import express from "express";
import { getPosts, getPost, createPost, updatePost, votePost, deletePost } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", createPost);
router.put("/:id", updatePost);
router.patch("/:id/vote", votePost);
router.delete("/:id", deletePost);

export default router;
