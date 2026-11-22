import type { Metadata } from "next";
import Link from "next/link";

import LiveCounter from "@/components/blocks/footprint/live-counter";
import { getMetricTheme } from "@/components/blocks/footprint/metric-theme";

import { footprint, formatCompact, getSource } from "@/lib/footprint";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const PAGE_DESCRIPTION =
  "Live estimates of global AI electricity use, water footprint and carbon emissions, with low and high ranges, methodology and sources from IEA, UNU-INWEH and peer-reviewed research.";

export const metadata: Metadata = {
  title: "Global AI Footprint Tracker: Power, Water and Carbon",
  description: PAGE_DESCRIPTION,
  keywords: [
    "AI electricity consumption",
    "AI water usage",
    "data center energy use 2026",
    "AI carbon emissions",
    "AI footprint tracker",
  ],
  alternates: { canonical: "/ai-footprint" },
  openGraph: {
    title: `Global AI Footprint Tracker - ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/ai-footprint`,
  },
};

const AiFootprintPage = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Global AI Footprint Tracker",
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/ai-footprint`,
    dateModified: footprint.lastReviewed,
    temporalCoverage: String(footprint.estimateYear),
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    isBasedOn: footprint.sources.map((source) => source.url),
    variableMeasured: footprint.metrics.map((metric) => ({
      "@type": "PropertyValue",
      name: metric.label,
      unitText: `${metric.unit} per year`,
      value: metric.annual.central,
      minValue: metric.annual.low,
      maxValue: metric.annual.high,
    })),
  };

  return (
    <div className="mx-auto my-8 w-full max-w-6xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-3xl space-y-3">
        <p className="text-brand-green text-sm font-medium uppercase tracking-[0.18em]">
          AI footprint tracker
        </p>
        <h1 className="text-3xl font-semibold text-balance sm:text-4xl">
          How much power and water does AI use right now?
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Our best estimate for {footprint.estimateYear}, built from the
          latest IEA, United Nations University and peer-reviewed figures.
          Counters run from 1 January (UTC) at the central estimate. Every
          number has a range, because the studies disagree.
        </p>
        <p className="text-muted-foreground text-sm">
          Last reviewed{" "}
          <time dateTime={footprint.lastReviewed}>{footprint.lastReviewed}</time>{" "}
          by {footprint.reviewedBy}. The bot re-checks the sources every week.
        </p>
      </header>

      <section aria-label="Live counters" className="grid gap-5 sm:grid-cols-2">
        {footprint.metrics.map((metric) => {
          const theme = getMetricTheme(metric.id);
          const Icon = theme.icon;

          const comparisonSourceIds = [
            ...new Set(metric.comparisons?.flatMap((item) => item.sourceIds) ?? []),
          ];

          return (
            <article
              key={metric.id}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border p-6 shadow-sm",
                theme.card,
              )}
            >
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <span
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-full",
                    theme.badge,
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {metric.label}
              </h2>
              <p className="text-muted-foreground text-sm">{metric.scope}</p>
              <div>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                  This year so far
                </p>
                <LiveCounter
                  metric={metric}
                  comparisons={metric.comparisons}
                  className="text-3xl font-bold sm:text-4xl"
                  numberClassName={cn("text-transparent", theme.number)}
                  comparisonClassName="mt-3"
                  accentClassName={theme.accent}
                />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                  Since you opened this page
                </p>
                <LiveCounter
                  metric={metric}
                  mode="session"
                  className={cn("text-xl font-semibold", theme.accent)}
                />
              </div>
              <dl className="grid grid-cols-3 gap-2 border-t pt-3 text-sm">
                {(["low", "central", "high"] as const).map((key) => (
                  <div key={key}>
                    <dt className="text-muted-foreground text-xs capitalize">
                      {key === "central" ? "Central" : key}
                    </dt>
                    <dd className="font-semibold">
                      {formatCompact(metric.annual[key])} {metric.unit}
                    </dd>
                  </div>
                ))}
              </dl>
              {(metric.baseline || metric.projection) && (
                <ul className="text-muted-foreground space-y-1 text-sm">
                  {metric.baseline && (
                    <li>
                      <strong className="text-foreground">
                        {metric.baseline.year}:
                      </strong>{" "}
                      {formatCompact(metric.baseline.value)} {metric.unit}.{" "}
                      {metric.baseline.note}
                    </li>
                  )}
                  {metric.projection && (
                    <li>
                      <strong className="text-foreground">
                        {metric.projection.year}:
                      </strong>{" "}
                      {formatCompact(metric.projection.value)} {metric.unit}.{" "}
                      {metric.projection.note}
                    </li>
                  )}
                </ul>
              )}
              <details className="text-sm">
                <summary className="cursor-pointer font-medium">
                  How we got this number
                </summary>
                <p className="text-muted-foreground mt-2">{metric.derivation}</p>
                <p className="text-muted-foreground mt-2">
                  Sources:{" "}
                  {metric.sourceIds.map((id, index) => {
                    const source = getSource(id);

                    return source ? (
                      <span key={id}>
                        {index > 0 && ", "}
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {source.publisher}
                        </a>
                      </span>
                    ) : null;
                  })}
                </p>
                {comparisonSourceIds.length > 0 && (
                  <p className="text-muted-foreground mt-2">
                    Comparisons use:{" "}
                    {comparisonSourceIds.map((id, index) => {
                      const source = getSource(id);

                      return source ? (
                        <span key={id}>
                          {index > 0 && "; "}
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {source.title}
                          </a>
                        </span>
                      ) : null;
                    })}
                  </p>
                )}
              </details>
            </article>
          );
        })}
      </section>

      <section className="editorial-content max-w-3xl space-y-4">
        <h2>Methodology</h2>
        <p>{footprint.methodology}</p>
        <p>
          Water figures include water used to generate electricity as well as
          on-site cooling. UNU-INWEH estimates power generation accounts for
          about half of the data-centre water footprint, so the totals here
          are larger than the water companies report at their own sites.
        </p>
        <h2>Sources</h2>
        <ul>
          {footprint.sources.map((source) => (
            <li key={source.id}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.title}
              </a>{" "}
              — {source.publisher} ({source.published})
            </li>
          ))}
        </ul>
        <h2>Revision history</h2>
        <ul>
          {[...footprint.history].reverse().map((entry) => (
            <li key={`${entry.date}-${entry.note}`}>
              <time dateTime={entry.date}>{entry.date}</time>: {entry.note}
            </li>
          ))}
        </ul>
        <p>
          Spot an outdated figure? See our{" "}
          <Link href="/responsible-ai-usage">responsible AI policy</Link> or{" "}
          <Link href="/contact-us">contact us</Link>.
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
};

export default AiFootprintPage;
