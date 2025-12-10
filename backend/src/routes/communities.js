import express from "express";
import Community from "../models/Community.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch communities" });
  }
});

export default router;
