"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Search, Clock, FileText } from "lucide-react";

interface FakeTranscriptionSearchUIProps {
  progress: number; // 0 to 1
  className?: string;
}

// Fake old meeting transcription data
const TRANSCRIPTION_LINES = [
  { time: "0:00", speaker: "John", text: "Let's discuss the Q3 budget allocation and timeline adjustments..." },
  { time: "2:15", speaker: "Sarah", text: "I think we should prioritize the mobile app development..." },
  { time: "4:32", speaker: "Mike", text: "The vendor contract needs renegotiation before next month..." },
  { time: "7:18", speaker: "Lisa", text: "We agreed on the 15% increase for marketing spend..." },
  { time: "9:45", speaker: "John", text: "Action item: Review the analytics dashboard by Friday..." },
  { time: "12:03", speaker: "Sarah", text: "The customer feedback indicated issues with onboarding flow..." },
  { time: "14:28", speaker: "Mike", text: "Let's schedule a follow-up meeting next Tuesday at 2pm..." },
  { time: "16:50", speaker: "Lisa", text: "I'll send the updated proposals to the stakeholders..." },
];

export function FakeTranscriptionSearchUI({
  progress,
  className,
}: FakeTranscriptionSearchUIProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Spotlight position animation based on progress
  useEffect(() => {
    if (!spotlightRef.current) return;

    // Calculate spotlight position (moves through the content)
    const searchProgress = Math.max(0, (progress - 0.2) / 0.6); // Start after 20%, complete at 80%

    // Zigzag pattern through the transcription
    const row = Math.floor(searchProgress * 4); // 0-3 rows
    const col = row % 2 === 0 ? searchProgress * 4 % 1 : 1 - (searchProgress * 4 % 1);

    const x = 10 + col * 80; // 10% to 90%
    const y = 20 + row * 20; // 20% to 80%

    spotlightRef.current.style.setProperty("--spotlight-x", `${x}%`);
    spotlightRef.current.style.setProperty("--spotlight-y", `${y}%`);
  }, [progress]);

  // Animation states
  const isVisible = progress > 0;
  const opacity = Math.min(1, progress * 2);
  const translateY = (1 - Math.min(1, progress * 1.5)) * 30;
  const searchActive = progress > 0.15;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-xl border border-orange-200 dark:border-orange-900/50 bg-card/90 backdrop-blur-sm shadow-lg overflow-hidden",
        "transition-all duration-300",
        className
      )}
      style={{
        opacity: isVisible ? opacity : 0,
        transform: `translateY(${translateY}px)`,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
        <FileText className="size-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          Old Meeting Recording
        </span>
        <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock className="size-3" />3 weeks ago
        </span>
      </div>

      {/* Search bar */}
      <div className="px-3 py-2 border-b border-border bg-muted/20">
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-md border bg-background transition-all",
            searchActive
              ? "border-orange-400 ring-2 ring-orange-400/20"
              : "border-input"
          )}
        >
          <Search
            className={cn(
              "size-3.5 transition-colors",
              searchActive ? "text-orange-500 animate-pulse" : "text-muted-foreground"
            )}
          />
          <span className="text-xs text-muted-foreground">
            {searchActive ? (
              <span className="text-orange-600 dark:text-orange-400">
                Searching for &quot;budget decision&quot;...
              </span>
            ) : (
              "Search in transcription..."
            )}
          </span>
        </div>
      </div>

      {/* Transcription content with spotlight effect */}
      <div className="relative p-3 h-[180px] sm:h-[200px] overflow-hidden">
        {/* Blurred content layer */}
        <div className="absolute inset-0 p-3">
          <div className="space-y-2.5">
            {TRANSCRIPTION_LINES.map((line, idx) => (
              <div key={idx} className="flex gap-2 text-[10px] sm:text-xs">
                <span className="shrink-0 text-muted-foreground/60 font-mono w-8">
                  {line.time}
                </span>
                <span className="shrink-0 font-medium text-foreground/40 w-12">
                  {line.speaker}
                </span>
                <span className="text-foreground/30 line-clamp-1 blur-[2px]">
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spotlight/magnifier layer */}
        <div
          ref={spotlightRef}
          className={cn(
            "absolute inset-0 p-3 transition-opacity duration-300",
            searchActive ? "opacity-100" : "opacity-0"
          )}
          style={{
            maskImage: `radial-gradient(circle 60px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), black 0%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 60px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), black 0%, transparent 100%)`,
          }}
        >
          <div className="space-y-2.5">
            {TRANSCRIPTION_LINES.map((line, idx) => (
              <div key={idx} className="flex gap-2 text-[10px] sm:text-xs">
                <span className="shrink-0 text-muted-foreground font-mono w-8">
                  {line.time}
                </span>
                <span className="shrink-0 font-medium text-foreground w-12">
                  {line.speaker}
                </span>
                <span className="text-foreground line-clamp-1">
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spotlight glow effect */}
        {searchActive && (
          <div
            className="absolute pointer-events-none rounded-full transition-all duration-200"
            style={{
              width: "120px",
              height: "120px",
              left: "var(--spotlight-x, 50%)",
              top: "var(--spotlight-y, 50%)",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, transparent 70%)",
              boxShadow: "0 0 40px rgba(251, 146, 60, 0.2)",
            }}
          />
        )}

        {/* Frustration indicator */}
        <div
          className={cn(
            "absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium transition-all",
            "bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400",
            searchActive ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}
        >
          <Clock className="size-3" />
          <span>5+ minutes searching...</span>
        </div>
      </div>

      {/* Time waste indicator */}
      <div
        className={cn(
          "absolute -top-2 -right-2 sm:-top-3 sm:-right-3 transition-all duration-300",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}
      >
        <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400">
          5.3hrs/week
        </span>
      </div>
    </div>
  );
}
