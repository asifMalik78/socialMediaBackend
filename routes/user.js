import { Router } from "express";
import userController from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

//get user
router.route("/:id").get(verifyToken, userController.getUser);
// update user
router.route("/:id").put(verifyToken, userController.update);

// follow user
router.route("/follow/:id").put(verifyToken, userController.follow);

// unfollow user
router.route("/unfollow/:id").put(verifyToken, userController.unfollow);

// search user
router.route("/").get(verifyToken , userController.getAllUsers);

export default router;
