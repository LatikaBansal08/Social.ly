import express from 'express';
import { addComment, addReply, getAllComments, getAllReplies, getAllRepliesByComment, getAllRepliesByPost, getCommentById, getReplyById } from '../controllers/postController';

const commentRouter = express.Router();

postRouter.post("/add/:id",isAuthenticated,addComment);
postRouter.get("/all/:postId", isAuthenticated, getAllComments );
postRouter.get("/:postId", isAuthenticated, getCommentById );

postRouter.post("/add/reply/:commentId",isAuthenticated,addReply);
postRouter.get("/all", isAuthenticated, getAllReplies );
postRouter.get("/reply/:replyId",isAuthenticated,getReplyById);
postRouter.get("/replies/comment/:commentId", isAuthenticated, getAllRepliesByComment );
postRouter.get("/replies/post/:postId", isAuthenticated, getAllRepliesByPost );

export default commentRouter;