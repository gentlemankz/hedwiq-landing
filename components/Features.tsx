"use client";

import Image from "next/image";
import { FakeTranscriptionUI } from "@/components/FakeTranscriptionUI";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

export function Features() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-24 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12 md:mb-16">
          <AnimatedSection delay={0}>
            <Badge variant="secondary" className="w-fit gap-2 py-1 px-3">
              <Sparkles className="size-4" />
              Features
            </Badge>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
              Turn conversations into action
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Hedwiq listens, understands, and surfaces what matters most in real-time
            </p>
          </AnimatedSection>
        </div>

        {/* Feature Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 lg:gap-8 items-center max-w-5xl mx-auto">
          {/* Left Side - Description */}
          <AnimatedSection delay={300} animation="slide-right">
            <div className="flex flex-col gap-6 lg:pr-4">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
                Live Transcription with
                <br />
                <span className="text-primary">Intelligent Insights</span>
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                Hedwiq captures every word and automatically tags problems, ideas, decisions, and action items in real-time.
              </p>

              {/* Divider */}
              <div className="w-full max-w-md h-px bg-border" />

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                Transcriptions reference your documents directly, highlighting the exact information connected to each part of the conversation.
              </p>
              {/* Supported document types */}
              <div className="flex items-center gap-4">
                <Image
                  src="/PDF_file_icon.svg"
                  alt="PDF"
                  width={36}
                  height={37}
                />
                <Image
                  src="/Google_Google_Sheets_0.svg"
                  alt="Google Sheets"
                  width={32}
                  height={32}
                />
                <Image
                  src="/Google_Google_Docs_0.svg"
                  alt="Google Docs"
                  width={32}
                  height={32}
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Right Side - Transcription UI overlaid on image */}
          <AnimatedSection delay={400} animation="slide-left">
            <div className="relative">
              {/* Decorative blur elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              {/* Main container with background image */}
              <div className="relative w-full aspect-[4/4] overflow-hidden rounded-md shadow-2xl">
                {/* Background Image */}
                <Image
                  src="/art1.jpg"
                  alt="Team collaboration"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Transcription UI overlaid on image */}
                <div className="absolute inset-4 sm:inset-6 md:inset-8">
                  <FakeTranscriptionUI />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
