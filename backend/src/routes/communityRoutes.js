import express from "express";
import {
  getCommunities,
  createCommunity,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  getCommunityPosts,
  deleteCommunity
} from "../controllers/communityController.js";

const router = express.Router();

router.get("/", getCommunities);
router.get("/:id", getCommunityById);
router.post("/", createCommunity);
router.post("/:id/join", joinCommunity);
router.post("/:id/leave", leaveCommunity);
router.get("/:id/posts", getCommunityPosts);
router.delete("/:id", deleteCommunity);

export default router;
