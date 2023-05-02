import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import postController from "../controllers/postController.js";

const router = Router();

//create post
router.route("/create").post(verifyToken , postController.createPost);

//get all post or get users post (query id)
router.route("/all").get(verifyToken , postController.getAllPosts);

//delete post
router.route("/:id").delete(verifyToken , postController.deletePost);

//update post
router.route("/:id").put(verifyToken , postController.updatePost);

//like post or dislike post
router.route("/like/:id").put(verifyToken , postController.likePost);




export default router;