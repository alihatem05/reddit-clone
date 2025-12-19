import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  loginUser,
  updateUser,
  getUserComments,
  getUserUpvotedPosts,
  getUserDownvotedPosts
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/:id/comments", getUserComments);
router.get("/:id/upvoted", getUserUpvotedPosts);
router.get("/:id/downvoted", getUserDownvotedPosts);
router.patch("/:id", updateUser);
router.get("/:id", getUser);

export default router;
