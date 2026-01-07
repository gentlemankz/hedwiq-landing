import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

// Pain points that users can select during onboarding
export const PAIN_POINTS = [
  { id: "note_taking", label: "Taking notes during meetings" },
  { id: "action_items", label: "Tracking action items and follow-ups" },
  { id: "meeting_prep", label: "Preparing for meetings" },
  { id: "meeting_overload", label: "Too many meetings" },
  { id: "missed_context", label: "Missing context from past meetings" },
  { id: "email_followups", label: "Writing follow-up emails" },
  { id: "staying_focused", label: "Staying focused during meetings" },
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
