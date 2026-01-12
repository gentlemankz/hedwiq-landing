"use client";

import { useRef } from "react";
// COMMENTED OUT: useState was used by NoteTakerFeatureSection
// import { useState } from "react";
import Image from "next/image";
import { FakeTranscriptionUI } from "@/components/FakeTranscriptionUI";
// COMMENTED OUT: Note Taker feature - kept for potential future use
// import { FakeNoteTakerUI, type NoteTakerMode } from "@/components/FakeNoteTakerUI";
import { FakeMeetingAlertsUI } from "@/components/FakeMeetingAlertsUI";
import { FakeEmailDraftUI } from "@/components/FakeEmailDraftUI";
import { FakeAgendaUI } from "@/components/FakeAgendaUI";
import { Sparkles, CheckCircle2, ListTodo, Bot, Clock, UserX, RefreshCcw } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";
// COMMENTED OUT: track was used by NoteTakerFeatureSection for analytics
// import { track } from "@/lib/amplitude";

// ============================================================================
// COMMENTED OUT: Subfeature Configuration for Note Taker
// Kept for potential future use
// ============================================================================
/*
interface Subfeature {
  id: string;
  title: string;
  description: string;
  mode: NoteTakerMode;
}

const NOTE_TAKER_SUBFEATURES: Subfeature[] = [
  {
    id: "block-notes",
    title: "Block-based notes",
    description: "Take notes in real-time with a drag-and-drop editor. Organize your thoughts as the meeting unfolds.",
    mode: "notes-only",
  },
  {
    id: "quote-transcription",
    title: "Quote from transcription",
    description: "Link notes directly to what was said. Never lose the \"who said what\" context.",
    mode: "notes-with-quotes",
  },
];
*/

// ============================================================================
// COMMENTED OUT: Subfeature List Component for Note Taker
// Kept for potential future use
// ============================================================================
/*
function SubfeatureList({
  subfeatures,
  activeIndex,
  onSelect,
}: {
  subfeatures: Subfeature[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:gap-1">
      {subfeatures.map((subfeature, index) => (
        <button
          key={subfeature.id}
          onClick={() => onSelect(index)}
          className={cn(
            "text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-all duration-300",
            "border-l-2",
            index === activeIndex
              ? "border-l-primary bg-primary/5 text-foreground"
              : "border-l-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          <span className="text-xs sm:text-sm md:text-base font-medium">
            {subfeature.title}
          </span>
        </button>
      ))}
    </div>
  );
}
*/

// ============================================================================
// COMMENTED OUT: Note Taker Feature Section (with scroll-based switcher)
// Kept for potential future use
// ============================================================================
/*
function NoteTakerFeatureSection() {
  const [activeSubfeatureIndex, setActiveSubfeatureIndex] = useState(0);

  const activeSubfeature = NOTE_TAKER_SUBFEATURES[activeSubfeatureIndex];

  // Manual selection with tracking
  const handleSelect = (index: number) => {
    if (index !== activeSubfeatureIndex) {
      const subfeature = NOTE_TAKER_SUBFEATURES[index];
      track({
        name: 'Feature Subfeature Selected',
        properties: {
          feature_name: 'Advanced Note Taker',
          subfeature_title: subfeature.title,
          subfeature_index: index
        }
      });
    }
    setActiveSubfeatureIndex(index);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 sm:gap-6 lg:gap-8 items-center max-w-5xl mx-auto">
      <AnimatedSection delay={300} animation="slide-right" className="order-1 lg:order-2">
        <div className="flex flex-col gap-4 sm:gap-6 lg:pl-4">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
            Advanced Note Taker with
            <br />
            <span className="text-primary">Quote Transcription</span>
          </h3>

          <SubfeatureList
            subfeatures={NOTE_TAKER_SUBFEATURES}
            activeIndex={activeSubfeatureIndex}
            onSelect={handleSelect}
          />

          <p
            key={activeSubfeature.id}
            className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-md animate-fade-in"
          >
            {activeSubfeature.description}
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={400} animation="slide-left" className="order-2 lg:order-1">
        <div className="relative">
          <div className="hidden sm:block absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="hidden sm:block absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-full aspect-[4/5] sm:aspect-[4/4] overflow-hidden rounded-md shadow-2xl">
            <Image
              src="/art2.jpg"
              alt="Team taking notes"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            <div className="absolute inset-3 sm:inset-4 md:inset-6 lg:inset-8">
              <FakeNoteTakerUI mode={activeSubfeature.mode} />
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
*/

// ============================================================================
// Alert Detection Feature Section (Smart Meeting Reviewer)
// ============================================================================

function AlertDetectionFeatureSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 sm:gap-6 lg:gap-8 items-center max-w-5xl mx-auto">
      {/* Text Description - First on mobile/tablet */}
      <AnimatedSection delay={300} animation="slide-right" className="order-1 lg:order-2">
        <div className="flex flex-col gap-4 sm:gap-6 lg:pl-4">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
            Smart Meeting
            <br />
            <span className="text-primary">Reviewer</span>
          </h3>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
            Luframe monitors your meeting and surfaces issues before they become problems. Get notified about stalled discussions, unassigned actions, and looping topics.
          </p>

          {/* Divider */}
          <div className="w-full max-w-md h-px bg-border" />

          {/* Alert highlights */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Decision Detection */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-white/10 border border-border shadow-sm">
                <Clock className="size-4 sm:size-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium">Decision Detection</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Alerts when no decisions made for extended periods
                </p>
              </div>
            </div>

            {/* Owner Assignment */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-white/10 border border-border shadow-sm">
                <UserX className="size-4 sm:size-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium">Owner Assignment</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Catches action items without assignees
                </p>
              </div>
            </div>

            {/* Topic Loop Detection */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-white/10 border border-border shadow-sm">
                <RefreshCcw className="size-4 sm:size-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium">Topic Loop Detection</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Identifies circular discussions without resolution
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* UI Component - Second on mobile/tablet */}
      <AnimatedSection delay={400} animation="slide-left" className="order-2 lg:order-1">
        <div className="relative">
          {/* Decorative blur elements - hidden on mobile for performance */}
          <div className="hidden sm:block absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="hidden sm:block absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          {/* Main container with background image */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[4/4] overflow-hidden rounded-md shadow-2xl">
            {/* Background Image */}
            <Image
              src="/art2.jpg"
              alt="Team meeting intelligence"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Meeting Alerts UI overlaid on image */}
            <div className="absolute inset-3 sm:inset-4 md:inset-6 lg:inset-8">
              <FakeMeetingAlertsUI />
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

// ============================================================================
// Email Draft Feature Section
// ============================================================================

function EmailDraftFeatureSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 sm:gap-6 lg:gap-8 items-center max-w-5xl mx-auto">
      {/* Text Description - Always first on mobile/tablet */}
      <AnimatedSection delay={300} animation="slide-right" className="order-1">
        <div className="flex flex-col gap-4 sm:gap-6 lg:pr-4">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
            Real-Time Actions to
            <br />
            <span className="text-primary">Follow-Up Emails</span>
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
            Luframe detects action items during your meeting and instantly generates professional email drafts. Review, edit, and send in one click.
          </p>

          {/* Divider */}
          <div className="w-full max-w-md h-px bg-border" />

          {/* Feature highlights */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* AI-Powered Drafts */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-white/10 border border-border shadow-sm">
                <Sparkles className="size-4 sm:size-5 text-violet-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium">AI-Powered Drafts</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Context-aware emails from meeting discussions
                </p>
              </div>
            </div>

            {/* Gmail Integration */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-white/10 border border-border shadow-sm">
                <Image
                  src="/Gmail_icon_(2020).svg"
                  alt="Gmail"
                  width={24}
                  height={24}
                  className="size-5 sm:size-6"
                />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium">Gmail Integration</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Send directly from your connected account
                </p>
              </div>
            </div>

            {/* Review Before Sending */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-white/10 border border-border shadow-sm">
                <CheckCircle2 className="size-4 sm:size-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium">Review Before Sending</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Edit subject, body, and recipients
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* UI Component - Second on mobile/tablet */}
      <AnimatedSection delay={400} animation="slide-left" className="order-2">
        <div className="relative">
          {/* Decorative blur elements - hidden on mobile for performance */}
          <div className="hidden sm:block absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="hidden sm:block absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          {/* Main container with background image */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[4/4] overflow-hidden rounded-md shadow-2xl">
            {/* Background Image */}
            <Image
              src="/art3.jpg"
              alt="Team collaboration"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Email Draft UI overlaid on image */}
            <div className="absolute inset-3 sm:inset-4 md:inset-6 lg:inset-8">
              <FakeEmailDraftUI />
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

// ============================================================================
// Agenda Feature Section
// ============================================================================

function AgendaFeatureSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 sm:gap-6 lg:gap-8 items-center max-w-5xl mx-auto">
      {/* Text Description - First on mobile/tablet */}
      <AnimatedSection delay={300} animation="slide-right" className="order-1 lg:order-2">
        <div className="flex flex-col gap-4 sm:gap-6 lg:pl-4">
          {/* Quote */}
          <blockquote className="text-base sm:text-lg md:text-xl font-medium text-muted-foreground italic border-l-4 border-primary pl-3 sm:pl-4">
            &ldquo;No agenda, no meeting&rdquo;
          </blockquote>

          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
            Smart Agenda that
            <br />
            <span className="text-primary">Runs Itself</span>
          </h3>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
            Build your agenda before the meeting. Our AI listens to the conversation and automatically transitions between topics.
          </p>

          {/* Divider */}
          <div className="w-full max-w-md h-px bg-border" />

          {/* Feature highlights */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Agenda Builder */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-white/10 border border-border shadow-sm">
                <ListTodo className="size-4 sm:size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium">Drag & Drop Builder</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Create structured agendas with time estimates
                </p>
              </div>
            </div>

            {/* AI Context Understanding */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-white/10 border border-border shadow-sm">
                <Bot className="size-4 sm:size-5 text-violet-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium">AI Context Awareness</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Detects topic shifts and advances automatically
                </p>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-white/10 border border-border shadow-sm">
                <CheckCircle2 className="size-4 sm:size-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium">Real-Time Progress</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Track completion and time remaining at a glance
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* UI Component - Second on mobile/tablet */}
      <AnimatedSection delay={400} animation="slide-left" className="order-2 lg:order-1">
        <div className="relative">
          {/* Decorative blur elements - hidden on mobile for performance */}
          <div className="hidden sm:block absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="hidden sm:block absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          {/* Main container with background image */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[4/4] overflow-hidden rounded-md shadow-2xl">
            {/* Background Image */}
            <Image
              src="/art4.jpg"
              alt="Team meeting"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Agenda UI overlaid on image */}
            <div className="absolute inset-3 sm:inset-4 md:inset-6 lg:inset-8">
              <FakeAgendaUI />
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

// ============================================================================
// Live Title with animated dot on "i"
// ============================================================================

interface LiveTitleProps {
  dotRef: React.RefObject<HTMLSpanElement | null>;
  showDot: boolean;
}

function LiveTitle({ dotRef, showDot }: LiveTitleProps) {
  return (
    <span className="relative inline-block">
      {/* The "L" */}
      <span>L</span>
      {/* The "i" without dot - using positioning for the dot */}
      <span className="relative inline-block">
        {/* Dotless i character or styled i */}
        <span className="relative">
          ı
          {/* The dot placeholder - positioned above the i */}
          <span
            ref={dotRef}
            data-live-dot="true"
            className={cn(
              "absolute left-1/2 -translate-x-1/2 rounded-full bg-foreground",
              "transition-all duration-500 ease-out",
              showDot ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )}
            style={{
              width: '0.18em',
              height: '0.18em',
              top: '-0.05em',
            }}
          />
        </span>
      </span>
      {/* The "ve" */}
      <span>ve</span>
    </span>
  );
}

// ============================================================================
// Main Features Component
// ============================================================================

interface FeaturesProps {
  showLiveDot?: boolean;
}

export function Features({ showLiveDot = false }: FeaturesProps) {
  const liveDotRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Dot visibility is controlled entirely by parent (ChaosToOrderTransition)
  // The dot only appears when the traveling circle reaches the "i"
  const isDotVisible = showLiveDot;

  return (
    <section
      ref={sectionRef}
      id="features"
      className="w-full py-12 md:py-20 lg:py-24 scroll-mt-20"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Feature 1: Live Transcription */}
        <div className="pb-12 md:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 sm:gap-6 lg:gap-8 items-center max-w-5xl mx-auto">
          {/* Text Description - First on mobile/tablet (already in correct DOM order) */}
          <AnimatedSection delay={0} animation="slide-right" className="order-1">
            <div className="flex flex-col gap-4 sm:gap-6 lg:pr-4">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                <LiveTitle dotRef={liveDotRef} showDot={isDotVisible} /> Transcription with
                <br />
                <span className="text-primary">Intelligent Insights</span>
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                Luframe captures every word and automatically tags problems, ideas, decisions, and action items in real-time.
              </p>

              {/* Divider */}
              <div className="w-full max-w-md h-px bg-border" />

              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                Transcriptions reference your documents directly, highlighting the exact information connected to each part of the conversation.
              </p>
              {/* Supported document types */}
              <div className="flex items-center gap-3 sm:gap-4">
                <Image
                  src="/PDF_file_icon.svg"
                  alt="PDF"
                  width={36}
                  height={36}
                  className="w-7 sm:w-9 h-auto"
                />
                <Image
                  src="/Google_Google_Sheets_0.svg"
                  alt="Google Sheets"
                  width={32}
                  height={32}
                  className="w-6 sm:w-8 h-auto"
                />
                <Image
                  src="/Google_Google_Docs_0.svg"
                  alt="Google Docs"
                  width={32}
                  height={32}
                  className="w-6 sm:w-8 h-auto"
                />
              </div>
            </div>
          </AnimatedSection>

          {/* UI Component - Second on mobile/tablet */}
          <AnimatedSection delay={100} animation="slide-left" className="order-2">
            <div className="relative">
              {/* Decorative blur elements - hidden on mobile for performance */}
              <div className="hidden sm:block absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="hidden sm:block absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              {/* Main container with background image */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[4/4] overflow-hidden rounded-md shadow-2xl">
                {/* Background Image */}
                <Image
                  src="/art1.jpg"
                  alt="Team collaboration"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Transcription UI overlaid on image */}
                <div className="absolute inset-3 sm:inset-4 md:inset-6 lg:inset-8">
                  <FakeTranscriptionUI />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
        </div>

        {/* Feature 2: Smart Meeting Reviewer */}
        {/* COMMENTED OUT: Previously Note Taker - <NoteTakerFeatureSection /> */}
        <div className="border-t border-border pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20">
          <AlertDetectionFeatureSection />
        </div>

        {/* Feature 3: Real-Time Email Drafts */}
        <div className="border-t border-border pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20">
          <EmailDraftFeatureSection />
        </div>

        {/* Feature 4: Smart Agenda */}
        <div className="border-t border-border pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20">
          <AgendaFeatureSection />
        </div>
      </div>
    </section>
  );
}
