import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { ChaosToOrderTransition } from "@/components/ChaosToOrderTransition";
import { PageLines } from "@/components/LineContainer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Persistent vertical guide lines */}
      <PageLines />

      {/* Main content */}
      <div className="relative z-10">
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
    </div>
  );
}
