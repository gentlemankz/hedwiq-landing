"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";
import {
  Mail,
  Send,
  ChevronDown,
  ChevronUp,
  User,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
} from "lucide-react";

// ============================================================================
// Animation Configuration
// ============================================================================

const ANIMATION_CONFIG = {
  actionDetectionDelay: 1000,
  typingDuration: 2000,
  typingSpeed: 15, // Slightly faster typing
  draftGenerationDelay: 1500,
  draftRevealDuration: 800,
  autoScrollDelay: 500, // Delay before auto-scroll starts
  autoScrollDuration: 1500, // Duration of auto-scroll animation
  sendDelay: 1500, // Reduced since we wait for scroll
  successDuration: 2000,
  loopPause: 3000,
};

// ============================================================================
// Types
// ============================================================================

type DraftStatus = "generating" | "ready" | "sending" | "sent";

interface FakeAction {
  id: string;
  type: "email_followup" | "email_share" | "email_schedule";
  content: string;
  speaker: string;
  avatar: string;
  initials: string;
}

interface FakeEmailDraft {
  id: string;
  action: FakeAction;
  to: { name: string; email: string }[];
  subject: string;
  body: string;
  status: DraftStatus;
}

// ============================================================================
// Fake Data
// ============================================================================

const FAKE_ACTIONS: FakeAction[] = [
  {
    id: "action-1",
    type: "email_followup",
    content: "I'll send the Q4 budget proposal to the finance team for review",
    speaker: "Sarah",
    avatar: "/purple_avatar.webp",
    initials: "S",
  },
  {
    id: "action-2",
    type: "email_share",
    content: "Let me share the research findings with the product team",
    speaker: "Michael",
    avatar: "/blue_avatar.webp",
    initials: "M",
  },
];

const FAKE_DRAFTS: FakeEmailDraft[] = [
  {
    id: "draft-1",
    action: FAKE_ACTIONS[0],
    to: [
      { name: "Finance Team", email: "finance@company.com" },
      { name: "John", email: "john@company.com" },
    ],
    subject: "Q4 Budget Proposal - Review Request",
    body: `Hi Finance Team,

As discussed in our meeting today, I'm sharing the Q4 budget proposal for your review.

Key highlights:
- 15% increase for marketing initiatives
- New headcount allocation for engineering
- Revised vendor contracts

Please review and share your feedback by Friday.

Best regards,
Sarah`,
    status: "ready",
  },
  {
    id: "draft-2",
    action: FAKE_ACTIONS[1],
    to: [{ name: "Product Team", email: "product@company.com" }],
    subject: "Research Findings - User Interview Insights",
    body: `Hi Product Team,

Following up from our sync, here are the research findings from the user interviews.

Key insights:
- 73% of users prefer the new onboarding flow
- Mobile experience needs improvement
- Feature requests for collaboration tools

Let me know if you need any clarification.

Best,
Michael`,
    status: "ready",
  },
];

// ============================================================================
// Status Configuration
// ============================================================================

const STATUS_CONFIG: Record<
  DraftStatus,
  {
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  generating: {
    label: "Generating",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
  },
  ready: {
    label: "Ready",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/50",
  },
  sending: {
    label: "Sending",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
  },
  sent: {
    label: "Sent",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
  },
};

// ============================================================================
// Sub-components
// ============================================================================

function MacWindowFrame({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
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
            {title}
          </span>
        </div>
        <div className="w-8 sm:w-12" />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

// Action Detection Indicator
function ActionDetectionIndicator({
  action,
  isVisible,
  isProcessing,
}: {
  action: FakeAction;
  isVisible: boolean;
  isProcessing: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
        isProcessing
          ? "border-primary/50 bg-primary/5"
          : "border-border bg-muted/30"
      )}
    >
      <Avatar className="size-6 sm:size-8 shrink-0">
        <AvatarImage src={action.avatar} alt={action.speaker} />
        <AvatarFallback className="text-[10px] sm:text-xs">{action.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
          <span className="text-xs sm:text-sm font-medium">{action.speaker}</span>
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] sm:text-xs transition-all px-1.5 sm:px-2",
              isProcessing && "animate-pulse"
            )}
          >
            <Sparkles className="size-2.5 sm:size-3 mr-0.5 sm:mr-1" />
            Action Detected
          </Badge>
        </div>
        <p className="text-[11px] sm:text-sm text-muted-foreground line-clamp-2">
          &ldquo;{action.content}&rdquo;
        </p>
      </div>
    </div>
  );
}

// Typing indicator for draft generation
function DraftGeneratingIndicator({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 border-t transition-all duration-300",
        isVisible ? "opacity-100" : "opacity-0 h-0 p-0 overflow-hidden"
      )}
    >
      <div className="p-2 rounded-full bg-amber-50 dark:bg-amber-950/50">
        <Loader2 className="size-4 text-amber-600 dark:text-amber-400 animate-spin" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">Generating email draft...</p>
        <p className="text-xs text-muted-foreground">
          AI is crafting a professional email based on the action
        </p>
      </div>
    </div>
  );
}

// Email Draft Card
function EmailDraftCard({
  draft,
  isExpanded,
  onToggleExpand,
  showTypingBody,
  typedBodyLength,
  isSending,
  isSent,
  autoScrollProgress,
}: {
  draft: FakeEmailDraft;
  isExpanded: boolean;
  onToggleExpand?: () => void;
  showTypingBody: boolean;
  typedBodyLength: number;
  isSending: boolean;
  isSent: boolean;
  autoScrollProgress: number; // 0-1 for scroll animation (used for button highlight)
}) {
  const currentStatus: DraftStatus = isSent
    ? "sent"
    : isSending
      ? "sending"
      : "ready";
  const statusConfig = STATUS_CONFIG[currentStatus];

  const displayedBody = showTypingBody
    ? draft.body.slice(0, typedBodyLength) + (typedBodyLength < draft.body.length ? "|" : "")
    : draft.body;

  return (
    <div
      className={cn(
        "border rounded-lg transition-all duration-300",
        isSent && "opacity-60",
        isExpanded ? "bg-card" : "bg-muted/30"
      )}
    >
      {/* Header - always visible */}
      <button
        onClick={onToggleExpand}
        className="w-full p-3 flex items-start gap-3 text-left hover:bg-muted/50 transition-colors rounded-t-lg"
      >
        {/* Status Icon */}
        <div className={cn("p-2 rounded-full shrink-0", statusConfig.bgColor)}>
          {isSending ? (
            <Loader2
              className={cn("size-4 animate-spin", statusConfig.color)}
            />
          ) : isSent ? (
            <CheckCircle2 className={cn("size-4", statusConfig.color)} />
          ) : (
            <Mail className={cn("size-4", statusConfig.color)} />
          )}
        </div>

        {/* Content Preview */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">
              {draft.action.type.replace("_", " ")}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-xs", statusConfig.color)}
            >
              {statusConfig.label}
            </Badge>
            <span className="text-xs text-muted-foreground ml-auto">
              <Clock className="size-3 inline mr-1" />
              Just now
            </span>
          </div>

          <p className="text-sm font-medium truncate">{draft.subject}</p>

          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <User className="size-3" />
            <span className="truncate">
              {draft.to.map((r) => r.email).join(", ")}
            </span>
          </div>
        </div>

        {/* Expand indicator */}
        <div className="shrink-0">
          {isExpanded ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      <div
        className={cn(
          "transition-all duration-300 overflow-hidden",
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-3 pt-0 space-y-3">
          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Recipients */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              To
            </label>
            <div className="flex flex-wrap gap-1">
              {draft.to.map((recipient, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {recipient.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Subject
            </label>
            <div className="text-sm border rounded px-2 py-1.5 bg-background">
              {draft.subject}
            </div>
          </div>

          {/* Body */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Message
            </label>
            <div className="text-xs border rounded px-2 py-1.5 bg-background whitespace-pre-wrap">
              {displayedBody}
            </div>
          </div>

          {/* Action buttons */}
          {!isSent && (
            <div className="flex items-center gap-2 pt-2">
              <Button
                size="sm"
                className={cn(
                  "flex-1 transition-all",
                  autoScrollProgress >= 0.9 && !isSending && "ring-2 ring-primary ring-offset-2 animate-pulse"
                )}
                disabled={isSending || showTypingBody}
              >
                {isSending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="size-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          )}

          {isSent && (
            <div className="flex items-center justify-center gap-2 py-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
              Email sent successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Animation State
// ============================================================================

type AnimationPhase =
  | "idle"
  | "action_detected"
  | "generating"
  | "revealing"
  | "typing_body"
  | "auto_scrolling"
  | "ready"
  | "sending"
  | "sent"
  | "loop_pause";

interface AnimationState {
  phase: AnimationPhase;
  currentDraftIndex: number;
  actionVisible: boolean;
  draftVisible: boolean;
  draftExpanded: boolean;
  typedBodyLength: number;
  autoScrollProgress: number; // 0-1 for smooth scroll animation
  isSending: boolean;
  isSent: boolean;
}

// ============================================================================
// Main Component
// ============================================================================

export function FakeEmailDraftUI() {
  const [containerRef, isInView] = useInView<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "50px",
  });

  const [state, setState] = useState<AnimationState>({
    phase: "idle",
    currentDraftIndex: 0,
    actionVisible: false,
    draftVisible: false,
    draftExpanded: false,
    typedBodyLength: 0,
    autoScrollProgress: 0,
    isSending: false,
    isSent: false,
  });

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);
  const mainScrollContainerRef = useRef<HTMLDivElement>(null);

  const currentDraft = FAKE_DRAFTS[state.currentDraftIndex];
  const currentAction = currentDraft?.action;

  // Auto-scroll the main content container based on progress
  useEffect(() => {
    if (!mainScrollContainerRef.current || state.autoScrollProgress <= 0) return;

    const container = mainScrollContainerRef.current;
    const maxScroll = container.scrollHeight - container.clientHeight;
    const targetScroll = maxScroll * state.autoScrollProgress;

    container.scrollTop = targetScroll;
  }, [state.autoScrollProgress]);

  // Animation loop
  const runAnimation = useCallback(() => {
    setState((prev) => {
      const { phase, currentDraftIndex, typedBodyLength, autoScrollProgress } = prev;
      const draft = FAKE_DRAFTS[currentDraftIndex];

      switch (phase) {
        case "idle":
          // Start: show action detected
          animationTimeoutRef.current = setTimeout(() => {
            setState((s) => ({ ...s, phase: "action_detected" }));
          }, ANIMATION_CONFIG.actionDetectionDelay);
          return { ...prev, actionVisible: true };

        case "action_detected":
          // After action is shown, start generating
          animationTimeoutRef.current = setTimeout(() => {
            setState((s) => ({ ...s, phase: "generating" }));
          }, ANIMATION_CONFIG.draftGenerationDelay);
          return prev;

        case "generating":
          // After generating, reveal draft
          animationTimeoutRef.current = setTimeout(() => {
            setState((s) => ({ ...s, phase: "revealing" }));
          }, ANIMATION_CONFIG.draftGenerationDelay);
          return prev;

        case "revealing":
          // Show draft card expanded
          animationTimeoutRef.current = setTimeout(() => {
            setState((s) => ({ ...s, phase: "typing_body" }));
          }, ANIMATION_CONFIG.draftRevealDuration);
          return { ...prev, draftVisible: true, draftExpanded: true };

        case "typing_body":
          // Type out the body
          if (typedBodyLength < draft.body.length) {
            animationTimeoutRef.current = setTimeout(() => {
              setState((s) => ({
                ...s,
                typedBodyLength: Math.min(
                  s.typedBodyLength + 3,
                  draft.body.length
                ),
              }));
            }, ANIMATION_CONFIG.typingSpeed);
            return prev;
          }
          // Done typing, start auto-scroll after delay
          animationTimeoutRef.current = setTimeout(() => {
            setState((s) => ({ ...s, phase: "auto_scrolling" }));
          }, ANIMATION_CONFIG.autoScrollDelay);
          return prev;

        case "auto_scrolling":
          // Smoothly scroll to show send button
          if (autoScrollProgress < 1) {
            const scrollStep = 0.05; // 5% per step for smooth scroll
            const scrollInterval = ANIMATION_CONFIG.autoScrollDuration / (1 / scrollStep);
            animationTimeoutRef.current = setTimeout(() => {
              setState((s) => ({
                ...s,
                autoScrollProgress: Math.min(s.autoScrollProgress + scrollStep, 1),
              }));
            }, scrollInterval);
            return prev;
          }
          // Done scrolling, move to ready
          animationTimeoutRef.current = setTimeout(() => {
            setState((s) => ({ ...s, phase: "ready" }));
          }, 500);
          return prev;

        case "ready":
          // Wait then send
          animationTimeoutRef.current = setTimeout(() => {
            setState((s) => ({ ...s, phase: "sending" }));
          }, ANIMATION_CONFIG.sendDelay);
          return prev;

        case "sending":
          // Simulate sending
          animationTimeoutRef.current = setTimeout(() => {
            setState((s) => ({ ...s, phase: "sent" }));
          }, 1500);
          return { ...prev, isSending: true };

        case "sent":
          // Wait then loop
          animationTimeoutRef.current = setTimeout(() => {
            setState((s) => ({ ...s, phase: "loop_pause" }));
          }, ANIMATION_CONFIG.successDuration);
          return { ...prev, isSending: false, isSent: true };

        case "loop_pause":
          // Reset and start next draft
          animationTimeoutRef.current = setTimeout(() => {
            setState({
              phase: "idle",
              currentDraftIndex:
                (currentDraftIndex + 1) % FAKE_DRAFTS.length,
              actionVisible: false,
              draftVisible: false,
              draftExpanded: false,
              typedBodyLength: 0,
              autoScrollProgress: 0,
              isSending: false,
              isSent: false,
            });
          }, ANIMATION_CONFIG.loopPause);
          return prev;

        default:
          return prev;
      }
    });
  }, []);

  // Start animation when in view
  useEffect(() => {
    if (!isInView || hasStartedRef.current) return;
    hasStartedRef.current = true;

    const startDelay = setTimeout(() => {
      runAnimation();
    }, 500);

    return () => clearTimeout(startDelay);
  }, [isInView, runAnimation]);

  // Run animation on phase change
  useEffect(() => {
    if (!hasStartedRef.current) return;
    runAnimation();
  }, [state.phase, state.typedBodyLength, state.autoScrollProgress, runAnimation]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const isGenerating = state.phase === "generating";
  const showTypingBody = state.phase === "typing_body";

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <MacWindowFrame title="Email Drafts">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-3 border-b border-border bg-muted/30 shrink-0">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Smart Email Drafts</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                Gmail Connected
              </Badge>
            </div>
          </div>

          {/* Content - main scrollable area */}
          <div
            ref={mainScrollContainerRef}
            className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3"
          >
            {/* Action Detection */}
            {currentAction && (
              <ActionDetectionIndicator
                action={currentAction}
                isVisible={state.actionVisible}
                isProcessing={
                  state.phase === "action_detected" || isGenerating
                }
              />
            )}

            {/* Arrow indicator */}
            {state.actionVisible && (
              <div
                className={cn(
                  "flex items-center justify-center transition-all duration-300",
                  isGenerating || state.draftVisible
                    ? "opacity-100"
                    : "opacity-0"
                )}
              >
                <ArrowRight className="size-4 text-muted-foreground animate-pulse" />
              </div>
            )}

            {/* Draft Generation Indicator */}
            <DraftGeneratingIndicator isVisible={isGenerating} />

            {/* Email Draft Card */}
            {currentDraft && state.draftVisible && (
              <div
                className={cn(
                  "transition-all duration-500",
                  state.draftVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                <EmailDraftCard
                  draft={currentDraft}
                  isExpanded={state.draftExpanded}
                  showTypingBody={showTypingBody}
                  typedBodyLength={state.typedBodyLength}
                  autoScrollProgress={state.autoScrollProgress}
                  isSending={state.isSending}
                  isSent={state.isSent}
                />
              </div>
            )}

            {/* Empty state when no drafts visible */}
            {!state.draftVisible && !state.actionVisible && (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground animate-fade-in">
                <Mail className="mb-2 size-8 opacity-50" />
                <p className="text-sm">Listening for action items...</p>
                <p className="text-xs">
                  Email drafts will appear when actions are detected
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t text-xs text-muted-foreground shrink-0">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="size-3" />
                AI-powered drafts
              </span>
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle2 className="size-3" />
                Gmail Connected
              </span>
            </div>
          </div>
        </div>
      </MacWindowFrame>
    </div>
  );
}
