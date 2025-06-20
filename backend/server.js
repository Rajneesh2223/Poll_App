const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const registerSocketEvents = require("./socket");
const connectDB = require("./config/db");
const pollroutes = require("./routes/pollroute")

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
// Ie5gweINxIu0LXDk

connectDB()
app.use(express.json());
app.use("/api", pollroutes);
// Register events from separate file
registerSocketEvents(io);

server.listen(4000, () => console.log("Server running on port 4000"));
