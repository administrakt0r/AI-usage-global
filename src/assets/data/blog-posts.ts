import { type BlogPost, comparePostsByPublishedAt } from "@/lib/blog";

const DEFAULT_AUTHOR = "AUG Bot";
const DEFAULT_AVATAR = "/images/avatars/1.webp";

const NEWS = "AI News" as const;
const ANALYSIS = "Analysis" as const;

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
  "author" | "avatarUrl" | "imageUrl" | "socialImageUrl" | "slug" | "contentSlug"
> & {
  slug: string;
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
    ...rest,
  };
};

export const blogPosts: BlogPost[] = [
  createPost({
    id: 1,
    slug: "ai-usage-global-is-now-live",
    title: "AI Usage Global is now live",
    description:
      "AI Usage Global is a daily English-language AI news site focused on real-world usage, regulation, adoption, and impact. Our autonomous publishing system will begin posting daily stories shortly.",
    imageAlt: "AI Usage Global launch announcement",
    publishedOn: "2026-04-22",
    category: NEWS,
    readTime: 2,
    featured: true,
  }),
  createPost({
    id: 2,
    slug: "iea-ai-data-center-energy-triple-2030",
    title: "IEA: AI data center energy use set to triple by 2030",
    description:
      "Electricity demand from AI-focused data centers is projected to triple by 2030 as the sector faces infrastructure bottlenecks and surging capital investments.",
    imageAlt: "Data center energy infrastructure",
    publishedOn: "2026-04-22",
    category: NEWS,
    readTime: 3,
    featured: false,
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
