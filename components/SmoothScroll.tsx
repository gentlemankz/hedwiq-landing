"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafCallbackRef = useRef<((time: number) => void) | null>(null);
  const previousLagSmoothingRef = useRef<{ lag: number; minFPS: number } | null>(null);

  useEffect(() => {
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

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Store the callback reference so we can properly remove it
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    rafCallbackRef.current = rafCallback;

    // Use GSAP ticker for smooth animation frame updates
    gsap.ticker.add(rafCallback);

    // Disable GSAP's default lag smoothing for better sync
    gsap.ticker.lagSmoothing(0);

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

      // Destroy Lenis instance
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
