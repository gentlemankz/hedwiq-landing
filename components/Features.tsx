"use client";

import { useState } from "react";
import Image from "next/image";
import { FakeTranscriptionUI } from "@/components/FakeTranscriptionUI";
import { FakeNoteTakerUI, type NoteTakerMode } from "@/components/FakeNoteTakerUI";
import { FakeEmailDraftUI } from "@/components/FakeEmailDraftUI";
import { FakeAgendaUI } from "@/components/FakeAgendaUI";
import { Sparkles, CheckCircle2, ListTodo, Bot } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

// ============================================================================
// Subfeature Configuration
// ============================================================================

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

// ============================================================================
// Subfeature List Component
// ============================================================================

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

// ============================================================================
// Note Taker Feature Section (with scroll-based switcher)
// ============================================================================

function NoteTakerFeatureSection() {
  const [activeSubfeatureIndex, setActiveSubfeatureIndex] = useState(0);

  const activeSubfeature = NOTE_TAKER_SUBFEATURES[activeSubfeatureIndex];

  // Manual selection only
  const handleSelect = (index: number) => {
    setActiveSubfeatureIndex(index);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 sm:gap-6 lg:gap-8 items-center max-w-5xl mx-auto mt-12 md:mt-20 lg:mt-28">
      {/* Text Description - First on mobile/tablet */}
      <AnimatedSection delay={300} animation="slide-right" className="order-1 lg:order-2">
        <div className="flex flex-col gap-4 sm:gap-6 lg:pl-4">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
            Advanced Note Taker with
            <br />
            <span className="text-primary">Quote Transcription</span>
          </h3>

          {/* Subfeature Switcher */}
          <SubfeatureList
            subfeatures={NOTE_TAKER_SUBFEATURES}
            activeIndex={activeSubfeatureIndex}
            onSelect={handleSelect}
          />

          {/* Active subfeature description */}
          <p
            key={activeSubfeature.id}
            className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-md animate-fade-in"
          >
            {activeSubfeature.description}
          </p>
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
              alt="Team taking notes"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Note Taker UI overlaid on image */}
            <div className="absolute inset-3 sm:inset-4 md:inset-6 lg:inset-8">
              <FakeNoteTakerUI mode={activeSubfeature.mode} />
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
    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 sm:gap-6 lg:gap-8 items-center max-w-5xl mx-auto mt-12 md:mt-20 lg:mt-28">
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 sm:gap-6 lg:gap-8 items-center max-w-5xl mx-auto mt-12 md:mt-20 lg:mt-28">
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
// Main Features Component
// ============================================================================

export function Features() {
  return (
    <section id="features" className="w-full px-4 sm:px-6 md:px-12 lg:px-24 py-12 md:py-20 lg:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Feature 1: Live Transcription */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 sm:gap-6 lg:gap-8 items-center max-w-5xl mx-auto">
          {/* Text Description - First on mobile/tablet (already in correct DOM order) */}
          <AnimatedSection delay={0} animation="slide-right" className="order-1">
            <div className="flex flex-col gap-4 sm:gap-6 lg:pr-4">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                Live Transcription with
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
                <img
                  src="/PDF_file_icon.svg"
                  alt="PDF"
                  className="w-7 sm:w-9"
                />
                <img
                  src="/Google_Google_Sheets_0.svg"
                  alt="Google Sheets"
                  className="w-6 sm:w-8"
                />
                <img
                  src="/Google_Google_Docs_0.svg"
                  alt="Google Docs"
                  className="w-6 sm:w-8"
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

        {/* Feature 2: Advanced Note Taker (with subfeature switcher) */}
        <NoteTakerFeatureSection />

        {/* Feature 3: Real-Time Email Drafts */}
        <EmailDraftFeatureSection />

        {/* Feature 4: Smart Agenda */}
        <AgendaFeatureSection />
      </div>
    </section>
  );
}
