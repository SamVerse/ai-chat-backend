import { db } from "../db/index.js";
import { conversations } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function getOrCreateConversation(
  sessionId?: string
) {
  if (sessionId) {
    const [existing] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, sessionId));

    if (existing) return existing;
  }

  const [created] = await db
    .insert(conversations)
    .values({})
    .returning();

  return created;
}
