import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const components = pgTable("components", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  htmlCode: text("html_code").notNull(),
  cssCode: text("css_code").notNull().default(""),
  jsCode: text("js_code").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  isDeleted: boolean("is_deleted").notNull().default(false),
  isFavorite: boolean("is_favorite").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertComponentSchema = createInsertSchema(components).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateComponentSchema = insertComponentSchema.partial();

export type Component = typeof components.$inferSelect;
export type InsertComponent = z.infer<typeof insertComponentSchema>;
export type UpdateComponent = z.infer<typeof updateComponentSchema>;

// Keep existing user schema for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
