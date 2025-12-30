import redis from "../cache/redis.js";
import { db } from "../db/index.js";
import { messages } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

const CACHE_TTL = 300; // 5 minutes in seconds


export async function createMessage({
  conversationId,
  sender,
  text,
}: {
  conversationId: string;
  sender: "user" | "ai";
  text: string;
}) {
  await db.insert(messages).values({
    conversationId,
    sender,
    text,
  });

  try {
    await redis.del(`conversation:${conversationId}:messages`);
  } catch {
    // ignore cache errors
  }
}


export async function getRecentMessages(
  conversationId: string,
  limit = 10
) {
  const cacheKey = `conversation:${conversationId}:messages`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("CACHE HIT");
      return JSON.parse(cached);
    }
  } catch {
    // ignore cache errors
  }

  console.log("CACHE MISS - fetching from DB");

  const result = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(desc(messages.createdAt))
    .limit(limit);

  try {
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
  } catch {
    // ignore cache errors
  }

  return result;
}