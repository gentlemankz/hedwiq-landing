import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const trustedCompanies = [
  { name: "Company 1", logo: "/globe.svg" },
  { name: "Company 2", logo: "/globe.svg" },
  { name: "Company 3", logo: "/globe.svg" },
  { name: "Company 4", logo: "/globe.svg" },
];

export function Hero() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-24 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Text content */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <Badge variant="secondary" className="w-fit">
                Backed by Microsoft for Startups
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
                From post-meeting chaos to real-time execution
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Hedwiq is an agentic meeting platform that captures context, extracts insights, and enables action while meetings are still happening.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full px-8">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Watch Demo
              </Button>
            </div>

            {/* Trusted Companies */}
            <div className="flex flex-col gap-4 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                Trusted by teams at
              </p>
              <div className="flex items-center gap-8 flex-wrap">
                {trustedCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={24}
                      height={24}
                    />
                    <span className="text-muted-foreground text-sm font-medium">
                      {company.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Image placeholder */}
          <div className="relative">
            <Card className="relative aspect-square lg:aspect-[4/3] w-full overflow-hidden">
              {/* Placeholder gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/50 to-background" />

              {/* Placeholder content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-muted-foreground text-sm">Product Image</p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-green-500" />
              <div className="absolute top-4 right-10 w-3 h-3 rounded-full bg-yellow-500" />
              <div className="absolute top-4 right-16 w-3 h-3 rounded-full bg-red-500" />
            </Card>

            {/* Decorative blur elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
