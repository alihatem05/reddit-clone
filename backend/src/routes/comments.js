import express from "express";
import Comment from "../models/Comment.js";

const router = express.Router();

// Get comments for a specific post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username avatar");

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch comments" });
  }
});

export default router;
