import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, default: "" },
    image:       { type: String, default: "" },

    user:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    community:  { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
    comments:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" , default: []}],
    upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    downvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    votes:      { type: Number, default: 0 }
    },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
