"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

const trustedCompanies = [
  { name: "Amplitude", logo: "/Amplitude_logo.svg", width: 120, height: 28, isWordmark: true },
  { name: "GitHub", logo: "/github-svgrepo-com.svg", width: 32, height: 32, isWordmark: false },
  { name: "OpenAI", logo: "/openai-svgrepo-com.svg", width: 28, height: 28, isWordmark: false },
  { name: "Supabase", logo: "/supabase-logo-wordmark--light.svg", width: 120, height: 28, isWordmark: true },
];

export function TrustedBy() {
  return (
    <section className="w-full pb-12 md:pb-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <AnimatedSection delay={0}>
          <div className="relative flex flex-col items-center">
            {/* Top horizontal line */}
            <div className="w-full border-t border-border" />

            {/* Title */}
            <p className="text-sm text-muted-foreground italic py-8">
              Trusted by teams building real products
            </p>

            {/* Logo grid with line dividers */}
            <div className="w-full border-t border-b border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
                {trustedCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-2 py-6 md:py-8 px-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  >
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={company.width}
                      height={company.height}
                    />
                    {!company.isWordmark && (
                      <span className="text-muted-foreground text-xs md:text-sm font-medium">
                        {company.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chevron down indicator */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background px-2">
              <ChevronDown className="w-6 h-6 text-muted-foreground animate-bounce" />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
