"use client";

import { useRef, useState, useCallback, useEffect } from "react";
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
    endProgress: 0.15,
  },
  {
    id: "time-waste",
    type: "time-waste",
    componentType: "transcription-ui",
    position: { top: "10%", right: "5%" },
    startProgress: 0.12,
    endProgress: 0.28,
  },
  {
    id: "forgotten-info",
    type: "forgotten-info",
    componentType: "text",
    position: { bottom: "15%", left: "5%" },
    startProgress: 0.24,
    endProgress: 0.42,
  },
  {
    id: "post-meeting",
    type: "post-meeting",
    componentType: "tasks-ui",
    position: { bottom: "10%", right: "5%" },
    startProgress: 0.38,
    endProgress: 0.55,
  },
];

interface PainToFeaturesTransitionProps {
  onDotPositionUpdate?: (visible: boolean, size: number) => void;
}

export function PainToFeaturesTransition({ onDotPositionUpdate }: PainToFeaturesTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const targetDotRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [circleState, setCircleState] = useState({
    visible: false,
    x: 0,
    y: 0,
    size: 100,
    fixed: false,
  });

  // Setup GSAP ScrollTrigger
  useGSAP(
    () => {
      if (!sectionRef.current || !containerRef.current) return;

      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", // Longer scroll for full animation
        pin: sectionRef.current,
        scrub: 0.6,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: containerRef }
  );

  // Calculate phase timings
  // Phase 1: 0-0.50 - Chaos lines and pain points
  // Phase 2: 0.50-0.70 - Everything morphs to center circle
  // Phase 3: 0.70-1.0 - Circle shrinks and travels down

  const CHAOS_END = 0.50;
  const MORPH_START = 0.50;
  const MORPH_END = 0.70;
  const TRAVEL_START = 0.70;
  const TRAVEL_END = 1.0;

  // Progress calculations
  const chaosProgress = Math.min(scrollProgress / CHAOS_END, 1);

  const morphProgress = scrollProgress > MORPH_START
    ? Math.min((scrollProgress - MORPH_START) / (MORPH_END - MORPH_START), 1)
    : 0;

  const travelProgress = scrollProgress > TRAVEL_START
    ? Math.min((scrollProgress - TRAVEL_START) / (TRAVEL_END - TRAVEL_START), 1)
    : 0;

  // Easing function for smooth animation
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Calculate pain point progress
  const getPainProgress = (startProgress: number, endProgress: number) => {
    const adjustedStart = startProgress * CHAOS_END;
    const adjustedEnd = endProgress * CHAOS_END;
    if (scrollProgress < adjustedStart) return 0;
    if (scrollProgress > adjustedEnd) return 1;
    return (scrollProgress - adjustedStart) / (adjustedEnd - adjustedStart);
  };

  // Fade out calculation for morph phase
  const fadeOutProgress = easeOutCubic(morphProgress);

  // Circle calculations
  const circleVisible = morphProgress > 0.3;
  const circleFormProgress = morphProgress > 0.3
    ? easeOutCubic((morphProgress - 0.3) / 0.7)
    : 0;

  // Circle size: starts at 100px, shrinks to 12px during travel
  const baseCircleSize = 100 * circleFormProgress;
  const travelShrink = easeInOutCubic(travelProgress);
  const circleSize = baseCircleSize * (1 - travelShrink * 0.88); // 100 -> 12

  // Circle position during travel (moves down)
  const travelDistance = 350; // px to travel down
  const circleMoveY = easeInOutCubic(travelProgress) * travelDistance;

  // Notify parent about dot visibility (for Features component)
  useEffect(() => {
    if (onDotPositionUpdate) {
      // The dot in "Live" should appear when circle reaches it
      const dotVisible = travelProgress >= 0.95;
      onDotPositionUpdate(dotVisible, circleSize);
    }
  }, [travelProgress, circleSize, onDotPositionUpdate]);

  // Card morph animation - cards shrink and move toward center
  const getCardMorphStyle = (position: PainPosition) => {
    if (morphProgress === 0) return { transform: '', opacity: 1 };

    const shrinkScale = 1 - fadeOutProgress * 0.8;
    const moveAmount = fadeOutProgress * 50;

    // Determine direction based on position
    const moveX = position.left ? moveAmount : -moveAmount;
    const moveY = position.top ? moveAmount : -moveAmount;

    return {
      transform: `scale(${shrinkScale}) translate(${moveX}%, ${moveY}%)`,
      opacity: 1 - fadeOutProgress,
    };
  };

  return (
    <section ref={containerRef} className="relative w-full">
      <div
        ref={sectionRef}
        className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background"
      >
        {/* Section header */}
        <div
          className={cn(
            "absolute top-8 md:top-16 left-0 right-0 text-center px-4 z-20"
          )}
          style={{
            opacity: Math.min(1, scrollProgress * 8) * (1 - fadeOutProgress),
            transform: `translateY(${(1 - Math.min(1, scrollProgress * 5)) * 30}px)`,
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
          {/* Chaos lines - fade and shrink during morph */}
          <div
            className="absolute inset-0 flex items-center justify-center z-0"
            style={{
              opacity: 1 - fadeOutProgress,
              transform: `scale(${1 - fadeOutProgress * 0.5})`,
              transition: 'opacity 0.1s ease-out',
            }}
          >
            <div className="w-full h-full max-w-4xl">
              <ChaosLines
                progress={chaosProgress}
                className="text-foreground"
              />
            </div>
          </div>

          {/* Pain point cards */}
          {PAIN_POINTS.map((pain) => {
            const progress = getPainProgress(pain.startProgress, pain.endProgress);
            const morphStyle = getCardMorphStyle(pain.position);

            return (
              <div
                key={pain.id}
                className="absolute z-10 w-[280px] sm:w-[300px] md:w-[340px]"
                style={{
                  ...pain.position,
                  opacity: progress > 0
                    ? Math.min(1, progress * 3) * morphStyle.opacity
                    : 0,
                  transform: `
                    scale(${progress > 0 ? 0.9 + progress * 0.1 : 0.9})
                    translateY(${progress > 0 ? 0 : 20}px)
                    ${morphStyle.transform}
                  `,
                  pointerEvents: progress > 0.1 && fadeOutProgress < 0.5 ? "auto" : "none",
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

          {/* Central circle - forms from chaos, then travels */}
          <div
            ref={circleRef}
            className={cn(
              "absolute left-1/2 top-1/2 z-30 rounded-full bg-foreground",
              "transition-shadow duration-300"
            )}
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              transform: `translate(-50%, -50%) translateY(${circleMoveY}px)`,
              opacity: circleVisible ? 1 : 0,
              boxShadow: circleVisible
                ? `0 ${4 + travelProgress * 8}px ${20 + travelProgress * 20}px rgba(0,0,0,${0.1 + travelProgress * 0.1})`
                : 'none',
            }}
          />

          {/* Target position indicator (invisible, for reference) */}
          <div
            ref={targetDotRef}
            className="absolute left-1/2 bottom-[5%] w-3 h-3 -translate-x-1/2"
            style={{ opacity: 0 }}
          />
        </div>

        {/* Transition message */}
        <div
          className={cn(
            "absolute bottom-12 md:bottom-20 left-1/2 -translate-x-1/2",
            "text-center z-20"
          )}
          style={{
            opacity: morphProgress > 0.5 && travelProgress < 0.8
              ? Math.min(1, (morphProgress - 0.5) * 4) * (1 - travelProgress * 1.2)
              : 0,
            transform: `translateY(${morphProgress > 0.5 ? 0 : 20}px)`,
          }}
        >
          <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">
            This is the chaos.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground">
            Scroll to discover how Luframe brings order.
          </p>
        </div>

        {/* Progress indicator */}
        <div
          className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2 z-20",
            scrollProgress > 0.02 && scrollProgress < MORPH_START ? "opacity-100" : "opacity-0"
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
  );
}
