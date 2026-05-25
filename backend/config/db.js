const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

const dns = require("dns");

const connectDB = async () => {
  try {
    console.log("Configuring DNS resolution for MongoDB Atlas...");
    // Fall back to public DNS if local resolver fails to resolve SRV records (common Windows/Node.js issue)
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (dnsErr) {
      console.warn("⚠️ Custom DNS configuration failed, using system default resolver:", dnsErr.message);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_DB_URL, {
      serverSelectionTimeoutMS: 5000 // Fast timeout of 5 seconds
    });
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("⚠️ MongoDB connection failed:", err.message);
    console.warn("⚠️ Continuing application startup with In-Memory fallback store.");
  }
};

module.exports = connectDB;
