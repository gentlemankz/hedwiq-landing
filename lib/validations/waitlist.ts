import { z } from "zod";
import { PAIN_POINTS, type PainPointId } from "@/db/schema";

// ============================================================================
// Shared Waitlist Validation Schemas
// ============================================================================

// Valid pain point IDs derived from schema
const validPainPointIds = PAIN_POINTS.map((p) => p.id) as [PainPointId, ...PainPointId[]];

/**
 * Step 1: Basic user information
 */
export const waitlistStep1Schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .transform((val) => val.trim()),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .transform((val) => val.toLowerCase().trim()),
});

/**
 * Step 2: Pain points selection
 */
export const waitlistStep2Schema = z.object({
  painPoints: z
    .array(z.enum(validPainPointIds))
    .min(1, "Please select at least one challenge")
    .max(PAIN_POINTS.length, "Invalid selection"),
  otherPainPoint: z
    .string()
    .max(500, "Please keep your response under 500 characters")
    .optional()
    .transform((val) => val?.trim()),
});

/**
 * Complete waitlist submission schema (for API)
 */
export const waitlistSubmissionSchema = waitlistStep1Schema.merge(waitlistStep2Schema);

// Type exports
export type WaitlistStep1Data = z.infer<typeof waitlistStep1Schema>;
export type WaitlistStep2Data = z.infer<typeof waitlistStep2Schema>;
export type WaitlistSubmissionData = z.infer<typeof waitlistSubmissionSchema>;

// ============================================================================
// Sanitization Utilities
// ============================================================================

/**
 * Sanitize string input to prevent XSS
 * Removes potential script tags and HTML
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim();
}

/**
 * Sanitize waitlist data before storage
 */
export function sanitizeWaitlistData(data: WaitlistSubmissionData): WaitlistSubmissionData {
  return {
    name: sanitizeString(data.name),
    email: data.email, // Email is already validated and lowercased
    painPoints: data.painPoints,
    otherPainPoint: data.otherPainPoint ? sanitizeString(data.otherPainPoint) : undefined,
  };
}
