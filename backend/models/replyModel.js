import mongoose from "mongoose";

const replySchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_Soc'
    },
    reply: {
        type: String,
        ref: 'Reply'
    },
    likes: ({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_Soc'
    }),
    Comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_Soc'
    }
},{
    timestamps : true,
})

const Reply = mongoose.model('Reply',commentSchema);
export default Reply;