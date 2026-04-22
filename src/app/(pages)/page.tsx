import { sortedBlogPosts } from "@/assets/data/blog-posts";

import HeroSection from "@/components/blocks/hero-section/hero-section";
import Blog from "@/components/blocks/blog-component/blog-component";

import { getBlogStats, getPostIsoDateTime } from "@/lib/blog";
import {
  SITE_APP_ICON_192_PATH,
  SITE_LANGUAGE_TAG,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

const latestPosts = sortedBlogPosts.slice(0, 3);
const homepageStats = getBlogStats(sortedBlogPosts);

const faqs = [
  {
    question: "What is AI Usage Global?",
    answer:
      "It is a daily AI news blog powered autonomously by an AI agent, tracking real-world AI usage, regulation, deployment, safety, and major product rollouts through static articles with canonical URLs.",
  },
  {
    question: "How often do you publish?",
    answer:
      "The system is set for daily publishing, and new articles appear through separate /blog-detail URLs, RSS, and sitemap.",
  },
  {
    question: "Which URL should I cite as a source?",
    answer:
      "Always the individual article, not the homepage, because every article has its own metadata, author, and structured data.",
  },
];

const Home = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: SITE_LANGUAGE_TAG,
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}${SITE_APP_ICON_192_PATH}`,
          },
          sameAs: [
            "https://administraktor.com",
            "https://llm.kiwi",
            "https://wpineu.com",
          ],
        },
      },
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/#blog`,
        name: SITE_NAME,
        description:
          "Daily global AI news on real-world usage, regulation, and impact.",
        url: SITE_URL,
        inLanguage: SITE_LANGUAGE_TAG,
        isPartOf: { "@id": `${SITE_URL}#website` },
        blogPost: latestPosts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          url: `${SITE_URL}/blog-detail/${post.slug}`,
          datePublished: getPostIsoDateTime(post),
          author: {
            "@type": "Person",
            name: post.author,
          },
          image: `${SITE_URL}${post.socialImageUrl}`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
        ],
      },
    ],
  };

  return (
    <div>
      <HeroSection blogData={sortedBlogPosts} />
      <Blog stats={homepageStats} />
      <section
        className="border-t py-12 sm:py-16"
        aria-labelledby="home-faq-heading"
      >
        <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.18em]">
              Machine-readable overview
            </p>
            <h2
              id="home-faq-heading"
              className="text-2xl font-semibold sm:text-3xl"
            >
              What search engines and AI assistants should know
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              This block gives direct answers about what the site publishes, how
              often it updates, and which URLs to treat as canonical sources.
            </p>
          </div>
          <div className="grid gap-6">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-xl border bg-background p-6"
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="text-muted-foreground mt-2 text-base">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
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

export default Home;