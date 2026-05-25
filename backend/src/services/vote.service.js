import mongoose from "mongoose";
import { findVoteByPollIdAndUserId } from "../repositories/vote.repo.js";

export function voteMessageTestService(){
    try{
        return "Vote route is working✔️";
    }
    catch(err){
        throw err;
    }
}

export function getPollVoteService(pollId, userId) {
    try {
        const pollIdObjet = new mongoose.Types.ObjectId(pollId);
        const vote = findVoteByPollIdAndUserId(pollIdObjet, userId);
        return vote;
    }
    catch (err) {
        throw err;
    }
}