import User from "../models/User.js";
import customErrorHandler from "../services/customErrorHandler.js";
import bcrypt from "bcrypt";

const userController = {
  //updating the user
  async update(req, res, next) {
    const { id } = req.params;

    if (req._id !== id) {
      return next(customErrorHandler.unAuthorized());
    }
    try {
      const user = await User.findById(id);
      if (!user) {
        return next(customErrorHandler.unAuthorized());
      }

      const { password } = req.body;

      if (password) {
        const hshedPassword = await bcrypt.hash(password, 10);
        req.body.password = hshedPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      )
        .select("-password")
        .populate("following", "name img");

      return res.status(200).json({
        user: updatedUser,
      });
    } catch (error) {
      return next(error);
    }
  },

  //following the user
  async follow(req, res, next) {
    const { id } = req.params;
    const userId = req._id;
    if (id === userId) {
      return next(customErrorHandler.unAuthorized("invalid operation"));
    }

    try {
      const isAlreadyFollowed = await User.findOne({
        _id: userId,
        following: id,
      });
      if (isAlreadyFollowed) {
        return next(customErrorHandler.alreadyExist("Already following"));
      }
      const userFollow = await User.findByIdAndUpdate(id, {
        $push: { followers: userId },
      });
      const currUser = await User.findByIdAndUpdate(userId, {
        $push: { following: id },
      });

      return res.status(200).json({
        message: "followed successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  //unfollowing the user
  async unfollow(req, res, next) {
    const { id } = req.params;
    const userId = req._id;
    if (id === userId) {
      return next(customErrorHandler.unAuthorized("invalid operation"));
    }
    try {
      const userFollow = await User.findByIdAndUpdate(id, {
        $pull: { followers: userId },
      });
      const currUser = await User.findByIdAndUpdate(userId, {
        $pull: { following: id },
      });

      return res.status(200).json({
        message: "unfollowed successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  //get user
  async getUser(req, res, next) {
    const { id } = req.params;

    try {
      const user = await User.findById(id)
        .select("-password")
        .populate("following", "name img");
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  },

  //search user
  async getAllUsers(req, res, next) {
    const { search } = req.query;

    if (search.length === 0) {
      return res.status(200).json({
        users:null
      });
    }
    const keyword = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    try {
      const users = await User.find(keyword)
        .find({ _id: { $ne: req._id } })
        .select("name img email");
      res.status(200).json({users:users});
    } catch (error) {
      return next(error);
    }
  },
};

export default userController;
