import Post from "../models/Post.js";
import User from "../models/User.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user")
      .populate("community");
    
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user")
      .populate("community");

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

export const createPost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    // add post reference to user's posts array
    if (newPost.user) {
      await User.findByIdAndUpdate(newPost.user, { $push: { posts: newPost._id } });
    }
    const populated = await Post.findById(newPost._id).populate('user').populate('community');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )
    .populate("user")
    .populate("community");

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
};
