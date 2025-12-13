import express from "express";
import { getPosts, getPost, createPost, updatePost } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", createPost);
router.put("/:id", updatePost);

export default router;
