"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import {
  Mic,
  MicOff,
  Video,
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
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 bg-background/95 backdrop-blur border-t border-border">
      {/* Microphone - enabled */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="size-9 sm:size-10 md:size-11 rounded-full"
            >
              <Mic className="size-4 sm:size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mute</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Camera - disabled */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="size-9 sm:size-10 md:size-11 rounded-full"
            >
              <VideoOff className="size-4 sm:size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Start Video</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Screen Share */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="size-9 sm:size-10 md:size-11 rounded-full"
            >
              <Monitor className="size-4 sm:size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share Screen</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Divider */}
      <div className="mx-1 sm:mx-2 h-6 sm:h-8 w-px bg-border" />

      {/* Leave */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="size-9 sm:size-10 md:size-11 rounded-full"
            >
              <PhoneOff className="size-4 sm:size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Leave Meeting</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function FakeAgendaItem({
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
    <div className="flex gap-2 sm:gap-3 pb-3 sm:pb-4">
      {/* Status indicator + connector */}
      <div className="relative flex flex-col items-center shrink-0 w-4 sm:w-5">
        <div
          className={cn(
            "relative z-10 size-4 sm:size-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-500",
            item.status === "pending" && "border-2 border-muted-foreground/40 bg-transparent",
            isInProgress && "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]",
            isCompleted && "bg-green-500"
          )}
        >
          {isInProgress && (
            <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
          )}
          {isCompleted && (
            <Check className="size-2.5 sm:size-3 text-white animate-scale-in" strokeWidth={3} />
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
          isCurrent && "bg-primary/5 px-2 sm:px-3 py-1 -my-1"
        )}
      >
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-start gap-1 sm:gap-2">
            <span
              className={cn(
                "text-xs sm:text-sm font-medium leading-tight transition-all duration-300",
                isCompleted && "text-muted-foreground line-through",
                isCurrent && "text-primary font-semibold",
                !isCompleted && !isCurrent && "text-foreground"
              )}
            >
              {item.title}
            </span>
            {isCurrent && (
              <span className="shrink-0 text-[8px] sm:text-[10px] font-medium uppercase tracking-wide text-primary bg-primary/10 px-1 sm:px-1.5 py-0.5 rounded animate-pulse">
                Now
              </span>
            )}
            {isCompleted && (
              <span className="shrink-0 text-[8px] sm:text-[10px] font-medium uppercase tracking-wide text-green-600 bg-green-100 px-1 sm:px-1.5 py-0.5 rounded animate-fade-in">
                Done
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5 sm:gap-1">
              <Clock className="size-2.5 sm:size-3" />
              {item.duration}
            </span>
            <span className="flex items-center gap-0.5 sm:gap-1">
              <User className="size-2.5 sm:size-3" />
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
}: {
  type: "action_item" | "key_insight" | "decision";
  label: string;
  content?: string;
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
      <span className="hidden sm:inline">{label}</span>
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
}: {
  entry: (typeof FAKE_TRANSCRIPTIONS)[0];
  isNew?: boolean;
  showInsights?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex gap-2 sm:gap-3 transition-all duration-500",
        isNew ? "animate-fade-in-up" : ""
      )}
    >
      <Avatar className="size-6 sm:size-8 shrink-0">
        <AvatarImage src={entry.avatar} alt={entry.speaker} />
        <AvatarFallback className="text-[10px] sm:text-xs">{entry.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-0.5 sm:space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium leading-none">{entry.speaker}</p>
          <span className="text-[10px] sm:text-xs text-muted-foreground">{entry.timestamp}</span>
        </div>
        <p className="text-xs sm:text-sm text-foreground">{entry.text}</p>
        {entry.insights.length > 0 && showInsights && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1 sm:mt-2 animate-fade-in">
            {entry.insights.map((insight, idx) => (
              <FakeInsightBadge
                key={idx}
                type={insight.type}
                label={insight.label}
                content={insight.content}
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
}: {
  agendaItems: FakeAgendaItem[];
  elapsedMinutes: number;
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
      <div className="p-2 sm:p-3 border-b space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ListTodo className="size-3.5 sm:size-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm font-medium">Agenda Progress</span>
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {completedItems}/{agendaItems.length}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-1.5 sm:h-2 transition-all duration-500" />
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
          <Clock className="size-2.5 sm:size-3" />
          <span>Est. remaining: {remainingMinutes} min</span>
        </div>
      </div>

      {/* Items */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 sm:p-3">
          {agendaItems.map((item, index) => (
            <FakeAgendaItem
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
  );
}

function FakeMeetingHeader() {
  return (
    <div className="p-2 sm:p-3 border-b">
      {/* Meeting Image */}
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-2 sm:mb-3 bg-muted">
        <img
          src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=225&fit=crop"
          alt="Meeting"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Meeting Info */}
      <h3 className="text-xs sm:text-sm font-medium truncate">Quarterly Digital Marketing Strategy...</h3>
      <p className="text-[10px] sm:text-xs text-muted-foreground">20.12.2025 • 02:35</p>
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
  scrollRef,
}: {
  animationState: TranscriptionAnimationState;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const visibleTranscriptions = FAKE_TRANSCRIPTIONS.slice(0, animationState.visibleCount);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Meeting Header with Image */}
      <FakeMeetingHeader />

      {/* Transcriptions */}
      <ScrollArea className="flex-1 min-h-0">
        <div ref={scrollRef} className="p-2 sm:p-3 space-y-3 sm:space-y-4">
          {visibleTranscriptions.map((entry, index) => (
            <FakeTranscriptionMessage
              key={entry.id}
              entry={entry}
              isNew={index === animationState.newestIndex}
              showInsights={index < animationState.insightsVisibleUpTo}
            />
          ))}

          {/* Typing indicator */}
          {animationState.typingIndicator && (
            <div className="flex gap-2 sm:gap-3 opacity-60 animate-fade-in">
              <Avatar className="size-6 sm:size-8 shrink-0">
                <AvatarImage src={animationState.typingIndicator.avatar} alt={animationState.typingIndicator.speaker} />
                <AvatarFallback className="text-[10px] sm:text-xs">{animationState.typingIndicator.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-0.5 sm:space-y-1">
                <p className="text-xs sm:text-sm font-medium leading-none">
                  {animationState.typingIndicator.speaker}
                  <span className="ml-2 text-[10px] sm:text-xs text-muted-foreground italic">
                    typing...
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-foreground italic">
                  <TypingText text={animationState.typingIndicator.text} />
                </p>
              </div>
            </div>
          )}
        </div>
        <ScrollBar className="w-2 bg-muted/50" />
      </ScrollArea>
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
            Hedwiq — Quarterly Digital Marketing Strategy
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
// Animation Hook
// ============================================================================

function useMeetingAnimation() {
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

  const scrollRef = useRef<HTMLDivElement>(null);

  // Use refs to track animation state without causing re-renders
  const currentIndexRef = useRef(-1);
  const phaseRef = useRef<"typing" | "showing" | "insights">("typing");
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAnimatingRef = useRef(false);

  // Main animation loop - runs only once on mount
  useEffect(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

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

        // Auto-scroll
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }, 100);

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
    }, 1500);

    return () => {
      clearTimeout(startDelay);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
      isAnimatingRef.current = false;
    };
  }, []); // Empty dependency array - only run once

  return {
    transcriptionState,
    agendaItems,
    speakingParticipantId,
    elapsedMinutes,
    scrollRef,
  };
}

// ============================================================================
// Main Component
// ============================================================================

export function FakeMeetingRoom() {
  const {
    transcriptionState,
    agendaItems,
    speakingParticipantId,
    elapsedMinutes,
    scrollRef,
  } = useMeetingAnimation();

  return (
    <MacWindowFrame>
      <div className="relative w-full h-full flex bg-background">
        {/* Main video area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Participant grid */}
          <div className="flex-1 p-2 sm:p-3 md:p-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 h-full">
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

        {/* Sidebar - Horizontal split: Agenda (left) | Transcription (right) */}
        <div className="hidden md:flex h-full w-[420px] lg:w-[480px] xl:w-[560px] border-l border-border bg-background">
          {/* Agenda Panel - Left side */}
          <div className="w-[45%] h-full border-r border-border overflow-hidden">
            <FakeAgendaPanel agendaItems={agendaItems} elapsedMinutes={elapsedMinutes} />
          </div>

          {/* Transcription Panel - Right side */}
          <div className="flex-1 h-full overflow-hidden">
            <FakeTranscriptionPanel animationState={transcriptionState} scrollRef={scrollRef} />
          </div>
        </div>
      </div>
    </MacWindowFrame>
  );
}
