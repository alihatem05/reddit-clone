import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import postRoutes from "./routes/posts.js";
import communityRoutes from "./routes/communities.js";
import userRoutes from "./routes/users.js";
import commentRoutes from "./routes/comments.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/posts", postRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

const PORT = 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
