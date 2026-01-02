"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import {
  Lightbulb,
  CheckCircle,
  ClipboardList,
  AlertTriangle,
  Search,
  HelpCircle,
  AlertCircle,
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

// ============================================================================
// Animation Configuration
// ============================================================================

const ANIMATION_CONFIG = {
  transcriptionInterval: 2800,
  typingDuration: 1400,
  typingSpeed: 25,
  insightDelay: 600,
  pdfPreviewDelay: 800,
  pdfPreviewDuration: 3500,
  loopPause: 4000,
};

// ============================================================================
// Types
// ============================================================================

type InsightType =
  | "idea"
  | "problem"
  | "solution"
  | "risk"
  | "insight"
  | "action_item"
  | "open_question";

interface FakeInsight {
  type: InsightType;
  label: string;
  content: string;
}

interface FakeDocumentReference {
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  matchedText: string;
  context: string;
  confidence: number;
}

interface FakeTranscription {
  id: string;
  speaker: string;
  initials: string;
  avatar: string;
  text: string;
  timestamp: string;
  insights: FakeInsight[];
  documentReference?: FakeDocumentReference;
}

// ============================================================================
// Fake Transcription Data
// ============================================================================

const FAKE_TRANSCRIPTIONS: FakeTranscription[] = [
  {
    id: "1",
    speaker: "Sarah",
    initials: "S",
    avatar: "/purple_avatar.webp",
    text: "Looking at the Q4 report, our user onboarding has a 40% drop-off rate at the payment step.",
    timestamp: "0:12",
    insights: [],
    documentReference: {
      documentId: "doc-1",
      documentTitle: "Q4 Financial Report",
      pageNumber: 3,
      matchedText: "40% drop-off occurring at the payment step",
      context: "Speaker referenced onboarding metrics from quarterly report",
      confidence: 0.94,
    },
  },
  {
    id: "2",
    speaker: "Michael",
    initials: "M",
    avatar: "/blue_avatar.webp",
    text: "What if we offer a 14-day free trial instead? That could reduce friction significantly.",
    timestamp: "0:28",
    insights: [
      {
        type: "idea",
        label: "Idea",
        content: "Implement 14-day free trial to reduce payment friction",
      },
    ],
  },
  {
    id: "3",
    speaker: "Emma",
    initials: "E",
    avatar: "/green_avatar.webp",
    text: "Good idea, but we need to consider the risk of free-tier abuse.",
    timestamp: "0:45",
    insights: [
      {
        type: "risk",
        label: "Risk",
        content: "Free trial may lead to abuse and revenue impact",
      },
    ],
  },
];

// ============================================================================
// Fake PDF Content
// ============================================================================

const FAKE_PDF_CONTENT = [
  { type: "heading", text: "Key Performance Metrics" },
  { type: "paragraph", text: "Total revenue for Q4 2024 reached $12.4M, representing a 23% increase compared to Q3." },
  { type: "highlight", text: "User onboarding conversion rate dropped to 60%, with a 40% drop-off occurring at the payment step." },
  { type: "paragraph", text: "This represents a significant opportunity for improvement in Q1 2025." },
];

// ============================================================================
// Insight Configuration
// ============================================================================

const INSIGHT_CONFIG: Record<
  InsightType,
  {
    icon: React.ElementType;
    bgColor: string;
    textColor: string;
  }
> = {
  idea: {
    icon: Lightbulb,
    bgColor: "bg-yellow-100 dark:bg-yellow-950/50",
    textColor: "text-yellow-700 dark:text-yellow-400",
  },
  problem: {
    icon: AlertTriangle,
    bgColor: "bg-orange-100 dark:bg-orange-950/50",
    textColor: "text-orange-700 dark:text-orange-400",
  },
  solution: {
    icon: CheckCircle,
    bgColor: "bg-green-100 dark:bg-green-950/50",
    textColor: "text-green-700 dark:text-green-400",
  },
  risk: {
    icon: AlertCircle,
    bgColor: "bg-red-100 dark:bg-red-950/50",
    textColor: "text-red-700 dark:text-red-400",
  },
  insight: {
    icon: Search,
    bgColor: "bg-blue-100 dark:bg-blue-950/50",
    textColor: "text-blue-700 dark:text-blue-400",
  },
  action_item: {
    icon: ClipboardList,
    bgColor: "bg-indigo-100 dark:bg-indigo-950/50",
    textColor: "text-indigo-700 dark:text-indigo-400",
  },
  open_question: {
    icon: HelpCircle,
    bgColor: "bg-cyan-100 dark:bg-cyan-950/50",
    textColor: "text-cyan-700 dark:text-cyan-400",
  },
};

// ============================================================================
// Sub-components
// ============================================================================

function FakeInsightBadge({
  type,
  label,
  content,
}: {
  type: InsightType;
  label: string;
  content?: string;
}) {
  const config = INSIGHT_CONFIG[type];
  const Icon = config.icon;

  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-default",
        config.bgColor,
        config.textColor
      )}
    >
      <Icon className="size-3" />
      <span>{label}</span>
    </span>
  );

  if (content) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent side="top" className="max-w-[220px] text-xs">
            {content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}

function FakeDocumentReferenceBadge({
  reference,
  isActive,
}: {
  reference: FakeDocumentReference;
  isActive?: boolean;
}) {
  const truncatedTitle =
    reference.documentTitle.length > 18
      ? `${reference.documentTitle.slice(0, 15)}...`
      : reference.documentTitle;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        "transition-all cursor-pointer",
        "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300",
        "border border-blue-200 dark:border-blue-800",
        isActive && "ring-2 ring-blue-400 ring-offset-1 scale-105"
      )}
    >
      <FileText className="size-3" />
      <span className="max-w-[100px] truncate">{truncatedTitle}</span>
      <span className="text-blue-500 dark:text-blue-400">
        p.{reference.pageNumber}
      </span>
      <ExternalLink className="size-2.5 opacity-60" />
    </span>
  );
}

// PDF Preview Component - Floating window style
function PdfPreviewWindow({
  reference,
  isVisible,
  onClose,
}: {
  reference: FakeDocumentReference;
  isVisible: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center p-4 pointer-events-none transition-all duration-500 ease-out",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className={cn(
          "rounded-xl overflow-hidden shadow-2xl pointer-events-auto w-[90%] max-w-[320px] transition-all duration-500 ease-out",
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}
      >
        {/* macOS Window Frame */}
        <div className="flex items-center h-8 px-3 bg-neutral-800 border-b border-neutral-700">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="size-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all"
            />
            <div className="size-3 rounded-full bg-[#febc2e]" />
            <div className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <FileText className="size-3 text-red-500 mr-1.5" />
            <span className="text-[11px] text-neutral-300 font-medium truncate">
              {reference.documentTitle.replace(/ /g, "_")}.pdf
            </span>
          </div>
          <div className="w-12" />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-2 py-1.5 bg-neutral-800/90 border-b border-neutral-700">
          <div className="flex items-center gap-1">
            <button className="size-5 flex items-center justify-center text-neutral-400 hover:text-white rounded">
              <ChevronLeft className="size-3" />
            </button>
            <span className="text-[10px] text-neutral-300 px-1">{reference.pageNumber} / 12</span>
            <button className="size-5 flex items-center justify-center text-neutral-400 hover:text-white rounded">
              <ChevronRight className="size-3" />
            </button>
          </div>
          <div className="flex items-center gap-0.5">
            <button className="size-5 flex items-center justify-center text-neutral-400 hover:text-white rounded">
              <ZoomOut className="size-3" />
            </button>
            <span className="text-[10px] text-neutral-300 w-8 text-center">100%</span>
            <button className="size-5 flex items-center justify-center text-neutral-400 hover:text-white rounded">
              <ZoomIn className="size-3" />
            </button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div className="bg-neutral-600 p-3 flex justify-center max-h-[280px] overflow-auto">
          <div className="bg-white shadow-lg w-full">
            <div className="p-4 space-y-3">
              {/* Document Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
                <div className="size-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-[8px]">Q4</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-800">{reference.documentTitle}</h3>
                  <p className="text-[8px] text-neutral-500">Fiscal Year 2024</p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                {FAKE_PDF_CONTENT.map((item, index) => {
                  if (item.type === "heading") {
                    return (
                      <h4 key={index} className="text-[11px] font-semibold text-neutral-800">
                        {item.text}
                      </h4>
                    );
                  }

                  if (item.type === "highlight") {
                    return (
                      <p key={index} className="text-[10px] text-neutral-700 leading-relaxed">
                        <span
                          className="px-0.5 rounded"
                          style={{
                            background: "linear-gradient(to bottom, rgba(255, 235, 120, 0.6), rgba(255, 220, 100, 0.5))",
                            boxShadow: "0 0 0 2px rgba(255, 200, 50, 0.3)",
                          }}
                        >
                          {item.text}
                        </span>
                      </p>
                    );
                  }

                  return (
                    <p key={index} className="text-[10px] text-neutral-600 leading-relaxed">
                      {item.text}
                    </p>
                  );
                })}
              </div>

              {/* Page Footer */}
              <div className="pt-2 border-t border-neutral-200 flex justify-between text-[8px] text-neutral-400">
                <span>© 2024 Company Inc.</span>
                <span>Page {reference.pageNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-2 py-1 bg-neutral-800 text-[9px] text-neutral-400">
          <span>{Math.round(reference.confidence * 100)}% match</span>
          <span className="italic truncate max-w-[150px]">&ldquo;{reference.matchedText}&rdquo;</span>
        </div>
      </div>
    </div>
  );
}

function FakeTranscriptionMessage({
  entry,
  isNew,
  showInsights,
  isReferenceActive,
}: {
  entry: FakeTranscription;
  isNew?: boolean;
  showInsights?: boolean;
  isReferenceActive?: boolean;
}) {
  const hasBadges = entry.insights.length > 0 || entry.documentReference;

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
      <div className="flex-1 space-y-0.5 sm:space-y-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium leading-none">{entry.speaker}</p>
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            {entry.timestamp}
          </span>
        </div>
        <p className="text-[11px] sm:text-sm text-foreground leading-relaxed">{entry.text}</p>

        {/* Badges */}
        {hasBadges && showInsights && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 animate-fade-in">
            {entry.documentReference && (
              <FakeDocumentReferenceBadge
                reference={entry.documentReference}
                isActive={isReferenceActive}
              />
            )}
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
            Live Transcription
          </span>
        </div>
        <div className="w-8 sm:w-12" />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

// ============================================================================
// Animation State
// ============================================================================

interface TranscriptionAnimationState {
  visibleCount: number;
  newestIndex: number;
  insightsVisibleUpTo: number;
  pdfPreviewVisible: boolean;
  typingIndicator: {
    visible: boolean;
    speaker: string;
    avatar: string;
    initials: string;
    text: string;
  } | null;
}

// ============================================================================
// Main Component
// ============================================================================

export function FakeTranscriptionUI() {
  const [containerRef, isInView] = useInView<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "50px",
  });

  const [animationState, setAnimationState] =
    useState<TranscriptionAnimationState>({
      visibleCount: 0,
      newestIndex: -1,
      insightsVisibleUpTo: 0,
      pdfPreviewVisible: false,
      typingIndicator: null,
    });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef(0);

  const currentIndexRef = useRef(-1);
  const phaseRef = useRef<"typing" | "showing" | "insights" | "pdfPreview" | "pdfHide">("typing");
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);

  // Auto-scroll effect
  useEffect(() => {
    if (!userScrolledRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const targetScroll = container.scrollHeight - container.clientHeight;
      const startScroll = container.scrollTop;
      const distance = targetScroll - startScroll;

      if (distance > 0) {
        const duration = 300;
        const startTime = performance.now();

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          container.scrollTop = startScroll + distance * easeOut;

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        };

        requestAnimationFrame(animateScroll);
      }
    }
  }, [animationState.visibleCount, animationState.typingIndicator, animationState.pdfPreviewVisible]);

  // Handle manual scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const currentScrollTop = container.scrollTop;

    if (currentScrollTop < lastScrollTopRef.current - 5) {
      userScrolledRef.current = true;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        userScrolledRef.current = false;
      }, 4000);
    }

    lastScrollTopRef.current = currentScrollTop;
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Main animation loop - only starts when in view
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
          text:
            nextEntry.text.slice(0, 50) +
            (nextEntry.text.length > 50 ? "..." : ""),
        };
      }
      return null;
    };

    const resetAnimation = () => {
      currentIndexRef.current = -1;
      phaseRef.current = "typing";

      setAnimationState({
        visibleCount: 0,
        newestIndex: -1,
        insightsVisibleUpTo: 0,
        pdfPreviewVisible: false,
        typingIndicator: null,
      });
    };

    const runAnimation = () => {
      const phase = phaseRef.current;
      const currentIndex = currentIndexRef.current;

      if (phase === "typing") {
        const typingIndicator = getNextTypingIndicator(currentIndex);

        if (typingIndicator) {
          setAnimationState((prev) => ({
            ...prev,
            typingIndicator,
          }));

          phaseRef.current = "showing";
          animationTimeoutRef.current = setTimeout(
            runAnimation,
            ANIMATION_CONFIG.typingDuration
          );
        } else {
          // End of loop, pause then restart
          animationTimeoutRef.current = setTimeout(() => {
            resetAnimation();
            animationTimeoutRef.current = setTimeout(runAnimation, 800);
          }, ANIMATION_CONFIG.loopPause);
        }
      } else if (phase === "showing") {
        currentIndexRef.current++;
        const newIndex = currentIndexRef.current;

        setAnimationState((prev) => ({
          ...prev,
          visibleCount: newIndex + 1,
          newestIndex: newIndex,
          typingIndicator: null,
        }));

        phaseRef.current = "insights";
        animationTimeoutRef.current = setTimeout(
          runAnimation,
          ANIMATION_CONFIG.insightDelay
        );
      } else if (phase === "insights") {
        const newIndex = currentIndexRef.current;
        const currentEntry = FAKE_TRANSCRIPTIONS[newIndex];

        setAnimationState((prev) => ({
          ...prev,
          insightsVisibleUpTo: newIndex + 1,
        }));

        // If this entry has a document reference, show PDF preview next
        if (currentEntry?.documentReference) {
          phaseRef.current = "pdfPreview";
          animationTimeoutRef.current = setTimeout(
            runAnimation,
            ANIMATION_CONFIG.pdfPreviewDelay
          );
        } else {
          phaseRef.current = "typing";
          animationTimeoutRef.current = setTimeout(
            runAnimation,
            ANIMATION_CONFIG.transcriptionInterval
          );
        }
      } else if (phase === "pdfPreview") {
        // Show PDF preview
        setAnimationState((prev) => ({
          ...prev,
          pdfPreviewVisible: true,
        }));

        phaseRef.current = "pdfHide";
        animationTimeoutRef.current = setTimeout(
          runAnimation,
          ANIMATION_CONFIG.pdfPreviewDuration
        );
      } else if (phase === "pdfHide") {
        // Hide PDF preview and continue
        setAnimationState((prev) => ({
          ...prev,
          pdfPreviewVisible: false,
        }));

        phaseRef.current = "typing";
        animationTimeoutRef.current = setTimeout(
          runAnimation,
          ANIMATION_CONFIG.transcriptionInterval
        );
      }
    };

    const startDelay = setTimeout(() => {
      runAnimation();
    }, 500);

    return () => {
      clearTimeout(startDelay);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isInView]);

  const visibleTranscriptions = FAKE_TRANSCRIPTIONS.slice(
    0,
    animationState.visibleCount
  );

  // Find the first transcription with a document reference for the floating PDF preview
  const documentReferenceEntry = FAKE_TRANSCRIPTIONS.find(
    (entry) => entry.documentReference
  );

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <MacWindowFrame>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-2 sm:p-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <FileText className="size-3 sm:size-4 text-muted-foreground" />
            <span className="text-[10px] sm:text-sm font-medium">Real-time Transcription</span>
            <span className="ml-auto text-[9px] sm:text-xs text-muted-foreground hidden xs:block">
              Product Strategy Meeting
            </span>
          </div>
        </div>

        {/* Transcriptions */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
        >
          <div className="p-2 sm:p-3 space-y-3 sm:space-y-4">
            {visibleTranscriptions.map((entry, index) => (
              <FakeTranscriptionMessage
                key={entry.id}
                entry={entry}
                isNew={index === animationState.newestIndex}
                showInsights={index < animationState.insightsVisibleUpTo}
                isReferenceActive={
                  entry.documentReference !== undefined &&
                  animationState.pdfPreviewVisible
                }
              />
            ))}

            {/* Typing indicator */}
            {animationState.typingIndicator && (
              <div className="flex gap-2 sm:gap-3 opacity-60 animate-fade-in">
                <Avatar className="size-6 sm:size-8 shrink-0">
                  <AvatarImage
                    src={animationState.typingIndicator.avatar}
                    alt={animationState.typingIndicator.speaker}
                  />
                  <AvatarFallback className="text-[10px] sm:text-xs">
                    {animationState.typingIndicator.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-0.5 sm:space-y-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium leading-none">
                    {animationState.typingIndicator.speaker}
                    <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs text-muted-foreground italic">
                      speaking...
                    </span>
                  </p>
                  <p className="text-[11px] sm:text-sm text-foreground italic">
                    <TypingText text={animationState.typingIndicator.text} />
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MacWindowFrame>

      {/* Floating PDF Preview Window */}
      {documentReferenceEntry?.documentReference && (
        <PdfPreviewWindow
          reference={documentReferenceEntry.documentReference}
          isVisible={animationState.pdfPreviewVisible}
          onClose={() =>
            setAnimationState((prev) => ({
              ...prev,
              pdfPreviewVisible: false,
            }))
          }
        />
      )}
    </div>
  );
}
