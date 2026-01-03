"use client";

import { cn } from "@/lib/utils";
import { Calendar, Brain, Clock, AlertTriangle } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useProgressAnimation } from "@/hooks/useProgressAnimation";

export type PainType =
  | "meetings-block"
  | "forgotten-info"
  | "time-waste"
  | "post-meeting";

interface PainTextCardProps {
  type: PainType;
  progress: number; // 0 to 1 for animation
  className?: string;
}

const PAIN_CONFIG: Record<
  PainType,
  {
    icon: LucideIcon;
    title: string;
    description: string;
    stat: string;
    statLabel: string;
  }
> = {
  "meetings-block": {
    icon: Calendar,
    title: "Meetings block real work",
    description:
      "Back-to-back meetings leave no time for deep work. Context switching kills productivity.",
    stat: "23hrs/week",
    statLabel: "avg in meetings",
  },
  "forgotten-info": {
    icon: Brain,
    title: "Forgotten Information",
    description:
      "Critical details slip away within hours. Key decisions and action items get lost.",
    stat: "47% lost",
    statLabel: "within 24 hours",
  },
  "time-waste": {
    icon: Clock,
    title: "Time Wasted Searching",
    description:
      "Hours spent digging through old recordings and notes to find one piece of information.",
    stat: "5.5hrs/week",
    statLabel: "searching recordings",
  },
  "post-meeting": {
    icon: AlertTriangle,
    title: "Post-Meeting Overload",
    description:
      "Follow-up emails, ticket updates, CRM entries — the real work starts after meetings end.",
    stat: "~2hrs/meeting",
    statLabel: "on follow-ups",
  },
};

export function PainTextCard({ type, progress, className }: PainTextCardProps) {
  const config = PAIN_CONFIG[type];
  const Icon = config.icon;

  // Animation states using shared hook
  const { isVisible, opacity } = useProgressAnimation(progress, {
    translateDistance: 0,
    scaleRange: [1, 1],
  });

  return (
    <div
      className={cn(
        "relative rounded-xl border border-red-200 dark:border-red-900/50 bg-card/95 backdrop-blur-sm shadow-lg",
        className
      )}
      style={{
        opacity: isVisible ? opacity : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30 rounded-t-xl">
        <Icon className="size-3.5 text-red-500" />
        <span className="text-xs font-medium">{config.title}</span>
        <span className="ml-auto text-[10px] text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
          <Clock className="size-3" />
          {config.statLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {config.description}
        </p>
      </div>

      {/* Stat badge */}
      <div
        className={cn(
          "absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-10 transition-all duration-300",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}
      >
        <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
          {config.stat}
        </span>
      </div>
    </div>
  );
}
