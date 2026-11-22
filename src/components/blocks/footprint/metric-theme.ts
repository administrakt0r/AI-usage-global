import {
  CloudIcon,
  DropletsIcon,
  ServerIcon,
  ZapIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type MetricTheme = {
  icon: LucideIcon;

  /** Card surface: soft tinted gradient + coloured border. */
  card: string;

  /** Round icon badge. */
  badge: string;

  /** Gradient text for the big number. */
  number: string;

  /** Small accent text (comparison values, labels). */
  accent: string;
};

const THEMES: Record<string, MetricTheme> = {
  "ai-electricity": {
    icon: ZapIcon,
    card: "border-amber-500/30 bg-linear-to-br from-amber-500/12 via-card to-card dark:from-amber-400/10",
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    number: "bg-linear-to-r from-amber-500 to-orange-600 dark:from-amber-300 dark:to-orange-400",
    accent: "text-amber-700 dark:text-amber-300",
  },
  "datacenter-electricity": {
    icon: ServerIcon,
    card: "border-violet-500/30 bg-linear-to-br from-violet-500/12 via-card to-card dark:from-violet-400/10",
    badge: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
    number: "bg-linear-to-r from-violet-500 to-indigo-600 dark:from-violet-300 dark:to-indigo-300",
    accent: "text-violet-700 dark:text-violet-300",
  },
  "ai-water": {
    icon: DropletsIcon,
    card: "border-sky-500/30 bg-linear-to-br from-sky-500/12 via-card to-card dark:from-sky-400/10",
    badge: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
    number: "bg-linear-to-r from-sky-500 to-blue-600 dark:from-sky-300 dark:to-blue-300",
    accent: "text-sky-700 dark:text-sky-300",
  },
  "ai-emissions": {
    icon: CloudIcon,
    card: "border-rose-500/30 bg-linear-to-br from-rose-500/12 via-card to-card dark:from-rose-400/10",
    badge: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    number: "bg-linear-to-r from-rose-500 to-red-600 dark:from-rose-300 dark:to-red-300",
    accent: "text-rose-700 dark:text-rose-300",
  },
};

export const getMetricTheme = (id: string): MetricTheme =>
  THEMES[id] ?? THEMES["ai-electricity"];
