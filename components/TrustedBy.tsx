"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

const trustedCompanies = [
  { name: "Amplitude", logo: "/Amplitude_logo.svg", width: 160, height: 32, isWordmark: true },
  { name: "GitHub", logo: "/github-svgrepo-com.svg", width: 40, height: 40, isWordmark: false },
  { name: "OpenAI", logo: "/openai-svgrepo-com.svg", width: 36, height: 36, isWordmark: false },
  { name: "Supabase", logo: "/supabase-logo-wordmark--light.svg", width: 160, height: 32, isWordmark: true },
];

export function TrustedBy() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-24 pb-12 md:pb-16">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection delay={0}>
          <div className="relative flex flex-col items-center gap-6 pb-8 border-b border-border">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              Trusted by teams at
            </p>
            <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
              {trustedCompanies.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                >
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={company.width}
                    height={company.height}
                  />
                  {!company.isWordmark && (
                    <span className="text-muted-foreground text-sm font-medium">
                      {company.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background px-2">
              <ChevronDown className="w-6 h-6 text-muted-foreground animate-bounce" />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
