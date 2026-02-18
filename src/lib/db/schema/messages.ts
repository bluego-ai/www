import {
  uuid,
  text,
  boolean,
  timestamp,
  pgTable,
  integer,
  jsonb,
} from "drizzle-orm/pg-core"

export const botMessages = pgTable("bot_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  botId: text("bot_id").notNull(), // e.g. "oliver", "max", "henry"
  botName: text("bot_name").notNull(), // display name
  direction: text("direction").notNull(), // "inbound" | "outbound"
  senderName: text("sender_name"), // who sent — bot name or contact name
  senderAddress: text("sender_address"), // phone/email
  recipientName: text("recipient_name"),
  recipientAddress: text("recipient_address"),
  chatGuid: text("chat_guid"), // group chat identifier
  chatName: text("chat_name"), // group name if applicable
  messageText: text("message_text"),
  messageId: text("message_id"), // original message ID from the bot
  hasMedia: boolean("has_media").default(false),
  mediaType: text("media_type"), // image/audio/video/pdf
  isGroup: boolean("is_group").default(false),
  status: text("status").notNull(), // "sent" | "delivered" | "failed" | "received"
  errorText: text("error_text"), // if failed, the error
  flagged: boolean("flagged").default(false), // for QA — auto-flag suspicious messages
  flagReason: text("flag_reason"),
  tokenCount: integer("token_count"), // LLM tokens used for this response
  responseTimeMs: integer("response_time_ms"), // how long the bot took to respond
  createdAt: timestamp("created_at").notNull().defaultNow(),
  metadata: jsonb("metadata"), // flexible extra data
});

export type BotMessage = typeof botMessages.$inferSelect;
export type NewBotMessage = typeof botMessages.$inferInsert;