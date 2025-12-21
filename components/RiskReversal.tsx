import { Check } from "lucide-react";

const advantages = [
  "Bot free",
  "10x effective meetings",
  "Simple. Browser-based.",
];

export function RiskReversal() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:gap-x-12">
      {advantages.map((text, index) => (
        <div key={index} className="flex items-center gap-2">
          <Check className="size-5 text-green-500" strokeWidth={2.5} />
          <span className="text-sm md:text-base text-foreground font-medium">
            {text}
          </span>
        </div>
      ))}
    </div>
  );
}
