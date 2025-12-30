import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const senderEnum = pgEnum("sender", ["user", "ai"]);

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),

  sender: senderEnum("sender").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
