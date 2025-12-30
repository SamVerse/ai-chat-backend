import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPrompt } from "./prompt.ts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function generateReply({
  history,
  userMessage,
}: {
  history: { sender: "user" | "ai"; text: string }[];
  userMessage: string;
}): Promise<string> {
  try {
    const prompt = buildPrompt(history, userMessage);

    const result = await model.generateContent(prompt);

    return result.response.text().trim();
  } catch (err) {
    console.error("Gemini error:", err);
    throw new Error("LLM_FAILURE");
  }
}
