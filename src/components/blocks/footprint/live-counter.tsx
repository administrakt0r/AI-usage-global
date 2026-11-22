"use client";

import { useEffect, useRef, useState } from "react";

import type { FootprintComparison, FootprintMetric } from "@/lib/footprint";
import {
  formatHumanCount,
  formatWhole,
  getCounterUnit,
  getPerSecondRate,
  getYearToDate,
} from "@/lib/footprint";
import { cn } from "@/lib/utils";

type LiveCounterProps = {
  metric: Pick<FootprintMetric, "id" | "unit" | "annual">;
  mode?: "year-to-date" | "session";

  /** Everyday equivalents rendered under the number, updated live. */
  comparisons?: FootprintComparison[];
  className?: string;

  /** Extra classes for the number itself (e.g. gradient text). */
  numberClassName?: string;
  comparisonClassName?: string;
  accentClassName?: string;
};

const INTRO_MS = 2200;
const FRAME_MS = 50;
const REDUCED_FRAME_MS = 1000;

/** Ease-out quart: fast start, gentle landing on the live value. */
const easeOut = (progress: number) => 1 - (1 - progress) ** 4;

/**
 * Animated value that counts up from 0 the first time the counter scrolls
 * into view, then keeps ticking at the metric's per-second rate.
 */
const useLiveValue = (
  metric: LiveCounterProps["metric"],
  mode: NonNullable<LiveCounterProps["mode"]>,
) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const openedAt = Date.now();
    let introStart: number | null = reduceMotion || mode === "session" ? 0 : null;
    let lastPaint = -Infinity;
    let frame = 0;

    const target = (nowMs: number) => {
      const now = new Date(nowMs);

      if (mode === "session") {
        return (getPerSecondRate(metric, now.getUTCFullYear()) * (nowMs - openedAt)) / 1000;
      }

      return getYearToDate(metric, now);
    };

    const tick = (time: number) => {
      frame = window.requestAnimationFrame(tick);

      if (introStart === null || time - lastPaint < (reduceMotion ? REDUCED_FRAME_MS : FRAME_MS)) {
        return;
      }

      lastPaint = time;

      const progress = introStart === 0 ? 1 : Math.min(1, (time - introStart) / INTRO_MS);

      setValue(target(Date.now()) * easeOut(progress));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && introStart === null) {
          introStart = performance.now();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
    frame = window.requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [metric, mode]);

  return { ref, value };
};

/** Each digit sits in a fixed-width box so the number never jitters sideways. */
const StableNumber = ({ text }: { text: string }) => (
  <>
    {Array.from(text).map((char, index) => (
      <span

        // Position is the identity here: digits change in place.
         
        key={index}
        className={cn(
          "inline-block text-center",
          /\d/.test(char) ? "w-[0.6em]" : "w-[0.28em]",
        )}
      >
        {char}
      </span>
    ))}
  </>
);

const LiveCounter = ({
  metric,
  mode = "year-to-date",
  comparisons,
  className,
  numberClassName,
  comparisonClassName,
  accentClassName,
}: LiveCounterProps) => {
  const { ref, value } = useLiveValue(metric, mode);
  const { unit } = getCounterUnit(metric);

  return (
    <>
      <span ref={ref} className={cn("block whitespace-nowrap", className)}>
        <span className={cn("bg-clip-text tabular-nums", numberClassName)} aria-hidden="true">
          <StableNumber text={formatWhole(value)} />
        </span>
        <span className="sr-only">
          Counting up at the central estimate of {formatWhole(metric.annual.central)} {metric.unit} a year
        </span>{" "}
        <span className="text-muted-foreground text-[0.5em] font-medium">{unit}</span>
      </span>
      {comparisons && comparisons.length > 0 && (
        <ul className={cn("space-y-1.5 text-sm", comparisonClassName)}>
          {comparisons.map((comparison) => (
            <li key={comparison.id} className="leading-snug">
              <span className="text-muted-foreground">That&apos;s about </span>
              <span className={cn("font-semibold tabular-nums", accentClassName)}>
                {formatHumanCount(value / comparison.per)}
              </span>{" "}
              <span className="text-muted-foreground">{comparison.label}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default LiveCounter;
