import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import customErrorHandler from "../services/customErrorHandler.js";

const commentContrller = {
  //creating the comment
  async createComment(req, res, next) {
    const { postId, commentDesc, userId } = req.body;
    const id = req._id;
    if (id !== userId) {
      return next(customErrorHandler.unAuthorized());
    }
    try {
      const comment = await Comment.create({
        commentDesc,
        commentBy: userId,
        postComment: postId,
      });

      await Post.findByIdAndUpdate(postId, {
        $push: { postComments: comment._id },
      });
      const query = await Comment.findById(comment._id).populate(
        "commentBy",
        "name img"
      );

      return res.status(200).json({
        comment: query,
      });
    } catch (error) {
      return next(error);
    }
  },

  //get all comments belong to the post
  async getAllComment(req, res, next) {
    const { id } = req.params;
    try {
      const allComments = await Comment.find({ postComment: id }).populate(
        "commentBy",
        "name img"
      );

      return res.status(200).json(allComments);
    } catch (error) {
      return next(error);
    }
  },

  //updating the comment
  async updateComment(req, res, next) {
    const { id } = req.params;
    const userId = req._id;
    try {
      const comment = await Comment.findById(id);
      if (comment.commentBy.toString() !== userId) {
        return next(customErrorHandler.unAuthorized());
      }

      await Comment.findByIdAndUpdate(id, { $set: req.body });

      return res.status(200).json({
        message: "comment updated successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  //deleting the comment
  async deleteComment(req, res, next) {
    const { id } = req.params;
    const userId = req._id;
    try {
      const comment = await Comment.findById(id);
      if (comment.commentBy.toString() !== userId) {
        return next(customErrorHandler.unAuthorized());
      }
      await Post.findByIdAndUpdate(comment.postComment, {
        $pull: { postComments: comment._id },
      });
      await Comment.findByIdAndDelete(id);
      return res.status(200).json({
        message: "comment deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default commentContrller;
