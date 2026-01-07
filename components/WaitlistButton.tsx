"use client";

import { forwardRef, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useWaitlist } from "@/components/WaitlistContext";
import { track } from "@/lib/amplitude";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<typeof Button>;

interface WaitlistButtonProps extends Omit<ButtonProps, "onClick"> {
  /** Location identifier for analytics */
  location: string;
  /** CTA type for analytics */
  ctaType?: string;
  /** Use shimmer effect button style */
  shimmer?: boolean;
  /** Additional className for shimmer button */
  shimmerClassName?: string;
}

export const WaitlistButton = forwardRef<HTMLButtonElement, WaitlistButtonProps>(
  function WaitlistButton(
    { children, location, ctaType = "waitlist", shimmer, shimmerClassName, className, ...props },
    ref
  ) {
    const { openWaitlist } = useWaitlist();

    const handleClick = () => {
      track({
        name: "Waitlist CTA Clicked",
        properties: { cta_type: ctaType, location },
      });
      openWaitlist();
    };

    if (shimmer) {
      return (
        <ShimmerButton
          className={cn(shimmerClassName)}
          onClick={handleClick}
        >
          {children}
        </ShimmerButton>
      );
    }

    return (
      <Button ref={ref} className={className} onClick={handleClick} {...props}>
        {children}
      </Button>
    );
  }
);
