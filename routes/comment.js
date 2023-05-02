import { Router } from "express";
import commentContrller from "../controllers/commentController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

//create comment
router.route("/create").post(verifyToken , commentContrller.createComment);

//get all comment
router.route("/all/:id").get(verifyToken , commentContrller.getAllComment);

//delete comment
router.route("/:id").delete(verifyToken , commentContrller.deleteComment);

//update comment
router.route("/:id").put(verifyToken , commentContrller.updateComment);

export default router;