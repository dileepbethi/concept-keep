import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  title: text("title").default("Innovator").notNull(),
  profileImage: text("profile_image"),
  bio: text("bio"),
  privateVault: boolean("private_vault").default(false).notNull(),
  twoFactorAuth: boolean("two_factor_auth").default(false).notNull(),
  emailNotifications: boolean("email_notifications").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ideas = pgTable("ideas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  problemStatement: text("problem_statement"),
  solution: text("solution"),
  targetAudience: text("target_audience"),
  tags: text("tags").array().default([]),
  status: text("status").notNull().default("draft"), // draft, public, investment_open
  likes: integer("likes").default(0).notNull(),
  comments: integer("comments").default(0).notNull(),
  funding: decimal("funding", { precision: 10, scale: 2 }).default("0").notNull(),
  investorCount: integer("investor_count").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const investments = pgTable("investments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  ideaId: varchar("idea_id").references(() => ideas.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  roi: decimal("roi", { precision: 5, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  ideaId: varchar("idea_id").references(() => ideas.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const likes = pgTable("likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  ideaId: varchar("idea_id").references(() => ideas.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const followers = pgTable("followers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  followerId: varchar("follower_id").references(() => users.id).notNull(),
  followingId: varchar("following_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Private Market Tables
export const userWallet = pgTable("user_wallet", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  credits: decimal("credits", { precision: 12, scale: 2 }).default("10000.00").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const marketListings = pgTable("market_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  ideaId: varchar("idea_id").references(() => ideas.id).notNull(),
  companyName: text("company_name").notNull(),
  description: text("description").notNull(),
  totalValuation: decimal("total_valuation", { precision: 15, scale: 2 }).notNull(),
  equityPercentage: decimal("equity_percentage", { precision: 5, scale: 2 }).notNull(),
  pricePerShare: decimal("price_per_share", { precision: 10, scale: 2 }).notNull(),
  totalShares: integer("total_shares").notNull(),
  availableShares: integer("available_shares").notNull(),
  industry: text("industry").notNull(),
  status: text("status").notNull().default("active"), // active, suspended, completed
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerId: varchar("buyer_id").references(() => users.id).notNull(),
  sellerId: varchar("seller_id").references(() => users.id),
  listingId: varchar("listing_id").references(() => marketListings.id).notNull(),
  type: text("type").notNull(), // buy, sell
  shares: integer("shares").notNull(),
  pricePerShare: decimal("price_per_share", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("completed"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userHoldings = pgTable("user_holdings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  listingId: varchar("listing_id").references(() => marketListings.id).notNull(),
  shares: integer("shares").notNull(),
  averageCost: decimal("average_cost", { precision: 10, scale: 2 }).notNull(),
  totalInvested: decimal("total_invested", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertIdeaSchema = createInsertSchema(ideas).omit({
  id: true,
  userId: true,
  likes: true,
  comments: true,
  funding: true,
  investorCount: true,
  featured: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true,
  roi: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertUserWalletSchema = createInsertSchema(userWallet).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketListingSchema = createInsertSchema(marketListings).omit({
  id: true,
  availableShares: true,
  featured: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  totalAmount: true,
  status: true,
  createdAt: true,
});

export const insertUserHoldingSchema = createInsertSchema(userHoldings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Idea = typeof ideas.$inferSelect;
export type InsertIdea = z.infer<typeof insertIdeaSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Like = typeof likes.$inferSelect;
export type Follower = typeof followers.$inferSelect;

// Private Market Types
export type UserWallet = typeof userWallet.$inferSelect;
export type InsertUserWallet = z.infer<typeof insertUserWalletSchema>;
export type MarketListing = typeof marketListings.$inferSelect;
export type InsertMarketListing = z.infer<typeof insertMarketListingSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type UserHolding = typeof userHoldings.$inferSelect;
export type InsertUserHolding = z.infer<typeof insertUserHoldingSchema>;
