"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initAmplitude, trackScrollMilestone, resetScrollTracking, track } from '@/lib/amplitude';

/**
 * AmplitudeProvider - Initializes Amplitude and handles automatic tracking
 *
 * Features:
 * - Initializes Amplitude SDK with session replay
 * - Auto-tracks page views on route changes
 * - Tracks scroll depth milestones
 * - Sets up intersection observers for section tracking
 */
export function AmplitudeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);

  // Initialize Amplitude on mount (only once)
  useEffect(() => {
    if (!hasInitialized.current) {
      initAmplitude();
      hasInitialized.current = true;
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    // Reset scroll tracking for new pages
    resetScrollTracking();
  }, [pathname, searchParams]);

  // Scroll depth tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (window.scrollY / scrollHeight) * 100;
      trackScrollMilestone(scrollPercent);
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  // Section visibility tracking using Intersection Observer
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const trackedSections = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          if (entry.isIntersecting && !trackedSections.has(sectionId)) {
            trackedSections.add(sectionId);

            // Calculate scroll depth when section is viewed
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

            track({
              name: 'Section Viewed',
              properties: {
                section_name: sectionId,
                scroll_depth_percent: scrollPercent
              }
            });
          }
        });
      },
      {
        threshold: 0.3, // 30% of section visible
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]); // Re-observe on route changes

  return <>{children}</>;
}
