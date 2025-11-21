# Socket.IO API Documentation

This document describes all Socket.IO events used in the Real-Time Polling App.

---

## Client → Server Events

### `register_user`

Register a new user (teacher or student) in the system.

**Payload:**
```javascript
{
  name: string,      // User's name (required, 1-100 characters)
  role: string       // "teacher" or "student" (required)
}
```

**Responses:**
- `registration_success` - Registration successful
- `registration_error` - Registration failed (duplicate name, invalid input, etc.)

**Example:**
```javascript
socket.emit("register_user", {
  name: "John Doe",
  role: "student"
});
```

---

### `create_poll`

Create a new poll (teacher only).

**Payload:**
```javascript
{
  question: string,           // Poll question (required, 3-500 characters)
  options: string[],          // Answer options (required, 2-6 items)
  correctAnswerIndex: number, // Index of correct answer (required, 0-based)
  duration: number            // Poll duration in seconds (required, 5-300)
}
```

**Responses:**
- `new_poll` - Poll created and broadcast to all users
- `error` - Creation failed (permission denied, invalid data, etc.)

**Example:**
```javascript
socket.emit("create_poll", {
  question: "What is 2 + 2?",
  options: ["3", "4", "5", "6"],
  correctAnswerIndex: 1,
  duration: 30
});
```

---

### `submit_answer`

Submit an answer to the current poll (student only).

**Payload:**
```javascript
{
  selectedIndex: number  // Index of selected option (required, 0-based)
}
```

**Responses:**
- `answer_submitted` - Answer recorded successfully
- `update_stats` - Updated poll statistics broadcast to all users
- `error` - Submission failed (already voted, no active poll, invalid index, etc.)

**Example:**
```javascript
socket.emit("submit_answer", {
  selectedIndex: 1
});
```

---

### `get_poll_history`

Request poll history (teacher only).

**Payload:** None

**Responses:**
- `poll_history` - Array of all past polls
- `error` - Permission denied

**Example:**
```javascript
socket.emit("get_poll_history");
```

---

### `send-chat-message`

Send a chat message to all users.

**Payload:**
```javascript
{
  message: string  // Message content (required, 1-500 characters)
}
```

**Responses:**
- `chat-message` - Message broadcast to all users
- `error` - Send failed (not registered, empty message, etc.)

**Example:**
```javascript
socket.emit("send-chat-message", {
  message: "Hello everyone!"
});
```

---

### `kick-user`

Remove a student from the session (teacher only).

**Payload:**
```javascript
targetName: string  // Name of user to kick (required)
```

**Responses:**
- `kick_success` - User kicked successfully
- `kicked` - Sent to the kicked user
- `error` - Kick failed (permission denied, user not found, etc.)

**Example:**
```javascript
socket.emit("kick-user", "John Doe");
```

---

### `get_poll_status`

Request current poll status.

**Payload:** None

**Responses:**
- `new_poll` - Current active poll (if any)
- `update_stats` - Current poll statistics (if any)

**Example:**
```javascript
socket.emit("get_poll_status");
```

---

## Server → Client Events

### `registration_success`

User registration successful.

**Payload:**
```javascript
{
  name: string,  // Registered name
  role: string   // Registered role
}
```

---

### `registration_error`

User registration failed.

**Payload:**
```javascript
string  // Error message
```

---

### `update_user_list`

Updated list of connected users.

**Payload:**
```javascript
[
  {
    name: string,
    role: string,
    joinedAt: number  // Timestamp
  },
  ...
]
```

---

### `user_joined`

A new user joined the session.

**Payload:**
```javascript
{
  name: string,
  role: string
}
```

---

### `user_left`

A user left the session.

**Payload:**
```javascript
{
  name: string,
  role: string
}
```

---

### `new_poll`

A new poll has been created.

**Payload:**
```javascript
{
  question: string,
  options: string[],
  correctAnswerIndex: number,
  duration: number,
  startTime: number,     // Timestamp
  createdBy: string      // Teacher name
}
```

---

### `poll_ended`

The current poll has ended.

**Payload:**
```javascript
{
  percentages: number[],      // Percentage for each option
  counts: number[],           // Vote count for each option
  total: number,              // Total votes
  correctAnswerIndex: number, // Correct answer index
  responses: number           // Number of responses
}
```

---

### `answer_submitted`

Your answer was recorded.

**Payload:**
```javascript
{
  selectedIndex: number,
  isCorrect: boolean
}
```

---

### `update_stats`

Real-time poll statistics update.

**Payload:**
```javascript
{
  percentages: number[],      // Percentage for each option
  counts: number[],           // Vote count for each option
  total: number,              // Total votes
  correctAnswerIndex: number, // Correct answer index
  responses: number           // Number of responses
}
```

---

### `poll_history`

Historical poll data (teacher only).

**Payload:**
```javascript
[
  {
    _id: string,
    question: string,
    options: string[],
    correctAnswerIndex: number,
    duration: number,
    createdBy: string,
    startTime: Date,
    responses: [
      {
        userName: string,
        selectedIndex: number,
        isCorrect: boolean,
        timestamp: Date
      },
      ...
    ],
    createdAt: Date,
    updatedAt: Date
  },
  ...
]
```

---

### `chat-history`

Chat message history (sent on connect).

**Payload:**
```javascript
[
  {
    id: string,
    timestamp: number,
    sender: string,
    isTeacher: boolean,
    message: string
  },
  ...
]
```

---

### `chat-message`

New chat message.

**Payload:**
```javascript
{
  id: string,
  timestamp: number,
  sender: string,
  isTeacher: boolean,
  message: string
}
```

---

### `kicked`

You have been kicked from the session.

**Payload:**
```javascript
{
  reason: string  // Reason for kick
}
```

---

### `kick_success`

User kick successful (teacher only).

**Payload:**
```javascript
{
  targetName: string  // Name of kicked user
}
```

---

### `error`

General error message.

**Payload:**
```javascript
string  // Error message
```

---

## Connection Events

### `connect`

Socket connected to server.

### `disconnect`

Socket disconnected from server.

**Payload:**
```javascript
string  // Disconnect reason
```

### `connect_error`

Connection error occurred.

**Payload:**
```javascript
Error  // Error object
```

### `reconnect`

Successfully reconnected after disconnect.

**Payload:**
```javascript
number  // Number of reconnection attempts
```

---

## Error Codes

Common error messages:

- `"User not registered"` - Action requires registration
- `"Only teachers can create polls"` - Permission denied
- `"Invalid poll data"` - Poll validation failed
- `"No active poll"` - No poll currently running
- `"You have already submitted an answer"` - Duplicate vote attempt
- `"Invalid answer selection"` - Invalid option index
- `"Name already taken. Please choose a different name."` - Duplicate username
- `"Invalid name provided"` - Name validation failed
- `"Invalid role provided"` - Role validation failed
- `"Only teachers can kick users"` - Permission denied
- `"Invalid target user"` - Kick target not found
- `"Invalid message"` - Message validation failed
- `"Message too long (max 500 characters)"` - Message exceeds limit

---

## Best Practices

1. **Always register before performing actions**
   ```javascript
   socket.emit("register_user", { name: "John", role: "student" });
   ```

2. **Handle all error events**
   ```javascript
   socket.on("error", (message) => {
     console.error("Error:", message);
     // Show error to user
   });
   ```

3. **Clean up event listeners**
   ```javascript
   useEffect(() => {
     socket.on("new_poll", handleNewPoll);
     return () => {
       socket.off("new_poll", handleNewPoll);
     };
   }, []);
   ```

4. **Check connection status before emitting**
   ```javascript
   if (socket.connected) {
     socket.emit("create_poll", pollData);
   }
   ```
