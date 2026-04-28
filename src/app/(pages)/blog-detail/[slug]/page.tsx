import type { ComponentType } from "react";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { blogPosts, sortedBlogPosts } from "@/assets/data/blog-posts";
import {
  formatDisplayTime,
  formatPostDisplayDate,
  getPostIsoDateTime,
} from "@/lib/blog";
import {
  SITE_APP_ICON_192_PATH,
  SITE_LANGUAGE_TAG,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

import Blog from "@/components/blocks/blog-related-post/blog-related-post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DynamicToc } from "@/components/table-of-contents/dynamic-toc";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((candidate) => candidate.slug === slug);

  if (!post) return {};

  const postUrl = `${SITE_URL}/blog-detail/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.keywords,
    alternates: {
      canonical: `/blog-detail/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: getPostIsoDateTime(post),
      authors: [post.author],
      section: post.category,
      url: postUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}${post.socialImageUrl}`,
          width: 1200,
          height: 630,
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${SITE_URL}${post.socialImageUrl}`],
    },
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

const PostNavigation = ({
  currentPost,
}: {
  currentPost: (typeof blogPosts)[0];
}) => {
  const currentIndex = sortedBlogPosts.findIndex(
    (post) => post.slug === currentPost.slug,
  );

  const newerPost = currentIndex > 0 ? sortedBlogPosts[currentIndex - 1] : null;

  const olderPost =
    currentIndex < sortedBlogPosts.length - 1
      ? sortedBlogPosts[currentIndex + 1]
      : null;

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-between">
      {newerPost ? (
        <Button
          className="justify-start rounded-full"
          variant="outline"
          asChild
        >
          <Link href={`/blog-detail/${newerPost.slug}`}>
            <ChevronLeftIcon className="size-4" />
            Newer post
          </Link>
        </Button>
      ) : (
        <Button
          className="justify-start rounded-full"
          variant="outline"
          disabled
        >
          <ChevronLeftIcon className="size-4" />
          Newer post
        </Button>
      )}

      {olderPost ? (
        <Button
          className="justify-end rounded-full border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground sm:ml-auto"
          variant="outline"
          asChild
        >
          <Link href={`/blog-detail/${olderPost.slug}`}>
            Older post
            <ChevronRightIcon className="size-4" />
          </Link>
        </Button>
      ) : (
        <Button
          className="justify-end rounded-full border-primary/20 bg-primary/10 text-primary sm:ml-auto"
          variant="outline"
          disabled
        >
          Older post
          <ChevronRightIcon className="size-4" />
        </Button>
      )}
    </div>
  );
};

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((candidate) => candidate.slug === slug);

  if (!post) {
    notFound();
  }

  let Post: ComponentType;

  try {
    ({ default: Post } = await import(`@/content/${post.contentSlug}.mdx`));
  } catch {
    notFound();
  }

  const relatedPosts = sortedBlogPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .slice(0, 3);

  const displayTime = formatDisplayTime(post.publishedTime);
  const publishedIso = getPostIsoDateTime(post);

  return (
    <div>
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="gap-16 md:grid md:grid-cols-5 lg:grid-cols-[minmax(16rem,18rem)_minmax(0,1fr)]">
            <aside className="hidden md:block">
              <div className="sticky top-28 rounded-[1.75rem] border border-border/75 bg-card/92 p-5 shadow-sm shadow-brand-green/5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-green">
                  Contents
                </p>
                <div className="mt-4">
                  <DynamicToc />
                </div>
              </div>
            </aside>

            <div className="space-y-10">
              <header className="space-y-6 rounded-[2rem] border border-border/75 bg-card/95 p-6 shadow-sm shadow-brand-green/5 sm:p-8">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/#categories">
AI Usage Tracking
                       </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{post.category}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="rounded-full bg-brand-green/10 text-brand-green border-0 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
                    {post.category}
                  </Badge>
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.18em]">
                    {post.readTime} min read
                  </span>
                </div>

                <div className="space-y-4">
                  <h1 className="font-serif text-4xl leading-none tracking-tight text-balance text-foreground sm:text-5xl">
                    {post.title}
                  </h1>
                  <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                    {post.description}
                  </p>
                </div>

                <Separator />

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11 border border-border/70">
                      <AvatarImage src={post.avatarUrl} alt={post.author} />
                      <AvatarFallback className="text-xs">
                        {post.author
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Author
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {post.author}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-left sm:text-right">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Published
                    </p>
                    <time
                      dateTime={publishedIso}
                      className="text-sm font-semibold text-foreground"
                    >
                      {displayTime
                        ? `${formatPostDisplayDate(post)} at ${displayTime}`
                        : formatPostDisplayDate(post)}
                    </time>
                  </div>
                </div>
              </header>

              <div className="overflow-hidden rounded-[2rem] border border-border/75 bg-card/90 p-2 shadow-sm shadow-brand-green/5">
                <Image
                  src={post.imageUrl}
                  alt={post.imageAlt}
                  width={1200}
                  height={630}
                  priority
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="h-auto w-full rounded-[1.5rem] object-cover"
                />
              </div>

              <article
                id="content"
                className="editorial-content rounded-[2rem] border border-border/75 bg-card/95 p-6 shadow-sm shadow-brand-green/5 sm:p-8"
              >
                <Post />
              </article>

              <PostNavigation currentPost={post} />
            </div>
          </div>
        </div>
      </section>

      <Blog blogPosts={relatedPosts} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BlogPosting",
                "@id": `${SITE_URL}/blog-detail/${post.slug}#article`,
                headline: post.title,
                description: post.description,
                image: `${SITE_URL}${post.socialImageUrl}`,
                datePublished: publishedIso,
                dateModified: publishedIso,
                author: {
                  "@type": "Person",
                  name: post.author,
                  url: `${SITE_URL}/about`,
                },
                publisher: {
                  "@type": "Organization",
                  name: SITE_NAME,
                  url: SITE_URL,
                  logo: {
                    "@type": "ImageObject",
                    url: `${SITE_URL}${SITE_APP_ICON_192_PATH}`,
                  },
                },
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `${SITE_URL}/blog-detail/${post.slug}`,
                },
                articleSection: post.category,
                wordCount: post.readTime * 200,
                inLanguage: SITE_LANGUAGE_TAG,
                isPartOf: {
                  "@type": "Blog",
                  "@id": `${SITE_URL}/#blog`,
                  name: SITE_NAME,
                  url: SITE_URL,
                },
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
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "AI Usage Tracking",
                    item: `${SITE_URL}/#categories`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: post.category,
                  },
                ],
              },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}