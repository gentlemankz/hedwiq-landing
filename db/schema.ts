import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

// Pain points that users can select during onboarding
export const PAIN_POINTS = [
  { id: "unclear_agenda", label: "No clear agenda or meeting goals" },
  { id: "action_items_lost", label: "Action items get lost after meetings" },
  { id: "no_decisions", label: "Decisions don't get made" },
  { id: "poor_followup", label: "Poor post-meeting follow-up" },
  { id: "meeting_overload", label: "Too many unproductive meetings" },
  { id: "no_documentation", label: "Lack of meeting documentation" },
  { id: "unclear_roles", label: "Unclear roles and accountability" },
  { id: "other", label: "Other" },
] as const;

export type PainPointId = (typeof PAIN_POINTS)[number]["id"];

// Waitlist entries table
export const waitlist = pgTable("waitlist", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  painPoints: text("pain_points").array().notNull().default([]),
  otherPainPoint: text("other_pain_point"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // For future use: tracking invite status
  invitedAt: timestamp("invited_at"),
  hasAccess: boolean("has_access").default(false).notNull(),
});

export type Waitlist = typeof waitlist.$inferSelect;
export type NewWaitlist = typeof waitlist.$inferInsert;
