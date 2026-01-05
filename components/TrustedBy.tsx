"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

const trustedCompanies = [
  { name: "Amplitude", logo: "/Amplitude_logo.svg", width: 120, height: 28, isWordmark: true },
  { name: "GitHub", logo: "/github-svgrepo-com.svg", width: 32, height: 32, isWordmark: false },
  { name: "OpenAI", logo: "/openai-svgrepo-com.svg", width: 28, height: 28, isWordmark: false },
  { name: "Supabase", logo: "/supabase-logo-wordmark--light.svg", width: 120, height: 28, isWordmark: true },
];

export function TrustedBy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const lineContainerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Track anchor position for fixed overlay
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 });

  // Update anchor position
  useEffect(() => {
    const updateAnchorPos = () => {
      if (anchorRef.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        setAnchorPos({
          x: rect.left + rect.width / 2,
          y: rect.bottom
        });
      }
    };

    updateAnchorPos();
    window.addEventListener('scroll', updateAnchorPos);
    window.addEventListener('resize', updateAnchorPos);

    return () => {
      window.removeEventListener('scroll', updateAnchorPos);
      window.removeEventListener('resize', updateAnchorPos);
    };
  }, []);

  // Direct DOM update for performance
  const updateDOM = useCallback(() => {
    const progress = progressRef.current;

    if (lineRef.current && chevronRef.current && lineContainerRef.current) {
      // Line grows during first 75% of scroll, then fades
      if (progress < 0.75) {
        const growProgress = progress / 0.75;
        const lineHeight = Math.min(growProgress * 150, 150); // Max 150px line
        lineRef.current.style.height = `${lineHeight}px`;
        lineRef.current.style.opacity = "1";
        chevronRef.current.style.opacity = "1";
        lineContainerRef.current.style.opacity = "1";
      } else {
        // Fade out during last 25%
        const fadeProgress = (progress - 0.75) / 0.25;
        lineRef.current.style.height = "150px";
        const opacity = 1 - fadeProgress;
        lineRef.current.style.opacity = String(opacity);
        chevronRef.current.style.opacity = String(opacity);
        lineContainerRef.current.style.opacity = String(opacity);
      }

      // Chevron bounces only when progress is very low
      const shouldBounce = progress < 0.05;
      chevronRef.current.className = cn(
        "text-muted-foreground transition-transform duration-300",
        shouldBounce && "animate-bounce"
      );
    }
  }, []);

  // Throttled update via RAF
  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        updateDOM();
      });
    }
  }, [updateDOM]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // ScrollTrigger for the expanding line animation
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Find the ChaosToOrderTransition element to use as end target
      const chaosSection = document.querySelector('[data-chaos-section="true"]');

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "bottom 90%",  // Start when TrustedBy bottom is 90% down viewport
        end: chaosSection ? "top top" : "+=300", // End when chaos section reaches top
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
          left: anchorPos.x,
          top: anchorPos.y + 16,
          transform: 'translateX(-50%)'
        }}
        aria-hidden="true"
      >
        {/* The line that grows downward */}
        <div
          ref={lineRef}
          className="w-px bg-border"
          style={{ height: 0 }}
        />
        {/* Chevron at the tip */}
        <div
          ref={chevronRef}
          className="text-muted-foreground transition-transform duration-300 animate-bounce"
        >
          <ChevronDown className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
}
