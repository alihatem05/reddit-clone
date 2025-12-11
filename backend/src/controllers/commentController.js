import Comment from "../models/Comment.js";

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

export const addComment = async (req, res) => {
  try {
    const newComment = await Comment.create(req.body);
    res.json(newComment);
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
