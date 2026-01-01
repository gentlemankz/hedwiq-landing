import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Luframe",
  description:
    "Learn how Luframe collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="mb-12">
            <p className="text-sm text-muted-foreground mb-2">
              Last updated: December 25, 2024
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Your privacy matters to us. This policy explains how we handle
              your data.
            </p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            {/* Table of Contents */}
            <nav className="bg-muted/50 rounded-lg p-6 mb-12">
              <h2 className="text-lg font-semibold mb-4 mt-0">
                Table of Contents
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  <a href="#introduction" className="hover:underline">
                    Introduction
                  </a>
                </li>
                <li>
                  <a href="#information-we-collect" className="hover:underline">
                    Information We Collect
                  </a>
                </li>
                <li>
                  <a
                    href="#how-we-use-information"
                    className="hover:underline"
                  >
                    How We Use Your Information
                  </a>
                </li>
                <li>
                  <a href="#google-api-data" className="hover:underline">
                    Google API Services User Data
                  </a>
                </li>
                <li>
                  <a href="#third-party-services" className="hover:underline">
                    Third-Party Services
                  </a>
                </li>
                <li>
                  <a href="#cookies" className="hover:underline">
                    Cookies and Tracking Technologies
                  </a>
                </li>
                <li>
                  <a href="#data-sharing" className="hover:underline">
                    When We Share Information
                  </a>
                </li>
                <li>
                  <a href="#data-security" className="hover:underline">
                    Data Security
                  </a>
                </li>
                <li>
                  <a href="#data-retention" className="hover:underline">
                    Data Retention
                  </a>
                </li>
                <li>
                  <a href="#your-rights" className="hover:underline">
                    Your Privacy Rights
                  </a>
                </li>
                <li>
                  <a href="#california-rights" className="hover:underline">
                    California Privacy Rights
                  </a>
                </li>
                <li>
                  <a href="#international-transfers" className="hover:underline">
                    International Data Transfers
                  </a>
                </li>
                <li>
                  <a href="#children" className="hover:underline">
                    Children&apos;s Privacy
                  </a>
                </li>
                <li>
                  <a href="#changes" className="hover:underline">
                    Changes to This Policy
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:underline">
                    Contact Us
                  </a>
                </li>
              </ol>
            </nav>

            {/* Introduction */}
            <section id="introduction" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="mb-4">
                Selectra Group, Inc. (&quot;Luframe,&quot; &quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;) operates the Luframe platform,
                an AI-native meeting and collaboration solution. We are
                committed to protecting your privacy and providing transparency
                about how we collect, use, and safeguard your personal
                information.
              </p>
              <p className="mb-4">
                This Privacy Policy applies to our website at luframe.com and all
                related services, including our meeting platform, transcription
                services, and integrations (collectively, the
                &quot;Services&quot;).
              </p>
              <p>
                By using our Services, you agree to the collection and use of
                information in accordance with this policy. If you do not agree
                with this policy, please do not use our Services.
              </p>
            </section>

            {/* Information We Collect */}
            <section id="information-we-collect" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-medium mb-3">
                2.1 Account Information
              </h3>
              <p className="mb-4">
                When you create an account, we collect:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Profile picture (if provided via Google OAuth)</li>
                <li>Authentication credentials</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">
                2.2 Meeting Data
              </h3>
              <p className="mb-4">
                When you use our meeting features, we may collect and process:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Audio and video streams during meetings</li>
                <li>Real-time transcriptions of meeting conversations</li>
                <li>AI-generated insights, action items, and summaries</li>
                <li>Meeting agendas and notes</li>
                <li>Documents uploaded to meetings</li>
                <li>Email drafts generated during meetings</li>
                <li>Meeting metadata (date, time, duration, participants)</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">
                2.3 Integration Data
              </h3>
              <p className="mb-4">
                If you connect third-party services:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>
                  <strong>Google Calendar:</strong> Calendar events, meeting
                  schedules, and attendee information
                </li>
                <li>
                  <strong>Gmail:</strong> Email sending capabilities for
                  meeting-related communications
                </li>
              </ul>

              <h3 className="text-xl font-medium mb-3">
                2.4 Payment Information
              </h3>
              <p className="mb-4">
                For paid subscriptions, we collect billing information through
                our payment processor, Stripe. We do not directly store your
                full credit card numbers. Stripe may collect:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Payment card details (processed securely by Stripe)</li>
                <li>Billing address</li>
                <li>Transaction history</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">
                2.5 Usage and Technical Data
              </h3>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>IP address and approximate location</li>
                <li>Browser type and version</li>
                <li>Device information and operating system</li>
                <li>Pages visited and features used</li>
                <li>Timestamps and session duration</li>
                <li>Error logs and performance data</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section id="how-we-use-information" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                3. How We Use Your Information
              </h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Provide, maintain, and improve our Services</li>
                <li>Process real-time meeting transcription and insights</li>
                <li>Generate AI-powered summaries and action items</li>
                <li>Enable calendar synchronization and email features</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send service-related communications</li>
                <li>Provide customer support</li>
                <li>Analyze usage patterns to improve our Services</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* Google API Data */}
            <section id="google-api-data" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                4. Google API Services User Data
              </h2>
              <p className="mb-4">
                Luframe&apos;s use and transfer of information received from
                Google APIs adheres to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>

              <h3 className="text-xl font-medium mb-3">
                4.1 Google Calendar Data
              </h3>
              <p className="mb-4">
                When you connect your Google Calendar, we access:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Calendar event details (title, time, attendees)</li>
                <li>Meeting links and descriptions</li>
              </ul>
              <p className="mb-4">
                This data is used solely to display upcoming meetings and sync
                meeting schedules within Luframe.
              </p>

              <h3 className="text-xl font-medium mb-3">4.2 Gmail Data</h3>
              <p className="mb-4">
                When you connect Gmail for sending meeting-related emails, we:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Only use send permissions to deliver emails you approve</li>
                <li>Do not read, scan, or store your inbox contents</li>
                <li>
                  Do not use Gmail data for advertising or unauthorized purposes
                </li>
              </ul>

              <h3 className="text-xl font-medium mb-3">4.3 Limited Use</h3>
              <p className="mb-4">
                We limit our use of Google user data to providing and improving
                user-facing features. We do not:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>
                  Transfer Google data to third parties except as necessary to
                  provide the service
                </li>
                <li>Use Google data for advertising purposes</li>
                <li>
                  Allow humans to read Google data except with user consent, for
                  security purposes, or to comply with law
                </li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section id="third-party-services" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                5. Third-Party Services
              </h2>
              <p className="mb-4">
                We use the following third-party service providers to operate
                our Services. These providers process data on our behalf and are
                contractually bound to protect your information:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border mb-4">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left">
                        Service
                      </th>
                      <th className="border border-border px-4 py-2 text-left">
                        Purpose
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2">
                        Deepgram
                      </td>
                      <td className="border border-border px-4 py-2">
                        Speech-to-text transcription
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">
                        LiveKit
                      </td>
                      <td className="border border-border px-4 py-2">
                        Video/audio infrastructure
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">
                        Azure OpenAI
                      </td>
                      <td className="border border-border px-4 py-2">
                        AI processing for insights and summaries
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">
                        Supabase
                      </td>
                      <td className="border border-border px-4 py-2">
                        Database and file storage
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">
                        Stripe
                      </td>
                      <td className="border border-border px-4 py-2">
                        Payment processing
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">
                        Vercel
                      </td>
                      <td className="border border-border px-4 py-2">
                        Hosting and deployment
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">Resend</td>
                      <td className="border border-border px-4 py-2">
                        Email delivery
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mb-4">
                <strong>Stripe Privacy Disclosure:</strong> We use Stripe for
                payments, analytics, and other business services. Stripe may
                collect personal data including via cookies and similar
                technologies. The personal data Stripe collects may include
                transactional data and identifying information about devices
                that connect to its services. Stripe uses this information to
                operate and improve the services it provides to us, including
                for fraud detection and prevention. You can learn more about
                Stripe and read its privacy policy at{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://stripe.com/privacy
                </a>
                .
              </p>
            </section>

            {/* Cookies */}
            <section id="cookies" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Maintain your session and authentication state</li>
                <li>Remember your preferences</li>
                <li>Analyze usage and improve our Services</li>
                <li>Prevent fraud and enhance security</li>
              </ul>
              <p className="mb-4">
                You can control cookies through your browser settings. However,
                disabling certain cookies may affect the functionality of our
                Services.
              </p>
            </section>

            {/* Data Sharing */}
            <section id="data-sharing" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                7. When We Share Information
              </h2>
              <p className="mb-4">
                We do not sell your personal information. We may share your
                information in the following circumstances:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>
                  <strong>With your consent:</strong> When you explicitly agree
                  to share information
                </li>
                <li>
                  <strong>With service providers:</strong> Third parties who
                  help us operate our Services (see Section 5)
                </li>
                <li>
                  <strong>With meeting participants:</strong> Other attendees
                  can see your name and contributions during meetings
                </li>
                <li>
                  <strong>For legal compliance:</strong> When required by law or
                  to protect our rights
                </li>
                <li>
                  <strong>Business transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section id="data-security" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">8. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures
                to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Encryption of data in transit (TLS/SSL)</li>
                <li>Encryption of data at rest</li>
                <li>Access controls and authentication</li>
                <li>Regular security assessments</li>
                <li>Employee training on data protection</li>
              </ul>
              <p>
                While we strive to protect your information, no method of
                transmission over the Internet is 100% secure. We cannot
                guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section id="data-retention" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">9. Data Retention</h2>
              <p className="mb-4">
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Provide our Services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
              </ul>
              <p className="mb-4">
                Meeting data (transcripts, recordings, insights) is retained
                according to your account settings and subscription plan. You
                can delete your meeting data at any time through your account
                dashboard.
              </p>
              <p>
                When you delete your account, we will delete or anonymize your
                personal information within 30 days, except where retention is
                required by law.
              </p>
            </section>

            {/* Your Rights */}
            <section id="your-rights" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                10. Your Privacy Rights
              </h2>
              <p className="mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  data
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  data
                </li>
                <li>
                  <strong>Portability:</strong> Request your data in a portable
                  format
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain processing of
                  your data
                </li>
                <li>
                  <strong>Withdrawal of consent:</strong> Withdraw consent at
                  any time
                </li>
              </ul>
              <p>
                To exercise these rights, please contact us at{" "}
                <a
                  href="mailto:admin@luframe.com"
                  className="text-primary hover:underline"
                >
                  admin@luframe.com
                </a>
                . We will respond within 30 days.
              </p>
            </section>

            {/* California Rights */}
            <section id="california-rights" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                11. California Privacy Rights (CCPA/CPRA)
              </h2>
              <p className="mb-4">
                If you are a California resident, you have additional rights
                under the California Consumer Privacy Act (CCPA) and California
                Privacy Rights Act (CPRA):
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>
                  <strong>Right to Know:</strong> Request information about data
                  collection practices
                </li>
                <li>
                  <strong>Right to Delete:</strong> Request deletion of personal
                  information
                </li>
                <li>
                  <strong>Right to Opt-Out:</strong> Opt out of the sale or
                  sharing of personal information
                </li>
                <li>
                  <strong>Right to Non-Discrimination:</strong> Not be
                  discriminated against for exercising rights
                </li>
              </ul>
              <p className="mb-4">
                <strong>We do not sell personal information</strong> as defined
                by the CCPA.
              </p>
              <p>
                To submit a request, please email{" "}
                <a
                  href="mailto:admin@luframe.com"
                  className="text-primary hover:underline"
                >
                  admin@luframe.com
                </a>{" "}
                with the subject line &quot;California Privacy Request.&quot;
              </p>
            </section>

            {/* International Transfers */}
            <section id="international-transfers" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                12. International Data Transfers
              </h2>
              <p className="mb-4">
                Luframe is based in the United States. Your information may be
                transferred to, stored, and processed in the United States or
                other countries where our service providers operate.
              </p>
              <p>
                By using our Services, you consent to the transfer of your
                information to these locations. We ensure appropriate safeguards
                are in place to protect your data in accordance with this
                Privacy Policy.
              </p>
            </section>

            {/* Children */}
            <section id="children" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                13. Children&apos;s Privacy
              </h2>
              <p className="mb-4">
                Our Services are not intended for children under 18 years of
                age. We do not knowingly collect personal information from
                children under 18.
              </p>
              <p>
                If you believe we have collected information from a child under
                18, please contact us immediately at{" "}
                <a
                  href="mailto:admin@luframe.com"
                  className="text-primary hover:underline"
                >
                  admin@luframe.com
                </a>
                , and we will promptly delete such information.
              </p>
            </section>

            {/* Changes */}
            <section id="changes" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                14. Changes to This Policy
              </h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of significant changes by:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Updating the &quot;Last updated&quot; date at the top</li>
                <li>
                  Sending an email notification for material changes
                </li>
                <li>
                  Posting a notice on our website
                </li>
              </ul>
              <p>
                Your continued use of our Services after changes become
                effective constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact */}
            <section id="contact" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">15. Contact Us</h2>
              <p className="mb-4">
                If you have questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-muted/50 rounded-lg p-6">
                <p className="mb-2">
                  <strong>Selectra Group, Inc.</strong>
                </p>
                <p className="mb-2">Attn: Privacy Team</p>
                <p className="mb-2">131 Continental Dr, Suite 305</p>
                <p className="mb-2">Newark, DE 19713</p>
                <p className="mb-2">United States</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:admin@luframe.com"
                    className="text-primary hover:underline"
                  >
                    admin@luframe.com
                  </a>
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              See also:{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
