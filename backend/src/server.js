import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/communities", communityRoutes);

app.use(express.static(path.join(__dirname, "../../frontend/build")));

app.use((req, res, next) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
  } else {
    res.status(404).json({ error: "API endpoint not found" });
  }
});

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => 
      console.log(`Server running on port ${PORT} and DB connected.`)
    );
  })
  .catch((error) => {
    console.log(error);
  });
