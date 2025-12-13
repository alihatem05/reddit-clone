import User from "../models/User.js";
import Post from "../models/Post.js";
import jwt from "jsonwebtoken";

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
      .populate('community');

    user.posts = posts;
    res.json(user);
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
