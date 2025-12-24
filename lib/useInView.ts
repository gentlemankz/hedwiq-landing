"use client";

import { useState, useEffect, useRef, useCallback, RefObject } from "react";

interface UseInViewOptions {
  /** Percentage of element visible to trigger (0-1). Default: 0.1 */
  threshold?: number;
  /** Margin around root element. Default: "0px" */
  rootMargin?: string;
  /** Only trigger once (stays true after first intersection). Default: true */
  triggerOnce?: boolean;
}

/**
 * Hook to detect when an element enters the viewport using IntersectionObserver.
 *
 * @param options - Configuration options for the observer
 * @returns Tuple of [ref to attach to element, boolean indicating if in view]
 *
 * @example
 * const [ref, isInView] = useInView({ threshold: 0.5 });
 * return <div ref={ref}>{isInView ? 'Visible!' : 'Hidden'}</div>;
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Cleanup function to disconnect observer
  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for IntersectionObserver support
    if (typeof IntersectionObserver === "undefined") {
      // Fallback for older browsers - assume in view
      setIsInView(true);
      return;
    }

    // Clean up any existing observer
    cleanup();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current = observer;
    observer.observe(element);

    return cleanup;
  }, [threshold, rootMargin, triggerOnce, cleanup]);

  return [ref, isInView];
}
