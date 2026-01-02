"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface TravelingCircleProps {
  startTrigger: string; // CSS selector for where animation starts
  endTrigger: string; // CSS selector for where animation ends (the dot position)
}

export function TravelingCircle({ startTrigger, endTrigger }: TravelingCircleProps) {
  const circleRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, size: 24 });

  useGSAP(() => {
    if (!circleRef.current) return;

    const startEl = document.querySelector(startTrigger);
    const endEl = document.querySelector(endTrigger);

    if (!startEl || !endEl) {
      console.warn("TravelingCircle: Could not find start or end trigger elements");
      return;
    }

    // Create the scroll trigger for the traveling animation
    const trigger = ScrollTrigger.create({
      trigger: startTrigger,
      start: "bottom center",
      endTrigger: endTrigger,
      end: "top center+=100",
      scrub: 0.8,
      onUpdate: (self) => {
        if (!circleRef.current) return;

        const progress = self.progress;

        // Get positions
        const startRect = startEl.getBoundingClientRect();
        const endRect = endEl.getBoundingClientRect();

        // Calculate start position (center of start element)
        const startX = startRect.left + startRect.width / 2;
        const startY = startRect.top + startRect.height / 2;

        // Calculate end position (center of end element - the i dot placeholder)
        const endX = endRect.left + endRect.width / 2;
        const endY = endRect.top + endRect.height / 2;

        // Interpolate position with easing
        const easedProgress = gsap.utils.pipe(
          gsap.utils.clamp(0, 1),
          (p: number) => 1 - Math.pow(1 - p, 3) // easeOutCubic
        )(progress);

        const currentX = startX + (endX - startX) * easedProgress;
        const currentY = startY + (endY - startY) * easedProgress;

        // Size: starts at 24px, shrinks to 8px (the dot size)
        const startSize = 24;
        const endSize = 8;
        const currentSize = startSize - (startSize - endSize) * easedProgress;

        setPosition({
          x: currentX,
          y: currentY,
          size: currentSize,
        });

        setIsVisible(progress > 0 && progress < 1);
      },
      onLeave: () => setIsVisible(false),
      onEnterBack: () => setIsVisible(true),
    });

    return () => {
      trigger.kill();
    };
  }, [startTrigger, endTrigger]);

  if (!isVisible) return null;

  return (
    <div
      ref={circleRef}
      className="fixed z-[100] rounded-full bg-foreground pointer-events-none"
      style={{
        width: `${position.size}px`,
        height: `${position.size}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        transition: "box-shadow 0.2s ease-out",
      }}
    />
  );
}
