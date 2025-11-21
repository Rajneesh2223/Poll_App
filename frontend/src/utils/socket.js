// frontend/utils/socket.js
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/**
 * Get or create a persistent user ID
 * This ID survives page refreshes and allows the server to recognize returning users
 */
const getUserId = () => {
  let userId = localStorage.getItem("poll_app_user_id");
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem("poll_app_user_id", userId);
    console.log("🆔 Created new user ID:", userId);
  } else {
    console.log("🆔 Using existing user ID:", userId);
  }
  return userId;
};

const userId = getUserId();

// Initialize socket with persistent user ID in auth
const socket = io(SOCKET_URL, {
  auth: {
    userId: userId
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  timeout: 10000,
  autoConnect: true
});

socket.on("connect", () => {
  console.log("✅ Connected to socket:", socket.id, "| User ID:", userId);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Disconnected from socket:", reason);
  if (reason === "io server disconnect") {
    // Server disconnected, try to reconnect
    socket.connect();
  }
});

socket.on("connect_error", (error) => {
  console.error("🔴 Socket connection error:", error.message);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("🔄 Reconnected to socket after", attemptNumber, "attempts");
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log("🔄 Reconnection attempt", attemptNumber);
});

socket.on("reconnect_error", (error) => {
  console.error("🔴 Reconnection error:", error.message);
});

socket.on("reconnect_failed", () => {
  console.error("🔴 Failed to reconnect to socket");
});

export { socket, userId };
