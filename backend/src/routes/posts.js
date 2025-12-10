import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Community from "../models/Community.js";

const router = express.Router();

// GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username avatar")
      .populate("community", "name logo");

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch posts" });
  }
});

export default router;
