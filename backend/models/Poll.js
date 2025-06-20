const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswerIndex: Number,
  duration: Number,
  createdBy: String,
  startTime: Date,
  responses: [
    {
      userName: String,
      selectedIndex: Number,
      isCorrect: Boolean,
      timestamp: Date,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Poll", PollSchema);
