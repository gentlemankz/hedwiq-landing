import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { StructuredData } from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.luframe.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Luframe | Agentic Meeting Platform for Real-Time Execution",
    template: "%s | Luframe",
  },
  description:
    "Luframe transforms live meetings into real-time action with AI-powered transcription, automatic insight detection, agenda tracking, and instant drafts. Stop post-meeting chaos.",
  keywords: [
    "meeting platform",
    "AI meeting assistant",
    "real-time transcription",
    "meeting notes",
    "action items",
    "meeting insights",
    "agenda tracking",
    "automated follow-ups",
    "meeting productivity",
    "team collaboration",
  ],
  authors: [{ name: "Luframe" }],
  creator: "Luframe",
  publisher: "Luframe",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Luframe",
    title: "Luframe | Agentic Meeting Platform for Real-Time Execution",
    description:
      "Transform live meetings into real-time action with AI-powered transcription, automatic insight detection, agenda tracking, and instant drafts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luframe | Agentic Meeting Platform for Real-Time Execution",
    description:
      "Transform live meetings into real-time action with AI-powered transcription, automatic insight detection, agenda tracking, and instant drafts.",
    creator: "@luframe",
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  verification: {
    // Add your verification codes when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
