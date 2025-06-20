const Poll = require("../models/Poll");

exports.savePoll = async (pollData) => {
  const poll = new Poll(pollData);
  return await poll.save();
};

exports.getAllPolls = async () => {
  return await Poll.find().sort({ createdAt: -1 });
};
