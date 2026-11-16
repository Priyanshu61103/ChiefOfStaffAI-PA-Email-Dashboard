import express from "express";
import Conversation from "../models/Conversation.js";
import { seedConversations } from "../seedData.js";

const router = express.Router();

// POST /api/seed/reset
router.post("/reset", async (req, res) => {
  try {
    await Conversation.deleteMany({});
    const inserted = await Conversation.insertMany(seedConversations);
    console.log(`Database reset: seeded ${inserted.length} conversations.`);
    res.json({
      success: true,
      message: "Database reset and seeded successfully",
      count: inserted.length,
    });
  } catch (error) {
    console.error("Error resetting and seeding database:", error);
    res.status(500).json({ error: "Failed to reset and seed database" });
  }
});

export default router;
