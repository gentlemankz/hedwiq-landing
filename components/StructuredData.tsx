const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.luframe.com";

interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  contactPoint?: {
    "@type": "ContactPoint";
    email: string;
    contactType: string;
  };
}

interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  publisher: {
    "@type": "Organization";
    name: string;
  };
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}

interface SoftwareApplicationSchema {
  "@context": "https://schema.org";
  "@type": "SoftwareApplication";
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
    description: string;
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: string;
    ratingCount: string;
  };
  featureList: string[];
}

export function OrganizationStructuredData() {
  const schema: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Luframe",
    url: siteUrl,
    logo: `${siteUrl}/android-chrome-512x512.png`,
    description:
      "Luframe is an agentic meeting platform that transforms live meetings into real-time action with AI-powered transcription, insight detection, and automated drafts.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "admin@luframe.com",
      contactType: "customer service",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteStructuredData() {
  const schema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Luframe",
    url: siteUrl,
    description:
      "Agentic meeting platform for real-time execution with transcription, insight detection, and automated drafts.",
    publisher: {
      "@type": "Organization",
      name: "Luframe",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SoftwareApplicationStructuredData() {
  const schema: SoftwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Luframe",
    description:
      "Agentic meeting platform that captures context, extracts insights, and enables action while meetings are still happening.",
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier available with premium plans",
    },
    featureList: [
      "Real-time AI transcription",
      "Automatic insight detection",
      "Smart agenda tracking",
      "Automated email drafts",
      "Speaker identification",
      "Document references",
      "Team collaboration",
      "Action item tracking",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function StructuredData() {
  return (
    <>
      <OrganizationStructuredData />
      <WebSiteStructuredData />
      <SoftwareApplicationStructuredData />
    </>
  );
}
