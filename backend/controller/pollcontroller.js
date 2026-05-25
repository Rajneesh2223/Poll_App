const Poll = require("../models/Poll");
const mongoose = require("mongoose");

// In-memory fallback database
const inMemoryPolls = [];

/**
 * Save a new poll to the database
 * @param {Object} pollData - Poll data including question, options, duration, etc.
 * @returns {Promise<Object>} Saved poll document
 * @throws {Error} If validation fails or database error occurs
 */
exports.savePoll = async (pollData) => {
  try {
    // Validate poll data
    if (!pollData || typeof pollData !== 'object') {
      throw new Error('Invalid poll data');
    }

    if (mongoose.connection.readyState === 1) {
      const poll = new Poll(pollData);
      const savedPoll = await poll.save();
      console.log(`Poll saved successfully to MongoDB: ${savedPoll._id}`);
      return savedPoll;
    } else {
      const mockId = new mongoose.Types.ObjectId();
      const savedPoll = {
        _id: mockId,
        ...pollData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryPolls.push(savedPoll);
      console.log(`⚠️ MongoDB not connected. Saved poll to In-Memory store: ${mockId}`);
      return savedPoll;
    }
  } catch (error) {
    console.error('Error saving poll:', error.message);
    throw error;
  }
};

/**
 * Retrieve all polls from the database, sorted by creation date (newest first)
 * @returns {Promise<Array>} Array of poll documents
 * @throws {Error} If database query fails
 */
exports.getAllPolls = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      const polls = await Poll.find()
        .sort({ createdAt: -1 })
        .select('-__v') // Exclude version key
        .lean(); // Return plain JavaScript objects for better performance

      console.log(`Retrieved ${polls.length} polls from MongoDB`);
      return polls;
    } else {
      console.log(`⚠️ MongoDB not connected. Retrieved ${inMemoryPolls.length} polls from In-Memory store`);
      // Return a copy sorted by creation time (newest first)
      return [...inMemoryPolls].sort((a, b) => b.createdAt - a.createdAt);
    }
  } catch (error) {
    console.error('Error fetching polls:', error.message);
    throw error;
  }
};


