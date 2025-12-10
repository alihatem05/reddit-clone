import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, default: "" },
    avatar:   { type: String, default: "" },

    joinedCommunities: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Community" }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
