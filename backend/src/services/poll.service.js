import mongoose from "mongoose";
import {
  createPollByData,
  deletePollById,
  findPollById,
  findPolls,
  findPollsByCreatorId,
  getAllPollsCount,
  updatePollVoteCount,
} from "../repositories/poll.repo.js";
import {
  createVote,
  findVoteByPollIdAndUserId,
} from "../repositories/vote.repo.js";
import {
  addPollIdToBookmark,
  getUserBookmarkedPolls,
  removePollIdFromBookmark,
} from "../repositories/user.repo.js";

export async function createPollService(title, description, options, userId) {
  try {
    const optionsData = options.map((option) => ({
      name: option,
      _id: new mongoose.Types.ObjectId(),
      voteCount: 0,
    }));

    const data = {
      title,
      description,
      options: optionsData,
      creatorId: userId,
    };
    const poll = await createPollByData(data);
    return poll;
  } catch (err) {
    throw err;
  }
}

export async function getPollDataService(pollId) {
  try {
    const poll = await findPollById(pollId);
    if (!poll) {
      throw {
        statusCode: 404,
        message: "Poll not found",
      };
    }
    const { creatorId, ...pollData } = poll._doc;
    const { username, _id, ...creatorData } = creatorId._doc;
    return { pollData, creatorData: { username, _id } };
  } catch (err) {
    throw err;
  }
}

export async function getAllCreatedPollsService(id) {
  try {
    const polls = await findPollsByCreatorId(id);
    return polls;
  } catch (err) {
    throw err;
  }
}

export async function deletePollService(pollId, user) {
  try {
    const userId = user._id;
    const poll = await findPollById(pollId);
    if (!poll) {
      throw {
        statusCode: 404,
        message: "Poll not found",
      };
    }
    console.log(poll?.creatorId._id.toString(), userId.toString(), user);
    if (poll.creatorId._id.toString() !== userId.toString()) {
      throw {
        statusCode: 401,
        message: "Unauthorized",
      };
    }
    const deletedPoll = await deletePollById(pollId);
    return deletedPoll;
  } catch (err) {
    throw err;
  }
}

export async function createVoteService(pollId, userId, optionId) {
  try {
    // vote already voted
    const vote = await findVoteByPollIdAndUserId(pollId, userId);
    if (vote) {
      throw {
        statusCode: 400,
        message: "You have already voted on this poll",
      };
    }
    console.log(pollId, userId, optionId);
    const poll = await findPollById(pollId);
    if (!poll) {
      throw {
        statusCode: 404,
        message: "Poll not found",
      };
    }
    const updatedPollData = await updatePollVoteCount(pollId, optionId);
    const createdVote = await createVote(pollId, userId, optionId);
    console.log(updatedPollData);
    return createVote;
  } catch (err) {
    throw err;
  }
}

export async function addToBookMarkService(pollId, user) {
  try {
    const exits = user?.bookmarks.findIndex((id) => id.toString() == pollId);
    const poll = await findPollById(pollId);
    if (!poll) {
      throw {
        statusCode: 404,
        message: "Poll dont exits.",
      };
    }
    let updatedData;
    let message;
    if (exits == -1) {
      updatedData = await addPollIdToBookmark(user._id, poll._id);
      message = "Added to bookmark successfully.";
    } else {
      updatedData = await removePollIdFromBookmark(user._id, poll._id);
      message = "Removed from bookmark successfully.";
    }
    const {password, ...userData} = updatedData._doc;
    return {
      updatedData : userData,
      message,
    };
  } catch (err) {
    throw err;
  }
}


export async function getBookmarkPollService(userId) {
  try {
    const data = await getUserBookmarkedPolls(userId);
    return data;
  } catch (err) {
    throw err;
  }
}

export async function getAllPollsService(page, limit) {
  try {
    const data = await findPolls(page, limit);
    const filteredData = data.map((poll) => {
      const { creatorId, ...pollData } = poll._doc;
      const { username, _id, ...creatorData } = creatorId._doc;
      const {options, ...rest} = pollData;
      return {
        ...rest,
        creatorData: { username, _id }
      };
    });
    const totalPollCount = await getAllPollsCount();
    return {
      polls: filteredData,
      totalPollCount: totalPollCount,
      totalPages: Math.ceil(totalPollCount / limit),
    };
  }
  catch (err) {
    throw err;
  }
}