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

const GROQ_API_KEY = process.env.GROQ_API_KEY;
console.log('Loaded GROQ_API_KEY:', GROQ_API_KEY ? `${GROQ_API_KEY.substring(0, 10)}...` : 'NOT FOUND');

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

app.post("/api/summarize", async (req, res) => {
  try {
    console.log('Received summarize request');
    const { text } = req.body;
    console.log('Text to summarize:', text);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes text concisely.'
          },
          {
            role: 'user',
            content: `Summarize or explain the context of the following text in a short paragraph:\n\n${text}`
          }
        ],
        model: 'llama-3.3-70b-versatile',
        stream: false,
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      throw new Error(`API Error: ${data.error?.message || response.statusText}`);
    }
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid API response structure');
    }
    
    const summary = data.choices[0].message.content;
    console.log('Generated summary:', summary);

    res.json({ summary });
  } catch (err) {
    console.error('AI summarization error:', err);
    res.status(500).json({ error: "AI summarization failed", details: err.message });
  }
});


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
