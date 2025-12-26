"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";
import { Check, Sparkles } from "lucide-react";

// ============================================================================
// Pricing Data
// ============================================================================

interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  originalAnnualPrice?: number;
  priceNote?: string;
  popular?: boolean;
  features: string[];
  cta: string;
  ctaHref: string;
  ctaVariant?: "default" | "outline";
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: "Free",
    description: "Experience real-time AI meeting intelligence",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      "300 minutes/month",
      "Live transcription",
      "AI Insights",
      "Advanced Notes",
      "7-day meeting history",
    ],
    cta: "Get Started",
    ctaHref: "/signup?plan=free",
    ctaVariant: "outline",
  },
  {
    name: "Pro",
    description: "For professionals who need more",
    monthlyPrice: 16,
    annualPrice: 8,
    originalAnnualPrice: 10,
    features: [
      "3000 minutes/month",
      "AI Insights and Actions",
      "Agenda Tracking",
      "Advanced Notes",
      "Cloud recordings",
      "10 GB cloud storage",
      "30-day retention",
      "300 Email Drafts",
    ],
    cta: "Upgrade to Pro",
    ctaHref: "/signup?plan=pro",
    ctaVariant: "outline",
  },
  {
    name: "Business",
    description: "Perfect for growing teams",
    monthlyPrice: 30,
    annualPrice: 19.99,
    popular: true,
    features: [
      "Unlimited meetings",
      "Everything in Pro",
      "1500 Email Drafts",
      "20 GB storage/user",
      "90-day retention",
    ],
    cta: "Upgrade to Business",
    ctaHref: "/signup?plan=business",
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    monthlyPrice: null,
    annualPrice: null,
    features: [
      "Unlimited meetings",
      "Custom seats",
      "Everything in Team",
      "SSO & compliance",
      "24/7 dedicated support",
      "Custom contracts",
    ],
    cta: "Contact Sales",
    ctaHref: "/contact",
    ctaVariant: "outline",
  },
];

// ============================================================================
// Pricing Card Component
// ============================================================================

function PricingCard({
  tier,
  isAnnual,
}: {
  tier: PricingTier;
  isAnnual: boolean;
}) {
  const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
  const savings =
    tier.monthlyPrice && tier.annualPrice
      ? Math.round(
          ((tier.monthlyPrice - tier.annualPrice) / tier.monthlyPrice) * 100
        )
      : 0;

  return (
    <div
      className={cn(
        "relative flex flex-col p-6 rounded-2xl border bg-card",
        tier.popular
          ? "border-primary shadow-lg ring-1 ring-primary"
          : "border-border"
      )}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
      </div>

      <div className="mb-6">
        {price !== null ? (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-foreground">
              ${Math.floor(price)}
              {price % 1 !== 0 && (
                <span className="text-lg align-super">.{String(price).split('.')[1]}</span>
              )}
              {isAnnual && tier.originalAnnualPrice && (
                <span className="text-sm text-muted-foreground line-through align-super ml-0.5">
                  ${tier.originalAnnualPrice}
                </span>
              )}
            </span>
            <span className="text-muted-foreground">/user/mo</span>
          </div>
        ) : (
          <div className="text-4xl font-bold text-foreground">Custom</div>
        )}
        {isAnnual && savings > 0 && (
          <p className="text-sm text-primary mt-1">
            Save {savings}% with annual
          </p>
        )}
        {tier.priceNote && (
          <p className="text-sm text-muted-foreground mt-1">{tier.priceNote}</p>
        )}
      </div>

      <ul className="flex-1 space-y-3 mb-6">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="size-4 text-primary mt-0.5 shrink-0" />
            <span className="text-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={tier.ctaVariant || "default"}
        className={cn(
          "w-full rounded-full",
          tier.popular && "bg-blue-600 hover:bg-blue-700 text-white"
        )}
        size="lg"
        asChild
      >
        <Link href={tier.ctaHref}>{tier.cta}</Link>
      </Button>
    </div>
  );
}

// ============================================================================
// Billing Toggle Component
// ============================================================================

function BillingToggle({
  isAnnual,
  onChange,
}: {
  isAnnual: boolean;
  onChange: (value: boolean) => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(!isAnnual);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <span
        id="billing-monthly-label"
        className={cn(
          "text-sm font-medium transition-colors cursor-pointer",
          !isAnnual ? "text-foreground" : "text-muted-foreground"
        )}
        onClick={() => onChange(false)}
      >
        Monthly
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isAnnual}
        aria-labelledby="billing-toggle-label"
        onClick={() => onChange(!isAnnual)}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative w-14 h-7 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isAnnual ? "bg-primary" : "bg-muted"
        )}
      >
        <span className="sr-only">
          {isAnnual ? "Switch to monthly billing" : "Switch to annual billing"}
        </span>
        <div
          className={cn(
            "absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
            isAnnual ? "translate-x-8" : "translate-x-1"
          )}
          aria-hidden="true"
        />
      </button>
      <span
        id="billing-annual-label"
        className={cn(
          "text-sm font-medium transition-colors cursor-pointer",
          isAnnual ? "text-foreground" : "text-muted-foreground"
        )}
        onClick={() => onChange(true)}
      >
        Annual
      </span>
      <Badge variant="secondary" className="ml-1">
        Save up to 25%
      </Badge>
    </div>
  );
}

// ============================================================================
// Main Pricing Component
// ============================================================================

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section
      id="pricing"
      className="w-full px-6 md:px-12 lg:px-24 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <AnimatedSection delay={0}>
            <Badge variant="secondary" className="w-fit gap-2 py-1 px-3">
              <Sparkles className="size-4" />
              Pricing
            </Badge>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
              Simple, transparent pricing
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Start free, upgrade when you need more. No hidden fees, no
              surprises.
            </p>
          </AnimatedSection>
        </div>

        {/* Billing Toggle */}
        <AnimatedSection delay={250}>
          <div className="mb-10">
            <BillingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
          </div>
        </AnimatedSection>

        {/* Pricing Cards */}
        <AnimatedSection delay={300}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_TIERS.map((tier) => (
              <PricingCard key={tier.name} tier={tier} isAnnual={isAnnual} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
