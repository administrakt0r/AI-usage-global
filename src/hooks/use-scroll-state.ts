import { useEffect, useRef, useState } from "react";

export const useScrollState = (threshold = 0) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleScrollState = () => {
      // Throttle to animation frames to avoid excessive React re-renders
      // when the user scrolls (can fire 60–120+ times per second).
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const scrolled = window.scrollY > threshold;

        // Use functional state update to ensure we're comparing against the
        // latest state value, avoiding stale closures while keeping the
        // effect dependency array minimal.
        setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
      });
    };

    window.addEventListener("scroll", handleScrollState, { passive: true });
    handleScrollState();

    return () => {
      window.removeEventListener("scroll", handleScrollState);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [threshold]);

  return isScrolled;
};
