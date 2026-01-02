"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { ChaosLines } from "@/components/ChaosLines";
import { PainTextCard } from "@/components/PainTextCard";
import { FakeTranscriptionSearchUI } from "@/components/FakeTranscriptionSearchUI";
import { FakePostMeetingTasksUI } from "@/components/FakePostMeetingTasksUI";

// Pain point configuration with scroll trigger ranges
const PAIN_POINTS = [
  {
    id: "meetings-block",
    type: "meetings-block" as const,
    componentType: "text",
    position: { top: "15%", left: "5%" },
    startProgress: 0.05,
    endProgress: 0.3,
  },
  {
    id: "time-waste",
    type: "time-waste" as const,
    componentType: "transcription-ui",
    position: { top: "10%", right: "5%" },
    startProgress: 0.2,
    endProgress: 0.5,
  },
  {
    id: "forgotten-info",
    type: "forgotten-info" as const,
    componentType: "text",
    position: { bottom: "15%", left: "5%" },
    startProgress: 0.4,
    endProgress: 0.7,
  },
  {
    id: "post-meeting",
    type: "post-meeting" as const,
    componentType: "tasks-ui",
    position: { bottom: "10%", right: "5%" },
    startProgress: 0.6,
    endProgress: 0.95,
  },
];

export function PainPoints() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Setup GSAP ScrollTrigger with PIN
  useGSAP(
    () => {
      if (!sectionRef.current || !containerRef.current) return;

      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%", // Scroll for 2x the viewport height while pinned
        pin: sectionRef.current, // PIN the section in place
        scrub: 0.3, // Smooth scrubbing
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

  // Calculate individual pain point progress
  const getPainProgress = (startProgress: number, endProgress: number) => {
    if (scrollProgress < startProgress) return 0;
    if (scrollProgress > endProgress) return 1;
    return (scrollProgress - startProgress) / (endProgress - startProgress);
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
            opacity: Math.min(1, scrollProgress * 5),
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
          {/* Chaos line - centered and large */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <div className="w-full h-full max-w-4xl">
              <ChaosLines
                progress={scrollProgress}
                className="text-foreground"
              />
            </div>
          </div>

          {/* Pain point cards positioned around chaos */}
          {PAIN_POINTS.map((pain) => {
            const progress = getPainProgress(pain.startProgress, pain.endProgress);

            return (
              <div
                key={pain.id}
                className="absolute z-10 w-[300px] md:w-[340px]"
                style={{
                  ...pain.position,
                  opacity: progress > 0 ? Math.min(1, progress * 3) : 0,
                  transform: `scale(${progress > 0 ? 0.9 + progress * 0.1 : 0.9}) translateY(${progress > 0 ? 0 : 20}px)`,
                  transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
                  pointerEvents: progress > 0.1 ? "auto" : "none",
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
        </div>

        {/* Final message */}
        <div
          className={cn(
            "absolute bottom-8 md:bottom-16 left-1/2 -translate-x-1/2",
            "text-center transition-all duration-500 z-20"
          )}
          style={{
            opacity: scrollProgress > 0.85 ? (scrollProgress - 0.85) / 0.15 : 0,
            transform: `translateY(${scrollProgress > 0.85 ? 0 : 20}px)`,
          }}
        >
          <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">
            This is the chaos.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground">
            Luframe brings order to meeting madness.
          </p>
        </div>

        {/* Progress indicator */}
        <div
          className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2 z-20",
            "transition-opacity duration-300",
            scrollProgress > 0.02 && scrollProgress < 0.98 ? "opacity-100" : "opacity-0"
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
