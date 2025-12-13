import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    karma: { type: Number, default: 0 },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    downvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }]
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
