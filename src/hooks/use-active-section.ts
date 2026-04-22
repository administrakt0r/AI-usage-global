import { useEffect, useState } from "react";

export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleSectionTracking = () => {
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      if (sections.length === 0) {
        if (activeSection !== "") {
          setActiveSection("");
        }

        return;
      }

      let foundSection = false;

      for (const section of sections) {
        const element = section as HTMLElement;
        const { offsetTop, offsetHeight } = element;

        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          if (element.id !== activeSection) {
            setActiveSection(element.id);
          }

          foundSection = true;
          break;
        }
      }

      if (!foundSection && activeSection !== "") {
        setActiveSection("");
      }
    };

    handleSectionTracking();
    window.addEventListener("scroll", handleSectionTracking, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleSectionTracking);
    };
  }, [activeSection]);

  return activeSection;
};
