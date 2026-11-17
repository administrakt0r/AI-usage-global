"use client";

import { useEffect, useState } from "react";

import type { FootprintMetric } from "@/lib/footprint";
import {
  formatWhole,
  getCounterUnit,
  getPerSecondRate,
  getYearToDate,
} from "@/lib/footprint";

type LiveCounterProps = {
  metric: Pick<FootprintMetric, "id" | "unit" | "annual">;
  mode?: "year-to-date" | "session";
  className?: string;
};

const useNow = (intervalMs: number) => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const tick = () => setNow(new Date());

    tick();

    const timer = window.setInterval(
      tick,
      prefersReducedMotion ? 5000 : intervalMs,
    );

    return () => window.clearInterval(timer);
  }, [intervalMs]);

  return now;
};

/**
 * Renders a counter that ticks up at the metric's central annual rate.
 * Server output is a placeholder so static HTML never shows a stale number.
 */
const LiveCounter = ({ metric, mode = "year-to-date", className }: LiveCounterProps) => {
  const now = useNow(250);
  const [openedAt] = useState(() => Date.now());
  const { unit } = getCounterUnit(metric);

  let value: number | null = null;

  if (now) {
    value =
      mode === "session"
        ? (getPerSecondRate(metric, now.getUTCFullYear()) *
            (now.getTime() - openedAt)) /
          1000
        : getYearToDate(metric, now);
  }

  return (
    <span className={className}>
      <span className="tabular-nums" suppressHydrationWarning>
        {value === null ? "…" : formatWhole(value)}
      </span>{" "}
      <span className="text-muted-foreground text-[0.6em] font-medium">
        {unit}
      </span>
    </span>
  );
};

export default LiveCounter;
