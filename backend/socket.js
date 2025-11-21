/**
 * Socket.IO Event Handlers with Persistent User Sessions
 * Manages real-time communication for polling and chat functionality
 * Uses userId-based session management to maintain state across reconnections
 */
const { savePoll, getAllPolls } = require("./controller/pollcontroller");

// In-memory state (consider using Redis for production scaling)
let currentPoll = null;
let responses = [];
let chatHistory = [];

// CHANGED: Use userId as key instead of socket.id for persistent sessions
// Structure: { "user-uuid-123": { name: "Rajneesh", role: "student", socketId: "abc-123", lastActive: timestamp } }
const usersSession = {};

/**
 * Helper function to emit updated user list to all clients
 * @param {Object} io - Socket.IO server instance
 */
function emitUserList(io) {
  const users = Object.values(usersSession).map(user => ({
    name: user.name,
    role: user.role,
    joinedAt: user.joinedAt
  }));
  io.emit("update_user_list", users);
}

/**
 * Helper function to calculate poll results
 * @returns {Object} Poll results with counts and percentages
 */
function getResults() {
  if (!currentPoll) return null;

  const counts = new Array(currentPoll.options.length).fill(0);
  responses.forEach(r => {
    if (r.selectedIndex >= 0 && r.selectedIndex < counts.length) {
      counts[r.selectedIndex]++;
    }
  });

  const total = responses.length;
  const percentages = counts.map(count =>
    total > 0 ? Math.round((count / total) * 100) : 0
  );

  return {
    question: currentPoll.question,
    options: currentPoll.options,
    counts,
    percentages,
    totalResponses: total
  };
}

/**
 * Cleanup inactive users periodically
 * Removes users who haven't been active for more than 1 hour
 */
setInterval(() => {
  const now = Date.now();
  const oneHour = 3600000;

  for (const [userId, user] of Object.entries(usersSession)) {
    if (now - user.lastActive > oneHour) {
      console.log(`[Cleanup] Removing inactive user: ${user.name} (${userId})`);
      delete usersSession[userId];
    }
  }
}, 300000); // Run every 5 minutes

/**
 * Register all Socket.IO event handlers
 * @param {Object} io - Socket.IO server instance
 */
function registerSocketEvents(io) {

  // Middleware: Extract userId from handshake auth
  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;

    if (!userId) {
      console.log(`[Socket] Connection rejected: No userId provided`);
      return next(new Error("Authentication error: userId required"));
    }

    // Attach userId to socket for easy access
    socket.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    console.log(`[Socket] User connected: ${userId} (Socket: ${socket.id})`);

    // Check if this is a reconnecting user
    if (usersSession[userId]) {
      const user = usersSession[userId];
      console.log(`[Socket] Welcome back, ${user.name} (${user.role})`);

      // Update socket ID and last active time
      user.socketId = socket.id;
      user.lastActive = Date.now();

      // Send registration success immediately
      socket.emit("registration_success", {
        name: user.name,
        role: user.role
      });

      // If there's an active poll, send it with remaining time
      if (currentPoll) {
        const timeElapsed = Math.floor((Date.now() - currentPoll.startTime) / 1000);
        const timeRemaining = Math.max(0, currentPoll.duration - timeElapsed);

        if (timeRemaining > 0) {
          const pollWithRemainingTime = {
            ...currentPoll,
            duration: timeRemaining,
            startTime: Date.now()
          };

          socket.emit("new_poll", pollWithRemainingTime);

          // Send current stats
          const stats = getResults();
          if (stats) {
            socket.emit("update_stats", stats);
          }

          console.log(`[Poll] Sent active poll to ${user.name} with ${timeRemaining}s remaining`);
        }
      }
    }

    // Send current user list to new connection
    const users = Object.values(usersSession).map(u => ({
      name: u.name,
      role: u.role,
      joinedAt: u.joinedAt
    }));
    socket.emit("update_user_list", users);

    // Send chat history to new connection
    if (chatHistory.length > 0) {
      socket.emit("chat-history", chatHistory);
    }

    /**
     * Handle user registration
     * Creates or updates user session with persistent userId
     */
    socket.on("register_user", ({ name, role }) => {
      try {
        // Validate input
        if (!name || typeof name !== 'string' || !name.trim()) {
          console.log(`[Socket] Invalid name from ${userId}`);
          socket.emit("registration_error", "Invalid name provided");
          return;
        }

        if (!role || typeof role !== 'string') {
          console.log(`[Socket] Invalid role from ${userId}`);
          socket.emit("registration_error", "Invalid role provided");
          return;
        }

        const trimmedName = name.trim();
        const normalizedRole = role.toLowerCase();

        // Check for duplicate names (excluding current userId)
        const existingUser = Object.entries(usersSession).find(
          ([uid, user]) => uid !== userId && user.name.toLowerCase() === trimmedName.toLowerCase() && user.role === normalizedRole
        );

        if (existingUser) {
          console.log(`[Socket] Duplicate name: ${trimmedName} (already used by ${existingUser[0]})`);
          socket.emit("registration_error", "Name already taken. Please choose a different name.");
          return;
        }

        // Create or update user session
        usersSession[userId] = {
          name: trimmedName,
          role: normalizedRole,
          socketId: socket.id,
          joinedAt: usersSession[userId]?.joinedAt || Date.now(),
          lastActive: Date.now()
        };

        console.log(`[Socket] User registered: ${trimmedName} (${normalizedRole}) - ${userId}`);

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

        // If there's an active poll, send it
        if (currentPoll) {
          const timeElapsed = Math.floor((Date.now() - currentPoll.startTime) / 1000);
          const timeRemaining = Math.max(0, currentPoll.duration - timeElapsed);

          if (timeRemaining > 0) {
            const pollWithRemainingTime = {
              ...currentPoll,
              duration: timeRemaining,
              startTime: Date.now()
            };

            socket.emit("new_poll", pollWithRemainingTime);

            const stats = getResults();
            if (stats) {
              socket.emit("update_stats", stats);
            }

            console.log(`[Poll] Sent active poll to ${trimmedName} with ${timeRemaining}s remaining`);
          }
        }

      } catch (error) {
        console.error(`[Socket] Registration error:`, error);
        socket.emit("registration_error", "Registration failed. Please try again.");
      }
    });

    /**
     * Handle user disconnect
     * Mark user as inactive but don't delete (allows reconnection)
     */
    socket.on("disconnect", () => {
      const user = usersSession[userId];
      console.log(`[Socket] User disconnected: ${userId}${user ? ` (${user.name})` : ''}`);

      if (user) {
        // Update last active time but don't delete
        // This allows the user to reconnect and resume their session
        user.lastActive = Date.now();

        // Optionally notify others (but they might reconnect soon)
        socket.broadcast.emit("user_left", {
          name: user.name,
          role: user.role
        });
      }
    });

    /**
     * Handle poll creation (teacher only)
     * Validates permissions and poll data
     */
    socket.on("create_poll", async (poll) => {
      const user = usersSession[userId];

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
      const user = usersSession[userId];

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
      const user = usersSession[userId];

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

      // Check if user already responded (using userId instead of socket.id)
      const existingResponse = responses.find(r => r.userId === userId);
      if (existingResponse) {
        socket.emit("error", "You have already submitted an answer");
        return;
      }

      try {
        const isCorrect = selectedIndex === currentPoll.correctAnswerIndex;
        const response = {
          userId: userId, // Use persistent userId
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
      const user = usersSession[userId];

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
          id: `${Date.now()}-${userId}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          sender: user.name,
          role: user.role,
          message: trimmedMessage
        };

        // Add to chat history (limit to last 100 messages)
        chatHistory.push(messagePayload);
        if (chatHistory.length > 100) {
          chatHistory.shift();
        }

        console.log(`[Chat] ${user.name}: ${trimmedMessage.substring(0, 50)}${trimmedMessage.length > 50 ? '...' : ''}`);

        // Broadcast to all users
        io.emit("receive-chat-message", messagePayload);
      } catch (error) {
        console.error(`[Chat] Message error:`, error);
        socket.emit("error", "Failed to send message");
      }
    });

    /**
     * Handle user kick (teacher only)
     * Removes a user from the session
     */
    socket.on("kick-user", (data) => {
      const user = usersSession[userId];

      if (!user || user.role !== "teacher") {
        socket.emit("error", "Only teachers can kick users");
        return;
      }

      if (!data || !data.userName) {
        socket.emit("error", "Invalid kick request");
        return;
      }

      try {
        // Find user by name
        const targetEntry = Object.entries(usersSession).find(
          ([, u]) => u.name === data.userName
        );

        if (!targetEntry) {
          socket.emit("error", "User not found");
          return;
        }

        const [targetUserId, targetUser] = targetEntry;

        // Don't allow kicking yourself
        if (targetUserId === userId) {
          socket.emit("error", "Cannot kick yourself");
          return;
        }

        console.log(`[Kick] ${user.name} kicked ${targetUser.name}`);

        // Disconnect the target user's socket
        const targetSocket = io.sockets.sockets.get(targetUser.socketId);
        if (targetSocket) {
          targetSocket.emit("kicked", { reason: `Kicked by ${user.name}` });
          targetSocket.disconnect(true);
        }

        // Remove from session
        delete usersSession[targetUserId];

        // Notify all users
        io.emit("user_kicked", {
          userName: targetUser.name,
          kickedBy: user.name
        });

        emitUserList(io);
      } catch (error) {
        console.error(`[Kick] Error:`, error);
        socket.emit("error", "Failed to kick user");
      }
    });

    /**
     * Get current poll status
     * Sends active poll to requesting user
     */
    socket.on("get_current_poll", () => {
      if (currentPoll) {
        const timeElapsed = Math.floor((Date.now() - currentPoll.startTime) / 1000);
        const timeRemaining = Math.max(0, currentPoll.duration - timeElapsed);

        if (timeRemaining > 0) {
          const pollWithRemainingTime = {
            ...currentPoll,
            duration: timeRemaining,
            startTime: Date.now()
          };

          socket.emit("current_poll", pollWithRemainingTime);

          const stats = getResults();
          if (stats) {
            socket.emit("update_stats", stats);
          }
        } else {
          socket.emit("current_poll", null);
        }
      } else {
        socket.emit("current_poll", null);
      }
    });
  });
}

module.exports = registerSocketEvents;