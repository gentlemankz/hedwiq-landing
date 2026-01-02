import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { ChaosToOrderTransition } from "@/components/ChaosToOrderTransition";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ChaosToOrderTransition>
          <Features />
        </ChaosToOrderTransition>
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
