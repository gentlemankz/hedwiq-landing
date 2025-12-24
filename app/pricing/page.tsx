import { Header } from "@/components/Header";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-16">
      <Header />
      <main>
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
