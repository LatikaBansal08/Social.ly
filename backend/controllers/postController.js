import Reply from "../models/replyModel.js";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { message } from "../utils/message.js";
import { Response } from "../utils/response.js";
import cloudinary from 'cloudinary';


export const createPost = async (req,res) => {
    try{
        //parsing body data
        const { caption, mentions, image, location } = req.body;

        //checking body data
        if(!caption){
            return Response(res,400,false,message.missingFieldMessage);
        }

        if(!image){
            return Response(res,400,false,message.imageMissingMessage);
        }

        //upload image
        const imageResult = await cloudinary.v2.uploader.upload(image, {
            folder: 'posts',
        })
            
        //create post
        const post = await Post.create({
            image: {
                public_id: imageResult.public_id,
                url: imageResult.secure_url,
            },
            caption,
            location,
            mentions,
            owner : req.user._id,
        })

        //add post in user's post array
        const user = await User.findById(req.user._id);
        user.posts.unshift(post._id);
        await user.save();

        //send response
        Response(res,201,true,message.postCreatedMessage,post);

    } catch(error) {
        Response(res,500,false,error.message);
    }
}

export const getAllPosts = async (req,res) => {
    try{
        //get all posts
        const posts = await Post.find().populate('owner','username firstName avatar');

        //check posts
        if(posts.length === 0){
            return Response(res,404,false, message.postNotFoundMessage);
        }

        //send response
        Response(res,201,true,message.postFoundMessage,posts);

    } catch (error) {
        Response(res,500,false,error.message);
    }
}

export const getPostById = async (req,res) => {
    try {
        //params and body
        const { id } = req.params;

        // //check id
        // if(!id){
        //     return Response(res,400,false,message.idNotFoundMessage);
        // }

        //find post
        const posts = await Post.findById(id).populate('owner',' username firstName avatar');

        //check posts
        if(!post){
            return Response(res,404,false, message.postNotFoundMessage);
        }

        //send response
        Response(res,201,true,message.postFoundMessage,posts);

    } catch (error) {
        Response(res,500,false,error.message);
    }
}

export const getMyPosts = async (req,res) => {
    try {
        const posts = await Post.find({owner: req.user._id}).populate('owner',' username firstName avatar');

        //check posts
        if(posts.length === 0){
            return Response(res,404,false, message.postNotFoundMessage);
        }

        //send response
        Response(res,201,true,message.postFoundMessage,posts);

    } catch (error) {
        Response(res,500,false,error.message);
    }
}

export const addComment = async (req,res) => {
    try {
        //parsing id
        const { id } = req.params;

        //check id
        if(!id){
            return Response(res,400,false,message.idNotFoundMessage);
        }

        //find post
        const post = await Post.findById(id).populate('owner','username firstName avatar');

        //check post 
        if(!post) {
            return Response(res,404,false,message.postNotFoundMessage);
        }

        //parsing body
        const { comment } = req.body;

        //check body
        if(!comment){
            return Response(res,404,false,message.missingFieldsMessage);
        }

        //create comment
        const newComment = await Comment.create({
            comment,
            Owner: req.user._id,
            post: post._id
        })

        //add comment in post's comments array
        post.comments.push(newComment._id);
        await post.save();

        //send Response
        Response(res,201,true,message.commentCreatedMessage,newComment);

    } catch (error) {
        Response(res,500,false,error.message);
    }
}

export const getCommentById = async (req,res) => {
    try {
        //parsing id
        const { commentId } = req.params;

        //check id
        if(!commentId){
            return Response(res,400,false,message.idNotFoundMessage);
        }

        //find comment
        const comment = await Comment.findById(commentId).populate('owner','username firstName avatar');

        //check comment 
        if(!comment) {
            return Response(res,404,false,message.commentNotFoundMessage);
        }

        //send Response
        Response(res,201,true,message.commentFoundMessage,comment);
    } catch(error) {
        Response(res,500,false,error.message);
    }
}

export const addReply = async (req,res) => {
    try{
        //parsing id
        const { commentId } = req.params;

        //check id
        if(!commentId){
            return Response(res,400,false,message.idNotFoundMessage);
        }

        //find comment
        const comment = await Comment.findById(commentId).populate('owner','username firstName avatar');

        //check comment 
        if(!comment) {
            return Response(res,404,false,message.commentNotFoundMessage);
        }

        //parsing body
        const { reply } = req.body;

        //check body
        if(!reply){
            return Response(res,404,false,message.missingFieldsMessage);
        }

        //create comment
        const newReply = await Reply.create({
            reply,
            Owner: req.user._id,
            comment: comment._id
        })

        //add comment in post's comments array
        post.replies.push(newReply._id);
        await comment.save();

        //send Response
        Response(res,201,true,message.replyCreatedMessage,newReply);

    } catch(error) {
        Response(res,500,false,error.message);
    }
}

export const getReplyById = async(req,res) => {
    try{
        //parsing id
        const { replyId } = req.params;

        //check id
        if(!replyId){
            return Response(res,400,false,message.idNotFoundMessage);
        }

        //find comment
        const reply = await Reply.findById(replyId).populate('owner','username firstName avatar');

        //check comment 
        if(!reply) {
            return Response(res,404,false,message.replyNotFoundMessage);
        }

        //send Response
        Response(res,201,true,message.replyFoundMessage,reply);

    } catch (error) {
        Response(res,500,false,error.message);
    }
}

export const getAllComments = async(req,res) => {
    try{
        //parsing id
        const { postId } = req.body;

        //check id
        if(!postId){
            return Response(res,404,false,message.idNotFoundMessage);
        }

        //find post
        const post = await Post.findById(postId);

        //check post
        if(!post){
            return Response(res,404,false,message.postNotFoundMessage)
        }

        //fetch comments
        const comments = await Comment.find({post: post._id})
        .populate({
            path: 'owner',
            select: 'username firstName avatar',
        }).populate({
            path: 'replace',
            populate: {
                path: 'owner',
                select: 'username firstName avatar',
            }
        });

        //send response
        Response(res,201,true,message.commentFoundMessage,comments);

    } catch (error) {
        Response(res,500,false,error.message);
    }
}

export const getAllRepliesByComment = async(req,res) => {
    try{

    } catch (error) {
        Response(res,500,false,error.message);
    }
}

export const getAllRepliesByPost = async(req,res) => {
    try{

    } catch (error) {
        Response(res,500,false,error.message);
    }
}
