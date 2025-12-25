import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Luframe",
  description:
    "Read the terms and conditions for using Luframe's meeting platform and services.",
};

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using Luframe.
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
                  <a href="#agreement" className="hover:underline">
                    Agreement to Terms
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:underline">
                    Description of Services
                  </a>
                </li>
                <li>
                  <a href="#accounts" className="hover:underline">
                    Account Registration
                  </a>
                </li>
                <li>
                  <a href="#user-responsibilities" className="hover:underline">
                    User Responsibilities
                  </a>
                </li>
                <li>
                  <a href="#recording-consent" className="hover:underline">
                    Recording and Transcription Consent
                  </a>
                </li>
                <li>
                  <a href="#prohibited" className="hover:underline">
                    Prohibited Activities
                  </a>
                </li>
                <li>
                  <a href="#content" className="hover:underline">
                    User Content
                  </a>
                </li>
                <li>
                  <a href="#intellectual-property" className="hover:underline">
                    Intellectual Property
                  </a>
                </li>
                <li>
                  <a href="#payment" className="hover:underline">
                    Fees and Payment
                  </a>
                </li>
                <li>
                  <a href="#cancellation" className="hover:underline">
                    Cancellation and Refunds
                  </a>
                </li>
                <li>
                  <a href="#third-party" className="hover:underline">
                    Third-Party Services
                  </a>
                </li>
                <li>
                  <a href="#disclaimers" className="hover:underline">
                    Disclaimers
                  </a>
                </li>
                <li>
                  <a href="#liability" className="hover:underline">
                    Limitation of Liability
                  </a>
                </li>
                <li>
                  <a href="#indemnification" className="hover:underline">
                    Indemnification
                  </a>
                </li>
                <li>
                  <a href="#termination" className="hover:underline">
                    Termination
                  </a>
                </li>
                <li>
                  <a href="#governing-law" className="hover:underline">
                    Governing Law
                  </a>
                </li>
                <li>
                  <a href="#changes" className="hover:underline">
                    Changes to Terms
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:underline">
                    Contact Us
                  </a>
                </li>
              </ol>
            </nav>

            {/* Agreement to Terms */}
            <section id="agreement" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                1. Agreement to Terms
              </h2>
              <p className="mb-4">
                These Terms of Service (&quot;Terms&quot;) constitute a legally
                binding agreement between you, whether personally or on behalf
                of an entity (&quot;you&quot; or &quot;User&quot;), and Selectra
                Group, Inc. (&quot;Luframe,&quot; &quot;we,&quot; &quot;us,&quot;
                or &quot;our&quot;), concerning your access to and use of the
                Luframe website (luframe.com) and all related services
                (collectively, the &quot;Services&quot;).
              </p>
              <p className="mb-4">
                By accessing or using our Services, you agree to be bound by
                these Terms and our{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                . If you do not agree with any part of these Terms, you must not
                use our Services.
              </p>
              <p>
                We reserve the right to modify these Terms at any time. We will
                notify you of material changes by updating the &quot;Last
                updated&quot; date and, where appropriate, providing additional
                notice. Your continued use of the Services after changes become
                effective constitutes acceptance of the revised Terms.
              </p>
            </section>

            {/* Description of Services */}
            <section id="services" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                2. Description of Services
              </h2>
              <p className="mb-4">
                Luframe is an AI-native meeting platform that provides:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Real-time video and audio meeting capabilities</li>
                <li>Speaker-aware transcription of meeting conversations</li>
                <li>AI-generated insights, action items, and summaries</li>
                <li>Agenda tracking and management</li>
                <li>Document sharing and reference detection</li>
                <li>
                  AI-generated email drafts based on meeting context
                </li>
                <li>Calendar integration (Google Calendar)</li>
                <li>Email integration (Gmail) for sending meeting-related communications</li>
                <li>Team collaboration and workspace features</li>
              </ul>
              <p>
                We may add, modify, or discontinue features of the Services at
                any time without prior notice.
              </p>
            </section>

            {/* Account Registration */}
            <section id="accounts" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                3. Account Registration
              </h2>
              <p className="mb-4">
                To access certain features, you must create an account. When
                registering, you agree to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>
                  Maintain and promptly update your account information
                </li>
                <li>
                  Keep your login credentials confidential and secure
                </li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>
                  Notify us immediately of any unauthorized access or security
                  breach
                </li>
              </ul>
              <p className="mb-4">
                You must be at least 18 years old to create an account and use
                our Services.
              </p>
              <p>
                We reserve the right to suspend or terminate accounts that
                violate these Terms or engage in fraudulent, abusive, or illegal
                activity.
              </p>
            </section>

            {/* User Responsibilities */}
            <section id="user-responsibilities" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                4. User Responsibilities
              </h2>
              <p className="mb-4">By using our Services, you agree to:</p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>
                  Comply with all applicable laws and regulations
                </li>
                <li>
                  Use the Services only for lawful purposes
                </li>
                <li>
                  Respect the rights and privacy of other users
                </li>
                <li>
                  Not interfere with or disrupt the Services or servers
                </li>
                <li>
                  Not attempt to gain unauthorized access to any part of the
                  Services
                </li>
                <li>
                  Not use the Services for any activity that could harm Luframe
                  or its users
                </li>
              </ul>
            </section>

            {/* Recording and Transcription Consent */}
            <section id="recording-consent" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                5. Recording and Transcription Consent
              </h2>
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-4">
                <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Important: You are responsible for obtaining consent
                </p>
                <p className="text-amber-800 dark:text-amber-200">
                  Recording laws vary by jurisdiction. You must comply with all
                  applicable laws regarding recording and consent.
                </p>
              </div>
              <p className="mb-4">
                Our Services enable recording, transcription, and AI-generated
                analysis of meetings. By using these features, you acknowledge
                and agree that:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>
                  <strong>You are responsible</strong> for informing all meeting
                  participants that the meeting may be recorded and transcribed
                </li>
                <li>
                  <strong>You must obtain consent</strong> from all participants
                  prior to enabling recording or transcription features, in
                  compliance with applicable laws including but not limited to
                  the Electronic Communications Privacy Act and state-level
                  wiretapping laws
                </li>
                <li>
                  <strong>You authorize Luframe</strong> and our third-party
                  service providers to process audio, video, transcripts, and
                  summaries to provide and improve the Services
                </li>
                <li>
                  <strong>You are solely responsible</strong> for compliance
                  with all applicable laws governing recording and consent in
                  your jurisdiction
                </li>
              </ul>
              <p className="mb-4">
                Some jurisdictions require all-party consent for recording. It
                is your responsibility to understand and comply with these
                requirements. Luframe is not liable for your failure to obtain
                proper consent.
              </p>
            </section>

            {/* Prohibited Activities */}
            <section id="prohibited" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                6. Prohibited Activities
              </h2>
              <p className="mb-4">
                You agree not to engage in any of the following prohibited
                activities:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>
                  Violate any applicable laws, regulations, or third-party
                  rights
                </li>
                <li>
                  Record or transcribe meetings without proper consent from all
                  participants
                </li>
                <li>
                  Use the Services to harass, abuse, stalk, threaten, or
                  defame others
                </li>
                <li>
                  Upload, transmit, or distribute malicious code, viruses, or
                  harmful content
                </li>
                <li>
                  Attempt to reverse engineer, decompile, or disassemble any
                  part of the Services
                </li>
                <li>
                  Use automated systems (bots, scrapers) to access the Services
                  without permission
                </li>
                <li>
                  Circumvent or disable security features of the Services
                </li>
                <li>
                  Impersonate another person or entity
                </li>
                <li>
                  Use the Services for spam, phishing, or fraudulent activities
                </li>
                <li>
                  Share illegal content, including child exploitation material,
                  pirated content, or content promoting violence
                </li>
                <li>
                  Interfere with other users&apos; use and enjoyment of the
                  Services
                </li>
                <li>
                  Use the Services to compete with Luframe or create derivative
                  products
                </li>
              </ul>
              <p>
                Violation of these prohibitions may result in immediate
                termination of your account and may be reported to law
                enforcement.
              </p>
            </section>

            {/* User Content */}
            <section id="content" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">7. User Content</h2>
              <p className="mb-4">
                &quot;User Content&quot; includes any text, files, images,
                audio, video, documents, or other materials you upload, submit,
                or transmit through the Services, including meeting recordings
                and transcriptions.
              </p>
              <p className="mb-4">
                You retain ownership of your User Content. However, by using the
                Services, you grant Luframe a worldwide, non-exclusive,
                royalty-free license to use, process, store, and display your
                User Content solely for the purpose of providing and improving
                the Services.
              </p>
              <p className="mb-4">You represent and warrant that:</p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>
                  You own or have the necessary rights to use and share your
                  User Content
                </li>
                <li>
                  Your User Content does not violate any third-party rights
                </li>
                <li>
                  Your User Content is not illegal, harmful, or objectionable
                </li>
              </ul>
              <p>
                We may remove User Content that violates these Terms or is
                otherwise objectionable, at our sole discretion.
              </p>
            </section>

            {/* Intellectual Property */}
            <section id="intellectual-property" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                8. Intellectual Property
              </h2>
              <p className="mb-4">
                The Services, including all content, features, functionality,
                software, text, graphics, logos, and trademarks, are owned by
                Luframe or its licensors and are protected by copyright,
                trademark, and other intellectual property laws.
              </p>
              <p className="mb-4">
                Subject to these Terms, we grant you a limited, non-exclusive,
                non-transferable, revocable license to access and use the
                Services for your personal or internal business purposes.
              </p>
              <p className="mb-4">You may not:</p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>
                  Copy, modify, or distribute any part of the Services without
                  permission
                </li>
                <li>
                  Use Luframe&apos;s trademarks without prior written consent
                </li>
                <li>
                  Remove any copyright or proprietary notices from the Services
                </li>
              </ul>
            </section>

            {/* Fees and Payment */}
            <section id="payment" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                9. Fees and Payment
              </h2>
              <p className="mb-4">
                Some features of the Services require a paid subscription. By
                subscribing to a paid plan, you agree to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>
                  Pay all fees associated with your selected plan
                </li>
                <li>
                  Provide accurate and complete billing information
                </li>
                <li>
                  Authorize us to charge your payment method on a recurring
                  basis
                </li>
              </ul>
              <p className="mb-4">
                We use Stripe as our payment processor. All payment information
                is handled securely by Stripe in accordance with their terms and
                privacy policy.
              </p>
              <p className="mb-4">
                <strong>Pricing:</strong> Prices are subject to change. We will
                notify you of price changes before they take effect.
              </p>
              <p className="mb-4">
                <strong>Billing:</strong> Paid plans are billed in advance on a
                monthly or annual basis. Your subscription will automatically
                renew unless you cancel before the renewal date.
              </p>
              <p>
                <strong>Taxes:</strong> You are responsible for any applicable
                taxes. Prices may or may not include taxes depending on your
                location.
              </p>
            </section>

            {/* Cancellation and Refunds */}
            <section id="cancellation" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                10. Cancellation and Refunds
              </h2>
              <p className="mb-4">
                You may cancel your subscription at any time through your
                account settings or by contacting us at{" "}
                <a
                  href="mailto:support@luframe.com"
                  className="text-primary hover:underline"
                >
                  support@luframe.com
                </a>
                .
              </p>
              <p className="mb-4">
                Upon cancellation:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>
                  Your subscription will remain active until the end of the
                  current billing period
                </li>
                <li>
                  You will not be charged for subsequent periods
                </li>
                <li>
                  Access to premium features will end when your subscription
                  expires
                </li>
              </ul>
              <p className="mb-4">
                <strong>Refunds:</strong> We generally do not provide refunds
                for partial billing periods. If you believe you are entitled to
                a refund due to service issues, please contact us and we will
                review your request on a case-by-case basis.
              </p>
            </section>

            {/* Third-Party Services */}
            <section id="third-party" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                11. Third-Party Services
              </h2>
              <p className="mb-4">
                The Services may integrate with or link to third-party services,
                including:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Google Calendar and Gmail</li>
                <li>Stripe for payment processing</li>
                <li>Other integrations we may add</li>
              </ul>
              <p className="mb-4">
                Your use of third-party services is subject to their respective
                terms and privacy policies. We are not responsible for the
                content, functionality, or practices of third-party services.
              </p>
              <p>
                By connecting third-party accounts, you authorize us to access
                and use information from those services as described in our{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            {/* Disclaimers */}
            <section id="disclaimers" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">12. Disclaimers</h2>
              <div className="bg-muted/50 rounded-lg p-6 mb-4 text-sm">
                <p className="mb-4">
                  THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS
                  AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
                  OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                  NON-INFRINGEMENT.
                </p>
                <p className="mb-4">
                  WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED,
                  ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER HARMFUL
                  COMPONENTS.
                </p>
                <p className="mb-4">
                  AI-GENERATED CONTENT, INCLUDING TRANSCRIPTIONS, INSIGHTS, AND
                  SUMMARIES, MAY CONTAIN ERRORS OR INACCURACIES. YOU SHOULD NOT
                  RELY ON AI-GENERATED CONTENT WITHOUT VERIFICATION.
                </p>
                <p>
                  WE MAKE NO GUARANTEES REGARDING THE ACCURACY OF TRANSCRIPTIONS
                  OR THE QUALITY OF AI-GENERATED INSIGHTS.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section id="liability" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                13. Limitation of Liability
              </h2>
              <div className="bg-muted/50 rounded-lg p-6 mb-4 text-sm">
                <p className="mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, LUFRAME AND ITS
                  OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE
                  FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                  PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF
                  PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR RELATED TO
                  YOUR USE OF THE SERVICES.
                </p>
                <p className="mb-4">
                  OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATED TO
                  THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE AMOUNT YOU
                  PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE
                  HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
                </p>
                <p>
                  SOME JURISDICTIONS DO NOT ALLOW LIMITATIONS ON IMPLIED
                  WARRANTIES OR EXCLUSION OF CERTAIN DAMAGES. IF THESE LAWS
                  APPLY TO YOU, SOME OR ALL OF THE ABOVE LIMITATIONS MAY NOT
                  APPLY.
                </p>
              </div>
            </section>

            {/* Indemnification */}
            <section id="indemnification" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                14. Indemnification
              </h2>
              <p className="mb-4">
                You agree to indemnify, defend, and hold harmless Luframe and its
                officers, directors, employees, agents, and affiliates from and
                against any claims, damages, losses, liabilities, costs, and
                expenses (including reasonable attorneys&apos; fees) arising out
                of or related to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Your use of the Services</li>
                <li>Your User Content</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>
                  Your failure to obtain proper consent for recording or
                  transcription
                </li>
              </ul>
            </section>

            {/* Termination */}
            <section id="termination" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">15. Termination</h2>
              <p className="mb-4">
                We may suspend or terminate your access to the Services at any
                time, with or without cause, with or without notice, including
                if we believe you have violated these Terms.
              </p>
              <p className="mb-4">
                Upon termination:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>
                  Your right to use the Services will immediately cease
                </li>
                <li>
                  We may delete your account and User Content
                </li>
                <li>
                  Provisions that should survive termination will remain in
                  effect (including Sections 7, 8, 12-14, 16)
                </li>
              </ul>
              <p>
                You may terminate your account at any time by contacting us at{" "}
                <a
                  href="mailto:support@luframe.com"
                  className="text-primary hover:underline"
                >
                  support@luframe.com
                </a>
                .
              </p>
            </section>

            {/* Governing Law */}
            <section id="governing-law" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                16. Governing Law and Dispute Resolution
              </h2>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance
                with the laws of the State of Delaware, United States, without
                regard to its conflict of law principles.
              </p>
              <p className="mb-4">
                Any disputes arising from or relating to these Terms or the
                Services shall be resolved exclusively in the state or federal
                courts located in Delaware. You consent to the personal
                jurisdiction of these courts.
              </p>
              <p>
                If any provision of these Terms is found to be invalid or
                unenforceable, the remaining provisions will continue in full
                force and effect.
              </p>
            </section>

            {/* Changes to Terms */}
            <section id="changes" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                17. Changes to Terms
              </h2>
              <p className="mb-4">
                We reserve the right to modify these Terms at any time. We will
                provide notice of material changes by:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>
                  Updating the &quot;Last updated&quot; date at the top
                </li>
                <li>
                  Sending an email notification for significant changes
                </li>
                <li>
                  Displaying a notice within the Services
                </li>
              </ul>
              <p>
                Your continued use of the Services after changes become
                effective constitutes acceptance of the revised Terms. If you do
                not agree to the new Terms, you must stop using the Services.
              </p>
            </section>

            {/* Contact */}
            <section id="contact" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">18. Contact Us</h2>
              <p className="mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="bg-muted/50 rounded-lg p-6">
                <p className="mb-2">
                  <strong>Selectra Group, Inc.</strong>
                </p>
                <p className="mb-2">131 Continental Dr, Suite 305</p>
                <p className="mb-2">Newark, DE 19713</p>
                <p className="mb-2">United States</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:support@luframe.com"
                    className="text-primary hover:underline"
                  >
                    support@luframe.com
                  </a>
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              See also:{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
