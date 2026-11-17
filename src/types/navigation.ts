import type { ReactNode } from "react";

export type NavigationItem = {
  title: string;
  href: string;
};

export type NavigationSection = {
  title: string;
  icon?: ReactNode;
} & (
  | {
      items: NavigationItem[];
      href?: never;
    }
  | {
      items?: never;
      href: string;
    }
);
