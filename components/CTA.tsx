"use client";

import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";

// ============================================================================
// App URL Configuration
// ============================================================================

function getAppUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl;

  if (process.env.NODE_ENV === "production") {
    return "https://app.luframe.com";
  }
  return "http://localhost:3000";
}

const APP_URL = getAppUrl();

export function CTA() {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <AnimatedSection delay={0}>
          <div className="relative overflow-hidden border border-border bg-muted/30">
            {/* Content */}
            <div className="flex flex-col items-center text-center gap-6 md:gap-8 px-6 md:px-12 py-16 md:py-24">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight max-w-2xl">
                Ready to eliminate post-meeting busywork?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Join teams who are already turning conversations into action in real-time.
              </p>
              <Button
                size="lg"
                className="rounded-full px-10 py-6 text-lg bg-blue-600 text-white hover:bg-blue-700"
                asChild
              >
                <a href={`${APP_URL}/sign-up`}>Get Started</a>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
