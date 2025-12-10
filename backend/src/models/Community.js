import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    logo:        { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Community", CommunitySchema);
