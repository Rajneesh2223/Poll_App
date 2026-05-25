import mongoose, { Schema } from "mongoose";

const voteSchema = new Schema({
    pollId : {
        type : Schema.Types.ObjectId,
        ref : "Poll",
        required : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    optionId : {
        type : Schema.Types.ObjectId,
        ref : "Option",
        required : true
    },
}, {timestamps : true});


const VoteModel = mongoose.model("Vote", voteSchema);
export default VoteModel;