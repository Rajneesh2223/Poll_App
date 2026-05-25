import mongoose, { Schema } from "mongoose";

const pollSchema = new Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    creatorId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    options : [
        {
            type : Object,
            required : true,
        }
    ]
}, {timestamps : true});


const PollModel = mongoose.model("Poll", pollSchema);
export default PollModel;