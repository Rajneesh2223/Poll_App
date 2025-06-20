const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://rajneeshkumar6267:Ie5gweINxIu0LXDk@pollapp.byywbjo.mongodb.net/?retryWrites=true&w=majority&appName=pollapp");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
