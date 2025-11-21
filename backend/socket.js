/**
 * Socket.IO Event Handlers
 * Manages real-time communication for polling and chat functionality
 */
const { savePoll, getAllPolls } = require("./controller/pollcontroller");

// In-memory state (consider using Redis for production scaling)
let currentPoll = null;
let responses = [];
let chatHistory = [];
const connectedUsers = {};

/**
 * Register all Socket.IO event handlers
 * @param {Object} io - Socket.IO server instance
 */
function registerSocketEvents(io) {
  io.on("connection", (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // Send current user list to new connection
    const users = Object.values(connectedUsers);
    socket.emit("update_user_list", users);

    // Send chat history to new connection
    if (chatHistory.length > 0) {
      socket.emit("chat-history", chatHistory);
    }

    /**
     * Handle user registration
     * Validates input and prevents duplicate registrations
     */
    socket.on("register_user", ({ name, role }) => {
      try {
        // Check if user is already registered for this socket
        if (connectedUsers[socket.id]) {
          console.log(`[Socket] User already registered: ${socket.id}`);
          return;
        }

        // Validate input
        if (!name || typeof name !== 'string' || !name.trim()) {
          console.log(`[Socket] Invalid name from ${socket.id}`);
          socket.emit("registration_error", "Invalid name provided");
          return;
        }

        if (!role || typeof role !== 'string') {
          console.log(`[Socket] Invalid role from ${socket.id}`);
          socket.emit("registration_error", "Invalid role provided");
          return;
        }

        const trimmedName = name.trim();
        const normalizedRole = role.toLowerCase();

        // Check for duplicate names
        const existingUser = Object.values(connectedUsers).find(
          user => user.name.toLowerCase() === trimmedName.toLowerCase() && user.role === normalizedRole
        );

        if (existingUser) {
          console.log(`[Socket] Duplicate name: ${trimmedName}`);
          socket.emit("registration_error", "Name already taken. Please choose a different name.");
          return;
        }

        // Register the user
        connectedUsers[socket.id] = {
          name: trimmedName,
          role: normalizedRole,
          joinedAt: Date.now(),
          socketId: socket.id
        };

        console.log(`[Socket] User registered: ${trimmedName} (${normalizedRole})`);

        // Send success confirmation
        socket.emit("registration_success", {
          name: trimmedName,
          role: normalizedRole
        });

        // Update all clients with new user list
        emitUserList(io);

        // Notify all users about new connection
        socket.broadcast.emit("user_joined", {
          name: trimmedName,
          role: normalizedRole
        });

      } catch (error) {
        console.error(`[Socket] Registration error:`, error);
        socket.emit("registration_error", "Registration failed. Please try again.");
      }
    });

    /**
     * Handle user disconnect
     * Clean up user data and notify others
     */
    socket.on("disconnect", () => {
      const user = connectedUsers[socket.id];
      console.log(`[Socket] User disconnected: ${socket.id}${user ? ` (${user.name})` : ''}`);

      if (user) {
        socket.broadcast.emit("user_left", {
          name: user.name,
          role: user.role
        });
      }

      delete connectedUsers[socket.id];
      emitUserList(io);
    });

    /**
     * Handle poll creation (teacher only)
     * Validates permissions and poll data
     */
    socket.on("create_poll", async (poll) => {
      const user = connectedUsers[socket.id];

      if (!user || user.role !== "teacher") {
        socket.emit("error", "Only teachers can create polls");
        return;
      }

      try {
        // Validate poll data
        if (!poll || !poll.question || !poll.options || !poll.duration) {
          socket.emit("error", "Invalid poll data");
          return;
        }

        if (poll.options.length < 2 || poll.options.length > 6) {
          socket.emit("error", "Poll must have between 2 and 6 options");
          return;
        }

        if (poll.duration < 5 || poll.duration > 300) {
          socket.emit("error", "Poll duration must be between 5 and 300 seconds");
          return;
        }

        currentPoll = {
          ...poll,
          startTime: Date.now(),
          createdBy: user.name
        };
        responses = [];

        console.log(`[Poll] Created by ${user.name}: "${poll.question}"`);
        io.emit("new_poll", currentPoll);

        // Save poll to DB after poll ends
        setTimeout(async () => {
          const results = getResults();
          io.emit("poll_ended", results);

          const pollToSave = {
            ...currentPoll,
            responses,
          };

          try {
            await savePoll(pollToSave);
            console.log(`[Poll] Saved to database`);
          } catch (error) {
            console.error(`[Poll] Save error:`, error.message);
          }

          currentPoll = null;
        }, poll.duration * 1000);
      } catch (error) {
        console.error(`[Poll] Creation error:`, error);
        socket.emit("error", "Failed to create poll");
      }
    });

    /**
     * Handle poll history request (teacher only)
     */
    socket.on("get_poll_history", async () => {
      const user = connectedUsers[socket.id];

      if (!user || user.role !== "teacher") {
        socket.emit("error", "Only teachers can view poll history");
        return;
      }

      try {
        const history = await getAllPolls();
        socket.emit("poll_history", history);
        console.log(`[Poll] History sent to ${user.name}`);
      } catch (error) {
        console.error(`[Poll] Fetch history error:`, error);
        socket.emit("error", "Failed to fetch poll history");
      }
    });

    /**
     * Handle student answer submission
     * Validates user, poll state, and prevents duplicate submissions
     */
    socket.on("submit_answer", ({ selectedIndex }) => {
      const user = connectedUsers[socket.id];

      if (!user) {
        socket.emit("error", "User not registered");
        return;
      }

      if (!currentPoll) {
        socket.emit("error", "No active poll");
        return;
      }

      if (typeof selectedIndex !== 'number' || selectedIndex < 0) {
        socket.emit("error", "Invalid answer selection");
        return;
      }

      if (selectedIndex >= currentPoll.options.length) {
        socket.emit("error", "Invalid option index");
        return;
      }

      // Check if user already responded
      const existingResponse = responses.find(r => r.userId === socket.id);
      if (existingResponse) {
        socket.emit("error", "You have already submitted an answer");
        return;
      }

      try {
        const isCorrect = selectedIndex === currentPoll.correctAnswerIndex;
        const response = {
          userId: socket.id,
          userName: user.name,
          selectedIndex,
          isCorrect,
          timestamp: Date.now()
        };

        responses.push(response);
        console.log(`[Answer] ${user.name} selected option ${selectedIndex}`);

        // Send confirmation to the user
        socket.emit("answer_submitted", { selectedIndex, isCorrect });

        // Update stats for all users
        const stats = getResults();
        io.emit("update_stats", stats);
      } catch (error) {
        console.error(`[Answer] Submission error:`, error);
        socket.emit("error", "Failed to submit answer");
      }
    });

    /**
     * Handle chat messages
     * Validates message and broadcasts to all users
     */
    socket.on("send-chat-message", (msg) => {
      const user = connectedUsers[socket.id];

      if (!user) {
        socket.emit("error", "User not registered");
        return;
      }

      if (!msg || !msg.message || typeof msg.message !== 'string') {
        socket.emit("error", "Invalid message");
        return;
      }

      const trimmedMessage = msg.message.trim();
      if (!trimmedMessage) {
        socket.emit("error", "Message cannot be empty");
        return;
      }

      if (trimmedMessage.length > 500) {
        socket.emit("error", "Message too long (max 500 characters)");
        return;
      }

      try {
        const messagePayload = {
          id: `${Date.now()}-${socket.id}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          sender: user.name,
          isTeacher: user.role === "teacher",
          message: trimmedMessage,
        };

        chatHistory.push(messagePayload);

        // Limit chat history to last 100 messages
        if (chatHistory.length > 100) {
          chatHistory.shift();
        }

        console.log(`[Chat] ${user.name}: ${trimmedMessage.substring(0, 50)}${trimmedMessage.length > 50 ? '...' : ''}`);
        io.emit("chat-message", messagePayload);
      } catch (error) {
        console.error(`[Chat] Message error:`, error);
        socket.emit("error", "Failed to send message");
      }
    });

    /**
     * Handle kick user (teacher only)
     * Removes a student from the session
     */
    socket.on("kick-user", (targetName) => {
      const requester = connectedUsers[socket.id];

      if (!requester || requester.role !== "teacher") {
        socket.emit("error", "Only teachers can kick users");
        return;
      }

      if (!targetName || typeof targetName !== 'string') {
        socket.emit("error", "Invalid target user");
        return;
      }

      try {
        // Find and disconnect the target user
        for (const [id, user] of Object.entries(connectedUsers)) {
          if (user.name === targetName && user.role !== "teacher") {
            console.log(`[Kick] ${requester.name} kicked ${user.name}`);
            io.to(id).emit("kicked", { reason: "Removed by teacher" });
            io.sockets.sockets.get(id)?.disconnect(true);
            delete connectedUsers[id];
            emitUserList(io);
            socket.emit("kick_success", { targetName });
            break;
          }
        }
      } catch (error) {
        console.error(`[Kick] Error:`, error);
        socket.emit("error", "Failed to kick user");
      }
    });

    /**
     * Handle poll status request
     * Sends current poll and stats to requesting user
     */
    socket.on("get_poll_status", () => {
      if (currentPoll) {
        socket.emit("new_poll", currentPoll);
        socket.emit("update_stats", getResults());
      }
    });
  });
}

/**
 * Broadcast updated user list to all connected clients
 * @param {Object} io - Socket.IO server instance
 */
function emitUserList(io) {
  const userList = Object.values(connectedUsers).map(user => ({
    name: user.name,
    role: user.role,
    joinedAt: user.joinedAt
  }));
  io.emit("update_user_list", userList);
}

/**
 * Calculate poll results and statistics
 * @returns {Object|null} Poll results with percentages, counts, and metadata
 */
function getResults() {
  if (!currentPoll) return null;

  const optionCount = currentPoll.options ? currentPoll.options.length : 4;
  const counts = Array(optionCount).fill(0);

  responses.forEach((r) => {
    if (r.selectedIndex >= 0 && r.selectedIndex < optionCount) {
      counts[r.selectedIndex]++;
    }
  });

  const total = responses.length;
  const percentages = counts.map((count) =>
    total ? Math.round((count / total) * 100) : 0
  );

  return {
    percentages,
    counts,
    total,
    correctAnswerIndex: currentPoll.correctAnswerIndex,
    responses: responses.length
  };
}

module.exports = registerSocketEvents;