import type { MetadataRoute } from "next";

import { sortedBlogPosts } from "@/assets/data/blog-posts";

import { getPostMachineDate } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const latestPublishedAt =
    sortedBlogPosts.length > 0
      ? getPostMachineDate(sortedBlogPosts[0])
      : new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: latestPublishedAt,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: latestPublishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact-us`,
      lastModified: latestPublishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/responsible-ai-usage`,
      lastModified: latestPublishedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = sortedBlogPosts.map((post) => ({
    url: `${SITE_URL}/blog-detail/${post.slug}`,
    lastModified: getPostMachineDate(post),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes];
}
