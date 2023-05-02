import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import customErrorHandler from "../services/customErrorHandler.js";

const postController = {
  //creating post
  async createPost(req, res, next) {
    const id = req._id;
    const { postDesc, postImg, userId } = req.body;
    if (id !== userId) {
      return next(customErrorHandler.unAuthorized());
    }

    try {
      const post = await Post.create({ postDesc, postImg, postedBy: userId });
      const query = await Post.findById(post._id).populate(
        "postedBy",
        "name img"
      );
      return res.status(200).json({
        post: query,
      });
    } catch (error) {
      console.log("i am ");
      return next(error);
    }
  },

  //gettting all the posts
  async getAllPosts(req, res, next) {
    const { id } = req.query;

    try {
      let posts;
      if (id) {
        posts = await Post.find({ postedBy: id })
          .sort({})
          .sort({ createdAt: -1 })
          .limit(8)
          .populate("postedBy", "name img")
          .populate("postComments");

        posts = await User.populate(posts, {
          path: "postComments.commentBy",
          select: "name img",
        });

        return res.status(200).json(posts);
      } else {
        const userId = req._id;

        posts = await Post.find({ postedBy: userId })
          .populate("postedBy", "name img")
          .populate("postComments");

        posts = await User.populate(posts, {
          path: "postComments.commentBy",
          select: "name img",
        });

        const user = await User.findById(userId);
        const userFollowing = user.following;
        let allPost = await Promise.all(
          userFollowing.map((id) => {
            let followingPost = Post.find({ postedBy: id.toString() })
              .populate("postedBy", "name img")
              .populate("postComments");

            return followingPost;
          })
        );

        allPost = await Promise.all(
          allPost.map((curr) => {
            let followingPost = curr;
            followingPost = User.populate(followingPost, {
              path: "postComments.commentBy",
              select: "name img",
            });
            return followingPost;
          })
        );

        let p =
          allPost.length !== 0
            ? allPost.reduce((acc, curr) => {
                return [...acc, ...curr];
              })
            : [];

        if (allPost.length === 0) {
          allPost = [...posts];
        } else {
          allPost = [...posts, ...p];
        }
        await allPost.sort((obj1, obj2) => {
          return new Date(obj2.createdAt) - new Date(obj1.createdAt);
        });

        return res.status(200).json({ allPost });
      }
    } catch (error) {
      return next(error);
    }
  },

  //deleting the post
  async deletePost(req, res, next) {
    const { id } = req.params;
    const userId = req._id;

    try {
      let post = await Post.findById(id);
      if (post.postedBy.toString() !== userId) {
        return next(customErrorHandler.unAuthorized());
      }

      await Comment.deleteMany({ postComment: post._id });
      await Post.findByIdAndDelete(id);

      return res.status(200).json({
        message: "deleted successfully",
      });
    } catch (error) {
      return res.next(error);
    }
  },

  //updating the post
  async updatePost(req, res, next) {
    const { id } = req.params;
    const userId = req._id;
    try {
      let updatedPost = await Post.findById(id);
      if (updatedPost.postedBy.toString() !== userId) {
        return next(customErrorHandler.unAuthorized());
      }

      updatedPost = await Post.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      ).populate("postedBy", "name img");
      return res.status(200).json(updatedPost);
    } catch (error) {
      return next(error);
    }
  },

  // liking the post
  async likePost(req, res, next) {
    const userId = req._id;
    const { id } = req.params;
    const { likedBy } = req.body;
    try {
      const post = await Post.findById(id);

      if (post.postLikes.includes(likedBy)) {
        await Post.findByIdAndUpdate(id, { $pull: { postLikes: likedBy } });

        return res.status(200).json({ message: "disliked successfully" });
      } else {
        await Post.findByIdAndUpdate(id, { $push: { postLikes: likedBy } });
        return res.status(200).json({ message: "liked successfully" });
      }
    } catch (error) {
      return next(error);
    }
  },
};

export default postController;
