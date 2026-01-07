import { NextRequest, NextResponse } from "next/server";
import { db, waitlist } from "@/db";
import { sql } from "drizzle-orm";
import {
  waitlistSubmissionSchema,
  sanitizeWaitlistData,
} from "@/lib/validations/waitlist";

// ============================================================================
// Rate Limiting (Simple in-memory implementation)
// For production, consider using Redis or a dedicated rate limiting service
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Clean up expired entries periodically
  if (rateLimitMap.size > 10000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!entry || entry.resetTime < now) {
    // New window
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  entry.count++;
  return { allowed: true };
}

// ============================================================================
// API Handler
// ============================================================================

export async function POST(request: NextRequest) {
  // Rate limiting check
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfter),
        },
      }
    );
  }

  try {
    const body = await request.json();

    // Validate request body with shared schema
    const result = waitlistSubmissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    // Sanitize validated data
    const sanitizedData = sanitizeWaitlistData(result.data);
    const { name, email, painPoints, otherPainPoint } = sanitizedData;

    // Upsert: Insert or update if email exists
    // This prevents email enumeration by always returning the same response
    await db
      .insert(waitlist)
      .values({
        name,
        email,
        painPoints,
        otherPainPoint,
      })
      .onConflictDoUpdate({
        target: waitlist.email,
        set: {
          name,
          painPoints,
          otherPainPoint,
          updatedAt: sql`now()`,
        },
      });

    // Always return the same response to prevent email enumeration
    return NextResponse.json(
      { message: "Successfully joined the waitlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
