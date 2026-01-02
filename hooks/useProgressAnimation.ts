import { useMemo } from "react";

interface ProgressAnimationConfig {
  /** Multiplier for opacity calculation (default: 2) */
  opacityMultiplier?: number;
  /** Multiplier for translate progress (default: 1.5) */
  translateMultiplier?: number;
  /** Maximum translate distance in pixels (default: 30) */
  translateDistance?: number;
  /** Scale range: [minScale, maxScale] (default: [0.95, 1]) */
  scaleRange?: [number, number];
  /** Progress threshold for visibility (default: 0) */
  visibilityThreshold?: number;
}

interface ProgressAnimationResult {
  /** Whether the element should be visible */
  isVisible: boolean;
  /** Opacity value (0-1) */
  opacity: number;
  /** TranslateY value in pixels */
  translateY: number;
  /** Scale value */
  scale: number;
  /** Combined CSS transform string */
  transform: string;
  /** Style object ready for use */
  style: {
    opacity: number;
    transform: string;
    pointerEvents: "auto" | "none";
  };
}

const DEFAULT_CONFIG: Required<ProgressAnimationConfig> = {
  opacityMultiplier: 2,
  translateMultiplier: 1.5,
  translateDistance: 30,
  scaleRange: [0.95, 1],
  visibilityThreshold: 0,
};

/**
 * Hook for consistent progress-based animations across components.
 * Reduces code duplication and ensures consistent animation behavior.
 *
 * @param progress - Animation progress value (0 to 1)
 * @param config - Optional configuration for animation parameters
 * @returns Animation values and pre-computed styles
 *
 * @example
 * ```tsx
 * const { style, isVisible } = useProgressAnimation(progress);
 * return <div style={style}>{content}</div>;
 * ```
 *
 * @example
 * ```tsx
 * // With custom config
 * const { opacity, translateY, scale } = useProgressAnimation(progress, {
 *   opacityMultiplier: 3,
 *   translateDistance: 20,
 * });
 * ```
 */
export function useProgressAnimation(
  progress: number,
  config: ProgressAnimationConfig = {}
): ProgressAnimationResult {
  const {
    opacityMultiplier = DEFAULT_CONFIG.opacityMultiplier,
    translateMultiplier = DEFAULT_CONFIG.translateMultiplier,
    translateDistance = DEFAULT_CONFIG.translateDistance,
    scaleRange = DEFAULT_CONFIG.scaleRange,
    visibilityThreshold = DEFAULT_CONFIG.visibilityThreshold,
  } = config;

  return useMemo(() => {
    const isVisible = progress > visibilityThreshold;
    const opacity = Math.min(1, progress * opacityMultiplier);
    const translateY =
      (1 - Math.min(1, progress * translateMultiplier)) * translateDistance;
    const scale =
      scaleRange[0] + Math.min(1, progress * translateMultiplier) * (scaleRange[1] - scaleRange[0]);

    const transform = `translateY(${translateY}px) scale(${scale})`;

    return {
      isVisible,
      opacity,
      translateY,
      scale,
      transform,
      style: {
        opacity: isVisible ? opacity : 0,
        transform,
        pointerEvents: isVisible ? "auto" : "none",
      },
    };
  }, [
    progress,
    opacityMultiplier,
    translateMultiplier,
    translateDistance,
    scaleRange,
    visibilityThreshold,
  ]);
}

/**
 * Hook for staggered animation of list items.
 * Useful for animating multiple items with delay based on index.
 *
 * @param progress - Overall animation progress (0 to 1)
 * @param index - Item index in the list
 * @param totalItems - Total number of items
 * @param staggerDelay - Delay factor between items (default: 0.12)
 * @returns Animation result for the specific item
 */
export function useStaggeredAnimation(
  progress: number,
  index: number,
  totalItems: number,
  staggerDelay: number = 0.12
): ProgressAnimationResult {
  return useMemo(() => {
    const itemDelay = index * staggerDelay;
    const maxDelay = (totalItems - 1) * staggerDelay;
    const adjustedProgress = Math.max(0, (progress - itemDelay) / (1 - maxDelay));

    const isVisible = adjustedProgress > 0;
    const opacity = Math.min(1, adjustedProgress * 3);
    const translateX = isVisible ? 0 : -10;
    const translateY = 0;
    const scale = 1;

    return {
      isVisible,
      opacity,
      translateY,
      scale,
      transform: `translateX(${translateX}px)`,
      style: {
        opacity: isVisible ? opacity : 0,
        transform: `translateX(${translateX}px)`,
        pointerEvents: isVisible ? "auto" : "none",
      },
    };
  }, [progress, index, totalItems, staggerDelay]);
}
