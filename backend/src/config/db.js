// src/config/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set in .env");

  try {
    await mongoose.connect(uri, {
      // sensible defaults
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Optional: reduce how long it waits for server selection
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);
    throw err; // rethrow so callers know connection failed
  }
};
