import { useEffect, useRef, useState } from "react";

export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState("");
  const activeSectionRef = useRef(activeSection);
  const rafRef = useRef<number>(0);

  // Keep the ref in sync with state so the scroll handler always reads
  // the latest value without needing the state in its dependency array.
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    // Cache the section list so we don't re-query the DOM on every
    // scroll event. Sections are static after mount in this app.
    let sections: NodeListOf<Element> | null = null;

    const handleSectionTracking = () => {
      // Throttle to animation frames to prevent layout thrashing.
      // Without throttling, this handler fires 60–120+ times per second
      // and forces layout recalculation via offsetTop/offsetHeight reads.
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;

        if (!sections) {
          sections = document.querySelectorAll("section[id]");
        }

        const scrollPosition = window.scrollY + window.innerHeight / 2;

        if (sections.length === 0) {
          if (activeSectionRef.current !== "") {
            setActiveSection("");
          }

          return;
        }

        let foundSection = false;
        let newActive = "";

        for (const section of sections) {
          const element = section as HTMLElement;
          const { offsetTop, offsetHeight } = element;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            newActive = element.id;
            foundSection = true;
            break;
          }
        }

        if (!foundSection && activeSectionRef.current !== "") {
          setActiveSection("");
        } else if (newActive !== activeSectionRef.current) {
          setActiveSection(newActive);
        }
      });
    };

    handleSectionTracking();
    window.addEventListener("scroll", handleSectionTracking, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleSectionTracking);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return activeSection;
};
