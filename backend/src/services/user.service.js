import { JWT_PRIVATE, SALT } from "../config/veriables.js";
import { createUser, findUserByEmail } from "../repositories/user.repo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function signupService(username, email, password) {
  try {
    if (username.trim() == "" || email.trim() == "" || password.trim() == "") {
      throw {
        statusCode: 400,
        message: "All fields are required",
      };
    }
    const hashedPassword = bcrypt.hashSync(password, SALT);
    const user = await createUser(username, email, hashedPassword);
    return user;
  } catch (err) {
    if (err.code == 11000) {
      throw {
        statusCode: 409,
        message: "User already exists",
      };
    } else {
      throw err;
    }
  }
}

export async function signinService(email, password) {
  try{
    if (email.trim() == "" || password.trim() == "") {
      throw {
        statusCode: 400,
        message: "All fields are required",
      };
    }

    const user = await findUserByEmail(email);
    if (!user){
      throw {
        statusCode : 404,
        message : "User not found."
      }
    }
    if (!bcrypt.compareSync(password, user?.password)){
      throw {
        statusCode : 401,
        message : "Password isn't correct."
      }
    }

    const token = jwt.sign({id : user._id}, JWT_PRIVATE);
    const {password:pass, ...userData} = user._doc;
    return {token, userData};
  }
  catch(err){
    throw err;
  }
}