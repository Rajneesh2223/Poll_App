const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const registerSocketEvents = require("./socket");
const connectDB = require("./config/db");
const pollroutes = require("./routes/pollroute");
const healthRoute = require("./routes/health");
const errorHandler = require("./middleware/errorHandler");
const validateEnv = require("./middleware/validateEnv");

// Validate environment variables
validateEnv();

const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  },
  pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000,
  pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL) || 25000
});

// Connect to database
connectDB();

// Routes
app.use("/api", pollroutes);
app.use("/health", healthRoute);

// Register Socket.IO events
registerSocketEvents(io);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
