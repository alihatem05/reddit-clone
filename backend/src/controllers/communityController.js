import Community from "../models/Community.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch communities" });
  }
};

export const getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community)
      return res.status(404).json({ error: "Community not found" });

    res.json(community);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch community" });
  }
};

export const createCommunity = async (req, res) => {
  try {
    const newCommunity = await Community.create(req.body);
    res.json(newCommunity);
  } catch (err) {
    res.status(500).json({ error: "Failed to create community" });
  }
};

export const joinCommunity = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    const community = await Community.findById(req.params.id);

    if (!user || !community)
      return res.status(404).json({ error: "User or Community not found" });

    if (user.joinedCommunities?.includes(community._id))
      return res.json({ message: "Already a member" });

    user.joinedCommunities.push(community._id);
    await user.save();

    res.json({ message: "Joined community", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to join community" });
  }
};

export const leaveCommunity = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    const community = await Community.findById(req.params.id);

    if (!user || !community)
      return res.status(404).json({ error: "User or Community not found" });

    user.joinedCommunities = user.joinedCommunities.filter(
      (c) => c.toString() !== community._id.toString()
    );

    await user.save();

    res.json({ message: "Left community", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to leave community" });
  }
};

export const getCommunityPosts = async (req, res) => {
  try {
    const posts = await Post.find({ community: req.params.id })
      .populate("user", "username")
      .populate("community", "name");

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch community posts" });
  }
};
