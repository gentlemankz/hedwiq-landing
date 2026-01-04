import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://luframe.com";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Luframe team. We'd love to hear your questions, feedback, or partnership opportunities.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact | Luframe",
    description: "Get in touch with the Luframe team.",
    url: `${siteUrl}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions or feedback? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Email Us</h2>
              <p className="text-muted-foreground mb-4">
                For general inquiries, support, or partnership opportunities.
              </p>
              <a
                href="mailto:admin@luframe.com"
                className="text-lg font-medium text-primary hover:underline"
              >
                admin@luframe.com
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
