"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { track } from "@/lib/amplitude";

// ============================================================================
// FAQ Data
// ============================================================================

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "security",
    question: "How secure is my data with Luframe?",
    answer:
      "Your data is fully encrypted both in transit and at rest, ensuring no unauthorized entity can access it. You maintain complete control and can delete your data at any time. Additionally, your meeting data is never used for training AI models - your conversations remain private and confidential.",
  },
  {
    id: "why-switch",
    question: "Why should I switch from Zoom, Google Meet, Otter, or Notion?",
    answer:
      "Unlike traditional tools that work in isolation, Luframe combines real-time transcription, AI-powered insights, automatic action items, and meeting notes into one seamless platform. Instead of juggling between Zoom for calls, Otter for transcription, and Notion for notes, Luframe delivers everything in real-time during your meeting - turning discussions into immediate action, not post-meeting work.",
  },
  {
    id: "difficulty",
    question: "How difficult is it to use the platform?",
    answer:
      "Luframe is designed to be incredibly intuitive. Our short demo video covers everything you need to know to get started. Most users are productive within minutes of their first meeting.",
  },
  {
    id: "teams",
    question: "Do you support team-based solutions?",
    answer:
      "Yes! Luframe offers comprehensive team workspace features. You can create teams, easily invite members with role-based permissions, share meeting access, and collaborate on notes and action items. Teams can organize meetings into folders and maintain shared context across all their collaborative sessions.",
  },
];

// ============================================================================
// FAQ Structured Data (JSON-LD)
// ============================================================================

function FAQStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ============================================================================
// FAQ Component
// ============================================================================

export function FAQ() {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  const handleValueChange = (value: string) => {
    // Find the FAQ item by ID
    const item = FAQ_ITEMS.find((faq) => faq.id === value);

    if (value && item) {
      // Item is being expanded
      track({
        name: 'FAQ Item Expanded',
        properties: {
          question_id: item.id,
          question_text: item.question
        }
      });
    } else if (openItem) {
      // Item is being collapsed
      const previousItem = FAQ_ITEMS.find((faq) => faq.id === openItem);
      if (previousItem) {
        track({
          name: 'FAQ Item Collapsed',
          properties: {
            question_id: previousItem.id,
            question_text: previousItem.question
          }
        });
      }
    }

    setOpenItem(value || undefined);
  };

  return (
    <section id="faq" className="w-full py-16 md:py-24 bg-muted/30 scroll-mt-20">
      <FAQStructuredData />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12 md:mb-16">
          <AnimatedSection delay={0}>
            <Badge variant="secondary" className="w-fit py-1 px-3">
              FAQ
            </Badge>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Everything you need to know about Luframe
            </p>
          </AnimatedSection>
        </div>

        {/* FAQ Accordion */}
        <AnimatedSection delay={300}>
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={openItem}
            onValueChange={handleValueChange}
          >
            {FAQ_ITEMS.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b border-border/50 last:border-b-0"
              >
                <AccordionTrigger className="text-base md:text-lg font-medium hover:no-underline py-5">
                  <span className="text-left">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
