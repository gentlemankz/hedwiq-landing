const advantages = [
  { stat: "$12,000+", description: "saved per employee/year" },
  { stat: "10x", description: "effective meetings" },
  { stat: "95%", description: "outcomes delivered" },
];

export function RiskReversal() {
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8">
        {advantages.map((item, index) => (
          <div key={index} className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center">
              <span className="text-lg md:text-xl font-bold text-foreground">
                {item.stat}
              </span>
              <span className="text-sm text-muted-foreground">
                {item.description}
              </span>
            </div>
            {index < advantages.length - 1 && (
              <div className="hidden sm:block h-10 w-px bg-border" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
