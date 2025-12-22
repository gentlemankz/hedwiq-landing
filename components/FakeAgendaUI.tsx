"use client";

import { useState, useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import { ListTodo, Clock, User, Check, Sparkles } from "lucide-react";

// ============================================================================
// Animation Configuration
// ============================================================================

const ANIMATION_CONFIG = {
  // Time between agenda item transitions (ms)
  transitionInterval: 3500,
  // Time for item to "start" animation (ms)
  startDelay: 800,
  // Pause before restarting animation loop (ms)
  loopPause: 4000,
};

// ============================================================================
// Types
// ============================================================================

type AgendaStatus = "pending" | "in_progress" | "completed";

interface FakeAgendaItem {
  id: string;
  title: string;
  status: AgendaStatus;
  duration: string;
  presenter: string;
}

// ============================================================================
// Fake Data
// ============================================================================

const FAKE_AGENDA_ITEMS: FakeAgendaItem[] = [
  {
    id: "1",
    title: "Review Q4 campaign performance metrics",
    status: "pending",
    duration: "10 min",
    presenter: "Sarah",
  },
  {
    id: "2",
    title: "Discuss budget allocation for Q1 initiatives",
    status: "pending",
    duration: "15 min",
    presenter: "Michael",
  },
  {
    id: "3",
    title: "Plan social media strategy for product launch",
    status: "pending",
    duration: "20 min",
    presenter: "Emma",
  },
  {
    id: "4",
    title: "Assign action items and next steps",
    status: "pending",
    duration: "10 min",
    presenter: "Team",
  },
];

// ============================================================================
// Sub-components
// ============================================================================

function AgendaItem({
  item,
  isCurrent,
  isLast,
}: {
  item: FakeAgendaItem;
  isCurrent: boolean;
  isLast: boolean;
}) {
  const isCompleted = item.status === "completed";
  const isInProgress = item.status === "in_progress";

  return (
    <div className="flex gap-3 pb-4">
      {/* Status indicator + connector */}
      <div className="relative flex flex-col items-center shrink-0 w-5">
        <div
          className={cn(
            "relative z-10 size-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-500",
            item.status === "pending" &&
              "border-2 border-muted-foreground/40 bg-transparent",
            isInProgress &&
              "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]",
            isCompleted && "bg-green-500"
          )}
        >
          {isInProgress && (
            <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
          )}
          {isCompleted && (
            <Check
              className="size-3 text-white animate-scale-in"
              strokeWidth={3}
            />
          )}
        </div>

        {/* Connector line */}
        {!isLast && (
          <div
            className={cn(
              "flex-1 w-0.5 mt-1 transition-colors duration-500",
              isCompleted ? "bg-green-500/50" : "bg-muted-foreground/20"
            )}
          />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex-1 min-w-0 rounded-md transition-all duration-300",
          isCurrent && "bg-primary/5 px-3 py-1 -my-1"
        )}
      >
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <span
              className={cn(
                "text-sm font-medium leading-tight transition-all duration-300",
                isCompleted && "text-muted-foreground line-through",
                isCurrent && "text-primary font-semibold",
                !isCompleted && !isCurrent && "text-foreground"
              )}
            >
              {item.title}
            </span>
            {isCurrent && (
              <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-primary bg-primary/10 px-1.5 py-0.5 rounded animate-pulse">
                Now
              </span>
            )}
            {isCompleted && (
              <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded animate-fade-in">
                Done
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {item.duration}
            </span>
            <span className="flex items-center gap-1">
              <User className="size-3" />
              {item.presenter}
            </span>
          </div>
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
      <div className="flex items-center h-9 px-3 bg-muted/50 border-b border-border shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-[#ff5f57]" />
          <div className="size-2.5 rounded-full bg-[#febc2e]" />
          <div className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs text-muted-foreground font-medium">
            Agenda Progress
          </span>
        </div>
        <div className="w-12" />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

// ============================================================================
// AI Context Badge
// ============================================================================

function AIContextBadge({ text, isVisible }: { text: string; isVisible: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 border border-primary/20 transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
    >
      <Sparkles className="size-3 text-primary" />
      <span className="text-xs text-primary font-medium">{text}</span>
    </div>
  );
}

// ============================================================================
// Animation Hook
// ============================================================================

function useAgendaAnimation(isInView: boolean) {
  const [agendaItems, setAgendaItems] = useState<FakeAgendaItem[]>(
    FAKE_AGENDA_ITEMS.map((item) => ({ ...item, status: "pending" as AgendaStatus }))
  );
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!isInView || hasStartedRef.current) return;
    hasStartedRef.current = true;

    const aiMessages = [
      "Detected topic transition...",
      "Moving to next agenda item...",
      "Topic completed by AI",
      "Starting final item...",
    ];

    const resetAnimation = () => {
      setAgendaItems(
        FAKE_AGENDA_ITEMS.map((item) => ({ ...item, status: "pending" as AgendaStatus }))
      );
      setAiMessage(null);
      setElapsedMinutes(0);
    };

    const runAnimation = (step: number) => {
      const totalItems = FAKE_AGENDA_ITEMS.length;

      if (step >= totalItems * 2) {
        // Animation complete, pause then restart
        animationTimeoutRef.current = setTimeout(() => {
          resetAnimation();
          animationTimeoutRef.current = setTimeout(() => runAnimation(0), 1000);
        }, ANIMATION_CONFIG.loopPause);
        return;
      }

      const itemIndex = Math.floor(step / 2);
      const isStarting = step % 2 === 0;

      if (isStarting) {
        // Show AI message first
        setAiMessage(aiMessages[itemIndex] || "Processing...");

        animationTimeoutRef.current = setTimeout(() => {
          // Start the item
          setAgendaItems((prev) => {
            const updated = [...prev];
            updated[itemIndex] = { ...updated[itemIndex], status: "in_progress" };
            return updated;
          });
          setAiMessage(null);

          // Calculate elapsed time
          const completedMinutes = FAKE_AGENDA_ITEMS.slice(0, itemIndex)
            .reduce((sum, item) => sum + parseInt(item.duration), 0);
          setElapsedMinutes(completedMinutes + 5);

          animationTimeoutRef.current = setTimeout(
            () => runAnimation(step + 1),
            ANIMATION_CONFIG.transitionInterval
          );
        }, ANIMATION_CONFIG.startDelay);
      } else {
        // Complete the item
        setAgendaItems((prev) => {
          const updated = [...prev];
          updated[itemIndex] = { ...updated[itemIndex], status: "completed" };
          return updated;
        });

        // Update elapsed time
        const completedMinutes = FAKE_AGENDA_ITEMS.slice(0, itemIndex + 1)
          .reduce((sum, item) => sum + parseInt(item.duration), 0);
        setElapsedMinutes(completedMinutes);

        animationTimeoutRef.current = setTimeout(
          () => runAnimation(step + 1),
          ANIMATION_CONFIG.transitionInterval
        );
      }
    };

    // Start animation after initial delay
    const startDelay = setTimeout(() => {
      runAnimation(0);
    }, 800);

    return () => {
      clearTimeout(startDelay);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isInView]);

  return {
    agendaItems,
    aiMessage,
    elapsedMinutes,
  };
}

// ============================================================================
// Main Component
// ============================================================================

export function FakeAgendaUI() {
  const [containerRef, isInView] = useInView<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "50px",
  });

  const { agendaItems, aiMessage, elapsedMinutes } =
    useAgendaAnimation(isInView);

  const completedItems = agendaItems.filter((i) => i.status === "completed").length;
  const inProgressItems = agendaItems.filter((i) => i.status === "in_progress").length;
  const progressPercentage =
    ((completedItems + inProgressItems * 0.5) / agendaItems.length) * 100;

  const totalMinutes = FAKE_AGENDA_ITEMS.reduce(
    (sum, item) => sum + parseInt(item.duration),
    0
  );
  const remainingMinutes = Math.max(0, totalMinutes - elapsedMinutes);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <MacWindowFrame>
        <div className="flex flex-col h-full">
          {/* Header with progress */}
          <div className="p-3 border-b space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTodo className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Agenda Progress</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {completedItems}/{agendaItems.length}
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 transition-all duration-500"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                <span>Est. remaining: {remainingMinutes} min</span>
              </div>
              {/* AI Context Badge */}
              {aiMessage && (
                <AIContextBadge text={aiMessage} isVisible={!!aiMessage} />
              )}
            </div>
          </div>

          {/* Scrollable items list */}
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-0">
              {agendaItems.map((item, index) => (
                <AgendaItem
                  key={item.id}
                  item={item}
                  isCurrent={item.status === "in_progress"}
                  isLast={index === agendaItems.length - 1}
                />
              ))}
            </div>
            <ScrollBar className="w-2 bg-muted/50" />
          </ScrollArea>
        </div>
      </MacWindowFrame>
    </div>
  );
}
