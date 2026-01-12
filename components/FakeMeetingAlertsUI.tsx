"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import {
  AlertTriangle,
  Clock,
  UserX,
  RefreshCcw,
  Sparkles,
  CheckCircle2,
  X
} from "lucide-react";

// ============================================================================
// Animation Configuration
// ============================================================================

const ANIMATION_CONFIG = {
  // Time between alert appearances (ms)
  alertInterval: 2500,
  // Duration alert stays visible before next appears (ms)
  displayDuration: 2000,
  // Pause before restarting animation loop (ms)
  loopPause: 3000,
  // Time for AI suggestion to appear after alert (ms)
  aiSuggestionDelay: 800,
};

// ============================================================================
// Types
// ============================================================================

type AlertSeverity = "warning" | "info" | "critical";

interface MeetingAlert {
  id: string;
  type: "no_decision" | "no_owner" | "topic_looping";
  title: string;
  description: string;
  severity: AlertSeverity;
  timeAgo: string;
  aiSuggestion?: string;
}

// ============================================================================
// Fake Data
// ============================================================================

const FAKE_ALERTS: MeetingAlert[] = [
  {
    id: "1",
    type: "no_decision",
    title: "No decision detected",
    description: "12 minutes since last decision was made",
    severity: "warning",
    timeAgo: "Just now",
    aiSuggestion: "Consider summarizing key points and asking for a vote",
  },
  {
    id: "2",
    type: "no_owner",
    title: "Action item needs owner",
    description: "\"Update the proposal document\" has no assignee",
    severity: "critical",
    timeAgo: "2 min ago",
    aiSuggestion: "Suggest: Assign to Sarah (most relevant context)",
  },
  {
    id: "3",
    type: "topic_looping",
    title: "Topic looping detected",
    description: "Budget allocation discussed 3 times without resolution",
    severity: "info",
    timeAgo: "5 min ago",
    aiSuggestion: "Park this topic and schedule a follow-up meeting",
  },
];

// ============================================================================
// Alert Icon Component
// ============================================================================

function AlertIcon({ type, severity }: { type: MeetingAlert["type"]; severity: AlertSeverity }) {
  const iconClass = cn(
    "size-4 sm:size-5",
    severity === "critical" && "text-red-500",
    severity === "warning" && "text-amber-500",
    severity === "info" && "text-blue-500"
  );

  switch (type) {
    case "no_decision":
      return <Clock className={iconClass} />;
    case "no_owner":
      return <UserX className={iconClass} />;
    case "topic_looping":
      return <RefreshCcw className={iconClass} />;
    default:
      return <AlertTriangle className={iconClass} />;
  }
}

// ============================================================================
// Single Alert Card Component
// ============================================================================

function AlertCard({
  alert,
  showAiSuggestion,
  onDismiss,
  onAcceptSuggestion,
}: {
  alert: MeetingAlert;
  showAiSuggestion: boolean;
  onDismiss?: () => void;
  onAcceptSuggestion?: () => void;
}) {
  const severityStyles = {
    critical: "border-red-500/30 bg-red-500/5",
    warning: "border-amber-500/30 bg-amber-500/5",
    info: "border-blue-500/30 bg-blue-500/5",
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border p-2.5 sm:p-3 transition-all duration-300 animate-pop-in",
        severityStyles[alert.severity]
      )}
    >
      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-0.5 rounded-full hover:bg-muted/50 transition-colors"
      >
        <X className="size-3 sm:size-3.5 text-muted-foreground" />
      </button>

      <div className="flex gap-2 sm:gap-3">
        {/* Icon */}
        <div className="shrink-0 mt-0.5">
          <AlertIcon type={alert.type} severity={alert.severity} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h4 className="text-xs sm:text-sm font-medium text-foreground">
                {alert.title}
              </h4>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground">
                {alert.timeAgo}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
              {alert.description}
            </p>
          </div>

          {/* AI Suggestion */}
          {alert.aiSuggestion && showAiSuggestion && (
            <div
              className={cn(
                "flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-md bg-primary/5 border border-primary/20",
                "animate-fade-in"
              )}
            >
              <Sparkles className="size-3 sm:size-3.5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs text-primary font-medium leading-relaxed">
                  {alert.aiSuggestion}
                </p>
                <button
                  onClick={onAcceptSuggestion}
                  className="mt-1 flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <CheckCircle2 className="size-2.5 sm:size-3" />
                  Apply suggestion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// macOS Window Frame
// ============================================================================

function MacWindowFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full flex flex-col rounded-md overflow-hidden border border-border shadow-2xl bg-background">
      {/* macOS Title Bar */}
      <div className="flex items-center h-7 sm:h-9 px-2 sm:px-3 bg-muted/50 border-b border-border shrink-0">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="size-2 sm:size-2.5 rounded-full bg-[#ff5f57]" />
          <div className="size-2 sm:size-2.5 rounded-full bg-[#febc2e]" />
          <div className="size-2 sm:size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
            Meeting Alerts
          </span>
        </div>
        <div className="w-8 sm:w-12" />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

// ============================================================================
// Header Stats Component
// ============================================================================

function AlertStats({
  activeAlerts,
  resolvedAlerts
}: {
  activeAlerts: number;
  resolvedAlerts: number;
}) {
  return (
    <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 border-b border-border bg-muted/30">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <AlertTriangle className="size-3 sm:size-4 text-amber-500" />
        <span className="text-[10px] sm:text-xs font-medium">
          {activeAlerts} Active Alert{activeAlerts !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
        <CheckCircle2 className="size-2.5 sm:size-3 text-green-500" />
        <span>{resolvedAlerts} resolved</span>
      </div>
    </div>
  );
}

// ============================================================================
// Animation Hook
// ============================================================================

function useAlertsAnimation(isInView: boolean) {
  const [visibleAlerts, setVisibleAlerts] = useState<MeetingAlert[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState<Record<string, boolean>>({});
  const [resolvedCount, setResolvedCount] = useState(0);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!isInView || hasStartedRef.current) return;
    hasStartedRef.current = true;

    const runAnimation = (step: number) => {
      // Reset if we've shown all alerts
      if (step >= FAKE_ALERTS.length * 2) {
        animationTimeoutRef.current = setTimeout(() => {
          setVisibleAlerts([]);
          setShowAiSuggestions({});
          setResolvedCount(0);
          animationTimeoutRef.current = setTimeout(() => runAnimation(0), 1000);
        }, ANIMATION_CONFIG.loopPause);
        return;
      }

      const alertIndex = Math.floor(step / 2);
      const isShowingAlert = step % 2 === 0;

      if (isShowingAlert) {
        // Add new alert
        const newAlert = FAKE_ALERTS[alertIndex];
        setVisibleAlerts((prev) => [newAlert, ...prev]);

        // Show AI suggestion after delay
        animationTimeoutRef.current = setTimeout(() => {
          setShowAiSuggestions((prev) => ({ ...prev, [newAlert.id]: true }));

          animationTimeoutRef.current = setTimeout(
            () => runAnimation(step + 1),
            ANIMATION_CONFIG.displayDuration
          );
        }, ANIMATION_CONFIG.aiSuggestionDelay);
      } else {
        // "Resolve" the oldest alert
        setVisibleAlerts((prev) => {
          if (prev.length > 2) {
            return prev.slice(0, -1);
          }
          return prev;
        });
        setResolvedCount((prev) => prev + 1);

        animationTimeoutRef.current = setTimeout(
          () => runAnimation(step + 1),
          ANIMATION_CONFIG.alertInterval
        );
      }
    };

    // Start animation after initial delay
    const startDelay = setTimeout(() => {
      runAnimation(0);
    }, 600);

    return () => {
      clearTimeout(startDelay);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isInView]);

  return {
    visibleAlerts,
    showAiSuggestions,
    resolvedCount,
  };
}

// ============================================================================
// Main Component
// ============================================================================

export function FakeMeetingAlertsUI() {
  const [containerRef, isInView] = useInView<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "50px",
  });

  const { visibleAlerts, showAiSuggestions, resolvedCount } =
    useAlertsAnimation(isInView);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <MacWindowFrame>
        <div className="flex flex-col h-full">
          {/* Stats Header */}
          <AlertStats
            activeAlerts={visibleAlerts.length}
            resolvedAlerts={resolvedCount}
          />

          {/* Alerts List */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3">
            {visibleAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <CheckCircle2 className="size-8 sm:size-10 text-green-500/50 mb-2" />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  No active alerts
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground/70">
                  Meeting is running smoothly
                </p>
              </div>
            ) : (
              visibleAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  showAiSuggestion={showAiSuggestions[alert.id] || false}
                />
              ))
            )}
          </div>

          {/* Footer with AI indicator */}
          <div className="px-2 sm:px-3 py-1.5 sm:py-2 border-t border-border bg-muted/30">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="relative">
                <Sparkles className="size-3 sm:size-4 text-primary" />
                <div className="absolute inset-0 animate-ping">
                  <Sparkles className="size-3 sm:size-4 text-primary opacity-30" />
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                AI monitoring meeting in real-time
              </span>
            </div>
          </div>
        </div>
      </MacWindowFrame>
    </div>
  );
}
