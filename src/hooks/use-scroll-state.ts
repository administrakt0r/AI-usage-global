import { useEffect, useRef, useState } from "react";

export const useScrollState = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleScrollState = () => {
      // Throttle to animation frames to avoid excessive React re-renders
      // when the user scrolls (can fire 60–120+ times per second).
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const scrolled = window.scrollY > 0;

        // Only update state when the value actually changes to avoid
        // triggering downstream re-renders on every scroll event.
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
  }, []);

  return isScrolled;
};
