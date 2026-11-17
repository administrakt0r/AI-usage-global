import footprintData from "@/assets/data/ai-footprint.json";

export type FootprintRange = { low: number; central: number; high: number };

export type FootprintPoint = { year: number; value: number; note: string };

export type FootprintMetric = {
  id: string;
  label: string;
  scope: string;
  unit: string;
  annual: FootprintRange;
  baseline?: FootprintPoint;
  projection?: FootprintPoint;
  derivation: string;
  sourceIds: string[];
};

export type FootprintSource = {
  id: string;
  title: string;
  publisher: string;
  published: string;
  url: string;
};

export type FootprintData = {
  version: number;
  lastReviewed: string;
  estimateYear: number;
  reviewedBy: string;
  methodology: string;
  metrics: FootprintMetric[];
  sources: FootprintSource[];
  history: { date: string; note: string }[];
};

export const footprint = footprintData as FootprintData;

/** Multiplier from the metric's annual unit to the unit shown on live counters. */
const COUNTER_UNITS: Record<string, { unit: string; factor: number }> = {
  TWh: { unit: "kWh", factor: 1e9 },
  "billion L": { unit: "L", factor: 1e9 },
  "Mt CO2": { unit: "t CO2", factor: 1e6 },
};

export const getCounterUnit = (metric: Pick<FootprintMetric, "unit">) =>
  COUNTER_UNITS[metric.unit] ?? { unit: metric.unit, factor: 1 };

const MS_PER_DAY = 86_400_000;

export const getYearBounds = (year: number) => {
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);

  return { start, end, durationMs: end - start };
};

/** Central estimate spread evenly across the year, in counter units per second. */
export const getPerSecondRate = (
  metric: Pick<FootprintMetric, "unit" | "annual">,
  year: number,
) => {
  const { factor } = getCounterUnit(metric);
  const { durationMs } = getYearBounds(year);

  return (metric.annual.central * factor) / (durationMs / 1000);
};

/** Year-to-date amount in counter units, clamped to the calendar year of `now`. */
export const getYearToDate = (
  metric: Pick<FootprintMetric, "unit" | "annual">,
  now: Date,
) => {
  const year = now.getUTCFullYear();
  const { start, end } = getYearBounds(year);
  const elapsedSeconds = (Math.min(Math.max(now.getTime(), start), end) - start) / 1000;

  return getPerSecondRate(metric, year) * elapsedSeconds;
};

export const getDaysSinceReview = (lastReviewed: string, now: Date) =>
  Math.floor((now.getTime() - Date.parse(`${lastReviewed}T00:00:00Z`)) / MS_PER_DAY);

export const isFootprintStale = (lastReviewed: string, now: Date, maxAgeDays = 7) =>
  getDaysSinceReview(lastReviewed, now) > maxAgeDays;

export const getMetric = (id: string) =>
  footprint.metrics.find((metric) => metric.id === id);

export const getSource = (id: string) =>
  footprint.sources.find((source) => source.id === id);

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const formatCompact = (value: number) => compact.format(value);

export const formatWhole = (value: number) => whole.format(value);
