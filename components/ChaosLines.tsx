"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ChaosLinesProps {
  progress: number; // 0 to 1
  className?: string;
}

// Generate a chaotic scribble line with circular loops like tangled string
// Creates a large circular chaos area connecting all 4 problem card corners
function generateScribblePath(): string {
  // Start from top-left corner area (near first problem card)
  let path = `M 100 180`;

  // Curve toward center with first loop near top-left
  path += ` C 140 220, 180 260, 220 280`;
  path += ` C 260 300, 280 340, 260 380`;
  path += ` C 240 420, 200 430, 180 400`;
  path += ` C 160 370, 180 330, 220 320`;

  // Sweep up toward top-right area
  path += ` C 280 300, 360 260, 450 240`;
  path += ` C 540 220, 640 200, 720 220`;

  // Loop near top-right corner (second problem card area)
  path += ` C 780 240, 840 280, 860 340`;
  path += ` C 880 400, 860 450, 820 460`;
  path += ` C 780 470, 750 440, 760 400`;
  path += ` C 770 360, 810 340, 840 360`;

  // Sweep down through center toward bottom-right
  path += ` C 870 380, 880 440, 860 500`;
  path += ` C 840 560, 780 600, 720 620`;

  // Loop near bottom-right corner (fourth problem card area)
  path += ` C 780 640, 840 660, 860 620`;
  path += ` C 880 580, 860 540, 820 540`;
  path += ` C 780 540, 760 580, 780 620`;
  path += ` C 800 660, 760 680, 720 660`;

  // Sweep left through bottom toward bottom-left
  path += ` C 640 640, 540 660, 450 660`;
  path += ` C 360 660, 280 640, 220 600`;

  // Loop near bottom-left corner (third problem card area)
  path += ` C 180 580, 140 540, 160 500`;
  path += ` C 180 460, 220 450, 240 480`;
  path += ` C 260 510, 240 550, 200 560`;
  path += ` C 160 570, 140 530, 170 500`;

  // Sweep up through center creating chaos loops
  path += ` C 200 470, 260 440, 320 420`;

  // First central chaos loop
  path += ` C 380 400, 420 360, 400 320`;
  path += ` C 380 280, 340 280, 340 320`;
  path += ` C 340 360, 380 380, 420 370`;

  // Continue to create more central loops
  path += ` C 460 360, 500 340, 520 380`;
  path += ` C 540 420, 520 460, 480 470`;
  path += ` C 440 480, 420 450, 440 420`;
  path += ` C 460 390, 500 390, 520 420`;

  // Another overlapping loop in center
  path += ` C 540 450, 560 490, 540 530`;
  path += ` C 520 570, 480 580, 460 550`;
  path += ` C 440 520, 460 490, 500 490`;
  path += ` C 540 490, 570 520, 560 560`;

  // Sweep back up through center
  path += ` C 550 600, 500 620, 460 600`;
  path += ` C 420 580, 400 540, 420 500`;
  path += ` C 440 460, 480 450, 500 480`;

  // Create figure-8 pattern in center
  path += ` C 520 510, 560 520, 580 490`;
  path += ` C 600 460, 590 420, 560 410`;
  path += ` C 530 400, 510 420, 520 450`;
  path += ` C 530 480, 570 490, 600 470`;

  // Loop toward top area
  path += ` C 630 450, 660 420, 660 380`;
  path += ` C 660 340, 630 320, 600 340`;
  path += ` C 570 360, 570 400, 600 410`;
  path += ` C 630 420, 660 400, 670 370`;

  // Sweep to upper-right with loops
  path += ` C 680 340, 720 320, 740 350`;
  path += ` C 760 380, 750 420, 720 430`;
  path += ` C 690 440, 680 410, 700 390`;
  path += ` C 720 370, 760 380, 770 410`;

  // Continue chaos in right side
  path += ` C 780 440, 780 480, 760 510`;
  path += ` C 740 540, 700 550, 680 520`;
  path += ` C 660 490, 680 460, 710 460`;
  path += ` C 740 460, 760 490, 750 520`;

  // Sweep back to center with more loops
  path += ` C 740 550, 700 570, 660 560`;
  path += ` C 620 550, 600 520, 620 490`;
  path += ` C 640 460, 680 460, 690 490`;

  // Create lower-center chaos
  path += ` C 700 520, 680 560, 640 570`;
  path += ` C 600 580, 560 560, 560 520`;
  path += ` C 560 480, 590 460, 620 470`;
  path += ` C 650 480, 660 520, 640 550`;

  // Sweep toward bottom-left with loops
  path += ` C 620 580, 580 600, 540 600`;
  path += ` C 500 600, 460 580, 460 540`;
  path += ` C 460 500, 490 480, 520 490`;
  path += ` C 550 500, 560 540, 530 560`;

  // More loops in left-center
  path += ` C 500 580, 460 580, 440 550`;
  path += ` C 420 520, 440 490, 470 490`;
  path += ` C 500 490, 510 520, 490 540`;
  path += ` C 470 560, 430 550, 420 520`;

  // Upper-left center loops
  path += ` C 410 490, 430 460, 460 460`;
  path += ` C 490 460, 500 490, 480 510`;
  path += ` C 460 530, 420 530, 410 500`;
  path += ` C 400 470, 420 440, 450 440`;

  // Final connecting loops through center
  path += ` C 480 440, 510 450, 520 480`;
  path += ` C 530 510, 510 540, 480 540`;
  path += ` C 450 540, 440 510, 460 490`;
  path += ` C 480 470, 520 470, 540 500`;

  // End with tight spiral in center
  path += ` C 560 530, 550 560, 520 560`;
  path += ` C 490 560, 480 530, 500 510`;
  path += ` C 520 490, 550 500, 550 530`;

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
