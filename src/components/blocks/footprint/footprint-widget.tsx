import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { footprint, formatCompact } from "@/lib/footprint";
import { cn } from "@/lib/utils";

import LiveCounter from "./live-counter";
import { getMetricTheme } from "./metric-theme";

const WIDGET_METRICS = ["ai-electricity", "ai-water", "ai-emissions"];

/** Compact homepage band linking to the full /ai-footprint tracker. */
const FootprintWidget = () => {
  const metrics = footprint.metrics.filter((metric) =>
    WIDGET_METRICS.includes(metric.id),
  );

  return (
    <section
      aria-labelledby="footprint-widget-heading"
      className="border-b bg-background py-10 sm:py-14"
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
            See all figures and sources
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => {
            const theme = getMetricTheme(metric.id);
            const Icon = theme.icon;

            return (
              <li
                key={metric.id}
                className={cn(
                  "flex flex-col gap-3 rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md",
                  theme.card,
                )}
              >
                <p className="flex items-center gap-2.5 text-sm font-semibold">
                  <span
                    className={cn(
                      "inline-flex size-8 items-center justify-center rounded-full",
                      theme.badge,
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {metric.label}
                </p>
                <LiveCounter
                  metric={metric}
                  comparisons={metric.comparisons?.slice(0, 1)}
                  className="text-[1.65rem] font-bold leading-tight sm:text-3xl md:text-[1.7rem] lg:text-3xl"
                  numberClassName={cn("text-transparent", theme.number)}
                  accentClassName={theme.accent}
                />
                <p className="text-muted-foreground mt-auto border-t border-current/10 pt-3 text-xs">
                  About {formatCompact(metric.annual.central)} {metric.unit} a
                  year (range {formatCompact(metric.annual.low)}–
                  {formatCompact(metric.annual.high)})
                </p>
              </li>
            );
          })}
        </ul>
        <p className="text-muted-foreground text-xs">
          Modelled estimates from the IEA, UNU-INWEH and peer-reviewed research,
          last reviewed {footprint.lastReviewed}. The counters spread each
          yearly estimate evenly over the year, so they aren&apos;t live meter
          readings.
        </p>
      </div>
    </section>
  );
};

export default FootprintWidget;
