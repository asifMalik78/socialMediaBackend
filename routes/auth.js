import { Router } from "express";
import authController from "../controllers/authController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

// register
router.route("/register").post(authController.register);

// login
router.route("/login").post(authController.login);

// get user
router.route("/").get(verifyToken, authController.getUser);

export default router;
