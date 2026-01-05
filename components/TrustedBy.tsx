"use client";

import { useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { AnimatedSection } from "@/components/AnimatedSection";

// ============================================================================
// Constants - extracted magic numbers for maintainability
// ============================================================================
const ANIMATION = {
  GROW_PHASE_END: 0.75,      // Line grows during first 75% of scroll
  MAX_LINE_HEIGHT: 150,      // Maximum line height in pixels
  BOUNCE_THRESHOLD: 0.05,    // Chevron bounces when progress < 5%
  ANCHOR_OFFSET: 16,         // Offset from anchor to line start
  FALLBACK_SCROLL_DISTANCE: 300, // Fallback end if chaos section not found
} as const;

const trustedCompanies = [
  { name: "Amplitude", logo: "/Amplitude_logo.svg", width: 120, height: 28, isWordmark: true },
  { name: "GitHub", logo: "/github-svgrepo-com.svg", width: 32, height: 32, isWordmark: false },
  { name: "OpenAI", logo: "/openai-svgrepo-com.svg", width: 28, height: 28, isWordmark: false },
  { name: "Supabase", logo: "/supabase-logo-wordmark--light.svg", width: 120, height: 28, isWordmark: true },
];

// ============================================================================
// TrustedBy - Main component with scroll line animation
// ============================================================================
export function TrustedBy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const lineContainerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);

  // Use refs instead of state for position - avoids re-renders on scroll
  const anchorPosRef = useRef({ x: 0, y: 0 });
  const progressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const positionRafIdRef = useRef<number | null>(null);
  const isMeasuredRef = useRef(false);
  const isMountedRef = useRef(true);

  // Update anchor position imperatively (no React state)
  const updateAnchorPosition = useCallback(() => {
    if (!anchorRef.current || !lineContainerRef.current || !isMountedRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();
    const newX = rect.left + rect.width / 2;
    const newY = rect.bottom;

    // Only update DOM if position changed significantly (avoid micro-updates)
    if (
      Math.abs(anchorPosRef.current.x - newX) > 0.5 ||
      Math.abs(anchorPosRef.current.y - newY) > 0.5
    ) {
      anchorPosRef.current = { x: newX, y: newY };
      lineContainerRef.current.style.left = `${newX}px`;
      lineContainerRef.current.style.top = `${newY + ANIMATION.ANCHOR_OFFSET}px`;
    }

    // Mark as measured and show the indicator
    if (!isMeasuredRef.current && lineContainerRef.current) {
      isMeasuredRef.current = true;
      lineContainerRef.current.style.visibility = 'visible';
    }
  }, []);

  // Throttled position update via RAF
  const schedulePositionUpdate = useCallback(() => {
    if (positionRafIdRef.current === null) {
      positionRafIdRef.current = requestAnimationFrame(() => {
        positionRafIdRef.current = null;
        updateAnchorPosition();
      });
    }
  }, [updateAnchorPosition]);

  // Direct DOM update for animation (no React re-renders)
  const updateDOM = useCallback(() => {
    const progress = progressRef.current;

    if (!lineRef.current || !chevronRef.current || !lineContainerRef.current) return;

    const { GROW_PHASE_END, MAX_LINE_HEIGHT, BOUNCE_THRESHOLD } = ANIMATION;

    // Hide everything when progress is essentially 0
    if (progress < 0.001) {
      lineContainerRef.current.style.opacity = "0";
      return;
    }

    // Line grows during first 75% of scroll, then fades
    if (progress < GROW_PHASE_END) {
      const growProgress = progress / GROW_PHASE_END;
      const lineHeight = Math.min(growProgress * MAX_LINE_HEIGHT, MAX_LINE_HEIGHT);
      lineRef.current.style.height = `${lineHeight}px`;
      lineRef.current.style.opacity = "1";
      chevronRef.current.style.opacity = "1";
      lineContainerRef.current.style.opacity = "1";
    } else {
      // Fade out during last 25%
      const fadeProgress = (progress - GROW_PHASE_END) / (1 - GROW_PHASE_END);
      lineRef.current.style.height = `${MAX_LINE_HEIGHT}px`;
      const opacity = String(1 - fadeProgress);
      lineRef.current.style.opacity = opacity;
      chevronRef.current.style.opacity = opacity;
      lineContainerRef.current.style.opacity = opacity;
    }

    // Chevron bounces only when progress is very low (but visible)
    // Use classList.toggle instead of rewriting className to avoid style recalculation
    const shouldBounce = progress < BOUNCE_THRESHOLD;
    chevronRef.current.classList.toggle("animate-bounce", shouldBounce);
  }, []);

  // Throttled animation update via RAF
  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        updateDOM();
      });
    }
  }, [updateDOM]);

  // Setup scroll/resize listeners with passive flag and RAF throttling
  useEffect(() => {
    isMountedRef.current = true;

    // Initial measurement
    updateAnchorPosition();

    const handleScroll = () => schedulePositionUpdate();
    const handleResize = () => schedulePositionUpdate();

    // Add passive listeners for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      // Cleanup all RAF callbacks
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (positionRafIdRef.current !== null) {
        cancelAnimationFrame(positionRafIdRef.current);
      }
    };
  }, [updateAnchorPosition, schedulePositionUpdate]);

  // ScrollTrigger for the expanding line animation
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Find the ChaosToOrderTransition element to use as end target
      const chaosSection = document.querySelector('[data-chaos-section="true"]');

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "bottom 90%",
        end: chaosSection ? "top top" : `+=${ANIMATION.FALLBACK_SCROLL_DISTANCE}`,
        endTrigger: chaosSection || undefined,
        scrub: 0.5,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          scheduleUpdate();
        },
      });

      return () => trigger.kill();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="w-full pb-12 md:pb-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <AnimatedSection delay={0}>
          <div className="relative flex flex-col items-center overflow-visible">
            {/* Top horizontal line */}
            <div className="w-full border-t border-border" />

            {/* Title */}
            <p className="text-md text-muted-foreground italic py-8">
              Trusted and supported by
            </p>

            {/* Logo grid with line dividers */}
            <div className="w-full border-t border-b border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
                {trustedCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-2 py-6 md:py-8 px-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  >
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={company.width}
                      height={company.height}
                    />
                    {!company.isWordmark && (
                      <span className="text-muted-foreground text-xs md:text-sm font-medium">
                        {company.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Anchor point for tracking position */}
            <div ref={anchorRef} className="w-full h-0" />
          </div>
        </AnimatedSection>
      </div>

      {/* Fixed scroll line indicator - positioned based on anchor, doesn't affect layout */}
      <div
        ref={lineContainerRef}
        className="fixed z-[80] flex flex-col items-center pointer-events-none"
        style={{
          left: 0,
          top: 0,
          transform: 'translateX(-50%)',
          visibility: 'hidden', // Hidden until measured to prevent flash at (0,0)
          opacity: 0, // Start fully transparent, will be set by scroll progress
        }}
        aria-hidden="true"
      >
        {/* The line that grows downward */}
        <div
          ref={lineRef}
          className="w-px bg-border"
          style={{ height: 0, opacity: 0 }}
        />
        {/* Chevron at the tip */}
        <div
          ref={chevronRef}
          className="text-muted-foreground transition-transform duration-300 animate-bounce"
          style={{ opacity: 0 }}
        >
          <ChevronDown className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
}
