import Community from "../models/Community.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

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

    // Check if user is already a member
    const userCommunities = user.communities?.map(c => c.toString()) || [];
    if (userCommunities.includes(community._id.toString()))
      return res.json({ message: "Already a member" });

    // Add community to user's communities
    user.communities = user.communities || [];
    user.communities.push(community._id);
    await user.save();

    // Add user to community's members
    community.members = community.members || [];
    if (!community.members.includes(user._id)) {
      community.members.push(user._id);
      await community.save();
    }

    res.json({ message: "Joined community", user, community });
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

    // Remove community from user's communities
    user.communities = (user.communities || []).filter(
      (c) => c.toString() !== community._id.toString()
    );
    await user.save();

    // Remove user from community's members
    community.members = (community.members || []).filter(
      (m) => m.toString() !== user._id.toString()
    );
    await community.save();

    res.json({ message: "Left community", user, community });
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

export const deleteCommunity = async (req, res) => {
  try {
    const { userId } = req.body;
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    // Check if user is the creator
    if (community.createdBy.toString() !== userId) {
      return res.status(403).json({ error: "Only the creator can delete this community" });
    }

    // Find all posts in this community
    const posts = await Post.find({ community: community._id });
    const postIds = posts.map(post => post._id);

    // Delete all comments associated with posts in this community
    if (postIds.length > 0) {
      await Comment.deleteMany({ post: { $in: postIds } });
    }

    // Delete all posts in this community
    await Post.deleteMany({ community: community._id });

    // Remove community from all users' communities
    await User.updateMany(
      { communities: community._id },
      { $pull: { communities: community._id } }
    );

    // Delete the community
    await Community.findByIdAndDelete(req.params.id);

    res.json({ message: "Community deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete community" });
  }
};