// frontend/utils/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  timeout: 10000,
  autoConnect: true
});

socket.on("connect", () => {
  console.log("✅ Connected to socket:", socket.id);
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

export { socket };
