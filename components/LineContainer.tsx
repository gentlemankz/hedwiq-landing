"use client";

import { cn } from "@/lib/utils";

interface LineContainerProps {
  children: React.ReactNode;
  className?: string;
  showInnerLines?: boolean;
}

/**
 * LineContainer - Creates a visually framed content area with vertical border lines
 *
 * Inspired by modern landing page designs (Launch Fast, Cartesia) that use
 * vertical lines to constrain and frame content areas.
 */
export function LineContainer({
  children,
  className,
  showInnerLines = false,
}: LineContainerProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Left border line */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-border" />

      {/* Right border line */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-px bg-border" />

      {/* Optional inner guide lines for grid effect */}
      {showInnerLines && (
        <>
          <div className="pointer-events-none absolute left-1/4 top-0 bottom-0 w-px bg-border/30 hidden lg:block" />
          <div className="pointer-events-none absolute left-1/2 top-0 bottom-0 w-px bg-border/30 hidden md:block" />
          <div className="pointer-events-none absolute left-3/4 top-0 bottom-0 w-px bg-border/30 hidden lg:block" />
        </>
      )}

      {/* Content */}
      {children}
    </div>
  );
}

interface LineSectionProps {
  children: React.ReactNode;
  className?: string;
  showTopLine?: boolean;
  showBottomLine?: boolean;
}

/**
 * LineSection - A section with optional horizontal divider lines
 *
 * Use within LineContainer to create sectioned content with horizontal separators
 */
export function LineSection({
  children,
  className,
  showTopLine = false,
  showBottomLine = false,
}: LineSectionProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Top horizontal line */}
      {showTopLine && (
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-border" />
      )}

      {/* Bottom horizontal line */}
      {showBottomLine && (
        <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-border" />
      )}

      {children}
    </div>
  );
}

interface PageLinesProps {
  className?: string;
}

/**
 * PageLines - Full-height vertical lines that span the entire viewport
 *
 * Place this as a sibling to your main content to create persistent
 * vertical guide lines that extend beyond individual sections.
 */
export function PageLines({ className }: PageLinesProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0",
        className
      )}
      aria-hidden="true"
    >
      <div className="relative mx-auto h-full w-full max-w-[1400px] px-6 md:px-12 lg:px-16">
        {/* Left boundary line */}
        <div className="absolute left-6 md:left-12 lg:left-16 top-0 bottom-0 w-px bg-border" />

        {/* Right boundary line */}
        <div className="absolute right-6 md:right-12 lg:right-16 top-0 bottom-0 w-px bg-border" />

        {/* Center line (optional - subtle) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/20 hidden lg:block" />
      </div>
    </div>
  );
}
