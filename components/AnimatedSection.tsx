"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/useInView";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right";
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  animation = "fade-up",
}: AnimatedSectionProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });

  const animationClasses = {
    "fade-up": "translate-y-8 opacity-0",
    "fade-in": "opacity-0",
    "slide-left": "-translate-x-8 opacity-0",
    "slide-right": "translate-x-8 opacity-0",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isInView ? "translate-y-0 translate-x-0 opacity-100" : animationClasses[animation],
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface AnimatedChildrenProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
}

export function AnimatedChildren({
  children,
  className,
  staggerDelay = 100,
  baseDelay = 0,
}: AnimatedChildrenProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className={cn(
                "transition-all duration-700 ease-out",
                isInView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              )}
              style={{ transitionDelay: `${baseDelay + index * staggerDelay}ms` }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
