import { type BlogPost, comparePostsByPublishedAt } from "@/lib/blog";

const DEFAULT_AUTHOR = "AUG Bot";
const DEFAULT_AVATAR = "/images/avatars/1.webp";

const AI_USAGE = "AI Usage" as const;
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by bot-generated PRs
const NEWS = AI_USAGE;

export const getPostImagePath = (slug: string) => `/images/posts/${slug}.webp`;
export const getPostSocialImagePath = (slug: string) =>
  `/images/posts/${slug}.png`;

export const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "")
    .replaceAll(/-{2,}/g, "-");

type SourcePost = Omit<
  BlogPost,
  "author" | "avatarUrl" | "imageUrl" | "socialImageUrl" | "slug" | "contentSlug" | "category"
> & {
  slug: string;
  category?: typeof AI_USAGE;
} & Partial<Pick<BlogPost, "author" | "avatarUrl" | "imageUrl">>;

const createPost = (post: SourcePost): BlogPost => {
  const {
    slug: contentSlug,
    author = DEFAULT_AUTHOR,
    avatarUrl = DEFAULT_AVATAR,
    imageUrl,
    ...rest
  } = post;

  const slug = slugify(post.title);

  return {
    author,
    avatarUrl,
    contentSlug,
    slug,
    imageUrl: imageUrl ?? getPostImagePath(slug),
    socialImageUrl: getPostSocialImagePath(slug),
    category: AI_USAGE,
    ...rest,
  };
};

export const blogPosts: BlogPost[] = [
  createPost({
    id: 1,
    slug: "ai-usage-global-is-now-live",
    title: "AI Usage Global is now live",
    description:
      "AI Usage Global launches as a daily publication tracking the real cost of AI — water consumption, energy use, rising compute costs, and environmental impact worldwide.",
    imageAlt: "AI Usage Global launch announcement",
    publishedOn: "2026-04-22",
    readTime: 2,
    featured: true,
  }),
  createPost({
    id: 2,
    slug: "uk-ai-offshoring-energy-costs",
    title: "UK Firms Offshoring AI Workloads Due to High Energy Costs",
    description:
      "A new report finds that 20% of UK firms have moved AI workloads abroad as high electricity prices and grid bottlenecks hinder domestic AI infrastructure growth.",
    imageAlt: "Data center infrastructure and energy grid",
    publishedOn: "2026-04-22",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 3,
    slug: "ai-server-component-shortages",
    title: "AI Server Demand Triggers Global Component Shortage for 2026",
    description:
      "TrendForce downgrades server growth forecasts as AI hardware demand creates critical shortages of power and management chips, with lead times stretching up to 40 weeks.",
    imageAlt: "Server rack and semiconductor components",
    publishedOn: "2026-04-23",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 4,
    slug: "deepseek-v4-efficiency-gains",
    title: "DeepSeek V4 Slashes Inference Costs with New Architecture",
    description:
      "DeepSeek V4 introduces hybrid attention mechanisms and 4-bit precision to reduce KV cache memory usage by up to 13x, significantly lowering inference costs.",
    imageAlt: "Abstract representation of neural network architecture and data compression",
    publishedOn: "2026-04-24",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 5,
    slug: "ai-gas-power-emissions",
    title: "AI Gas Power Plans Could Emit 129 Million Tons a Year",
    description:
      "A WIRED review of air permits finds 11 gas-powered AI data center projects could emit more than 129 million tons of greenhouse gases per year.",
    imageAlt: "Data center campus with gas power infrastructure and emissions",
    publishedOn: "2026-04-25",
    readTime: 4,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 6,
    slug: "maine-blocks-ai-datacenter-moratorium",
    title: "Maine Governor Vetoes First-in-Nation AI Data Center Moratorium",
    description:
      "Governor Janet Mills vetoes legislation that would have established the first statewide freeze on AI data center construction, citing local economic impacts.",
    imageAlt: "Data center facility in a landscape",
    publishedOn: "2026-04-25",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 7,
    slug: "ai-data-center-energy-bill-spikes",
    title: "AI Data Centers Drive Double-Digit Spikes in US Residential Energy Bills",
    description:
      "New data shows AI data center expansion is driving up residential utility bills in 13 states, with some areas seeing costs increase by up to 267% over five years.",
    imageAlt: "Residential power lines and data center infrastructure",
    publishedOn: "2026-04-26",
    readTime: 4,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 8,
    slug: "nv-energy-data-center-power-demand",
    title: "Nevada's NV Energy Faces Massive Power Demand from AI Data Centers",
    description:
      "NV Energy reports that proposed AI data centers will require three times the electricity of Las Vegas, threatening the state's 50% renewable energy target by 2030.",
    imageAlt: "Aerial view of solar panels and data center infrastructure in the Nevada desert",
    publishedOn: "2026-04-27",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 9,
    slug: "oracle-project-jupiter-bloom-fuel-cells",
    title: "Oracle to Power Project Jupiter with 2.45 GW of Bloom Fuel Cells",
    description:
      "Oracle and BorderPlex pivot to a massive water-efficient Bloom fuel cell microgrid to power their New Mexico AI campus, bypassing grid constraints.",
    imageAlt: "Aerial view of a data center campus with fuel cell infrastructure",
    publishedOn: "2026-04-28",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 10,
    slug: "ai-data-center-moratorium-act",
    title: "Sanders and AOC Propose Federal AI Data Center Moratorium Act",
    description:
      "A landmark federal bill seeks to pause new US AI data center construction until environmental, energy, and resource safeguards are established.",
    imageAlt: "Federal building and data center infrastructure representation",
    publishedOn: "2026-04-29",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 11,
    slug: "los-alamos-ai-supercomputer-water-usage",
    title: "Los Alamos AI Supercomputer Expansion to Double Water Consumption",
    description:
      "A massive expansion at Los Alamos National Laboratory, including a new 100,000-square-foot AI supercomputer facility, is projected to consume 1.4 million gallons of water daily.",
    imageAlt: "Supercomputer components and cooling infrastructure",
    publishedOn: "2026-04-30",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 12,
    slug: "google-anthropic-gigawatt-ai-deal",
    title: "Google and Anthropic Negotiate 5 GW AI Infrastructure Deal",
    description:
      "Google and Anthropic are reportedly negotiating a landmark $40 billion deal that includes a 5-gigawatt compute commitment, signaling a shift toward utility-scale AI infrastructure.",
    imageAlt: "Hyperscale data center servers and infrastructure",
    publishedOn: "2026-05-01",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 13,
    slug: "microsoft-ai-capex-surge-2026",
    title: "Microsoft Lifts 2026 AI Capital Expenditure to $190 Billion",
    description:
      "Microsoft increases its 2026 capital expenditure to $190 billion, citing a $25 billion surge in component costs as memory and storage prices triple.",
    imageAlt: "Digital representation of data center hardware and capital investment",
    publishedOn: "2026-05-02",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 14,
    slug: "lumai-optical-ai-energy-savings",
    title: "Optical AI Startups Target 90% Energy Reduction for Inference",
    description:
      "UK startup Lumai launches the first optical computing system to run billion-parameter AI models in real-time, targeting 90% energy savings over traditional silicon architectures.",
    imageAlt: "Optical computing architecture and laser-based data processing",
    publishedOn: "2026-05-03",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 15,
    slug: "nc-ai-infrastructure-resource-bill",
    title: "North Carolina Bill Targets AI Data Center Resource Costs",
    description:
      "A new North Carolina bill proposes requiring AI data centers over 40 MW to pay full infrastructure costs and install 25% on-site clean generation.",
    imageAlt: "Digital representation of a data center and energy grid infrastructure in North Carolina",
    publishedOn: "2026-05-04",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 16,
    slug: "openai-50-billion-compute-burn",
    title: "OpenAI Projects $50 Billion Compute Spend for 2026",
    description:
      "OpenAI expects to spend $50 billion on computing power by the end of 2026, as Greg Brockman reveals massive infrastructure commitments tied to billions in partner investments.",
    imageAlt: "Digital representation of massive data center infrastructure and capital flow",
    publishedOn: "2026-05-05",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 17,
    slug: "texas-datacenter-water-use-projections",
    title: "Texas Data Centers Projected to Use 9% of State Water by 2040",
    description:
      "A new UT Austin study warns that booming AI data center infrastructure could account for 9% of Texas water use by 2040, up from less than 1% today.",
    imageAlt: "Data center server racks and water cooling infrastructure representation in Texas",
    publishedOn: "2026-05-06",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 18,
    slug: "us-local-governance-ai-data-center-impacts",
    title: "US Communities Unprepared for AI Data Center Resource Demands",
    description:
      "A new Washington & Jefferson College study warns that AI infrastructure growth is outpacing local governance, threatening power grids and watersheds.",
    imageAlt: "Digital representation of a data center facility impacting local environment and resources",
    publishedOn: "2026-05-07",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 19,
    slug: "florida-protects-ratepayers-ai-infrastructure-costs",
    title: "Florida Law Blocks AI Data Center Costs for Residential Ratepayers",
    description:
      "Governor Ron DeSantis signs SB 484 to shield Florida utility customers from subsidizing the massive infrastructure and energy costs of hyper-scale AI data centers.",
    imageAlt: "Digital representation of a data center and power lines in Florida",
    publishedOn: "2026-05-08",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
  createPost({
    id: 20,
    slug: "oleary-utah-ai-data-center-approval",
    title: "O'Leary's Massive Utah AI Data Center Project Wins Key Approval",
    description:
      "Utah's Box Elder County approves the 40,000-acre Stratos Project Area, a hyperscale AI data center campus projected to consume more than twice the electricity of the entire state.",
    imageAlt: "Digital representation of a massive data center campus in a rural Utah landscape",
    publishedOn: "2026-05-09",
    readTime: 3,
    featured: false,
    category: AI_USAGE,
  }),
];

const assertUniqueField = (
  posts: BlogPost[],
  fieldName: "id" | "slug" | "contentSlug",
) => {
  const values = new Set<string | number>();

  for (const post of posts) {
    const value = post[fieldName];

    if (values.has(value)) {
      throw new Error(`Duplicate blog post ${fieldName} detected: ${value}`);
    }

    values.add(value);
  }
};

export const assertUniqueBlogPosts = (posts: BlogPost[]) => {
  assertUniqueField(posts, "id");
  assertUniqueField(posts, "slug");
  assertUniqueField(posts, "contentSlug");
};

assertUniqueBlogPosts(blogPosts);

export const sortedBlogPosts = [...blogPosts].sort(comparePostsByPublishedAt);