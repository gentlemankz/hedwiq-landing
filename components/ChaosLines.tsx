"use client";

import { useRef, useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { getCachedIsSafari } from "@/lib/browser";

// Subscribe function for useSyncExternalStore (browser type never changes)
const subscribeNoop = () => () => {};
const getIsSafariSnapshot = () => getCachedIsSafari();
const getIsSafariServerSnapshot = () => false;

interface ChaosLinesProps {
  progress: number; // 0 to 1
  className?: string;
}

// Generate a chaotic scribble line with circular loops like tangled string
// Creates a large chaos area spreading across the viewport
function generateScribblePath(): string {
  // Start from top-left corner area (near first problem card)
  let path = `M 80 160`;

  // Curve outward toward upper left edge
  path += ` C 60 180, 40 200, 60 240`;
  path += ` C 80 280, 120 300, 160 280`;
  path += ` C 200 260, 180 220, 140 220`;
  path += ` C 100 220, 80 260, 120 300`;

  // Sweep down left side with loops
  path += ` C 160 340, 140 400, 100 440`;
  path += ` C 60 480, 80 540, 140 560`;
  path += ` C 200 580, 180 520, 140 500`;
  path += ` C 100 480, 120 440, 180 440`;

  // Loop near bottom-left corner
  path += ` C 240 440, 220 500, 160 540`;
  path += ` C 100 580, 140 640, 200 660`;
  path += ` C 260 680, 240 620, 200 600`;
  path += ` C 160 580, 180 540, 240 540`;

  // Sweep across bottom
  path += ` C 300 540, 360 580, 420 600`;
  path += ` C 480 620, 540 660, 600 680`;
  path += ` C 660 700, 720 680, 760 640`;
  path += ` C 800 600, 840 640, 880 680`;
  path += ` C 920 720, 940 680, 920 640`;
  path += ` C 900 600, 860 620, 840 580`;

  // Loop near bottom-right area
  path += ` C 820 540, 860 500, 900 520`;
  path += ` C 940 540, 920 580, 880 560`;
  path += ` C 840 540, 860 500, 900 480`;
  path += ` C 940 460, 920 420, 880 420`;

  // Sweep up right side
  path += ` C 840 420, 860 380, 900 360`;
  path += ` C 940 340, 920 300, 880 280`;
  path += ` C 840 260, 860 220, 900 200`;
  path += ` C 940 180, 920 140, 880 160`;
  path += ` C 840 180, 860 220, 820 240`;

  // Loop near top-right
  path += ` C 780 260, 800 200, 840 180`;
  path += ` C 880 160, 860 120, 820 140`;
  path += ` C 780 160, 760 200, 780 240`;
  path += ` C 800 280, 760 300, 720 280`;

  // Sweep across top
  path += ` C 680 260, 640 220, 600 200`;
  path += ` C 560 180, 500 160, 440 180`;
  path += ` C 380 200, 340 180, 300 160`;
  path += ` C 260 140, 220 160, 200 200`;
  path += ` C 180 240, 200 280, 240 300`;

  // Now create central chaos area with loops
  path += ` C 280 320, 320 340, 360 320`;
  path += ` C 400 300, 440 320, 480 360`;
  path += ` C 520 400, 500 440, 460 460`;
  path += ` C 420 480, 380 460, 360 420`;
  path += ` C 340 380, 360 340, 400 340`;

  // More central loops
  path += ` C 440 340, 480 380, 520 420`;
  path += ` C 560 460, 540 500, 500 520`;
  path += ` C 460 540, 420 520, 400 480`;
  path += ` C 380 440, 400 400, 440 400`;
  path += ` C 480 400, 520 440, 540 480`;

  // Additional center loops
  path += ` C 560 520, 580 480, 620 460`;
  path += ` C 660 440, 640 400, 600 380`;
  path += ` C 560 360, 580 320, 620 340`;
  path += ` C 660 360, 640 400, 600 420`;
  path += ` C 560 440, 540 400, 560 360`;

  // Extended outer loops - spreading out
  path += ` C 580 320, 640 300, 700 320`;
  path += ` C 760 340, 740 400, 700 420`;
  path += ` C 660 440, 680 480, 720 500`;
  path += ` C 760 520, 740 560, 700 580`;
  path += ` C 660 600, 620 580, 600 540`;

  // Left side extended loops
  path += ` C 580 500, 540 520, 500 560`;
  path += ` C 460 600, 420 580, 380 540`;
  path += ` C 340 500, 300 520, 280 560`;
  path += ` C 260 600, 220 580, 200 540`;
  path += ` C 180 500, 200 460, 240 440`;

  // Upper left extended
  path += ` C 280 420, 260 380, 220 360`;
  path += ` C 180 340, 160 380, 180 420`;
  path += ` C 200 460, 240 480, 280 460`;
  path += ` C 320 440, 340 400, 320 360`;

  // Final extended sweeps across the canvas
  path += ` C 300 320, 340 300, 380 320`;
  path += ` C 420 340, 460 320, 500 300`;
  path += ` C 540 280, 600 300, 640 340`;
  path += ` C 680 380, 720 360, 760 320`;
  path += ` C 800 280, 780 240, 740 260`;
  path += ` C 700 280, 660 260, 620 240`;
  path += ` C 580 220, 540 240, 520 280`;
  path += ` C 500 320, 460 300, 420 280`;
  path += ` C 380 260, 340 280, 320 320`;
  path += ` C 300 360, 280 340, 260 300`;
  path += ` C 240 260, 200 280, 180 320`;
  path += ` C 160 360, 180 400, 220 420`;

  // End loop
  path += ` C 260 440, 280 480, 260 520`;
  path += ` C 240 560, 200 540, 180 500`;
  path += ` C 160 460, 180 420, 220 400`;

  return path;
}

// Pre-compute the scribble path
const SCRIBBLE_PATH = generateScribblePath();

export function ChaosLines({ progress, className }: ChaosLinesProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const animationRef = useRef<number | null>(null);
  const displayedOffsetRef = useRef<number | null>(null);

  // Detect Safari for performance optimizations (skip blur glow)
  const isSafari = useSyncExternalStore(
    subscribeNoop,
    getIsSafariSnapshot,
    getIsSafariServerSnapshot
  );

  useEffect(() => {
    queueMicrotask(() => setIsClient(true));
  }, []);

  useEffect(() => {
    if (!isClient || !pathRef.current) return;

    const length = pathRef.current.getTotalLength();
    setPathLength(length);
    displayedOffsetRef.current = length;
    pathRef.current.style.strokeDasharray = `${length}`;
    pathRef.current.style.strokeDashoffset = `${length}`;

    if (glowRef.current) {
      glowRef.current.style.strokeDasharray = `${length}`;
      glowRef.current.style.strokeDashoffset = `${length}`;
    }
  }, [isClient]);

  // Animation effect - runs when progress or pathLength changes
  useEffect(() => {
    if (pathLength === 0 || displayedOffsetRef.current === null) return;

    // Calculate target offset based on progress
    const drawLength = pathLength * progress;
    const targetOffset = pathLength - drawLength;

    // Animation loop function
    const animate = () => {
      const currentOffset = displayedOffsetRef.current;
      if (currentOffset === null) return;

      const diff = targetOffset - currentOffset;

      // Smooth interpolation - move 8% of the remaining distance each frame
      if (Math.abs(diff) > 0.5) {
        const newOffset = currentOffset + diff * 0.08;
        displayedOffsetRef.current = newOffset;

        if (pathRef.current) {
          pathRef.current.style.strokeDashoffset = `${newOffset}`;
        }
        if (glowRef.current) {
          glowRef.current.style.strokeDashoffset = `${newOffset}`;
        }

        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Snap to final value when close enough
        displayedOffsetRef.current = targetOffset;
        if (pathRef.current) {
          pathRef.current.style.strokeDashoffset = `${targetOffset}`;
        }
        if (glowRef.current) {
          glowRef.current.style.strokeDashoffset = `${targetOffset}`;
        }
        animationRef.current = null;
      }
    };

    // Start animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [progress, pathLength]);

  return (
    <svg
      viewBox="0 0 1000 800"
      className={cn("w-full h-full", className)}
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible" }}
    >
      {/* Soft glow/shadow effect - skip on Safari due to SVG filter performance issues */}
      {!isSafari && (
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
      )}

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
