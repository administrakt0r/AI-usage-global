import type { Metadata } from "next";

import {
  CONTACT_EMAIL,
  RESPONSIBLE_AI_INITIATIVE_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Responsible AI Usage Policy",
  description:
    "AI Usage Global's principles for transparent, accountable AI usage reporting — covering data center water, energy, costs, and environmental impact with open disclosure.",
  keywords: [
    "responsible AI usage",
    "AI transparency",
    "autonomous publishing ethics",
    "AI environmental accountability",
    "responsible AI policy",
  ],
  alternates: {
    canonical: "/responsible-ai-usage",
  },
  openGraph: {
    title: `Responsible AI Usage Policy - ${SITE_NAME}`,
    description:
      "Our rules for transparent, responsible AI usage reporting with a focus on resource costs, environmental accountability, and open autonomous publishing.",
    type: "website",
    url: `${SITE_URL}/responsible-ai-usage`,
  },
};

export default function ResponsibleAIPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Responsible AI Usage Policy",
    description:
      "Our principles for transparent, accountable AI usage reporting — covering data center water, energy, costs, and environmental impact.",
    url: `${SITE_URL}/responsible-ai-usage`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <div className="container mx-auto my-8 min-h-[60vh] max-w-4xl rounded-xl border border-border/75 bg-card/85 px-4 py-16 shadow-sm shadow-brand-green/5 ring-1 ring-green-500/10 dark:ring-green-400/15 sm:px-6 lg:px-8">
      <div className="editorial-content max-w-none">
        <p className="eyebrow text-brand-green">Responsible AI</p>
        <h1>Responsible AI Usage Policy</h1>
        <p>
          This blog participates in the{" "}
          <a
            href={RESPONSIBLE_AI_INITIATIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold"
          >
            Responsible AI Usage
          </a>{" "}
          initiative.
        </p>

        <h2>Our principles</h2>
        <ul>
          <li>
            <strong>Transparency:</strong> All AI-generated content on the
            platform is clearly labeled and identifiable.
          </li>
          <li>
            <strong>Accuracy in resource reporting:</strong> When we cite water
            consumption, energy usage, carbon emissions, cost figures, or
            infrastructure data, we link to the original source and avoid
            misrepresenting numbers.
          </li>
          <li>
            <strong>Autonomy with accountability:</strong> Although the blog
            operates autonomously, we maintain a clear process for reporting and
            removing inaccurate or misleading content about AI&apos;s resource
            footprint.
          </li>
          <li>
            <strong>Open disclosure:</strong> Readers and search engines are
            clearly informed that content is produced through an autonomous AI
            system focused on tracking AI&apos;s real resource cost.
          </li>
        </ul>

        <h2>How we work</h2>
        <p>
          {SITE_NAME} is developed and maintained by{" "}
          <a
            href="https://administraktor.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            administraktor.com
          </a>
          . The blog uses an automated pipeline for daily monitoring, selection,
          and publication of stories about AI water use, energy consumption,
          compute costs, and environmental impact. All content is delivered
          through static deployment.
        </p>

        <h2>Reporting problems</h2>
        <p>
          If you find inaccurate, misleading, or potentially harmful content,
          please contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. All reports
          are taken seriously and addressed as quickly as possible.
        </p>

        <h2>Learn more</h2>
        <p>
          To read more about the principles of responsible AI implementation,
          visit the initiative page:
          <br />
          <a
            href={RESPONSIBLE_AI_INITIATIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold"
          >
            responsible-ai-usage.vercel.app
          </a>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}