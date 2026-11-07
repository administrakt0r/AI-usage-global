"use client";

import Link from "next/link";
import { GithubIcon, MailIcon, MenuIcon } from "lucide-react";

import type { NavigationSection } from "@/components/blocks/menu-navigation";
import MenuDropdown from "@/components/blocks/menu-dropdown";
import MenuNavigation from "@/components/blocks/menu-navigation";
import { ModeToggle } from "@/components/layout/mode-toggle";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrollState } from "@/hooks/use-scroll-state";
import { cn } from "@/lib/utils";

type HeaderProps = {
  navigationData: NavigationSection[];
  className?: string;
};

const Header = ({ navigationData, className }: HeaderProps) => {
  const isScrolled = useScrollState();
  const activeSection = useActiveSection();

  return (
    <header
      className={cn(
        "bg-background sticky top-0 z-50 h-16 w-full transition-all duration-300",
        { "shadow-sm": isScrolled },
        className,
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/#home">
          <Logo />
        </Link>

        <MenuNavigation
          navigationData={navigationData}
          activeSection={activeSection}
          className="max-lg:hidden"
        />

        <div className="flex gap-3">
          <ModeToggle />
          <Button variant="outline" className="max-md:hidden" asChild>
            <a
              href="https://github.com/administrakt0r/ai-usage-global"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="size-4" />
              GitHub
            </a>
          </Button>
          <Button variant="outline" className="max-sm:hidden" asChild>
            <Link href="/contact-us">Contact</Link>
          </Button>

          <div className="flex gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  asChild
                >
                  <a
                    href="https://github.com/administrakt0r/ai-usage-global"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon />
                    <span className="sr-only">GitHub repo</span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>GitHub repo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="sm:hidden"
                  asChild
                >
                  <Link href="/contact-us">
                    <MailIcon />
                    <span className="sr-only">Contact</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Contact</TooltipContent>
            </Tooltip>

            <MenuDropdown
              align="end"
              navigationData={navigationData}
              activeSection={activeSection}
              tooltip="Menu"
              trigger={
                <Button variant="outline" size="icon" className="lg:hidden">
                  <MenuIcon />
                  <span className="sr-only">Menu</span>
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;