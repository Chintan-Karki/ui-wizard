import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  role: text("role").notNull(),
  timestamp: integer("timestamp").notNull(),
  generatedHtml: text("generated_html"),
});

export const insertMessageSchema = createInsertSchema(messages, {
  content: z.string().min(1, "Content is required"),
  role: z.enum(["user", "assistant"]),
  timestamp: z.number(),
  generatedHtml: z.string().nullable().optional(),
}).omit({
  id: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export interface UIGenerationResponse {
  html: string;
  css?: string;
  javascript?: string;
}