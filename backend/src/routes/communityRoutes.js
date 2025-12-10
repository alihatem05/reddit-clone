import express from "express";
import {
  getCommunities,
  createCommunity,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  getCommunityPosts
} from "../controllers/communityController.js";

const router = express.Router();

// GET all communities
router.get("/", getCommunities);

// GET a specific community
router.get("/:id", getCommunityById);

// CREATE a community
router.post("/", createCommunity);

// JOIN a community
router.post("/:id/join", joinCommunity);

// LEAVE a community
router.post("/:id/leave", leaveCommunity);

// GET posts of a community
router.get("/:id/posts", getCommunityPosts);

export default router;
