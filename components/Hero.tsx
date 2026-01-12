"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { FakeMeetingRoom } from "@/components/FakeMeetingRoom";
import { RiskReversal } from "@/components/RiskReversal";
import { TrustedBy } from "@/components/TrustedBy";
import { AnimatedSection } from "@/components/AnimatedSection";
import { WaitlistButton } from "@/components/WaitlistButton";

export function Hero() {
  return (
    <>
      <section className="w-full py-16 md:py-10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col gap-12 lg:gap-16">
            {/* Text content - Centered */}
            <div className="flex flex-col items-center text-center gap-8">
              <div className="flex flex-col items-center gap-6">
                <AnimatedSection delay={0}>
                  <Badge variant="secondary" className="w-fit gap-2 py-1 px-3">
                    <Image
                      src="/Microsoft_logo.svg"
                      alt="Microsoft"
                      width={16}
                      height={16}
                    />
                    Backed by Microsoft for Startups
                  </Badge>
                </AnimatedSection>
                <AnimatedSection delay={100}>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
                    From post-meeting chaos
                    <br />
                    to{" "}
                    <span className="relative inline-block">
                      <span className="relative z-10 text-blue-600">real-time execution</span>
                      {/* Dotted border decoration */}
                      <span className="absolute left-0.5 sm:left-1 right-0 top-0.5 sm:top-1 bottom-0 sm:bottom-[0.5px] border border-dashed border-gray-300 -mx-1 sm:-mx-1.5 md:-mx-2" />
                      {/* Corner circles */}
                      <span className="absolute -top-0.5 sm:top-0 -left-1 sm:-left-1.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-black rounded-full" />
                      <span className="absolute -top-0.5 sm:top-0 -right-1.5 sm:-right-2 md:-right-2.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-black rounded-full" />
                      <span className="absolute -bottom-0.5 sm:bottom-0 -left-1 sm:-left-1.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-black rounded-full" />
                      <span className="absolute -bottom-0.5 sm:bottom-0 -right-1.5 sm:-right-2 md:-right-2.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-black rounded-full" />
                    </span>
                  </h1>
                </AnimatedSection>
                <AnimatedSection delay={200}>
                  <p className="text-base md:text-lg text-foreground leading-relaxed max-w-xl">
                    An ROI-driven meeting platform for outcome-focused teams seeking maximum impact per hour
                  </p>
                </AnimatedSection>
              </div>

              {/* CTA Button */}
              <AnimatedSection delay={300}>
                <WaitlistButton
                  shimmer
                  shimmerClassName="h-10 px-8 text-sm font-medium"
                  location="hero"
                  ctaType="join_waitlist"
                >
                  Get Private Access
                </WaitlistButton>
              </AnimatedSection>

              {/* Risk Reversal */}
              <AnimatedSection delay={400}>
                <RiskReversal />
              </AnimatedSection>
            </div>

            {/* Meeting Room Interface - Below content */}
            <AnimatedSection delay={500}>
              <div className="relative w-full">
                <div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px] w-full">
                  <FakeMeetingRoom />
                </div>

                {/* Decorative blur elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Trusted By - After the meeting room */}
      <div className="mt-8 md:mt-12">
        <TrustedBy />
      </div>
    </>
  );
}
