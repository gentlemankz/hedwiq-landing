"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ChaosLinesProps {
  progress: number; // 0 to 1
  className?: string;
}

// Generate a chaotic scribble line with circular loops like tangled string
// Inspired by the reference image - overlapping circular loops creating chaos
function generateScribblePath(): string {
  const width = 1000;
  const height = 800;
  const centerX = 500;
  const centerY = 400;

  // Start from left side, create chaotic loops in center, exit right
  let path = `M -50 400`;

  // Entry line from left
  path += ` L 150 400`;

  // First small loop (top-left area) - circular
  path += ` C 180 350, 220 320, 250 350`;
  path += ` C 280 380, 260 420, 220 410`;
  path += ` C 180 400, 170 360, 200 330`;

  // Sweep to create first big loop
  path += ` C 240 290, 300 270, 350 300`;
  path += ` C 400 330, 420 380, 400 430`;
  path += ` C 380 480, 320 500, 280 470`;
  path += ` C 240 440, 230 390, 260 350`;

  // Second overlapping loop (slightly right)
  path += ` C 300 310, 360 290, 420 310`;
  path += ` C 480 330, 520 380, 510 440`;
  path += ` C 500 500, 450 530, 400 510`;
  path += ` C 350 490, 330 440, 360 400`;

  // Small tight spiral in center
  path += ` C 390 360, 440 350, 480 370`;
  path += ` C 520 390, 530 430, 510 460`;
  path += ` C 490 490, 450 500, 420 480`;
  path += ` C 390 460, 400 420, 430 400`;

  // Third big loop going up-right
  path += ` C 470 380, 530 350, 580 370`;
  path += ` C 630 390, 660 440, 640 490`;
  path += ` C 620 540, 560 560, 510 540`;
  path += ` C 460 520, 450 470, 480 430`;

  // Another overlapping circular loop
  path += ` C 510 390, 570 370, 620 400`;
  path += ` C 670 430, 690 490, 660 540`;
  path += ` C 630 590, 570 600, 530 570`;
  path += ` C 490 540, 500 490, 540 460`;

  // Small loop near top
  path += ` C 580 430, 620 410, 650 440`;
  path += ` C 680 470, 670 510, 640 520`;
  path += ` C 610 530, 580 510, 590 480`;

  // Sweeping loop back through center
  path += ` C 600 450, 580 420, 550 400`;
  path += ` C 520 380, 480 390, 460 420`;
  path += ` C 440 450, 450 490, 490 510`;
  path += ` C 530 530, 590 520, 620 490`;

  // Another circular loop (bottom area)
  path += ` C 650 460, 670 420, 650 380`;
  path += ` C 630 340, 580 320, 540 350`;
  path += ` C 500 380, 510 430, 550 450`;
  path += ` C 590 470, 640 460, 660 430`;

  // Figure-8 style loop
  path += ` C 680 400, 700 370, 720 400`;
  path += ` C 740 430, 730 470, 700 480`;
  path += ` C 670 490, 640 470, 650 440`;
  path += ` C 660 410, 700 400, 730 420`;

  // Final loops before exit
  path += ` C 760 440, 780 480, 760 510`;
  path += ` C 740 540, 700 550, 680 520`;
  path += ` C 660 490, 680 460, 720 460`;
  path += ` C 760 460, 790 480, 800 450`;

  // Small exit loop
  path += ` C 810 420, 830 400, 850 410`;
  path += ` C 870 420, 870 440, 850 440`;

  // Exit line to right
  path += ` C 880 440, 920 420, 1050 400`;

  return path;
}

// Pre-compute the scribble path
const SCRIBBLE_PATH = generateScribblePath();

export function ChaosLines({ progress, className }: ChaosLinesProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [displayedOffset, setDisplayedOffset] = useState<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const targetOffsetRef = useRef<number>(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !pathRef.current) return;

    const length = pathRef.current.getTotalLength();
    setPathLength(length);
    setDisplayedOffset(length);
    pathRef.current.style.strokeDasharray = `${length}`;
    pathRef.current.style.strokeDashoffset = `${length}`;

    if (glowRef.current) {
      glowRef.current.style.strokeDasharray = `${length}`;
      glowRef.current.style.strokeDashoffset = `${length}`;
    }
  }, [isClient]);

  // Smooth animation using requestAnimationFrame
  const animateOffset = useCallback(() => {
    if (displayedOffset === null || pathLength === 0) return;

    const diff = targetOffsetRef.current - displayedOffset;

    // Smooth interpolation - move 8% of the remaining distance each frame
    // This creates a smooth, eased animation
    if (Math.abs(diff) > 0.5) {
      const newOffset = displayedOffset + diff * 0.08;
      setDisplayedOffset(newOffset);

      if (pathRef.current) {
        pathRef.current.style.strokeDashoffset = `${newOffset}`;
      }
      if (glowRef.current) {
        glowRef.current.style.strokeDashoffset = `${newOffset}`;
      }

      animationRef.current = requestAnimationFrame(animateOffset);
    } else {
      // Snap to final value when close enough
      setDisplayedOffset(targetOffsetRef.current);
      if (pathRef.current) {
        pathRef.current.style.strokeDashoffset = `${targetOffsetRef.current}`;
      }
      if (glowRef.current) {
        glowRef.current.style.strokeDashoffset = `${targetOffsetRef.current}`;
      }
    }
  }, [displayedOffset, pathLength]);

  useEffect(() => {
    if (pathLength === 0) return;

    // Calculate target offset based on progress
    const drawLength = pathLength * progress;
    const targetOffset = pathLength - drawLength;
    targetOffsetRef.current = targetOffset;

    // Start animation if not already running
    if (animationRef.current === null) {
      animationRef.current = requestAnimationFrame(animateOffset);
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [progress, pathLength, animateOffset]);

  // Keep animation running while there's a difference
  useEffect(() => {
    if (displayedOffset === null || pathLength === 0) return;

    const diff = Math.abs(targetOffsetRef.current - displayedOffset);
    if (diff > 0.5 && animationRef.current === null) {
      animationRef.current = requestAnimationFrame(animateOffset);
    }
  }, [displayedOffset, pathLength, animateOffset]);

  return (
    <svg
      viewBox="0 0 1000 800"
      className={cn("w-full h-full", className)}
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible" }}
    >
      {/* Soft glow/shadow effect */}
      <path
        ref={glowRef}
        d={SCRIBBLE_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-foreground/5 dark:text-foreground/5"
        style={{
          filter: "blur(6px)",
        }}
      />

      {/* Main scribble line */}
      <path
        ref={pathRef}
        d={SCRIBBLE_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-foreground/40 dark:text-foreground/35"
      />
    </svg>
  );
}
