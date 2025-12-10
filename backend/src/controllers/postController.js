import Post from "../models/Post.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .populate("community", "name");
    
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const createPost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
};
