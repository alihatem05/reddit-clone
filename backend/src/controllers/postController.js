import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import mongoose from "mongoose";

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
      .populate("community")
      .populate({
        path: 'comments',
        populate: [
          { path: 'user' },
          { path: 'replies', populate: { path: 'user' } },
        ],
      });

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

export const votePost = async (req, res) => {
  try {
    const { delta, userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Convert userId to ObjectId for consistency
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const hasUp = post.upvoters.some(u => u.toString() === userId);
    const hasDown = post.downvoters.some(u => u.toString() === userId);

    if (delta === 0) {
      // remove existing vote
      if (hasUp) {
        post.upvoters = post.upvoters.filter(u => u.toString() !== userId);
        post.votes -= 1;
      } else if (hasDown) {
        post.downvoters = post.downvoters.filter(u => u.toString() !== userId);
        post.votes += 1;
      } else {
        return res.status(400).json({ error: 'No existing vote to remove' });
      }
    } else if (delta === 1) {
      if (hasUp) {
        post.upvoters = post.upvoters.filter(u => u.toString() !== userId);
        post.votes -= 1;
      } else {
        if (hasDown) {
          post.downvoters = post.downvoters.filter(u => u.toString() !== userId);
          post.votes += 1; // remove downvote then add upvote
        }
        post.upvoters.push(userObjectId);
        post.votes += 1;
      }
    } else if (delta === -1) {
      if (hasDown) {
        post.downvoters = post.downvoters.filter(u => u.toString() !== userId);
        post.votes += 1;
      } else {
        if (hasUp) {
          post.upvoters = post.upvoters.filter(u => u.toString() !== userId);
          post.votes -= 1; // remove upvote (-1) then add downvote (-1)
        }
        post.downvoters.push(userObjectId);
        post.votes -= 1;
      }
    }
    await post.save();
    const populated = await Post.findById(post._id)
      .populate('user')
      .populate('community')
      .populate({
        path: 'comments',
        populate: [
          { path: 'user' },
          { path: 'replies', populate: { path: 'user' } },
        ],
      });
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post vote' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.user.toString() !== userId) return res.status(403).json({ error: 'Not authorized' });

    // remove comments linked to this post
    await Post.findByIdAndDelete(id);
    // delete all comments associated with this post
    await Comment.deleteMany({ post: id });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
