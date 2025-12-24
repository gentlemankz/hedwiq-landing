import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pricing | Hedwiq - Agentic Meeting Platform",
  description:
    "Simple, transparent pricing for Hedwiq. Start free, upgrade when you need more. No hidden fees, no surprises.",
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
