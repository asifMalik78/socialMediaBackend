import User from "../models/User.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import customErrorHandler from "../services/customErrorHandler.js";
import jwtService from "../services/jwtService.js";

const authController = {
  //registering a user

  async register(req, res, next) {
    // validation
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      confirm_password: Joi.string().required(),
    });

    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // check if user already exists in the database
    const { name, email, password, confirm_password, location, occupation } =
      req.body;

    //hashed password
    const hshedPassword = await bcrypt.hash(password, 10);
    req.body.password = hshedPassword;

    try {
      const isUserPresent = await User.findOne({ email });

      if (isUserPresent) {
        return next(
          customErrorHandler.alreadyExist("This Email is Already Taken")
        );
      }

      //create a user
      const user = new User(req.body);
      await user.save();
      const query = await User.findById(user._id)
        .select("-password")
        .populate("following", "name img");
      const accessToken = jwtService.createToken({ _id: user._id });
      let farFuture = new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 10
      ); // ~10y
      return res
        .cookie("token", accessToken, { expires: farFuture , secure: true, httpOnly: true })
        .status(200)
        .json({
          user: query,
        });
    } catch (error) {
      return next(error);
    }
  },

  // login user
  async login(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return next(customErrorHandler.wrongCredentials());
      }

      const isCorrect = await bcrypt.compare(password, user.password);

      if (!isCorrect) {
        return next(customErrorHandler.wrongCredentials());
      }

      let query = await User.findById(user._id)
        .select("-password")
        .populate("following", "name img ");
      const accessToken = jwtService.createToken({ _id: user._id });

      let farFuture = new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 10
      ); // ~10y
      return res
        .cookie("token", accessToken, { expires: farFuture , secure: true, httpOnly: true })
        .status(200)
        .json({
          user: query,
        });
    } catch (error) {
      return next(error);
    }
  },

  //get user
  async getUser(req, res, next) {
    const id = req._id;
    try {
      const user = await User.findById(id)
        .select("-password")
        .populate("following", "name img");
      return res.status(200).json({user:user});
    } catch (error) {
      return next(error);
    }
  },
};

export default authController;
