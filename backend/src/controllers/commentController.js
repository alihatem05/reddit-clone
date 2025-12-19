import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'username avatar')
      .populate({ path: 'replies', populate: { path: 'user', select: 'username avatar' } });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { parent, post: postId, user: userId } = req.body;
    const newComment = await Comment.create(req.body);
    
    // Add comment reference to user's comments array
    if (userId) {
      await User.findByIdAndUpdate(userId, { $push: { comments: newComment._id } });
    }
    
    if (newComment.post && !parent) {
      await Post.findByIdAndUpdate(newComment.post, { $push: { comments: newComment._id } });
    }

    if (parent) {
      await Comment.findByIdAndUpdate(parent, { $push: { replies: newComment._id } });
    }
    const populated = await Comment.findById(newComment._id).populate('user');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

export const voteComment = async (req, res) => {
  try {
    const { delta, userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const id = req.params.id;
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const hasUp = comment.upvoters.some(u => u.toString() === userId);
    const hasDown = comment.downvoters.some(u => u.toString() === userId);

    if (delta === 0) {
      if (hasUp) {
        comment.upvoters = comment.upvoters.filter(u => u.toString() !== userId);
        comment.karma -= 1;
      } else if (hasDown) {
        comment.downvoters = comment.downvoters.filter(u => u.toString() !== userId);
        comment.karma += 1;
      } else {
        return res.status(400).json({ error: 'No existing vote to remove' });
      }
    } else if (delta === 1) {
      if (hasUp) {
        comment.upvoters = comment.upvoters.filter(u => u.toString() !== userId);
        comment.karma -= 1;
      } else {
        if (hasDown) {
          comment.downvoters = comment.downvoters.filter(u => u.toString() !== userId);
          comment.karma += 1;
        }
        comment.upvoters.push(userObjectId);
        comment.karma += 1;
      }
    } else if (delta === -1) {
      if (hasDown) {
        comment.downvoters = comment.downvoters.filter(u => u.toString() !== userId);
        comment.karma += 1;
      } else {
        if (hasUp) {
          comment.upvoters = comment.upvoters.filter(u => u.toString() !== userId);
          comment.karma -= 1;
        }
        comment.downvoters.push(userObjectId);
        comment.karma -= 1;
      }
    }
    await comment.save();
    const populated = await Comment.findById(comment._id)
      .populate('user')
      .populate({ path: 'replies', populate: { path: 'user', select: 'username avatar' } });
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update comment vote" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.user.toString() !== userId) return res.status(403).json({ error: 'Not authorized' });

    if (comment.parent) {
      await Comment.findByIdAndUpdate(comment.parent, { $pull: { replies: comment._id } });
    } else if (comment.post) {
      await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });
    }
    
    const toDelete = [comment._id.toString()];
    for (let i = 0; i < toDelete.length; i++) {
      const cid = toDelete[i];
      const c = await Comment.findById(cid);
      if (!c) continue;
      c.replies.forEach(r => toDelete.push(r.toString()));
      await Comment.findByIdAndDelete(cid);
    }

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
