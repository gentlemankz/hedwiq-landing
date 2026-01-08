"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getCachedIsSafari } from "@/lib/browser";

// Module-level reference for scroll control from outside (e.g., stop when modal opens)
let globalLenisInstance: Lenis | null = null;

export function stopLenis() {
  globalLenisInstance?.stop();
}

export function startLenis() {
  globalLenisInstance?.start();
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafCallbackRef = useRef<((time: number) => void) | null>(null);
  const previousLagSmoothingRef = useRef<{ lag: number; minFPS: number } | null>(null);

  useEffect(() => {
    // Skip Lenis on Safari/iOS - it conflicts with ScrollTrigger pinning
    // and causes rubber-banding/hitching during scroll
    const isSafari = getCachedIsSafari();
    if (isSafari) {
      // On Safari, just use native scroll - ScrollTrigger works better without Lenis
      return;
    }

    // Store previous GSAP lagSmoothing settings to restore on cleanup
    // GSAP doesn't expose a getter, so we track that we changed it
    previousLagSmoothingRef.current = { lag: 500, minFPS: 20 }; // GSAP defaults

    // Initialize Lenis with balanced settings
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;
    globalLenisInstance = lenis;

    // Setup ScrollTrigger scroller proxy for proper Lenis integration
    // This fixes conflicts between Lenis transforms and ScrollTrigger pinning
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      // Use "fixed" pinType to avoid transform conflicts with Lenis
      pinType: "fixed",
    });

    // Connect Lenis scroll events to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Store the callback reference so we can properly remove it
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    rafCallbackRef.current = rafCallback;

    // Use GSAP ticker for smooth animation frame updates
    gsap.ticker.add(rafCallback);

    // Keep lag smoothing enabled for Safari compatibility (less aggressive setting)
    // Completely disabling it (lagSmoothing(0)) causes jank on slower devices
    gsap.ticker.lagSmoothing(200, 20);

    // Refresh ScrollTrigger after Lenis is fully initialized
    ScrollTrigger.refresh();

    // Cleanup
    return () => {
      // Remove the exact callback reference we added
      if (rafCallbackRef.current) {
        gsap.ticker.remove(rafCallbackRef.current);
        rafCallbackRef.current = null;
      }

      // Restore GSAP's default lag smoothing
      if (previousLagSmoothingRef.current) {
        gsap.ticker.lagSmoothing(
          previousLagSmoothingRef.current.lag,
          previousLagSmoothingRef.current.minFPS
        );
      }

      // Clear the scroller proxy
      ScrollTrigger.scrollerProxy(document.body, undefined);

      // Destroy Lenis instance
      lenis.destroy();
      lenisRef.current = null;
      globalLenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
