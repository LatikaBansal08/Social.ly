import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    image: {
        public_Id:{
            type: String,
            default: ''
        },
        url: {
            type: String,
            default: ''
        }
    },
    caption: {
        type: String,
        default: ''
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User_Soc'
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
            // comment: {
            //     type: String
            // },
            // owner: {
            //     type: mongoose.Schema.Types.ObjectId,
            //     ref: 'User_Soc',
            //     required: true
            // }
        }
    ],
    owner: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User_Soc',
            required: true //user nhi mil rha to post nhi hoga
        }
    ], 
    mention: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User_Soc'
        }
    ],
    shared: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User_Soc'
        }
    ],
    saved: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User_Soc'
        }
    ],
    updateHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'History'
        }
    ],
    locations: {
        type: String
    },


},{
    timeStamps: true,
});

const Post = mongoose.model('Post', postSchema);
export default Post