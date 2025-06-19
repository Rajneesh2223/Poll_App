const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const registerSocketEvents = require("./socket");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Register events from separate file
registerSocketEvents(io);

server.listen(4000, () => console.log("Server running on port 4000"));
