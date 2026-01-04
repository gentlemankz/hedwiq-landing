/**
 * Browser detection utilities for Safari-specific optimizations.
 * Safari has performance issues with certain CSS features like
 * filter: blur(), backdrop-filter, and complex SVG animations.
 */

import { useSyncExternalStore } from "react";

/**
 * Check if the current browser is Safari (including iOS Safari).
 * Returns false during SSR.
 */
export function isSafari(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const ua = navigator.userAgent;

  // Check for Safari: contains Safari but not Chrome/Chromium/Edge
  const isSafariBrowser =
    /Safari/.test(ua) &&
    !/Chrome/.test(ua) &&
    !/Chromium/.test(ua) &&
    !/Edg/.test(ua);

  // Check for iOS devices (all browsers on iOS use WebKit)
  // This includes iPadOS which reports as Mac but has touch support
  const isIOS = /iPad|iPhone|iPod/.test(ua);

  // iPadOS Safari reports as Mac in UA but has touch support
  // Use maxTouchPoints > 1 with Mac UA to detect iPadOS
  const isIPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;

  return isSafariBrowser || isIOS || isIPadOS;
}

/**
 * Check if the browser is WebKit-based (Safari, iOS browsers).
 * Useful for detecting WebKit-specific rendering issues.
 */
export function isWebKit(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  return /AppleWebKit/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
}

/**
 * Hook-friendly cached Safari detection.
 * Call this once at component mount to avoid repeated UA parsing.
 */
let cachedIsSafari: boolean | null = null;

export function getCachedIsSafari(): boolean {
  if (cachedIsSafari === null) {
    cachedIsSafari = isSafari();
  }
  return cachedIsSafari;
}

/**
 * React hook for Safari detection.
 * Uses useSyncExternalStore for proper SSR hydration without cascading renders.
 * Use this in React components for Safari-specific optimizations.
 */
// Store for Safari detection state
const safariStore = {
  getSnapshot: () => getCachedIsSafari(),
  getServerSnapshot: () => false, // Always false on server
  subscribe: () => () => {}, // No-op since browser UA doesn't change
};

export function useSafariDetection(): boolean {
  return useSyncExternalStore(
    safariStore.subscribe,
    safariStore.getSnapshot,
    safariStore.getServerSnapshot
  );
}

/**
 * Check if the device is likely low-powered (mobile/tablet).
 * Useful for reducing video quality or disabling autoplay on constrained devices.
 */
export function isLowPowerDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  // Check for mobile/tablet via touch and screen size
  const isTouchDevice = navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 768;

  return isTouchDevice && isSmallScreen;
}
