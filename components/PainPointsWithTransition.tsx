"use client";

import { useRef, useState, useEffect } from "react";
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

// Pain point configuration with scroll trigger ranges
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
    startProgress: 0.03,
    endProgress: 0.2,
  },
  {
    id: "time-waste",
    type: "time-waste",
    componentType: "transcription-ui",
    position: { top: "10%", right: "5%" },
    startProgress: 0.15,
    endProgress: 0.35,
  },
  {
    id: "forgotten-info",
    type: "forgotten-info",
    componentType: "text",
    position: { bottom: "15%", left: "5%" },
    startProgress: 0.28,
    endProgress: 0.5,
  },
  {
    id: "post-meeting",
    type: "post-meeting",
    componentType: "tasks-ui",
    position: { bottom: "10%", right: "5%" },
    startProgress: 0.42,
    endProgress: 0.65,
  },
];

// Props to receive the target position for the circle
interface PainPointsWithTransitionProps {
  onCircleReady?: (element: HTMLDivElement | null) => void;
}

export function PainPointsWithTransition({ onCircleReady }: PainPointsWithTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const chaosContainerRef = useRef<HTMLDivElement>(null);
  const painCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Notify parent when circle ref is ready
  useEffect(() => {
    if (circleRef.current && onCircleReady) {
      onCircleReady(circleRef.current);
    }
  }, [onCircleReady]);

  // Setup GSAP ScrollTrigger with PIN
  useGSAP(
    () => {
      if (!sectionRef.current || !containerRef.current) return;

      // Main scroll trigger for pain points section
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=250%", // Extended scroll duration for morphing phase
        pin: sectionRef.current,
        scrub: 0.5,
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

  // Calculate individual pain point progress (now ends earlier to make room for morphing)
  const getPainProgress = (startProgress: number, endProgress: number) => {
    if (scrollProgress < startProgress) return 0;
    if (scrollProgress > endProgress) return 1;
    return (scrollProgress - startProgress) / (endProgress - startProgress);
  };

  // Morphing phase: starts at 0.65, ends at 1.0
  const MORPH_START = 0.65;
  const MORPH_END = 1.0;
  const morphProgress = scrollProgress > MORPH_START
    ? Math.min(1, (scrollProgress - MORPH_START) / (MORPH_END - MORPH_START))
    : 0;

  // Calculate chaos and cards fade out (0.65-0.8)
  const fadeOutProgress = scrollProgress > MORPH_START
    ? Math.min(1, (scrollProgress - MORPH_START) / 0.15)
    : 0;

  // Circle formation starts at 0.7
  const CIRCLE_START = 0.7;
  const circleFormProgress = scrollProgress > CIRCLE_START
    ? Math.min(1, (scrollProgress - CIRCLE_START) / 0.15)
    : 0;

  // Circle shrink and move phase (0.85-1.0)
  const SHRINK_START = 0.85;
  const shrinkProgress = scrollProgress > SHRINK_START
    ? Math.min(1, (scrollProgress - SHRINK_START) / 0.15)
    : 0;

  // Calculate circle size (starts at 120px, shrinks to 24px)
  const circleSize = 120 - (shrinkProgress * 96); // 120 -> 24

  // Calculate circle position (moves down as it shrinks)
  const circleMoveY = shrinkProgress * 150; // Move down 150px

  // Calculate how much cards should shrink toward center
  const getCardMorphStyle = (position: PainPosition) => {
    if (morphProgress === 0) return {};

    // All cards move toward center and shrink
    const shrinkScale = 1 - (fadeOutProgress * 0.9);
    const moveToCenter = fadeOutProgress;

    return {
      transform: `scale(${shrinkScale}) translate(${position.left ? `${moveToCenter * 40}%` : `-${moveToCenter * 40}%`}, ${position.top ? `${moveToCenter * 40}%` : `-${moveToCenter * 40}%`})`,
      opacity: 1 - fadeOutProgress,
    };
  };

  return (
    <section ref={containerRef} className="relative w-full">
      {/* This is the section that gets pinned */}
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
            opacity: Math.min(1, scrollProgress * 5) * (1 - fadeOutProgress),
            transform: `translateY(${(1 - Math.min(1, scrollProgress * 3)) * 30}px)`,
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
          {/* Chaos lines container - will fade and shrink */}
          <div
            ref={chaosContainerRef}
            className="absolute inset-0 flex items-center justify-center z-0 transition-all duration-300"
            style={{
              opacity: 1 - fadeOutProgress,
              transform: `scale(${1 - fadeOutProgress * 0.5})`,
            }}
          >
            <div className="w-full h-full max-w-4xl">
              <ChaosLines
                progress={Math.min(scrollProgress / 0.65, 1)} // Complete chaos drawing by 0.65
                className="text-foreground"
              />
            </div>
          </div>

          {/* Pain point cards positioned around chaos */}
          {PAIN_POINTS.map((pain, index) => {
            const progress = getPainProgress(pain.startProgress, pain.endProgress);
            const morphStyle = getCardMorphStyle(pain.position);

            return (
              <div
                key={pain.id}
                ref={(el) => { painCardsRef.current[index] = el; }}
                className="absolute z-10 w-[300px] md:w-[340px]"
                style={{
                  ...pain.position,
                  opacity: progress > 0 ? Math.min(1, progress * 3) * (1 - fadeOutProgress) : 0,
                  transform: `scale(${progress > 0 ? 0.9 + progress * 0.1 : 0.9}) translateY(${progress > 0 ? 0 : 20}px) ${morphStyle.transform || ''}`,
                  transition: morphProgress > 0 ? "none" : "opacity 0.3s ease-out, transform 0.3s ease-out",
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

          {/* Central morphing circle - appears as chaos fades */}
          <div
            ref={circleRef}
            className="absolute left-1/2 top-1/2 z-30 rounded-full bg-foreground"
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              transform: `translate(-50%, -50%) translateY(${circleMoveY}px)`,
              opacity: circleFormProgress,
              boxShadow: circleFormProgress > 0
                ? `0 0 ${30 * circleFormProgress}px ${10 * circleFormProgress}px rgba(0,0,0,0.1)`
                : 'none',
              transition: 'box-shadow 0.3s ease-out',
            }}
            data-chaos-circle="true"
          />
        </div>

        {/* Final message - fades in during morph, then fades out as circle shrinks */}
        <div
          className={cn(
            "absolute bottom-8 md:bottom-16 left-1/2 -translate-x-1/2",
            "text-center transition-all duration-500 z-20"
          )}
          style={{
            opacity: scrollProgress > 0.6 && scrollProgress < 0.85
              ? Math.min(1, (scrollProgress - 0.6) / 0.1) * (1 - Math.max(0, (scrollProgress - 0.8) / 0.05))
              : scrollProgress >= 0.85
                ? 1 - shrinkProgress
                : 0,
            transform: `translateY(${scrollProgress > 0.6 ? 0 : 20}px)`,
          }}
        >
          <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">
            This is the chaos.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground">
            Luframe brings order to meeting madness.
          </p>
        </div>

        {/* Progress indicator - hidden during morph */}
        <div
          className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2 z-20",
            "transition-opacity duration-300",
            scrollProgress > 0.02 && scrollProgress < 0.65 ? "opacity-100" : "opacity-0"
          )}
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
                  style={{
                    opacity: progress > 0 ? 0.4 + progress * 0.6 : 0.3,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
