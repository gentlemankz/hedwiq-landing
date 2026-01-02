"use client";

import { cn } from "@/lib/utils";
import { Search, Clock, FileText } from "lucide-react";
import { useProgressAnimation } from "@/hooks/useProgressAnimation";

interface FakeTranscriptionSearchUIProps {
  progress: number; // 0 to 1
  className?: string;
}

// Fake old meeting transcription data
const TRANSCRIPTION_LINES = [
  { time: "0:00", speaker: "John", text: "Let's discuss the Q3 budget allocation..." },
  { time: "2:15", speaker: "Sarah", text: "I think we should prioritize the mobile..." },
  { time: "4:32", speaker: "Mike", text: "The vendor contract needs..." },
  { time: "7:18", speaker: "Lisa", text: "We agreed on the 15% increase for..." },
];

export function FakeTranscriptionSearchUI({
  progress,
  className,
}: FakeTranscriptionSearchUIProps) {
  // Animation states using shared hook
  // Note: Parent (ChaosToOrderTransition) handles transform animation
  // We only handle opacity here to avoid double-animation jank on Safari
  const { isVisible, opacity } = useProgressAnimation(progress, {
    translateDistance: 0, // Parent handles transform
    scaleRange: [1, 1],
  });
  const searchActive = progress > 0.15;

  return (
    <div
      className={cn(
        "relative rounded-xl border border-red-200 dark:border-red-900/50 bg-card/90 backdrop-blur-sm shadow-lg",
        className
      )}
      style={{
        opacity: isVisible ? opacity : 0,
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
              ? "border-red-400 ring-2 ring-red-400/20"
              : "border-input"
          )}
        >
          <Search
            className={cn(
              "size-3.5 transition-colors",
              searchActive ? "text-red-500 animate-pulse" : "text-muted-foreground"
            )}
          />
          <span className="text-xs text-muted-foreground">
            {searchActive ? (
              <span className="text-red-600 dark:text-red-400">
                Searching for &quot;budget decision&quot;...
              </span>
            ) : (
              "Search in transcription..."
            )}
          </span>
        </div>
      </div>

      {/* Transcription content */}
      <div className="relative p-3 h-[180px] sm:h-[200px] overflow-hidden">
        {/* Content layer */}
        <div className="space-y-2.5">
          {TRANSCRIPTION_LINES.slice(0, 4).map((line, idx) => (
            <div key={idx} className="flex gap-2 text-[10px] sm:text-xs">
              <span className="shrink-0 text-muted-foreground font-mono w-8">
                {line.time}
              </span>
              <span className="shrink-0 font-medium text-foreground w-12">
                {line.speaker}
              </span>
              <span className="text-muted-foreground line-clamp-1">
                {line.text}
              </span>
            </div>
          ))}
        </div>

        {/* Frustration indicator */}
        <div
          className={cn(
            "absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium transition-all",
            "bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400",
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
          "absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-10 transition-all duration-300",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}
      >
        <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
          5.5hrs/week
        </span>
      </div>
    </div>
  );
}
