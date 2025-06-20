const { savePoll, getAllPolls } = require("./controller/pollcontroller"); 
let currentPoll = null;
let responses = [];
let chatHistory = [];
let pollHistory = [];
const connectedUsers = {};

function registerSocketEvents(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    // Send current user list to new connection
    const users = Object.values(connectedUsers);
    socket.emit("update_user_list", users);
    
    // Send chat history to new connection
    if (chatHistory.length > 0) {
      socket.emit("chat-history", chatHistory);
    }

    socket.on("register_user", ({ name, role }) => {
      try {
        // Check if user is already registered for this socket
        if (connectedUsers[socket.id]) {
          console.log("User already registered for socket:", socket.id, "- ignoring duplicate registration");
          return;
        }

        // Validate input
        if (!name || typeof name !== 'string' || !name.trim()) {
          console.log("Invalid name provided:", name, "from socket:", socket.id);
          socket.emit("registration_error", "Invalid name provided");
          return;
        }

        if (!role || typeof role !== 'string') {
          console.log("Invalid role provided:", role, "from socket:", socket.id);
          socket.emit("registration_error", "Invalid role provided");
          return;
        }

        const trimmedName = name.trim();
        const normalizedRole = role.toLowerCase();
        
        // Check for duplicate names (optional - remove if you allow duplicates)
        const existingUser = Object.values(connectedUsers).find(
          user => user.name.toLowerCase() === trimmedName.toLowerCase() && user.role === normalizedRole
        );
        
        if (existingUser) {
          console.log("Duplicate name detected:", trimmedName, "role:", normalizedRole);
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
        
        console.log("User registered:", trimmedName, "as", normalizedRole, "→", socket.id);
        
        // Send success confirmation to the registering user
        socket.emit("registration_success", { 
          name: trimmedName, 
          role: normalizedRole 
        });
        
        // Update all clients with new user list
        emitUserList(io);
        
        // Notify all users about new connection (optional)
        socket.broadcast.emit("user_joined", { 
          name: trimmedName, 
          role: normalizedRole 
        });

      } catch (error) {
        console.error("Registration error:", error);
        socket.emit("registration_error", "Registration failed. Please try again.");
      }
    });

    // Handle disconnect: clean up
    socket.on("disconnect", () => {
      const user = connectedUsers[socket.id];
      console.log("User disconnected:", socket.id, user ? `(${user.name})` : "");
      
      if (user) {
        // Notify others about disconnection
        socket.broadcast.emit("user_left", { 
          name: user.name, 
          role: user.role 
        });
      }
      
      delete connectedUsers[socket.id];
      emitUserList(io);
    });

    // Teacher creates a poll
    socket.on("create_poll", async (poll) => {
        const user = connectedUsers[socket.id];
        if (!user || user.role !== "teacher") return;
      
        try {
          currentPoll = { ...poll, startTime: Date.now(), createdBy: user.name };
          responses = [];
      
          io.emit("new_poll", currentPoll);
      
          // Save poll to DB after poll ends
          setTimeout(async () => {
            const results = getResults();
            io.emit("poll_ended", results);
      
            const pollToSave = {
              ...currentPoll,
              responses,
            };
      
            await savePoll(pollToSave);
            currentPoll = null;
          }, poll.duration * 1000);
        } catch (error) {
          console.error("Poll creation error:", error);
        }
      });
      
      socket.on("get_poll_history", async () => {
        const user = connectedUsers[socket.id];
        console.log("location",user)
        if (!user || user.role !== "teacher") return;
      
        try {
          const history = await getAllPolls();
          socket.emit("poll_history", history);
        } catch (error) {
          console.error("Fetch history failed:", error);
        }
      });
      

    // Student submits vote
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

      // Check if user already responded (optional - remove to allow multiple responses)
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
        console.log("Answer submitted by", user.name, ":", selectedIndex);

        // Send confirmation to the user
        socket.emit("answer_submitted", { selectedIndex, isCorrect });

        // Update stats for all users
        const stats = getResults();
        io.emit("update_stats", stats);
      } catch (error) {
        console.error("Answer submission error:", error);
        socket.emit("error", "Failed to submit answer");
      }
    });

    // Chat message handler
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

      try {
        const messagePayload = {
          id: `${Date.now()}-${socket.id}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          sender: user.name,
          isTeacher: user.role === "teacher",
          message: msg.message.trim(),
        };

        chatHistory.push(messagePayload);
        if (chatHistory.length > 100) chatHistory.shift(); // Limit history
        
        console.log("Chat message from", user.name, ":", msg.message.substring(0, 50));
        io.emit("chat-message", messagePayload);
      } catch (error) {
        console.error("Chat message error:", error);
        socket.emit("error", "Failed to send message");
      }
    });

    // Kick user (teacher only)
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
            console.log("User kicked by", requester.name, ":", user.name);
            io.to(id).emit("kicked", { reason: "Removed by teacher" });
            io.sockets.sockets.get(id)?.disconnect(true);
            delete connectedUsers[id];
            emitUserList(io);
            socket.emit("kick_success", { targetName });
            break;
          }
        }
      } catch (error) {
        console.error("Kick user error:", error);
        socket.emit("error", "Failed to kick user");
      }
    });

    // Get current poll status
    socket.on("get_poll_status", () => {
      if (currentPoll) {
        socket.emit("new_poll", currentPoll);
        socket.emit("update_stats", getResults());
      }
    });
  });
}

// Broadcast user list
function emitUserList(io) {
  const userList = Object.values(connectedUsers).map(user => ({
    name: user.name,
    role: user.role,
    joinedAt: user.joinedAt
  }));
  io.emit("update_user_list", userList);
}

// Compute poll results
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