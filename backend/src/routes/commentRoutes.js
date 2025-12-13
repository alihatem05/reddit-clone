import express from "express";
import {
  getComments,
  addComment,
  deleteComment,
  voteComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/:postId", getComments);
router.post("/", addComment);
router.delete("/:id", deleteComment);
router.patch("/:id/vote", voteComment);

export default router;
