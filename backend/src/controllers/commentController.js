import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

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
    const { parent, post: postId } = req.body;
    const newComment = await Comment.create(req.body);
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

    const hasUp = comment.upvoters.some(u => u.toString() === userId);
    const hasDown = comment.downvoters.some(u => u.toString() === userId);

    if (delta === 0) {
      // remove existing vote
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
        // unvote
        comment.upvoters = comment.upvoters.filter(u => u.toString() !== userId);
        comment.karma -= 1;
      } else {
        if (hasDown) {
          comment.downvoters = comment.downvoters.filter(u => u.toString() !== userId);
          comment.karma += 1; // remove downvote (+1) then add upvote below (+1)
        }
        comment.upvoters.push(userId);
        comment.karma += 1;
      }
    } else if (delta === -1) {
      if (hasDown) {
        // unvote
        comment.downvoters = comment.downvoters.filter(u => u.toString() !== userId);
        comment.karma += 1;
      } else {
        if (hasUp) {
          comment.upvoters = comment.upvoters.filter(u => u.toString() !== userId);
          comment.karma -= 1; // remove upvote (-1) then add downvote below (-1)
        }
        comment.downvoters.push(userId);
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
