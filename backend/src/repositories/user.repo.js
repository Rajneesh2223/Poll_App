import UserModel from "../models/user.model.js";

export const createUser = async (username, email, password) => {
  try {
    const createdUser = await UserModel.create({
      username,
      email,
      password,
    });

    return createdUser;
  } catch (err) {
    throw err;
  }
};

export async function findUserByEmail(email) {
  try {
    const user = await UserModel.findOne({ email });
    return user;
  } catch (err) {
    throw err;
  }
}

export async function findUserById(id) {
  try {
    const user = await UserModel.findById(id);
    return user;
  } catch (err) {
    throw err;
  }
}

export async function addPollIdToBookmark(userId, pollId) {
  try {
    const updatedData = UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { bookmarks: pollId } },
      { new: true }
    );

    return updatedData;
  } catch (err) {
    throw err;
  }
}


export async function removePollIdFromBookmark(userId, pollId) {
    try {
        const updatedData = UserModel.findOneAndUpdate(
            { _id: userId },
            { $pull: { bookmarks: pollId } },
            { new: true }
          );
      
          return updatedData;
    }
    catch{
        throw err;
    }
}

export async function getUserBookmarkedPolls(userId) {
  try {
    const user = await UserModel.findById(userId).populate("bookmarks");
    return user.bookmarks;
  } catch (err) {
    throw err;
  }
}