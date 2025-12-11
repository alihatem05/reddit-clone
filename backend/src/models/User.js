import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, default: "" },
    avatar:   { type: String, default: "" },
    karma:    { type: Number, default: 0 },

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }]
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
