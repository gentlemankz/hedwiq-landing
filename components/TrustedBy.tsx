import Image from "next/image";

const trustedCompanies = [
  { name: "Company 1", logo: "/globe.svg" },
  { name: "Company 2", logo: "/globe.svg" },
  { name: "Company 3", logo: "/globe.svg" },
  { name: "Company 4", logo: "/globe.svg" },
];

export function TrustedBy() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-24 pb-12 md:pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-6 pb-8 border-b border-border">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">
            Trusted by teams at
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
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
    </section>
  );
}
