"use client";

import { ArrowUpIcon } from "lucide-react";

import { useScrollState } from "@/hooks/use-scroll-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ScrollToTop = () => {
  const isVisible = useScrollState(400);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "fixed right-6 bottom-6 z-50 rounded-full shadow-lg transition-all duration-300",
            isVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-10 opacity-0",
          )}
          onClick={scrollToTop}
          aria-label="Back to top"
          tabIndex={isVisible ? 0 : -1}
          aria-hidden={!isVisible}
        >
          <ArrowUpIcon className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={12}>
        Back to top
      </TooltipContent>
    </Tooltip>
  );
};

export { ScrollToTop };
