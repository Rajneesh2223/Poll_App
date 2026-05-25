import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    bookmarks : {
        type : [Schema.Types.ObjectId],
        ref : "Poll",
        default : []
    }
}, {timestamps : true});


const UserModel = mongoose.model("User", userSchema);
export default UserModel;