import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CalendarDaysIcon } from "lucide-react";

import { sortedBlogPosts as allBlogPosts } from '@/assets/data/blog-posts'
import { formatPostDisplayDate } from '@/lib/blog'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BlogProps {
  blogPosts?: typeof allBlogPosts;
}

const Blog = ({ blogPosts = allBlogPosts.slice(0, 3) }: BlogProps) => {
  if (blogPosts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border/70 py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <Badge
            variant="outline"
            className="rounded-full border-brand-blue/20 bg-brand-blue/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-brand-blue"
          >
            Povezano
          </Badge>
          <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            Pročitajte i ovo
          </h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Još nekoliko objava koje šire kontekst oko tema, kompanija i AI
            trendova iz ove priče.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card
              key={post.slug}
              className="group h-full overflow-hidden border-border/75 bg-card/95 py-0 shadow-sm shadow-brand-blue/5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/25 hover:shadow-lg hover:shadow-brand-blue/10"
            >
              <CardContent className="flex h-full flex-col gap-4 px-5 py-5">
                <Link
                  href={`/blog-detail/${post.slug}`}
                  className="block overflow-hidden rounded-[1.4rem] border border-border/60"
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt}
                    width={1200}
                    height={630}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="aspect-[1200/630] h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </Link>

                <div className="flex items-center justify-between gap-3">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <CalendarDaysIcon className="size-4" />
                    <time dateTime={post.publishedOn}>
                      {formatPostDisplayDate(post)}
                    </time>
                  </div>
                  <Badge className="rounded-full bg-brand-blue/10 text-brand-blue border-0 text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
                    {post.category}
                  </Badge>
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  <Link href={`/blog-detail/${post.slug}`}>
                    <h3 className="line-clamp-3 font-serif text-2xl leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {post.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4">
                  <span className="text-sm font-semibold text-foreground">
                    {post.author}
                  </span>
                  <Button
                    size="icon"
                    className="rounded-full border border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                    asChild
                  >
                    <Link href={`/blog-detail/${post.slug}`}>
                      <ArrowRightIcon className="size-4 -rotate-45" />
                      <span className="sr-only">
                        Pročitaj više: {post.title}
                      </span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
