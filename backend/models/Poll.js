const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    minlength: [3, 'Question must be at least 3 characters long'],
    maxlength: [500, 'Question must not exceed 500 characters']
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function (v) {
        return v && v.length >= 2 && v.length <= 6;
      },
      message: 'Poll must have between 2 and 6 options'
    }
  },
  correctAnswerIndex: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: 0
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [5, 'Duration must be at least 5 seconds'],
    max: [300, 'Duration must not exceed 300 seconds']
  },
  createdBy: {
    type: String,
    required: [true, 'Creator name is required'],
    trim: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  responses: [
    {
      userName: {
        type: String,
        required: true,
        trim: true
      },
      selectedIndex: {
        type: Number,
        required: true,
        min: 0
      },
      isCorrect: {
        type: Boolean,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
PollSchema.index({ createdAt: -1 });
PollSchema.index({ createdBy: 1 });

// Virtual for total responses count
PollSchema.virtual('totalResponses').get(function () {
  return this.responses.length;
});

module.exports = mongoose.model("Poll", PollSchema);

