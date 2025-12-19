import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema(
  {
    name:            { type: String, required: true, unique: true },
    description:     { type: String, default: "" },
    logo:            { type: String, default: "" },
    backgroundImage: { type: String, default: "" },
    type:            { type: String, enum: ["public", "restricted", "private"], default: "public" },
    topic:           { type: String, default: "" },

    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Community", CommunitySchema);
