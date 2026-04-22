"use client";

import { MoonStarIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const ModeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative rounded-full"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <MoonStarIcon className="scale-100 dark:scale-0" />
      <SunIcon className="absolute scale-0 dark:scale-100" />
      <span className="sr-only">Promijeni temu</span>
    </Button>
  );
};

export { ModeToggle };
