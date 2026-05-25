import VoteModel from "../models/vote.model.js";

export async function findVoteByPollIdAndUserId(pollId, userId) {
    try {
        const vote  = VoteModel.findOne({pollId : pollId, userId : userId});
        return vote;
    }
    catch(err){
        throw err;
    }
}


export async function createVote(pollId, userId, optionId) {
    try{
        const vote = VoteModel.create({
            pollId,
            userId,
            optionId
        });

        return vote;
    }
    catch(err){
        throw err;
    }
}