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