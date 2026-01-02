"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import {
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  PhoneOff,
  ListTodo,
  Clock,
  User,
  Check,
  Lightbulb,
  CheckCircle,
  ClipboardList,
  Users,
  MessageSquareText,
} from "lucide-react";

// ============================================================================
// Animation Configuration
// ============================================================================

const ANIMATION_CONFIG = {
  // Time between each transcription message appearing (ms)
  transcriptionInterval: 2000,
  // Time to show typing indicator before message appears (ms)
  typingDuration: 1400,
  // Time to "type" each character (ms) - for typing effect
  typingSpeed: 20,
  // Delay before insight badges appear after text (ms)
  insightDelay: 400,
  // Speaking indicator duration after transcription appears (ms)
  speakingDuration: 1600,
  // Pause before restarting animation loop (ms)
  loopPause: 3000,
  // Agenda transitions happen at specific transcription indices
  // Total: 8 transcriptions, 3 agenda items (~30 seconds per loop)
  agendaTransitions: {
    // Transcription 0: Start first agenda item
    0: { agendaIndex: 0, status: "in_progress" as const },
    // Transcription 2: Complete first item, start second
    2: { agendaIndex: 0, status: "completed" as const },
    3: { agendaIndex: 1, status: "in_progress" as const },
    // Transcription 5: Complete second item, start third
    5: { agendaIndex: 1, status: "completed" as const },
    6: { agendaIndex: 2, status: "in_progress" as const },
    // Transcription 7: Complete third item
    7: { agendaIndex: 2, status: "completed" as const },
  },
};

// Map speaker names to participant IDs
const SPEAKER_TO_PARTICIPANT: Record<string, string> = {
  "Alex": "1",
  "Ameila": "2",
  "Alice": "3",
  "Jordan": "4",
};

// ============================================================================
// Fake Data
// ============================================================================

const FAKE_PARTICIPANTS = [
  {
    id: "1",
    name: "Alex",
    initials: "A",
    avatar: "/blue_avatar.webp",
    isMuted: false,
    videoOn: false,
  },
  {
    id: "2",
    name: "Ameila",
    initials: "AM",
    avatar: "/green_avatar.webp",
    isMuted: false,
    videoOn: false,
  },
  {
    id: "3",
    name: "Alice",
    initials: "AL",
    avatar: "/purple_avatar.webp",
    isMuted: false,
    videoOn: false,
  },
  {
    id: "4",
    name: "Jordan",
    initials: "J",
    avatar: "/orange_avatar.webp",
    isMuted: true,
    videoOn: false,
  },
];

type AgendaStatus = "pending" | "in_progress" | "completed";

interface FakeAgendaItem {
  id: string;
  title: string;
  status: AgendaStatus;
  duration: string;
  presenter: string;
}

const FAKE_AGENDA_ITEMS: FakeAgendaItem[] = [
  {
    id: "1",
    title: "Review of current campaign performance and key metrics",
    status: "pending",
    duration: "15 min",
    presenter: "Alex",
  },
  {
    id: "2",
    title: "Discussion of target audience insights and market trends",
    status: "pending",
    duration: "15 min",
    presenter: "Ameila",
  },
  {
    id: "3",
    title: "Planning next steps for upcoming marketing initiatives",
    status: "pending",
    duration: "15 min",
    presenter: "Alice",
  },
];

const FAKE_TRANSCRIPTIONS = [
  // Agenda Item 1: Campaign Performance Review (messages 0-2)
  {
    id: "1",
    speaker: "Alex",
    initials: "A",
    avatar: "/blue_avatar.webp",
    text: "Let's review our Q4 campaign performance. The numbers are looking strong overall.",
    timestamp: "0:15",
    insights: [],
  },
  {
    id: "2",
    speaker: "Ameila",
    initials: "AM",
    avatar: "/green_avatar.webp",
    text: "Email open rates increased by 23% and social engagement is up 15%.",
    timestamp: "0:38",
    insights: [{ type: "key_insight" as const, label: "Key Insight", content: "Email open rates +23%, social engagement +15%" }],
  },
  {
    id: "3",
    speaker: "Alice",
    initials: "AL",
    avatar: "/purple_avatar.webp",
    text: "I'll prepare a detailed Instagram analysis by Friday with A/B test proposals.",
    timestamp: "1:02",
    insights: [{ type: "action_item" as const, label: "Action Item", content: "Alice to prepare Instagram analysis by Friday" }],
  },
  // Agenda Item 2: Target Audience Insights (messages 3-5)
  {
    id: "4",
    speaker: "Alex",
    initials: "A",
    avatar: "/blue_avatar.webp",
    text: "Moving on to audience insights. What did our research reveal?",
    timestamp: "1:25",
    insights: [],
  },
  {
    id: "5",
    speaker: "Jordan",
    initials: "J",
    avatar: "/orange_avatar.webp",
    text: "The 25-34 demographic responds best to short-form video under 60 seconds.",
    timestamp: "1:48",
    insights: [{ type: "key_insight" as const, label: "Key Insight", content: "25-34 age group prefers short-form video content" }],
  },
  {
    id: "6",
    speaker: "Ameila",
    initials: "AM",
    avatar: "/green_avatar.webp",
    text: "I propose we shift 30% of Q1 budget to TikTok and Reels content.",
    timestamp: "2:12",
    insights: [{ type: "decision" as const, label: "Decision", content: "Shift 30% of Q1 budget to TikTok and Reels" }],
  },
  // Agenda Item 3: Next Steps (messages 6-7)
  {
    id: "7",
    speaker: "Jordan",
    initials: "J",
    avatar: "/orange_avatar.webp",
    text: "I'll handle micro-influencer outreach targeting 10k-50k follower accounts.",
    timestamp: "2:35",
    insights: [{ type: "action_item" as const, label: "Action Item", content: "Jordan to handle micro-influencer outreach" }],
  },
  {
    id: "8",
    speaker: "Alex",
    initials: "A",
    avatar: "/blue_avatar.webp",
    text: "Great progress! Let's reconvene Thursday to review all proposals.",
    timestamp: "2:58",
    insights: [{ type: "decision" as const, label: "Decision", content: "Follow-up meeting scheduled for Thursday" }],
  },
];

// ============================================================================
// Sub-components
// ============================================================================

function FakeParticipantTile({
  participant,
  isSpeaking,
}: {
  participant: (typeof FAKE_PARTICIPANTS)[0];
  isSpeaking: boolean;
}) {
  return (
    <div
      className={cn(
        "relative aspect-video rounded-lg bg-muted flex items-center justify-center overflow-hidden",
        "border-2 transition-all duration-300",
        isSpeaking
          ? "border-primary ring-2 ring-primary/30"
          : "border-transparent"
      )}
    >
      {/* Avatar placeholder */}
      <Avatar className="size-12 sm:size-16 md:size-20 border-2 border-border">
        <AvatarImage src={participant.avatar} alt={participant.name} />
        <AvatarFallback className="bg-primary text-primary-foreground text-sm sm:text-base md:text-lg font-medium">
          {participant.initials}
        </AvatarFallback>
      </Avatar>

      {/* Participant name overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <div className="flex items-center gap-1.5">
          {participant.isMuted && (
            <MicOff className="size-3 text-red-400" />
          )}
          <span className="text-white text-xs font-medium truncate">
            {participant.name}
          </span>
        </div>
      </div>

      {/* Speaking indicator pulse */}
      {isSpeaking && (
        <div className="absolute inset-0 border-2 border-primary rounded-lg animate-pulse" />
      )}

      {/* Audio waveform animation when speaking */}
      {isSpeaking && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary rounded-full animate-sound-wave"
              style={{
                animationDelay: `${i * 0.1}s`,
                height: '100%',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FakeControlBar() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 bg-background/95 backdrop-blur border-t border-border">
        {/* Microphone - enabled */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="size-9 sm:size-10 md:size-11 rounded-full"
              aria-label="Mute microphone"
            >
              <Mic className="size-4 sm:size-5" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mute</TooltipContent>
        </Tooltip>

        {/* Camera - disabled */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="size-9 sm:size-10 md:size-11 rounded-full"
              aria-label="Start video"
            >
              <VideoOff className="size-4 sm:size-5" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Start Video</TooltipContent>
        </Tooltip>

        {/* Screen Share */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="size-9 sm:size-10 md:size-11 rounded-full"
              aria-label="Share screen"
            >
              <Monitor className="size-4 sm:size-5" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share Screen</TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="mx-1 sm:mx-2 h-6 sm:h-8 w-px bg-border" aria-hidden="true" />

        {/* Leave */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="size-9 sm:size-10 md:size-11 rounded-full"
              aria-label="Leave meeting"
            >
              <PhoneOff className="size-4 sm:size-5" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Leave Meeting</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

function FakeAgendaItem({
  item,
  isCurrent,
  isLast,
  isFullScreen = false,
}: {
  item: FakeAgendaItem;
  isCurrent: boolean;
  isLast: boolean;
  isFullScreen?: boolean;
}) {
  const isCompleted = item.status === "completed";
  const isInProgress = item.status === "in_progress";

  return (
    <div className={cn("flex", isFullScreen ? "gap-3 pb-5" : "gap-2 sm:gap-3 pb-3 sm:pb-4")}>
      {/* Status indicator + connector */}
      <div className={cn("relative flex flex-col items-center shrink-0", isFullScreen ? "w-6" : "w-4 sm:w-5")}>
        <div
          className={cn(
            "relative z-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500",
            isFullScreen ? "size-6" : "size-4 sm:size-5",
            item.status === "pending" && "border-2 border-muted-foreground/40 bg-transparent",
            isInProgress && "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]",
            isCompleted && "bg-green-500"
          )}
        >
          {isInProgress && (
            <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
          )}
          {isCompleted && (
            <Check className={cn("text-white animate-scale-in", isFullScreen ? "size-3.5" : "size-2.5 sm:size-3")} strokeWidth={3} />
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
          isCurrent && (isFullScreen ? "bg-primary/5 px-3 py-1.5 -my-1.5" : "bg-primary/5 px-2 sm:px-3 py-1 -my-1")
        )}
      >
        <div className={cn(isFullScreen ? "space-y-1.5" : "space-y-0.5 sm:space-y-1")}>
          <div className={cn("flex items-start", isFullScreen ? "gap-2" : "gap-1 sm:gap-2")}>
            <span
              className={cn(
                "font-medium leading-tight transition-all duration-300",
                isFullScreen ? "text-sm" : "text-xs sm:text-sm",
                isCompleted && "text-muted-foreground line-through",
                isCurrent && "text-primary font-semibold",
                !isCompleted && !isCurrent && "text-foreground"
              )}
            >
              {item.title}
            </span>
            {isCurrent && (
              <span className={cn(
                "shrink-0 font-medium uppercase tracking-wide text-primary bg-primary/10 rounded animate-pulse",
                isFullScreen ? "text-[10px] px-1.5 py-0.5" : "text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5"
              )}>
                Now
              </span>
            )}
            {isCompleted && (
              <span className={cn(
                "shrink-0 font-medium uppercase tracking-wide text-green-600 bg-green-100 rounded animate-fade-in",
                isFullScreen ? "text-[10px] px-1.5 py-0.5" : "text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5"
              )}>
                Done
              </span>
            )}
          </div>

          <div className={cn(
            "flex items-center text-muted-foreground",
            isFullScreen ? "gap-3 text-xs" : "gap-2 sm:gap-3 text-[10px] sm:text-xs"
          )}>
            <span className={cn("flex items-center", isFullScreen ? "gap-1" : "gap-0.5 sm:gap-1")}>
              <Clock className={cn(isFullScreen ? "size-3.5" : "size-2.5 sm:size-3")} />
              {item.duration}
            </span>
            <span className={cn("flex items-center", isFullScreen ? "gap-1" : "gap-0.5 sm:gap-1")}>
              <User className={cn(isFullScreen ? "size-3.5" : "size-2.5 sm:size-3")} />
              {item.presenter}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FakeInsightBadge({
  type,
  label,
  content,
  showLabel = false,
}: {
  type: "action_item" | "key_insight" | "decision";
  label: string;
  content?: string;
  showLabel?: boolean;
}) {
  const config = {
    action_item: {
      icon: ClipboardList,
      bgColor: "bg-amber-100",
      textColor: "text-amber-700",
    },
    key_insight: {
      icon: Lightbulb,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
    },
    decision: {
      icon: CheckCircle,
      bgColor: "bg-green-100",
      textColor: "text-green-700",
    },
  };

  const { icon: Icon, bgColor, textColor } = config[type];

  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium cursor-default",
        bgColor,
        textColor
      )}
    >
      <Icon className="size-2.5 sm:size-3" />
      <span className={showLabel ? "inline" : "hidden sm:inline"}>{label}</span>
    </span>
  );

  if (content) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px] text-xs">
            {content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}

function FakeTranscriptionMessage({
  entry,
  isNew,
  showInsights,
  isFullScreen = false,
}: {
  entry: (typeof FAKE_TRANSCRIPTIONS)[0];
  isNew?: boolean;
  showInsights?: boolean;
  isFullScreen?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex transition-all duration-500",
        isFullScreen ? "gap-3" : "gap-2 sm:gap-3",
        isNew ? "animate-fade-in-up" : ""
      )}
    >
      <Avatar className={cn("shrink-0", isFullScreen ? "size-9" : "size-6 sm:size-8")}>
        <AvatarImage src={entry.avatar} alt={entry.speaker} />
        <AvatarFallback className={cn(isFullScreen ? "text-xs" : "text-[10px] sm:text-xs")}>{entry.initials}</AvatarFallback>
      </Avatar>
      <div className={cn("flex-1", isFullScreen ? "space-y-1" : "space-y-0.5 sm:space-y-1")}>
        <div className="flex items-center justify-between">
          <p className={cn("font-medium leading-none", isFullScreen ? "text-sm" : "text-xs sm:text-sm")}>{entry.speaker}</p>
          <span className={cn("text-muted-foreground", isFullScreen ? "text-xs" : "text-[10px] sm:text-xs")}>{entry.timestamp}</span>
        </div>
        <p className={cn("text-foreground", isFullScreen ? "text-sm" : "text-xs sm:text-sm")}>{entry.text}</p>
        {entry.insights.length > 0 && showInsights && (
          <div className={cn(
            "flex flex-wrap animate-fade-in",
            isFullScreen ? "gap-1.5 mt-2" : "gap-1 sm:gap-1.5 mt-1 sm:mt-2"
          )}>
            {entry.insights.map((insight, idx) => (
              <FakeInsightBadge
                key={idx}
                type={insight.type}
                label={insight.label}
                content={insight.content}
                showLabel={isFullScreen}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FakeAgendaPanel({
  agendaItems,
  elapsedMinutes,
  isFullScreen = false,
}: {
  agendaItems: FakeAgendaItem[];
  elapsedMinutes: number;
  isFullScreen?: boolean;
}) {
  const completedItems = agendaItems.filter(
    (i) => i.status === "completed"
  ).length;
  const inProgressItems = agendaItems.filter(
    (i) => i.status === "in_progress"
  ).length;
  // Progress includes completed + half of in-progress
  const progressPercentage = ((completedItems + inProgressItems * 0.5) / agendaItems.length) * 100;

  // Calculate remaining time based on completed items
  const totalMinutes = 45;
  const remainingMinutes = Math.max(0, totalMinutes - elapsedMinutes);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className={cn(
        "border-b",
        isFullScreen ? "p-4 space-y-3" : "p-2 sm:p-3 space-y-2 sm:space-y-3"
      )}>
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center", isFullScreen ? "gap-2" : "gap-1.5 sm:gap-2")}>
            <ListTodo className={cn("text-muted-foreground", isFullScreen ? "size-5" : "size-3.5 sm:size-4")} />
            <span className={cn("font-medium", isFullScreen ? "text-base" : "text-xs sm:text-sm")}>Agenda Progress</span>
          </div>
          <span className={cn("text-muted-foreground", isFullScreen ? "text-sm" : "text-xs sm:text-sm")}>
            {completedItems}/{agendaItems.length}
          </span>
        </div>
        <Progress value={progressPercentage} className={cn("transition-all duration-500", isFullScreen ? "h-2.5" : "h-1.5 sm:h-2")} />
        <div className={cn("flex items-center gap-1 text-muted-foreground", isFullScreen ? "text-xs" : "text-[10px] sm:text-xs")}>
          <Clock className={cn(isFullScreen ? "size-3.5" : "size-2.5 sm:size-3")} />
          <span>Est. remaining: {remainingMinutes} min</span>
        </div>
      </div>

      {/* Items */}
      <ScrollArea className="flex-1 min-h-0">
        <div className={cn(isFullScreen ? "p-4" : "p-2 sm:p-3")}>
          {agendaItems.map((item, index) => (
            <FakeAgendaItem
              key={item.id}
              item={item}
              isCurrent={item.status === "in_progress"}
              isLast={index === agendaItems.length - 1}
              isFullScreen={isFullScreen}
            />
          ))}
        </div>
        <ScrollBar className="w-2 bg-muted/50" />
      </ScrollArea>
    </div>
  );
}

function FakeMeetingHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("border-b", compact ? "p-2" : "p-3")}>
      {/* Meeting Image - using original app image */}
      <div className={cn(
        "relative w-full rounded-lg overflow-hidden bg-muted",
        compact ? "aspect-[16/9] mb-2" : "aspect-[21/9] mb-3"
      )}>
        <Image
          src="/image1.png"
          alt="Meeting thumbnail"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>
      {/* Meeting Info */}
      <h3 className={cn(
        "font-medium truncate",
        compact ? "text-xs" : "text-sm"
      )}>
        Quarterly Digital Marketing Strategy...
      </h3>
      <p className={cn(
        "text-muted-foreground",
        compact ? "text-[10px]" : "text-xs"
      )}>
        20.12.2025 • 02:35
      </p>
    </div>
  );
}

interface TranscriptionAnimationState {
  visibleCount: number;
  newestIndex: number;
  insightsVisibleUpTo: number;
  typingIndicator: {
    visible: boolean;
    speaker: string;
    avatar: string;
    initials: string;
    text: string;
  } | null;
}

function FakeTranscriptionPanel({
  animationState,
  isFullScreen = false,
}: {
  animationState: TranscriptionAnimationState;
  isFullScreen?: boolean;
}) {
  const visibleTranscriptions = FAKE_TRANSCRIPTIONS.slice(0, animationState.visibleCount);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef(0);

  // Auto-scroll within the container only (not the page)
  useEffect(() => {
    if (!userScrolledRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Smooth scroll to bottom within the container only
      const targetScroll = container.scrollHeight - container.clientHeight;
      const startScroll = container.scrollTop;
      const distance = targetScroll - startScroll;

      if (distance > 0) {
        // Animate scroll over 300ms
        const duration = 300;
        const startTime = performance.now();

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeOut = 1 - Math.pow(1 - progress, 3);
          container.scrollTop = startScroll + distance * easeOut;

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        };

        requestAnimationFrame(animateScroll);
      }
    }
  }, [animationState.visibleCount, animationState.typingIndicator]);

  // Handle manual scroll - pause auto-scroll temporarily
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const currentScrollTop = container.scrollTop;

    // Only consider it manual scroll if user scrolled UP (against auto-scroll direction)
    if (currentScrollTop < lastScrollTopRef.current - 5) {
      userScrolledRef.current = true;

      // Reset after 4 seconds of no manual scrolling
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        userScrolledRef.current = false;
      }, 4000);
    }

    lastScrollTopRef.current = currentScrollTop;
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Meeting Header with Image - compact in sidebar, expanded on mobile full screen */}
      <FakeMeetingHeader compact={!isFullScreen} />

      {/* Transcriptions - custom scroll container instead of ScrollArea to prevent page scroll */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden transcription-scroll"
      >
        <div className={cn(
          "space-y-3",
          isFullScreen ? "p-3 space-y-4" : "p-2 sm:p-3 sm:space-y-4"
        )}>
          {visibleTranscriptions.map((entry, index) => (
            <FakeTranscriptionMessage
              key={entry.id}
              entry={entry}
              isNew={index === animationState.newestIndex}
              showInsights={index < animationState.insightsVisibleUpTo}
              isFullScreen={isFullScreen}
            />
          ))}

          {/* Typing indicator */}
          {animationState.typingIndicator && (
            <div className={cn(
              "flex opacity-60 animate-fade-in",
              isFullScreen ? "gap-3" : "gap-2 sm:gap-3"
            )}>
              <Avatar className={cn("shrink-0", isFullScreen ? "size-9" : "size-6 sm:size-8")}>
                <AvatarImage src={animationState.typingIndicator.avatar} alt={animationState.typingIndicator.speaker} />
                <AvatarFallback className={cn(isFullScreen ? "text-xs" : "text-[10px] sm:text-xs")}>{animationState.typingIndicator.initials}</AvatarFallback>
              </Avatar>
              <div className={cn("flex-1", isFullScreen ? "space-y-1" : "space-y-0.5 sm:space-y-1")}>
                <p className={cn("font-medium leading-none", isFullScreen ? "text-sm" : "text-xs sm:text-sm")}>
                  {animationState.typingIndicator.speaker}
                  <span className={cn("ml-2 text-muted-foreground italic", isFullScreen ? "text-xs" : "text-[10px] sm:text-xs")}>
                    typing...
                  </span>
                </p>
                <p className={cn("text-foreground italic", isFullScreen ? "text-sm" : "text-xs sm:text-sm")}>
                  <TypingText text={animationState.typingIndicator.text} />
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Typing effect component
function TypingText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, ANIMATION_CONFIG.typingSpeed);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <>
      {displayedText}
      <span className="animate-blink">|</span>
    </>
  );
}

// ============================================================================
// macOS Window Frame
// ============================================================================

function MacWindowFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full flex flex-col rounded-xl overflow-hidden border border-border shadow-2xl bg-background">
      {/* macOS Title Bar */}
      <div className="flex items-center h-10 sm:h-11 px-3 sm:px-4 bg-muted/50 border-b border-border shrink-0">
        {/* Traffic Light Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="size-2.5 sm:size-3 rounded-full bg-[#ff5f57]" />
          <div className="size-2.5 sm:size-3 rounded-full bg-[#febc2e]" />
          <div className="size-2.5 sm:size-3 rounded-full bg-[#28c840]" />
        </div>

        {/* Window Title */}
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
            Luframe — Quarterly Digital Marketing Strategy
          </span>
        </div>

        {/* Spacer for balance */}
        <div className="w-12 sm:w-14" />
      </div>

      {/* Window Content */}
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// Mobile Tab Navigation
// ============================================================================

type MobileTab = "meeting" | "agenda" | "transcript";

function MobileTabBar({
  activeTab,
  onTabChange,
  agendaProgress,
  hasNewTranscription,
}: {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  agendaProgress: { completed: number; total: number };
  hasNewTranscription: boolean;
}) {
  const tabs: { id: MobileTab; label: string; icon: React.ReactNode; badge?: React.ReactNode }[] = [
    {
      id: "meeting",
      label: "Meeting",
      icon: <Users className="size-4" />,
    },
    {
      id: "agenda",
      label: "Agenda",
      icon: <ListTodo className="size-4" />,
      badge: agendaProgress.completed > 0 && (
        <span className="absolute -top-1 -right-1 size-4 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {agendaProgress.completed}
        </span>
      ),
    },
    {
      id: "transcript",
      label: "Live",
      icon: <MessageSquareText className="size-4" />,
      badge: hasNewTranscription && (
        <span className="absolute -top-0.5 -right-0.5 size-2 bg-primary rounded-full animate-pulse" />
      ),
    },
  ];

  return (
    <div className="flex items-center justify-around bg-muted/50 border-t border-border p-1 md:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative flex-1 flex flex-col items-center gap-0.5 py-2 px-3 rounded-lg transition-all duration-200",
            activeTab === tab.id
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="relative">
            {tab.icon}
            {tab.badge}
          </div>
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Animation Hook
// ============================================================================

function useMeetingAnimation(isInView: boolean) {
  // Animation state
  const [transcriptionState, setTranscriptionState] = useState<TranscriptionAnimationState>({
    visibleCount: 0,
    newestIndex: -1,
    insightsVisibleUpTo: 0,
    typingIndicator: null,
  });

  const [agendaItems, setAgendaItems] = useState<FakeAgendaItem[]>(
    FAKE_AGENDA_ITEMS.map((item) => ({ ...item, status: "pending" as AgendaStatus }))
  );

  const [speakingParticipantId, setSpeakingParticipantId] = useState<string | null>(null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Use refs to track animation state without causing re-renders
  const currentIndexRef = useRef(-1);
  const phaseRef = useRef<"typing" | "showing" | "insights">("typing");
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);

  // Main animation loop - only starts when component is in view
  useEffect(() => {
    // Only start animation when in view and hasn't started yet
    if (!isInView || hasStartedRef.current) return;
    hasStartedRef.current = true;

    const getNextTypingIndicator = (index: number) => {
      const nextIndex = index + 1;
      if (nextIndex < FAKE_TRANSCRIPTIONS.length) {
        const nextEntry = FAKE_TRANSCRIPTIONS[nextIndex];
        return {
          visible: true,
          speaker: nextEntry.speaker,
          avatar: nextEntry.avatar,
          initials: nextEntry.initials,
          text: nextEntry.text.slice(0, 60) + (nextEntry.text.length > 60 ? "..." : ""),
        };
      }
      return null;
    };

    const updateAgendaState = (transcriptionIndex: number) => {
      const transition = ANIMATION_CONFIG.agendaTransitions[transcriptionIndex as keyof typeof ANIMATION_CONFIG.agendaTransitions];
      if (transition) {
        setAgendaItems((prev) => {
          const updated = [...prev];
          updated[transition.agendaIndex] = {
            ...updated[transition.agendaIndex],
            status: transition.status,
          };

          // Calculate elapsed time based on new state
          const completedCount = updated.filter((i) => i.status === "completed").length;
          const inProgressCount = updated.filter((i) => i.status === "in_progress").length;
          setElapsedMinutes(completedCount * 15 + inProgressCount * 7);

          return updated;
        });
      }
    };

    const resetAnimation = () => {
      currentIndexRef.current = -1;
      phaseRef.current = "typing";

      setTranscriptionState({
        visibleCount: 0,
        newestIndex: -1,
        insightsVisibleUpTo: 0,
        typingIndicator: null,
      });

      setAgendaItems(
        FAKE_AGENDA_ITEMS.map((item) => ({ ...item, status: "pending" as AgendaStatus }))
      );

      setSpeakingParticipantId(null);
      setElapsedMinutes(0);
    };

    const runAnimation = () => {
      const phase = phaseRef.current;
      const currentIndex = currentIndexRef.current;

      if (phase === "typing") {
        // Show typing indicator for next message
        const typingIndicator = getNextTypingIndicator(currentIndex);

        if (typingIndicator) {
          setTranscriptionState((prev) => ({
            ...prev,
            typingIndicator,
          }));

          // Set the speaker as talking
          const nextEntry = FAKE_TRANSCRIPTIONS[currentIndex + 1];
          if (nextEntry) {
            const participantId = SPEAKER_TO_PARTICIPANT[nextEntry.speaker];
            setSpeakingParticipantId(participantId);
          }

          phaseRef.current = "showing";
          animationTimeoutRef.current = setTimeout(runAnimation, ANIMATION_CONFIG.typingDuration);
        } else {
          // End of transcriptions - wait before restart
          setElapsedMinutes(45);

          animationTimeoutRef.current = setTimeout(() => {
            resetAnimation();
            animationTimeoutRef.current = setTimeout(runAnimation, 800);
          }, ANIMATION_CONFIG.loopPause);
        }
      } else if (phase === "showing") {
        // Show the transcription message
        currentIndexRef.current++;
        const newIndex = currentIndexRef.current;

        setTranscriptionState((prev) => ({
          ...prev,
          visibleCount: newIndex + 1,
          newestIndex: newIndex,
          typingIndicator: null,
        }));

        // Update agenda based on transcription index
        updateAgendaState(newIndex);

        phaseRef.current = "insights";
        animationTimeoutRef.current = setTimeout(runAnimation, ANIMATION_CONFIG.insightDelay);
      } else if (phase === "insights") {
        // Show insights for current message
        const newIndex = currentIndexRef.current;

        setTranscriptionState((prev) => ({
          ...prev,
          insightsVisibleUpTo: newIndex + 1,
        }));

        // Stop speaking after the speaking duration
        if (speakingTimeoutRef.current) {
          clearTimeout(speakingTimeoutRef.current);
        }
        speakingTimeoutRef.current = setTimeout(() => {
          setSpeakingParticipantId(null);
        }, ANIMATION_CONFIG.speakingDuration);

        phaseRef.current = "typing";
        animationTimeoutRef.current = setTimeout(
          runAnimation,
          ANIMATION_CONFIG.transcriptionInterval
        );
      }
    };

    // Start animation after initial delay
    const startDelay = setTimeout(() => {
      runAnimation();
    }, 500);

    return () => {
      clearTimeout(startDelay);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
    };
  }, [isInView]);

  return {
    transcriptionState,
    agendaItems,
    speakingParticipantId,
    elapsedMinutes,
  };
}

// ============================================================================
// Main Component
// ============================================================================

export function FakeMeetingRoom() {
  const [containerRef, isInView] = useInView<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "50px",
  });

  const [mobileTab, setMobileTab] = useState<MobileTab>("meeting");

  const {
    transcriptionState,
    agendaItems,
    speakingParticipantId,
    elapsedMinutes,
  } = useMeetingAnimation(isInView);

  // Calculate agenda progress for mobile tab badge
  const agendaProgress = {
    completed: agendaItems.filter((i) => i.status === "completed").length,
    total: agendaItems.length,
  };

  // Check if there's new transcription activity
  const hasNewTranscription = transcriptionState.typingIndicator !== null ||
    transcriptionState.newestIndex >= 0;

  return (
    <div ref={containerRef} className="w-full h-full">
      <MacWindowFrame>
        <div className="relative w-full h-full flex flex-col md:flex-row bg-background">
          {/* ============================================================== */}
          {/* MOBILE LAYOUT (< md breakpoint) */}
          {/* ============================================================== */}

          {/* Mobile: Main content area that switches based on active tab */}
          <div className="flex-1 flex flex-col min-h-0 md:hidden">
            {/* Meeting Tab - Video Grid + Controls */}
            {mobileTab === "meeting" && (
              <div className="flex-1 flex flex-col animate-fade-in">
                {/* Compact participant grid for mobile */}
                <div className="flex-1 p-2">
                  <div className="grid grid-cols-2 gap-1.5 h-full">
                    {FAKE_PARTICIPANTS.map((participant) => (
                      <FakeParticipantTile
                        key={participant.id}
                        participant={participant}
                        isSpeaking={participant.id === speakingParticipantId}
                      />
                    ))}
                  </div>
                </div>
                {/* Control bar */}
                <FakeControlBar />
              </div>
            )}

            {/* Agenda Tab - Full agenda panel */}
            {mobileTab === "agenda" && (
              <div className="flex-1 overflow-hidden animate-fade-in">
                <FakeAgendaPanel agendaItems={agendaItems} elapsedMinutes={elapsedMinutes} isFullScreen />
              </div>
            )}

            {/* Transcript Tab - Full transcription panel */}
            {mobileTab === "transcript" && (
              <div className="flex-1 overflow-hidden animate-fade-in">
                <FakeTranscriptionPanel animationState={transcriptionState} isFullScreen />
              </div>
            )}

            {/* Mobile Tab Navigation */}
            <MobileTabBar
              activeTab={mobileTab}
              onTabChange={setMobileTab}
              agendaProgress={agendaProgress}
              hasNewTranscription={hasNewTranscription}
            />
          </div>

          {/* ============================================================== */}
          {/* DESKTOP LAYOUT (>= md breakpoint) */}
          {/* ============================================================== */}

          {/* Desktop: Main video area */}
          <div className="hidden md:flex flex-1 flex-col min-w-0">
            {/* Participant grid */}
            <div className="flex-1 p-3 lg:p-4">
              <div className="grid grid-cols-2 gap-3 lg:gap-4 h-full">
                {FAKE_PARTICIPANTS.map((participant) => (
                  <FakeParticipantTile
                    key={participant.id}
                    participant={participant}
                    isSpeaking={participant.id === speakingParticipantId}
                  />
                ))}
              </div>
            </div>

            {/* Control bar */}
            <FakeControlBar />
          </div>

          {/* Desktop: Sidebar - Horizontal split: Agenda (left) | Transcription (right) */}
          <div className="hidden md:flex h-full w-[380px] lg:w-[440px] xl:w-[520px] border-l border-border bg-background">
            {/* Agenda Panel - Left side */}
            <div className="w-[45%] h-full border-r border-border overflow-hidden">
              <FakeAgendaPanel agendaItems={agendaItems} elapsedMinutes={elapsedMinutes} />
            </div>

            {/* Transcription Panel - Right side */}
            <div className="flex-1 h-full overflow-hidden">
              <FakeTranscriptionPanel animationState={transcriptionState} />
            </div>
          </div>
        </div>
      </MacWindowFrame>
    </div>
  );
}
