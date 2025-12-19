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

// Specific routes first
router.post("/register", createUser);     // Register
router.post("/login", loginUser);  // Login
router.get("/", getUsers);        // Get all
// User-specific data routes (before :id route)
router.get("/:id/comments", getUserComments);
router.get("/:id/upvoted", getUserUpvotedPosts);
router.get("/:id/downvoted", getUserDownvotedPosts);
// Parameterized routes last
router.patch("/:id", updateUser);  // Update user
router.get("/:id", getUser);      // Get one

export default router;
