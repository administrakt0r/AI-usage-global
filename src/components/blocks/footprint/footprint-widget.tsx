import Link from "next/link";
import {
  ArrowRightIcon,
  CloudIcon,
  DropletsIcon,
  ServerIcon,
  ZapIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { footprint, formatCompact } from "@/lib/footprint";

import LiveCounter from "./live-counter";

export const METRIC_ICONS: Record<string, LucideIcon> = {
  "ai-electricity": ZapIcon,
  "datacenter-electricity": ServerIcon,
  "ai-water": DropletsIcon,
  "ai-emissions": CloudIcon,
};

const WIDGET_METRICS = ["ai-electricity", "ai-water", "ai-emissions"];

/** Compact homepage band linking to the full /ai-footprint tracker. */
const FootprintWidget = () => {
  const metrics = footprint.metrics.filter((metric) =>
    WIDGET_METRICS.includes(metric.id),
  );

  return (
    <section
      aria-labelledby="footprint-widget-heading"
      className="border-b bg-background py-10 sm:py-12"
    >
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-brand-green text-sm font-medium uppercase tracking-[0.18em]">
              AI footprint tracker
            </p>
            <h2
              id="footprint-widget-heading"
              className="text-2xl font-semibold sm:text-3xl"
            >
              Estimated AI resource use this year so far
            </h2>
          </div>
          <Link
            href="/ai-footprint"
            className="text-brand-green inline-flex items-center gap-1 text-sm font-semibold hover:underline"
          >
            Methodology and sources
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = METRIC_ICONS[metric.id] ?? ZapIcon;

            return (
              <li key={metric.id} className="rounded-xl border bg-card p-5">
                <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Icon className="text-brand-green size-4" aria-hidden="true" />
                  {metric.label}
                </p>
                <LiveCounter
                  metric={metric}
                  className="mt-2 block text-2xl font-semibold sm:text-3xl"
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  ≈ {formatCompact(metric.annual.central)} {metric.unit} a year
                  (range {formatCompact(metric.annual.low)}–
                  {formatCompact(metric.annual.high)})
                </p>
              </li>
            );
          })}
        </ul>
        <p className="text-muted-foreground text-xs">
          Modelled estimates from IEA, UNU-INWEH and peer-reviewed research,
          last reviewed {footprint.lastReviewed}. Counters spread the yearly
          estimate evenly; they are not live meter readings.
        </p>
      </div>
    </section>
  );
};

export default FootprintWidget;
