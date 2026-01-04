import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.luframe.com";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Luframe's mission to transform meetings into real-time action. We're building an AI-native platform that eliminates post-meeting chaos.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "About | Luframe",
    description:
      "Learn about Luframe's mission to transform meetings into real-time action.",
    url: `${siteUrl}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              About Luframe
            </h1>
            <p className="text-lg text-muted-foreground">
              Transforming post-meeting chaos into real-time execution.
            </p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            {/* Mission */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We believe meetings should drive action, not create busywork.
                Every day, teams lose countless hours to forgotten action items,
                delayed follow-ups, and scattered notes. Luframe exists to
                change that.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to eliminate the gap between meeting discussions
                and real execution. We&apos;re building an AI-native platform
                that captures insights, detects action items, and generates
                drafts in real-time so your team can focus on what matters most.
              </p>
            </section>

            {/* Message from Team */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                A Message from Our Team
              </h2>
              <div className="bg-muted/50 rounded-lg p-6 md:p-8">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We started Luframe because we experienced the meeting problem
                  firsthand. As a team that runs on collaboration, we found
                  ourselves drowning in post-meeting tasks: writing follow-up
                  emails, transferring action items to task managers, and
                  hunting through recordings for that one important decision.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Existing tools captured meetings well, but they didn&apos;t
                  help us execute. Summaries arrived hours later. Action items
                  required manual extraction. Follow-ups fell through the
                  cracks.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  So we built something different: an agentic platform that
                  works alongside you during the meeting, not after it. Real-time
                  transcription. Instant insight detection. Email drafts ready
                  before the call ends.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We&apos;re just getting started, and we&apos;d love for you to
                  join us on this journey.
                </p>
                <p className="mt-6 font-medium">— The Luframe Team</p>
              </div>
            </section>

            {/* What We Do */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong className="text-foreground">
                      Real-time transcription
                    </strong>{" "}
                    — Accurate, speaker-identified transcripts as your meeting
                    happens.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong className="text-foreground">
                      AI insight detection
                    </strong>{" "}
                    — Automatically surface ideas, problems, risks, and action
                    items.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong className="text-foreground">
                      Smart agenda tracking
                    </strong>{" "}
                    — Know when topics start, complete, or run over time.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    <strong className="text-foreground">
                      Automated email drafts
                    </strong>{" "}
                    — Follow-up emails generated and ready to send before the
                    meeting ends.
                  </span>
                </li>
              </ul>
            </section>

            {/* CTA */}
            <section className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Ready to transform your meetings?
              </p>
              <Link
                href="/#features"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Explore Features
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
