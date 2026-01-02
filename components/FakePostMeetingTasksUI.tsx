"use client";

import { cn } from "@/lib/utils";
import {
  Mail,
  TicketCheck,
  Users,
  FileText,
  Circle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useProgressAnimation } from "@/hooks/useProgressAnimation";

interface FakePostMeetingTasksUIProps {
  progress: number; // 0 to 1
  className?: string;
}

interface TaskItem {
  icon: LucideIcon;
  label: string;
  category: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
}

const POST_MEETING_TASKS: TaskItem[] = [
  {
    icon: Mail,
    label: "Send follow-up email to stakeholders",
    category: "Email",
    priority: "high",
    status: "pending",
  },
  {
    icon: TicketCheck,
    label: "Create Jira ticket for feature request",
    category: "PM Tool",
    priority: "high",
    status: "pending",
  },
  {
    icon: Users,
    label: "Update CRM with meeting notes",
    category: "CRM",
    priority: "medium",
    status: "pending",
  },
  {
    icon: FileText,
    label: "Share meeting summary with team",
    category: "Docs",
    priority: "medium",
    status: "pending",
  },
  {
    icon: Mail,
    label: "Schedule next sync meeting",
    category: "Calendar",
    priority: "low",
    status: "pending",
  },
  {
    icon: TicketCheck,
    label: "Update sprint backlog priorities",
    category: "PM Tool",
    priority: "medium",
    status: "pending",
  },
];

const PRIORITY_STYLES = {
  high: {
    dot: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
  },
  medium: {
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  low: {
    dot: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
};

function TaskRow({
  task,
  index,
  taskProgress,
}: {
  task: TaskItem;
  index: number;
  taskProgress: number;
}) {
  const Icon = task.icon;
  const priorityStyle = PRIORITY_STYLES[task.priority];

  // Stagger task appearance
  const taskDelay = index * 0.12;
  const adjustedProgress = Math.max(0, (taskProgress - taskDelay) / (1 - taskDelay));
  const isVisible = adjustedProgress > 0;
  const opacity = Math.min(1, adjustedProgress * 3);

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg border border-transparent",
        "hover:bg-muted/50 hover:border-border transition-all",
        "cursor-default"
      )}
      style={{
        opacity: isVisible ? opacity : 0,
        transform: `translateX(${isVisible ? 0 : -10}px)`,
        transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
      }}
    >
      {/* Checkbox */}
      <Circle className="size-3.5 text-muted-foreground/40 shrink-0" />

      {/* Icon */}
      <div className={cn("p-1 rounded", priorityStyle.bg)}>
        <Icon className={cn("size-3", priorityStyle.text)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] sm:text-xs text-foreground truncate">
          {task.label}
        </p>
      </div>

      {/* Category badge */}
      <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
        {task.category}
      </span>

      {/* Priority indicator */}
      <div className={cn("size-1.5 rounded-full shrink-0", priorityStyle.dot)} />
    </div>
  );
}

export function FakePostMeetingTasksUI({
  progress,
  className,
}: FakePostMeetingTasksUIProps) {
  // Animation states using shared hook
  // Note: Parent (ChaosToOrderTransition) handles transform animation
  // We only handle opacity here to avoid double-animation jank on Safari
  const { isVisible, opacity } = useProgressAnimation(progress, {
    translateDistance: 0, // Parent handles transform
    scaleRange: [1, 1],
  });

  // Task list progress (starts after container is visible)
  const taskProgress = Math.max(0, (progress - 0.15) / 0.7);

  // Count visible tasks for the counter animation
  // This represents tasks that have appeared in the animation
  const visibleTaskCount = Math.min(
    POST_MEETING_TASKS.length,
    Math.floor(taskProgress * POST_MEETING_TASKS.length * 1.5)
  );

  // Progress percentage for the bar (0-100)
  const progressPercent = Math.round((visibleTaskCount / POST_MEETING_TASKS.length) * 100);

  return (
    <div
      className={cn(
        "relative rounded-xl border border-purple-200 dark:border-purple-900/50 bg-card/90 backdrop-blur-sm shadow-lg overflow-hidden",
        className
      )}
      style={{
        opacity: isVisible ? opacity : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-3.5 text-purple-500" />
          <span className="text-xs font-medium">Post-Meeting Tasks</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="size-3" />
            ~2hrs to complete
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-3 py-2 border-b border-border bg-muted/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">Tasks Loading</span>
          <span className="text-[10px] font-medium text-foreground">
            {visibleTaskCount}/{POST_MEETING_TASKS.length} visible
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Task list */}
      <div className="p-2 space-y-0.5 max-h-[200px] overflow-hidden">
        {POST_MEETING_TASKS.map((task, idx) => (
          <TaskRow
            key={idx}
            task={task}
            index={idx}
            taskProgress={taskProgress}
          />
        ))}
      </div>

      {/* Overflow indicator */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-12 pointer-events-none",
          "bg-gradient-to-t from-card/95 to-transparent",
          taskProgress > 0.5 ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">
          + more tasks below
        </div>
      </div>

      {/* Overwhelm indicator */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/70",
          "text-purple-700 dark:text-purple-300 text-xs font-medium",
          "flex items-center gap-1.5 shadow-lg",
          "transition-all duration-500",
          progress > 0.8 ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}
      >
        <AlertCircle className="size-3.5" />
        <span>Feeling overwhelmed?</span>
      </div>

      {/* Time badge */}
      <div
        className={cn(
          "absolute -top-2 -right-2 sm:-top-3 sm:-right-3 transition-all duration-300",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}
      >
        <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
          2hrs/meeting
        </span>
      </div>
    </div>
  );
}
