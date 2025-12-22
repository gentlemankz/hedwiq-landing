"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FileText,
  GripVertical,
  Quote,
  Plus,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  PhoneOff,
  ChevronUp,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export type NoteTakerMode = "notes-only" | "notes-with-quotes";

interface FakeNoteItem {
  id: string;
  type: "text" | "quote";
  content?: string;
  speaker?: string;
  avatar?: string;
  initials?: string;
  quote?: string;
}

// ============================================================================
// Fake Data
// ============================================================================

const FAKE_PARTICIPANTS = [
  { id: "1", name: "Alex", initials: "A", avatar: "/blue_avatar.webp", isMuted: false },
  { id: "2", name: "Jordan", initials: "J", avatar: "/orange_avatar.webp", isMuted: true },
];

// Mode 1: Clean notes only
const NOTES_ONLY_DATA: FakeNoteItem[] = [
  { id: "1", type: "text", content: "Key decision: Shift 30% of Q1 budget to short-form video" },
  { id: "2", type: "text", content: "Action: Prepare Instagram A/B test proposals by Friday" },
];

// Mode 2: Notes mixed with quote references
const NOTES_WITH_QUOTES_DATA: FakeNoteItem[] = [
  { id: "1", type: "text", content: "Key decision: Shift 30% of Q1 budget to short-form video" },
  {
    id: "q1",
    type: "quote",
    speaker: "Jordan",
    avatar: "/orange_avatar.webp",
    initials: "J",
    quote: "The 25-34 demographic responds best to short-form video under 60 seconds.",
    content: "Prioritize Reels & TikTok for this segment",
  },
  { id: "2", type: "text", content: "Action: Prepare Instagram A/B test proposals by Friday" },
];

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
      <div className="flex items-center h-7 px-2 bg-muted/50 border-b border-border shrink-0">
        <div className="flex items-center gap-1">
          <div className="size-[6px] rounded-full bg-[#ff5f57]" />
          <div className="size-[6px] rounded-full bg-[#febc2e]" />
          <div className="size-[6px] rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[9px] text-muted-foreground font-medium">
            {title}
          </span>
        </div>
        <div className="w-8" />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

// Mini Participant Tile
function MiniParticipantTile({
  participant,
}: {
  participant: (typeof FAKE_PARTICIPANTS)[0];
}) {
  return (
    <div className="relative aspect-video rounded bg-muted flex items-center justify-center overflow-hidden border border-border/50">
      <Avatar className="size-5 border border-border">
        <AvatarImage src={participant.avatar} alt={participant.name} />
        <AvatarFallback className="bg-primary text-primary-foreground text-[6px] font-medium">
          {participant.initials}
        </AvatarFallback>
      </Avatar>
      {/* Name overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-1 py-0.5">
        <div className="flex items-center gap-0.5">
          {participant.isMuted && <MicOff className="size-2 text-red-400" />}
          <span className="text-white text-[6px] font-medium truncate">
            {participant.name}
          </span>
        </div>
      </div>
    </div>
  );
}

// Mini Control Bar
function MiniControlBar() {
  return (
    <div className="flex items-center justify-center gap-1 py-1 bg-background/95 backdrop-blur border-t border-border">
      <Button variant="secondary" size="icon" className="size-5 rounded-full">
        <Mic className="size-2.5" />
      </Button>
      <Button variant="destructive" size="icon" className="size-5 rounded-full">
        <VideoOff className="size-2.5" />
      </Button>
      <Button variant="secondary" size="icon" className="size-5 rounded-full">
        <Monitor className="size-2.5" />
      </Button>
      <div className="mx-0.5 h-3 w-px bg-border" />
      <Button variant="destructive" size="icon" className="size-5 rounded-full">
        <PhoneOff className="size-2.5" />
      </Button>
    </div>
  );
}

// Text Note Block
function TextNoteBlock({ content }: { content: string }) {
  return (
    <div className="group relative flex gap-1.5">
      <div className="flex items-start pt-1 opacity-30">
        <GripVertical className="size-2.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="p-1.5 rounded text-[10px] leading-relaxed bg-transparent hover:bg-muted/30 transition-colors">
          {content}
        </div>
      </div>
    </div>
  );
}

// Quote Note Block
function QuoteNoteBlock({ item }: { item: FakeNoteItem }) {
  return (
    <div className="group relative flex gap-1.5">
      <div className="flex items-start pt-1.5 opacity-30">
        <GripVertical className="size-2.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0 rounded border bg-card p-1.5 space-y-1">
        {/* Quote */}
        <div className="flex gap-1 p-1 rounded bg-muted/40">
          <Quote className="size-2 text-muted-foreground/60 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <Avatar className="size-2.5">
                <AvatarImage src={item.avatar} alt={item.speaker} />
                <AvatarFallback className="text-[4px]">{item.initials}</AvatarFallback>
              </Avatar>
              <span className="text-[7px] font-medium text-muted-foreground">{item.speaker}</span>
            </div>
            <p className="text-[8px] text-muted-foreground/80 italic leading-tight line-clamp-1">
              &ldquo;{item.quote}&rdquo;
            </p>
          </div>
        </div>
        {/* User note */}
        <p className="text-[9px] text-foreground leading-tight">{item.content}</p>
      </div>
    </div>
  );
}

// Notes Panel with Grabber
function NotesPanel({ data }: { data: FakeNoteItem[] }) {
  return (
    <div className="flex-1 flex flex-col bg-background/95 backdrop-blur-sm border-t border-border min-h-0">
      {/* Grabber Handle */}
      <div className="flex items-center justify-center h-4 cursor-pointer group hover:bg-muted/50 transition-colors shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 rounded-full bg-muted-foreground/30 group-hover:bg-muted-foreground/50" />
          <span className="text-[7px] text-muted-foreground/60 group-hover:text-muted-foreground transition-colors flex items-center gap-0.5">
            <ChevronUp className="size-2" />
            Notes
          </span>
        </div>
      </div>

      {/* Notes Content */}
      <div className="flex-1 flex flex-col min-h-0 px-2 pb-1.5">
        <div className="flex items-center justify-between mb-1 shrink-0">
          <div className="flex items-center gap-1">
            <FileText className="size-2.5 text-muted-foreground" />
            <span className="text-[8px] font-medium">Meeting Notes</span>
          </div>
          <span className="text-[7px] text-muted-foreground">{data.length} items</span>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto min-h-0">
          {data.map((item) => {
            if (item.type === "text") {
              return <TextNoteBlock key={item.id} content={item.content || ""} />;
            } else {
              return <QuoteNoteBlock key={item.id} item={item} />;
            }
          })}

          {/* Add note hint */}
          <div className="flex items-center justify-center pt-0.5 opacity-50">
            <div className="flex items-center gap-0.5 px-1 py-0.5 rounded border border-dashed border-border text-[7px] text-muted-foreground">
              <Plus className="size-2" />
              Add
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

interface FakeNoteTakerUIProps {
  mode?: NoteTakerMode;
}

export function FakeNoteTakerUI({ mode = "notes-only" }: FakeNoteTakerUIProps) {
  const data = mode === "notes-only" ? NOTES_ONLY_DATA : NOTES_WITH_QUOTES_DATA;

  return (
    <div className="relative w-full h-full">
      <MacWindowFrame title="Hedwiq — Marketing Strategy Meeting">
        <div className="flex flex-col h-full bg-background">
          {/* Main content area - participants + controls (constrained height) */}
          <div className="flex flex-col shrink-0 h-[40%]">
            {/* Participant Grid */}
            <div className="flex-1 p-2 min-h-0">
              <div className="grid grid-cols-2 gap-1.5 h-full max-w-[85%] mx-auto">
                {FAKE_PARTICIPANTS.map((participant) => (
                  <MiniParticipantTile key={participant.id} participant={participant} />
                ))}
              </div>
            </div>

            {/* Control Bar */}
            <MiniControlBar />
          </div>

          {/* Notes Panel at bottom */}
          <NotesPanel data={data} />
        </div>
      </MacWindowFrame>
    </div>
  );
}
