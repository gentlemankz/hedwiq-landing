import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://luframe.com";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Luframe. Start free with real-time transcription and AI insights. Upgrade for unlimited meetings, team features, and priority support.",
  alternates: {
    canonical: `${siteUrl}/pricing`,
  },
  openGraph: {
    title: "Pricing | Luframe - Agentic Meeting Platform",
    description:
      "Simple, transparent pricing for Luframe. Start free, upgrade when you need more. No hidden fees, no surprises.",
    url: `${siteUrl}/pricing`,
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
