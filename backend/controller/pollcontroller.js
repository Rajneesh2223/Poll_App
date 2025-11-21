const Poll = require("../models/Poll");

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

    const poll = new Poll(pollData);
    const savedPoll = await poll.save();

    console.log(`Poll saved successfully: ${savedPoll._id}`);
    return savedPoll;
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
    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .select('-__v') // Exclude version key
      .lean(); // Return plain JavaScript objects for better performance

    console.log(`Retrieved ${polls.length} polls from database`);
    return polls;
  } catch (error) {
    console.error('Error fetching polls:', error.message);
    throw error;
  }
};

