import { Request, Response } from "express";
import { getOrCreateConversation } from "../services/conversation.service.ts";
import {
  getRecentMessages,
  createMessage,
} from "../services/message.service.ts";
import { validateMessage } from "../utils/validators.ts";
import { generateReply } from "../llm/gemini.service.ts";

export async function postChatMessage(req: Request, res: Response) {
  try {
    const { message, sessionId } = req.body;

    const cleanMessage = validateMessage(message);

    const conversation = await getOrCreateConversation(sessionId);

    await createMessage({
      conversationId: conversation.id,
      sender: "user",
      text: cleanMessage,
    });

    // Get recent messages for context
    const history = await getRecentMessages(conversation.id, 6);

    let reply: string;

    // Here we generate the AI reply
    try {
      reply = await generateReply({
        history: history.reverse(),
        userMessage: cleanMessage,
      });

    } catch {
      reply =
        "Sorry, I'm having trouble right now. Please try again in a moment.";
    }

    await createMessage({
      conversationId: conversation.id,
      sender: "ai",
      text: reply,
    });

    res.json({
      reply,
      sessionId: conversation.id,
    });
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : "Invalid request",
    });
  }
}
