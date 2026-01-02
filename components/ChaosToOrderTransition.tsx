"use client";

import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
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

// Phase timings (constants outside component to avoid recreation)
const CHAOS_END = 0.55;
const MORPH_START = 0.55;
const MORPH_END = 1.0;

// Easing functions (outside component for performance)
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

interface ChaosToOrderTransitionProps {
  children: React.ReactNode;
}

// Memoized pain card component to prevent unnecessary re-renders
const MemoizedPainCard = memo(function MemoizedPainCard({
  pain,
  progress,
}: {
  pain: (typeof PAIN_POINTS)[0];
  progress: number;
}) {
  if (pain.componentType === "text") {
    return <PainTextCard type={pain.type} progress={progress} />;
  }
  if (pain.componentType === "transcription-ui") {
    return <FakeTranscriptionSearchUI progress={progress} />;
  }
  if (pain.componentType === "tasks-ui") {
    return <FakePostMeetingTasksUI progress={progress} />;
  }
  return null;
});

export function ChaosToOrderTransition({ children }: ChaosToOrderTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const painSectionRef = useRef<HTMLDivElement>(null);
  const pinnedContentRef = useRef<HTMLDivElement>(null);
  const travelingCircleRef = useRef<HTMLDivElement>(null);
  const featuresWrapperRef = useRef<HTMLDivElement>(null);

  // DOM element refs for direct manipulation (no React re-renders)
  const headerRef = useRef<HTMLDivElement>(null);
  const chaosContainerRef = useRef<HTMLDivElement>(null);
  const centerPointRef = useRef<HTMLDivElement>(null);
  const transitionMessageRef = useRef<HTMLDivElement>(null);
  const progressIndicatorRef = useRef<HTMLDivElement>(null);
  const painCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressDotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Progress refs (not state - avoids re-renders)
  const painProgressRef = useRef(0);
  const travelProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Only state that truly needs React re-renders
  const [showLiveDot, setShowLiveDot] = useState(false);

  // Chaos lines needs progress as prop, so we need minimal state for it
  const [chaosProgress, setChaosProgress] = useState(0);

  // Pain card progress state (throttled updates for child component animations)
  const [painCardProgress, setPainCardProgress] = useState<number[]>(() =>
    PAIN_POINTS.map(() => 0)
  );

  // Cached target dot element
  const targetDotRef = useRef<Element | null>(null);
  const targetDotFoundRef = useRef(false);

  // Viewport dimensions ref
  const viewportRef = useRef({ width: 0, height: 0 });

  // Get target dot (memoized)
  const getTargetDot = useCallback(() => {
    if (!targetDotFoundRef.current) {
      targetDotRef.current = document.querySelector('[data-live-dot="true"]');
      if (targetDotRef.current) {
        targetDotFoundRef.current = true;
      }
    }
    return targetDotRef.current;
  }, []);

  // Calculate pain point progress
  const getPainProgress = useCallback((startProgress: number, endProgress: number, currentProgress: number) => {
    const adjustedEnd = Math.min(endProgress, CHAOS_END);
    if (currentProgress < startProgress) return 0;
    if (currentProgress > adjustedEnd) return 1;
    return (currentProgress - startProgress) / (adjustedEnd - startProgress);
  }, []);

  // Direct DOM update function (called via RAF, no React re-renders)
  const updateDOM = useCallback(() => {
    const painProgress = painProgressRef.current;
    const travelProgress = travelProgressRef.current;

    // Derived values
    const currentChaosProgress = Math.min(painProgress / CHAOS_END, 1);
    const morphProgress = painProgress > MORPH_START
      ? Math.min((painProgress - MORPH_START) / (MORPH_END - MORPH_START), 1)
      : 0;
    const morphEased = easeOutCubic(morphProgress);

    // Update chaos progress state only when significantly changed (for ChaosLines)
    const roundedChaosProgress = Math.round(currentChaosProgress * 100) / 100;
    setChaosProgress((prev) => {
      if (Math.abs(prev - roundedChaosProgress) > 0.01) {
        return roundedChaosProgress;
      }
      return prev;
    });

    // Update header
    if (headerRef.current) {
      const headerOpacity = Math.min(1, painProgress * 8) * (1 - morphEased);
      const headerTranslateY = (1 - Math.min(1, painProgress * 5)) * 30;
      headerRef.current.style.opacity = String(headerOpacity);
      headerRef.current.style.transform = `translateY(${headerTranslateY}px)`;
    }

    // Update chaos container
    if (chaosContainerRef.current) {
      chaosContainerRef.current.style.opacity = String(1 - morphEased);
      chaosContainerRef.current.style.transform = `scale(${1 - morphEased * 0.8})`;
      chaosContainerRef.current.style.filter = `blur(${morphEased * 4}px)`;
    }

    // Update pain cards
    const newCardProgress: number[] = [];
    painCardRefs.current.forEach((cardEl, index) => {
      const pain = PAIN_POINTS[index];
      const progress = getPainProgress(pain.startProgress, pain.endProgress, painProgress);
      newCardProgress.push(progress);

      if (!cardEl) return;

      // Card formation style
      let formationTransform = "";
      let formationOpacity = 1;
      if (morphProgress > 0) {
        const centerX = 50;
        const centerY = 50;
        const cardX = pain.position.left ? 5 : pain.position.right ? 95 : 50;
        const cardY = pain.position.top ? 15 : pain.position.bottom ? 85 : 50;
        const moveX = (centerX - cardX) * morphEased;
        const moveY = (centerY - cardY) * morphEased;
        const scale = 1 - morphEased * 0.9;
        formationOpacity = 1 - morphEased;
        const rotate = (index % 2 === 0 ? 1 : -1) * morphEased * 15;
        formationTransform = `translate(${moveX}%, ${moveY}%) scale(${scale}) rotate(${rotate}deg)`;
      }

      const cardOpacity = progress > 0 ? Math.min(1, progress * 3) * formationOpacity : 0;
      const cardScale = progress > 0 ? 0.9 + progress * 0.1 : 0.9;
      const cardTranslateY = progress > 0 ? 0 : 20;

      cardEl.style.opacity = String(cardOpacity);
      cardEl.style.transform = `scale(${cardScale}) translateY(${cardTranslateY}px) ${formationTransform}`;
      cardEl.style.filter = morphProgress > 0 ? `blur(${morphEased * 3}px)` : "none";
      cardEl.style.pointerEvents = progress > 0.1 && morphProgress < 0.3 ? "auto" : "none";
    });

    // Update pain card progress state (throttled - only when changed significantly)
    setPainCardProgress((prev) => {
      const hasSignificantChange = newCardProgress.some(
        (val, idx) => Math.abs(val - prev[idx]) > 0.02
      );
      return hasSignificantChange ? newCardProgress : prev;
    });

    // Update progress dots
    progressDotRefs.current.forEach((dotEl, index) => {
      if (!dotEl) return;
      const pain = PAIN_POINTS[index];
      const progress = getPainProgress(pain.startProgress, pain.endProgress, painProgress);
      dotEl.style.width = progress > 0 ? "2rem" : "0.5rem";
      dotEl.style.opacity = String(progress > 0 ? 0.4 + progress * 0.6 : 0.3);
      dotEl.className = cn(
        "h-1.5 rounded-full transition-all duration-300",
        progress > 0 ? "bg-foreground" : "bg-muted-foreground/30"
      );
    });

    // Update center point
    if (centerPointRef.current) {
      centerPointRef.current.style.width = `${morphEased * 120}px`;
      centerPointRef.current.style.height = `${morphEased * 120}px`;
      centerPointRef.current.style.opacity = String(morphProgress > 0.3 ? (morphEased - 0.3) / 0.7 : 0);
      centerPointRef.current.style.filter = `blur(${20 - morphEased * 15}px)`;
      centerPointRef.current.style.transform = `translate(-50%, -50%) scale(${0.5 + morphEased * 0.5})`;
    }

    // Update transition message
    if (transitionMessageRef.current) {
      const msgOpacity = morphProgress > 0.2 && morphProgress < 0.9
        ? Math.min(1, (morphProgress - 0.2) * 3) * (1 - Math.max(0, (morphProgress - 0.7) / 0.2))
        : 0;
      transitionMessageRef.current.style.opacity = String(msgOpacity);
      transitionMessageRef.current.style.transform = `translate(-50%, 0) translateY(${morphProgress > 0.2 ? 0 : 20}px)`;
    }

    // Update progress indicator visibility
    if (progressIndicatorRef.current) {
      progressIndicatorRef.current.style.opacity = painProgress > 0.02 && painProgress < MORPH_START ? "1" : "0";
    }

    // Update traveling circle
    if (travelingCircleRef.current) {
      const startX = (viewportRef.current.width || window.innerWidth) / 2;
      const startY = (viewportRef.current.height || window.innerHeight) / 2;
      const startSize = 60;

      const targetDot = getTargetDot();

      if (travelProgress > 0 && targetDot) {
        const targetRect = targetDot.getBoundingClientRect();
        const endX = targetRect.left + targetRect.width / 2;
        const endY = targetRect.top + targetRect.height / 2;
        const endSize = Math.max(targetRect.width, 6);

        const easedTravel = easeInOutQuart(travelProgress);
        const currentX = startX + (endX - startX) * easedTravel;
        const currentY = startY + (endY - startY) * easedTravel;
        const currentSize = startSize + (endSize - startSize) * easedTravel;
        const opacity = travelProgress > 0.85 ? Math.max(0, 1 - ((travelProgress - 0.85) / 0.15)) : 1;

        travelingCircleRef.current.style.width = `${currentSize}px`;
        travelingCircleRef.current.style.height = `${currentSize}px`;
        travelingCircleRef.current.style.left = `${currentX}px`;
        travelingCircleRef.current.style.top = `${currentY}px`;
        travelingCircleRef.current.style.opacity = String(opacity);
        travelingCircleRef.current.style.display = opacity > 0.01 ? "block" : "none";
        travelingCircleRef.current.style.boxShadow = opacity > 0
          ? `0 4px 20px rgba(0,0,0,${0.15 + opacity * 0.1})`
          : "none";
      } else if (morphProgress > 0.5) {
        const formProgress = (morphProgress - 0.5) / 0.5;
        const easedForm = easeOutCubic(formProgress);

        travelingCircleRef.current.style.width = `${startSize * easedForm}px`;
        travelingCircleRef.current.style.height = `${startSize * easedForm}px`;
        travelingCircleRef.current.style.left = `${startX}px`;
        travelingCircleRef.current.style.top = `${startY}px`;
        travelingCircleRef.current.style.opacity = String(easedForm);
        travelingCircleRef.current.style.display = easedForm > 0.01 ? "block" : "none";
        travelingCircleRef.current.style.boxShadow = easedForm > 0
          ? `0 4px 20px rgba(0,0,0,${0.15 + easedForm * 0.1})`
          : "none";
      } else {
        travelingCircleRef.current.style.opacity = "0";
        travelingCircleRef.current.style.display = "none";
      }
    }

    // Update showLiveDot state only when threshold crossed
    const shouldShowDot = travelProgress > 0.9;
    setShowLiveDot((prev) => (prev !== shouldShowDot ? shouldShowDot : prev));
  }, [getPainProgress, getTargetDot]);

  // Throttled update via RAF
  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        updateDOM();
      });
    }
  }, [updateDOM]);

  // Initialize viewport size
  useEffect(() => {
    const updateViewport = () => {
      viewportRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };
    updateViewport();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateViewport();
        scheduleUpdate();
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [scheduleUpdate]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // GSAP ScrollTrigger for PINNED pain points section
  useGSAP(
    () => {
      if (!painSectionRef.current || !pinnedContentRef.current) return;

      const painTrigger = ScrollTrigger.create({
        trigger: painSectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: pinnedContentRef.current,
        scrub: 0.8,
        onUpdate: (self) => {
          painProgressRef.current = self.progress;
          scheduleUpdate();
        },
      });

      return () => painTrigger.kill();
    },
    { scope: wrapperRef }
  );

  // GSAP ScrollTrigger for TRAVELING circle
  useGSAP(
    () => {
      if (!featuresWrapperRef.current || !wrapperRef.current) return;

      const travelTrigger = ScrollTrigger.create({
        trigger: featuresWrapperRef.current,
        start: "top bottom",
        end: "top center",
        scrub: 0.6,
        onUpdate: (self) => {
          travelProgressRef.current = self.progress;
          scheduleUpdate();
        },
      });

      return () => travelTrigger.kill();
    },
    { scope: wrapperRef, dependencies: [] }
  );

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
            ref={headerRef}
            className="absolute top-8 md:top-16 left-0 right-0 text-center px-4 z-20"
            style={{ opacity: 0, transform: "translateY(30px)" }}
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
            {/* Chaos lines container */}
            <div
              ref={chaosContainerRef}
              className="absolute inset-0 flex items-center justify-center z-0"
              style={{ opacity: 1, transform: "scale(1)" }}
            >
              <div className="w-full h-full max-w-4xl">
                <ChaosLines progress={chaosProgress} className="text-foreground" />
              </div>
            </div>

            {/* Pain point cards */}
            {PAIN_POINTS.map((pain, index) => (
              <div
                key={pain.id}
                ref={(el) => { painCardRefs.current[index] = el; }}
                className="absolute z-10 w-[280px] sm:w-[300px] md:w-[340px]"
                style={{
                  ...pain.position,
                  opacity: 0,
                  transform: "scale(0.9) translateY(20px)",
                }}
              >
                <MemoizedPainCard pain={pain} progress={painCardProgress[index]} />
              </div>
            ))}

            {/* Center formation point */}
            <div
              ref={centerPointRef}
              className="absolute left-1/2 top-1/2 rounded-full bg-foreground/20 z-20"
              style={{
                width: 0,
                height: 0,
                opacity: 0,
                transform: "translate(-50%, -50%) scale(0.5)",
              }}
            />
          </div>

          {/* Transition message */}
          <div
            ref={transitionMessageRef}
            className="absolute bottom-12 md:bottom-20 left-1/2 text-center z-20"
            style={{ opacity: 0, transform: "translate(-50%, 0) translateY(20px)" }}
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
            ref={progressIndicatorRef}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
            style={{ opacity: 0, transition: "opacity 0.3s ease-out" }}
          >
            <div className="flex gap-1.5">
              {PAIN_POINTS.map((pain, index) => (
                <div
                  key={pain.id}
                  ref={(el) => { progressDotRefs.current[index] = el; }}
                  className="h-1.5 rounded-full transition-all duration-300 w-2 bg-muted-foreground/30"
                  style={{ opacity: 0.3 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Traveling Circle */}
      <div
        ref={travelingCircleRef}
        className="fixed z-[100] rounded-full bg-foreground pointer-events-none"
        style={{
          width: 0,
          height: 0,
          transform: "translate(-50%, -50%)",
          opacity: 0,
          display: "none",
          transition: "box-shadow 0.2s ease-out",
        }}
      />

      {/* Features section wrapper */}
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
