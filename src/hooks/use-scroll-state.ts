import { useEffect, useState } from "react";

export const useScrollState = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScrollState = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScrollState, { passive: true });
    handleScrollState();

    return () => {
      window.removeEventListener("scroll", handleScrollState);
    };
  }, []);

  return isScrolled;
};
