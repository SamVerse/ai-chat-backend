import { Router } from "express";
import { postChatMessage } from "../controllers/chat.controller.js";
import { getRecentMessages } from "../services/message.service.js";

const router = Router();

router.post("/message", postChatMessage);

router.get("/history/:conversationId", async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await getRecentMessages(conversationId);

    res.json(messages);
  } catch {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
