/**
 * Amplitude Analytics Configuration
 *
 * This module provides type-safe analytics tracking for the Luframe landing page.
 * Uses the @amplitude/unified SDK with session replay enabled.
 *
 * @see https://amplitude.com/docs/sdks/analytics/browser/browser-unified-sdk
 */

import * as amplitude from '@amplitude/unified';
import { Identify } from '@amplitude/analytics-core';

// ============================================================================
// Configuration
// ============================================================================

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || '';

// Session replay sample rate (0.0 to 1.0)
// 1.0 = 100% of sessions recorded
const SESSION_REPLAY_SAMPLE_RATE = 1.0;

// ============================================================================
// Event Types - Type-safe event definitions
// ============================================================================

/**
 * Landing page event types with their properties
 */
export type AnalyticsEvent =
  // Hero Section Events
  | { name: 'Hero CTA Clicked'; properties: { cta_type: 'start_free_trial' | 'watch_demo'; location: 'hero' } }

  // Header Navigation Events
  | { name: 'Navigation Link Clicked'; properties: { link_label: string; link_href: string; location: 'header' | 'mobile_menu' | 'footer' } }
  | { name: 'Auth CTA Clicked'; properties: { cta_type: 'sign_in' | 'sign_up' | 'get_started'; location: 'header' | 'mobile_menu' | 'cta_section' } }
  | { name: 'Mobile Menu Toggled'; properties: { action: 'open' | 'close' } }

  // Pricing Section Events
  | { name: 'Pricing Plan Viewed'; properties: { plan_name: string; billing_cycle: 'monthly' | 'annual'; monthly_price: number | null; annual_price: number | null } }
  | { name: 'Pricing CTA Clicked'; properties: { plan_name: string; billing_cycle: 'monthly' | 'annual'; cta_text: string; price: number | null } }
  | { name: 'Billing Toggle Changed'; properties: { selected_cycle: 'monthly' | 'annual'; previous_cycle: 'monthly' | 'annual' } }

  // Feature Section Events
  | { name: 'Feature Section Viewed'; properties: { feature_name: string; feature_index: number } }
  | { name: 'Feature Subfeature Selected'; properties: { feature_name: string; subfeature_title: string; subfeature_index: number } }

  // FAQ Section Events
  | { name: 'FAQ Item Expanded'; properties: { question_id: string; question_text: string } }
  | { name: 'FAQ Item Collapsed'; properties: { question_id: string; question_text: string } }

  // Scroll Tracking Events
  | { name: 'Section Viewed'; properties: { section_name: string; scroll_depth_percent: number } }
  | { name: 'Page Scroll Milestone'; properties: { milestone_percent: 25 | 50 | 75 | 100 } }

  // Demo Interaction Events
  | { name: 'Demo Interaction'; properties: { demo_type: 'meeting_room' | 'transcription' | 'note_taker' | 'email_draft' | 'agenda'; interaction_type: string } }

  // External Link Events
  | { name: 'External Link Clicked'; properties: { link_url: string; link_text: string; location: string } }

  // Waitlist Events (no PII - email removed for privacy compliance)
  | { name: 'Waitlist CTA Clicked'; properties: { cta_type: string; location: string } }
  | { name: 'Waitlist Step Completed'; properties: { step: 1 | 2 } }
  | { name: 'Waitlist Submitted'; properties: { pain_points: string[]; has_other: boolean; pain_points_count: number } };

// ============================================================================
// Initialization
// ============================================================================

let isInitialized = false;

/**
 * Initialize Amplitude with analytics and session replay
 * Should be called once on app mount (client-side only)
 */
export function initAmplitude(): void {
  if (typeof window === 'undefined') {
    return; // Server-side, skip initialization
  }

  if (isInitialized) {
    return; // Already initialized
  }

  if (!AMPLITUDE_API_KEY) {
    console.warn('[Amplitude] API key not configured. Set NEXT_PUBLIC_AMPLITUDE_API_KEY in your environment.');
    return;
  }

  try {
    amplitude.initAll(AMPLITUDE_API_KEY, {
      analytics: {
        autocapture: {
          elementInteractions: true,
          pageViews: true,
          sessions: true,
          formInteractions: true,
          fileDownloads: true,
        },
        defaultTracking: {
          pageViews: true,
          sessions: true,
          formInteractions: true,
          fileDownloads: true,
        },
      },
      sessionReplay: {
        sampleRate: SESSION_REPLAY_SAMPLE_RATE,
      },
    });

    isInitialized = true;

    if (process.env.NODE_ENV === 'development') {
      console.log('[Amplitude] Initialized with session replay');
    }
  } catch (error) {
    console.error('[Amplitude] Initialization failed:', error);
  }
}

// ============================================================================
// Tracking Functions
// ============================================================================

/**
 * Track a custom event with type-safe properties
 */
export function trackEvent<T extends AnalyticsEvent>(
  eventName: T['name'],
  properties: T['properties']
): void {
  if (typeof window === 'undefined') return;

  try {
    amplitude.track(eventName, properties);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Amplitude] Event tracked:', eventName, properties);
    }
  } catch (error) {
    console.error('[Amplitude] Track event failed:', error);
  }
}

/**
 * Convenience function for tracking events
 */
export function track(event: AnalyticsEvent): void {
  trackEvent(event.name, event.properties as AnalyticsEvent['properties']);
}

/**
 * Identify a user with properties
 */
export function identifyUser(userId: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  try {
    amplitude.setUserId(userId);

    if (properties) {
      const identifyObj = new Identify();
      Object.entries(properties).forEach(([key, value]) => {
        identifyObj.set(key, value as string | number | boolean);
      });
      amplitude.identify(identifyObj);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Amplitude] User identified:', userId, properties);
    }
  } catch (error) {
    console.error('[Amplitude] Identify user failed:', error);
  }
}

/**
 * Set user properties without changing user ID
 */
export function setUserProperties(properties: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  try {
    const identifyObj = new Identify();
    Object.entries(properties).forEach(([key, value]) => {
      identifyObj.set(key, value as string | number | boolean);
    });
    amplitude.identify(identifyObj);
  } catch (error) {
    console.error('[Amplitude] Set user properties failed:', error);
  }
}

/**
 * Reset user identity (for logout)
 */
export function resetUser(): void {
  if (typeof window === 'undefined') return;

  try {
    amplitude.reset();
  } catch (error) {
    console.error('[Amplitude] Reset user failed:', error);
  }
}

// ============================================================================
// Section Tracking Helpers
// ============================================================================

/**
 * Track when a section comes into view
 */
export function trackSectionView(sectionName: string, scrollDepthPercent: number): void {
  track({
    name: 'Section Viewed',
    properties: { section_name: sectionName, scroll_depth_percent: scrollDepthPercent }
  });
}

/**
 * Track scroll milestones (25%, 50%, 75%, 100%)
 */
const trackedMilestones = new Set<number>();

export function trackScrollMilestone(percent: number): void {
  const milestone = Math.floor(percent / 25) * 25 as 25 | 50 | 75 | 100;

  if (milestone >= 25 && !trackedMilestones.has(milestone)) {
    trackedMilestones.add(milestone);
    track({
      name: 'Page Scroll Milestone',
      properties: { milestone_percent: milestone }
    });
  }
}

/**
 * Reset scroll tracking (for page changes)
 */
export function resetScrollTracking(): void {
  trackedMilestones.clear();
}
