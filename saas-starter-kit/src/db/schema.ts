import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Database Schema for SaaS Starter Kit
 * 
 * Tables:
 * - profiles: User profile data (linked to Supabase auth.users)
 * - subscriptions: Stripe subscription data
 * - customers: Stripe customer data
 */

// Enums
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "trialing",
  "active",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "past_due",
  "unpaid",
  "paused",
]);

export const pricingPlanIntervalEnum = pgEnum("pricing_plan_interval", [
  "day",
  "week",
  "month",
  "year",
]);

// ============================================
// PROFILES TABLE
// ============================================
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // References auth.users.id
  email: text("email").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  
  // Subscription status (denormalized for quick access)
  isPro: boolean("is_pro").default(false).notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// CUSTOMERS TABLE (Stripe)
// ============================================
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey(), // References auth.users.id
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// SUBSCRIPTIONS TABLE (Stripe)
// ============================================
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(), // Stripe subscription ID
  userId: uuid("user_id").notNull().references(() => profiles.id),
  
  // Stripe data
  status: subscriptionStatusEnum("status").notNull(),
  priceId: text("price_id").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  
  // Subscription dates
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }).notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  cancelAt: timestamp("cancel_at", { withTimezone: true }),
  canceledAt: timestamp("canceled_at", { withTimezone: true }),
  trialStart: timestamp("trial_start", { withTimezone: true }),
  trialEnd: timestamp("trial_end", { withTimezone: true }),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// RELATIONS
// ============================================
export const profilesRelations = relations(profiles, ({ one, many }) => ({
  customer: one(customers, {
    fields: [profiles.id],
    references: [customers.id],
  }),
  subscriptions: many(subscriptions),
}));

export const customersRelations = relations(customers, ({ one }) => ({
  profile: one(profiles, {
    fields: [customers.id],
    references: [profiles.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  profile: one(profiles, {
    fields: [subscriptions.userId],
    references: [profiles.id],
  }),
}));

// ============================================
// TYPE EXPORTS
// ============================================
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
