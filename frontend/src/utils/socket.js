// frontend/utils/socket.js
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}`); // Make sure backend is running on this

socket.on("connect", () => {
  console.log(" Connected to socket:", socket.id);
});

export { socket };

