import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    commentDesc:{
        type:String,
        required:true
    },

    commentBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    postComment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }
} , {timestamps:true});

const Comment = mongoose.model("Comment" , commentSchema);

export default Comment;