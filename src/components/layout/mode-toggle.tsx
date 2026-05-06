"use client";

import { MoonStarIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ModeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const label =
    resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full"
          aria-label={label}
          aria-pressed={resolvedTheme === "dark"}
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <MoonStarIcon className="scale-100 dark:scale-0" aria-hidden="true" />
          <SunIcon
            className="absolute scale-0 dark:scale-100"
            aria-hidden="true"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export { ModeToggle };
