"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { ChaosLines } from "@/components/ChaosLines";
import { PainTextCard } from "@/components/PainTextCard";
import { FakeTranscriptionSearchUI } from "@/components/FakeTranscriptionSearchUI";
import { FakePostMeetingTasksUI } from "@/components/FakePostMeetingTasksUI";

// Pain point position type
interface PainPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

// Pain point configuration
const PAIN_POINTS: {
  id: string;
  type: "meetings-block" | "time-waste" | "forgotten-info" | "post-meeting";
  componentType: "text" | "transcription-ui" | "tasks-ui";
  position: PainPosition;
  startProgress: number;
  endProgress: number;
}[] = [
  {
    id: "meetings-block",
    type: "meetings-block",
    componentType: "text",
    position: { top: "15%", left: "5%" },
    startProgress: 0.02,
    endProgress: 0.18,
  },
  {
    id: "time-waste",
    type: "time-waste",
    componentType: "transcription-ui",
    position: { top: "10%", right: "5%" },
    startProgress: 0.14,
    endProgress: 0.32,
  },
  {
    id: "forgotten-info",
    type: "forgotten-info",
    componentType: "text",
    position: { bottom: "15%", left: "5%" },
    startProgress: 0.28,
    endProgress: 0.48,
  },
  {
    id: "post-meeting",
    type: "post-meeting",
    componentType: "tasks-ui",
    position: { bottom: "10%", right: "5%" },
    startProgress: 0.42,
    endProgress: 0.62,
  },
];

interface ChaosToOrderTransitionProps {
  children: React.ReactNode;
}

export function ChaosToOrderTransition({ children }: ChaosToOrderTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const painSectionRef = useRef<HTMLDivElement>(null);
  const pinnedContentRef = useRef<HTMLDivElement>(null);
  const travelingCircleRef = useRef<HTMLDivElement>(null);
  const featuresWrapperRef = useRef<HTMLDivElement>(null);

  const [painProgress, setPainProgress] = useState(0);
  const [travelProgress, setTravelProgress] = useState(0);
  const [circleStyle, setCircleStyle] = useState({
    x: 0,
    y: 0,
    size: 0,
    opacity: 0,
  });

  // Phase timings for PINNED section (pain points + morphing)
  const CHAOS_END = 0.55; // Chaos lines complete
  const MORPH_START = 0.55;
  const MORPH_END = 1.0; // Morphing complete, then unpin

  // Easing functions
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const easeInOutQuart = (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

  // Calculate derived values
  const chaosProgress = Math.min(painProgress / CHAOS_END, 1);
  const morphProgress = painProgress > MORPH_START
    ? Math.min((painProgress - MORPH_START) / (MORPH_END - MORPH_START), 1)
    : 0;
  const morphEased = easeOutCubic(morphProgress);

  // Calculate pain point progress
  const getPainProgress = (startProgress: number, endProgress: number) => {
    const adjustedEnd = Math.min(endProgress, CHAOS_END);
    if (painProgress < startProgress) return 0;
    if (painProgress > adjustedEnd) return 1;
    return (painProgress - startProgress) / (adjustedEnd - startProgress);
  };

  // GSAP ScrollTrigger for PINNED pain points section
  useGSAP(
    () => {
      if (!painSectionRef.current || !pinnedContentRef.current) return;

      // Pain points section - PINNED
      const painTrigger = ScrollTrigger.create({
        trigger: painSectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: pinnedContentRef.current,
        scrub: 0.8, // Balanced scrub
        onUpdate: (self) => {
          setPainProgress(self.progress);
        },
      });

      return () => {
        painTrigger.kill();
      };
    },
    { scope: wrapperRef }
  );

  // GSAP ScrollTrigger for TRAVELING circle (separate trigger, no pin)
  useGSAP(
    () => {
      if (!featuresWrapperRef.current || !wrapperRef.current) return;

      // Travel trigger - NOT pinned, circle moves as page scrolls
      const travelTrigger = ScrollTrigger.create({
        trigger: featuresWrapperRef.current,
        start: "top bottom",
        end: "top center",
        scrub: 0.6, // Responsive travel
        onUpdate: (self) => {
          setTravelProgress(self.progress);
        },
      });

      return () => {
        travelTrigger.kill();
      };
    },
    { scope: wrapperRef, dependencies: [] }
  );

  // Update traveling circle position based on travel progress
  useEffect(() => {
    if (!travelingCircleRef.current) return;

    // Constants for consistent animation
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2; // Match morph end position exactly
    const startSize = 60;

    // Find the target dot
    const targetDot = document.querySelector('[data-live-dot="true"]');

    if (travelProgress > 0 && targetDot) {
      const targetRect = targetDot.getBoundingClientRect();

      // End: the "i" dot position
      const endX = targetRect.left + targetRect.width / 2;
      const endY = targetRect.top + targetRect.height / 2;
      const endSize = Math.max(targetRect.width, 6);

      // Use smoother easing for the travel
      const easedTravel = easeInOutQuart(travelProgress);

      // Simple linear interpolation (no bezier jumps)
      const currentX = startX + (endX - startX) * easedTravel;
      const currentY = startY + (endY - startY) * easedTravel;
      const currentSize = startSize + (endSize - startSize) * easedTravel;

      // Smooth opacity fade at the very end
      const opacity = travelProgress > 0.85
        ? Math.max(0, 1 - ((travelProgress - 0.85) / 0.15))
        : 1;

      setCircleStyle({
        x: currentX,
        y: currentY,
        size: currentSize,
        opacity,
      });
    } else if (morphProgress > 0.5) {
      // During morph phase (before travel starts), circle forms at center
      const formProgress = (morphProgress - 0.5) / 0.5;
      const easedForm = easeOutCubic(formProgress);
      setCircleStyle({
        x: startX,
        y: startY,
        size: startSize * easedForm,
        opacity: easedForm,
      });
    } else {
      setCircleStyle({ x: 0, y: 0, size: 0, opacity: 0 });
    }
  }, [painProgress, travelProgress, morphProgress]);

  // Card formation animation - cards converge toward center
  const getCardFormationStyle = (position: PainPosition, index: number) => {
    if (morphProgress === 0) return {};

    // Calculate center-ward movement
    const centerX = 50; // %
    const centerY = 50; // %

    // Estimate card's current position in %
    const cardX = position.left ? 5 : position.right ? 95 : 50;
    const cardY = position.top ? 15 : position.bottom ? 85 : 50;

    // Move toward center
    const moveX = (centerX - cardX) * morphEased;
    const moveY = (centerY - cardY) * morphEased;

    // Shrink as it moves
    const scale = 1 - morphEased * 0.9;

    // Fade out
    const opacity = 1 - morphEased;

    // Rotate slightly for effect
    const rotate = (index % 2 === 0 ? 1 : -1) * morphEased * 15;

    return {
      transform: `translate(${moveX}%, ${moveY}%) scale(${scale}) rotate(${rotate}deg)`,
      opacity,
    };
  };

  // Show the dot on "i" when circle arrives
  const showLiveDot = travelProgress > 0.9;

  return (
    <div ref={wrapperRef} className="relative">
      {/* Pain Points Section - PINNED during scroll */}
      <section ref={painSectionRef} className="relative w-full">
        <div
          ref={pinnedContentRef}
          className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background"
        >
          {/* Section header */}
          <div
            className={cn(
              "absolute top-8 md:top-16 left-0 right-0 text-center px-4 z-20"
            )}
            style={{
              opacity: Math.min(1, painProgress * 8) * (1 - morphEased),
              transform: `translateY(${(1 - Math.min(1, painProgress * 5)) * 30}px)`,
            }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              The Meeting Chaos Problem
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Sound familiar? You&apos;re not alone.
            </p>
          </div>

          {/* Main visualization container */}
          <div className="relative w-full max-w-6xl mx-auto h-[80vh] px-4">
            {/* Chaos lines - shrink toward center during morph */}
            <div
              className="absolute inset-0 flex items-center justify-center z-0"
              style={{
                opacity: 1 - morphEased,
                transform: `scale(${1 - morphEased * 0.8})`,
                filter: `blur(${morphEased * 4}px)`,
              }}
            >
              <div className="w-full h-full max-w-4xl">
                <ChaosLines
                  progress={chaosProgress}
                  className="text-foreground"
                />
              </div>
            </div>

            {/* Pain point cards - converge toward center */}
            {PAIN_POINTS.map((pain, index) => {
              const progress = getPainProgress(pain.startProgress, pain.endProgress);
              const formationStyle = getCardFormationStyle(pain.position, index);

              return (
                <div
                  key={pain.id}
                  className="absolute z-10 w-[280px] sm:w-[300px] md:w-[340px]"
                  style={{
                    ...pain.position,
                    opacity: progress > 0
                      ? Math.min(1, progress * 3) * (formationStyle.opacity ?? 1)
                      : 0,
                    transform: `
                      scale(${progress > 0 ? 0.9 + progress * 0.1 : 0.9})
                      translateY(${progress > 0 ? 0 : 20}px)
                      ${formationStyle.transform || ''}
                    `,
                    filter: morphProgress > 0 ? `blur(${morphEased * 3}px)` : 'none',
                    pointerEvents: progress > 0.1 && morphProgress < 0.3 ? "auto" : "none",
                  }}
                >
                  {pain.componentType === "text" && (
                    <PainTextCard type={pain.type} progress={progress} />
                  )}
                  {pain.componentType === "transcription-ui" && (
                    <FakeTranscriptionSearchUI progress={progress} />
                  )}
                  {pain.componentType === "tasks-ui" && (
                    <FakePostMeetingTasksUI progress={progress} />
                  )}
                </div>
              );
            })}

            {/* Center formation point - glows as elements converge */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/20 z-20"
              style={{
                width: `${morphEased * 120}px`,
                height: `${morphEased * 120}px`,
                opacity: morphProgress > 0.3 ? (morphEased - 0.3) / 0.7 : 0,
                filter: `blur(${20 - morphEased * 15}px)`,
                transform: `scale(${0.5 + morphEased * 0.5})`,
              }}
            />
          </div>

          {/* Transition message */}
          <div
            className={cn(
              "absolute bottom-12 md:bottom-20 left-1/2 -translate-x-1/2",
              "text-center z-20"
            )}
            style={{
              opacity: morphProgress > 0.2 && morphProgress < 0.9
                ? Math.min(1, (morphProgress - 0.2) * 3) * (1 - Math.max(0, (morphProgress - 0.7) / 0.2))
                : 0,
              transform: `translateY(${morphProgress > 0.2 ? 0 : 20}px)`,
            }}
          >
            <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              This is the chaos.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground">
              Keep scrolling to see how Luframe brings order.
            </p>
          </div>

          {/* Progress indicator */}
          <div
            className={cn(
              "absolute bottom-4 left-1/2 -translate-x-1/2 z-20",
              painProgress > 0.02 && painProgress < MORPH_START ? "opacity-100" : "opacity-0"
            )}
            style={{ transition: 'opacity 0.3s ease-out' }}
          >
            <div className="flex gap-1.5">
              {PAIN_POINTS.map((pain) => {
                const progress = getPainProgress(pain.startProgress, pain.endProgress);
                return (
                  <div
                    key={pain.id}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      progress > 0 ? "w-8 bg-foreground" : "w-2 bg-muted-foreground/30"
                    )}
                    style={{ opacity: progress > 0 ? 0.4 + progress * 0.6 : 0.3 }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Traveling Circle - FIXED position, moves during page scroll */}
      <div
        ref={travelingCircleRef}
        className="fixed z-[100] rounded-full bg-foreground pointer-events-none"
        style={{
          width: `${circleStyle.size}px`,
          height: `${circleStyle.size}px`,
          left: `${circleStyle.x}px`,
          top: `${circleStyle.y}px`,
          transform: 'translate(-50%, -50%)',
          opacity: circleStyle.opacity,
          boxShadow: circleStyle.opacity > 0
            ? `0 4px 20px rgba(0,0,0,${0.15 + circleStyle.opacity * 0.1})`
            : 'none',
          display: circleStyle.opacity > 0.01 ? 'block' : 'none',
          transition: 'box-shadow 0.2s ease-out',
        }}
      />

      {/* Features section wrapper - for travel trigger */}
      <div ref={featuresWrapperRef} data-features-wrapper="true">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { showLiveDot } as React.Attributes);
          }
          return child;
        })}
      </div>
    </div>
  );
}
