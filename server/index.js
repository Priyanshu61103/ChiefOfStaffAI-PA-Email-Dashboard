import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import Conversation from "./models/Conversation.js";
import { seedConversations } from "./seedData.js";
import conversationsRouter from "./routes/conversations.js";
import seedRouter from "./routes/seed.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/conversations", conversationsRouter);
app.use("/api/seed", seedRouter);

// Database connection & Auto-Seed
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(async () => {
      console.log("MongoDB Connected");
      try {
        const count = await Conversation.countDocuments();
        if (count === 0) {
          console.log("Empty database detected. Auto-seeding initial 18 conversations...");
          await Conversation.insertMany(seedConversations);
          console.log("Database successfully seeded with 18 conversations.");
        } else {
          console.log(`Database already initialized with ${count} conversations.`);
        }
      } catch (seedErr) {
        console.error("Auto-seed error:", seedErr);
      }
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
} else {
  console.warn("MONGODB_URI environment variable is not defined.");
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
