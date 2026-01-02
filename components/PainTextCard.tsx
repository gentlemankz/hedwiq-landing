"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, Calendar, Brain, Clock } from "lucide-react";
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
    stat?: string;
    iconBg: string;
    iconColor: string;
    borderColor: string;
  }
> = {
  "meetings-block": {
    icon: Calendar,
    title: "Meetings Block Real Work",
    description:
      "Back-to-back meetings leave no time for deep work. Context switching kills productivity.",
    stat: "23hrs/week",
    iconBg: "bg-red-100 dark:bg-red-950/50",
    iconColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-200 dark:border-red-900/50",
  },
  "forgotten-info": {
    icon: Brain,
    title: "Forgotten Information",
    description:
      "Critical details slip away within hours. Key decisions and action items get lost.",
    stat: "47% lost",
    iconBg: "bg-amber-100 dark:bg-amber-950/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-900/50",
  },
  "time-waste": {
    icon: Clock,
    title: "Time Wasted Searching",
    description:
      "Hours spent digging through old recordings and notes to find one piece of information.",
    stat: "5.3hrs/week",
    iconBg: "bg-orange-100 dark:bg-orange-950/50",
    iconColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-200 dark:border-orange-900/50",
  },
  "post-meeting": {
    icon: AlertTriangle,
    title: "Post-Meeting Overload",
    description:
      "Follow-up emails, ticket updates, CRM entries — the real work starts after meetings end.",
    stat: "2hrs/meeting",
    iconBg: "bg-purple-100 dark:bg-purple-950/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200 dark:border-purple-900/50",
  },
};

export function PainTextCard({ type, progress, className }: PainTextCardProps) {
  const config = PAIN_CONFIG[type];
  const Icon = config.icon;

  // Animation states using shared hook
  // Note: Parent (ChaosToOrderTransition) handles transform animation
  // We only handle opacity here to avoid double-animation jank on Safari
  const { isVisible, opacity } = useProgressAnimation(progress, {
    translateDistance: 0, // Parent handles transform
    scaleRange: [1, 1],   // Parent handles scale
  });

  return (
    <div
      className={cn(
        "relative p-4 sm:p-5 rounded-xl border bg-card/80 backdrop-blur-sm shadow-lg",
        config.borderColor,
        className
      )}
      style={{
        opacity: isVisible ? opacity : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {/* Stat badge */}
      {config.stat && (
        <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold",
              config.iconBg,
              config.iconColor
            )}
          >
            {config.stat}
          </span>
        </div>
      )}

      <div className="flex items-start gap-3 sm:gap-4">
        {/* Icon */}
        <div
          className={cn(
            "shrink-0 p-2 sm:p-2.5 rounded-lg",
            config.iconBg
          )}
        >
          <Icon className={cn("size-4 sm:size-5", config.iconColor)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-semibold text-foreground mb-1">
            {config.title}
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>

      {/* Decorative chaos indicator */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
        style={{
          opacity: Math.min(0.1, progress * 0.15),
        }}
      >
        <div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-br from-transparent via-current to-transparent",
            config.iconColor
          )}
        />
      </div>
    </div>
  );
}
