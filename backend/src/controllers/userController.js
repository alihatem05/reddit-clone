import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import mongoose from "mongoose";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ user: req.params.id })
      .populate('user')
      .populate('community')
      .sort({ createdAt: -1 });

    const comments = await Comment.find({ user: req.params.id })
      .populate('user')
      .populate('post')
      .populate({
        path: 'post',
        populate: [
          { path: 'user' },
          { path: 'community' }
        ]
      })
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'username avatar' }
      })
      .sort({ createdAt: -1 });

    const upvotedPosts = await Post.find({ upvoters: req.params.id })
      .populate('user')
      .populate('community')
      .sort({ createdAt: -1 });

    const downvotedPosts = await Post.find({ downvoters: req.params.id })
      .populate('user')
      .populate('community')
      .sort({ createdAt: -1 });

    const upvotedComments = await Comment.find({ upvoters: req.params.id })
      .populate('user')
      .populate('post')
      .populate({
        path: 'post',
        populate: [
          { path: 'user' },
          { path: 'community' }
        ]
      })
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'username avatar' }
      })
      .sort({ createdAt: -1 });

    const downvotedComments = await Comment.find({ downvoters: req.params.id })
      .populate('user')
      .populate('post')
      .populate({
        path: 'post',
        populate: [
          { path: 'user' },
          { path: 'community' }
        ]
      })
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'username avatar' }
      })
      .sort({ createdAt: -1 });

    user.posts = posts;
    user.comments = comments;
    user.upvotedPosts = upvotedPosts;
    user.downvotedPosts = downvotedPosts;
    user.upvotedComments = upvotedComments;
    user.downvotedComments = downvotedComments;
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserComments = async (req, res) => {
  try {
    const comments = await Comment.find({ user: req.params.id })
      .populate('user', 'username avatar')
      .populate('post', 'title _id')
      .populate({ path: 'replies', populate: { path: 'user', select: 'username avatar' } })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserUpvotedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ upvoters: req.params.id })
      .populate('user', 'username avatar')
      .populate('community', 'name logo')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserDownvotedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ downvoters: req.params.id })
      .populate('user', 'username avatar')
      .populate('community', 'name logo')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await User.register(username, email, password);

    const token = createToken(newUser._id);

    res.status(200).json({
      message: "User created successfully",
      user: newUser,
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, avatar } = req.body;

    // Validate ID format using Mongoose's built-in validation
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Find the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate email if provided
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ error: "Incorrect email structure!" });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: "Email already exists!" });
      }
    }

    // Check if username is already taken by another user
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ error: "Username already taken!" });
      }
    }

    // Update fields
    // For avatars: if it's a base64 data URL (custom upload), store it as-is
    // If it's a filename (from pfps folder), store the filename
    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(id).select('-password');

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
