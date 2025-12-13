import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username avatar");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

export const addComment = async (req, res) => {
  try {
    const newComment = await Comment.create(req.body);
    // Push comment id into post's comments array
    if (newComment.post) {
      await Post.findByIdAndUpdate(newComment.post, { $push: { comments: newComment._id } });
    }
    const populated = await Comment.findById(newComment._id).populate('user');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
