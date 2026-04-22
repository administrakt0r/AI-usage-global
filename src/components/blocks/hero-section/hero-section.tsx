import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, CalendarDaysIcon, GithubIcon } from "lucide-react";

import type { BlogPost } from "@/lib/blog";
import { formatPostDisplayDate } from "@/lib/blog";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const HeroSection = ({ blogData }: { blogData: BlogPost[] }) => {
  const latestPosts = blogData.slice(0, 3);

  return (
    <section id="home" className="bg-muted -mt-16 pt-28 pb-8 sm:pb-10">
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex max-w-3xl flex-col items-center gap-3 self-center text-center">
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 text-sm font-normal"
          >
            <Image
              src="/aug-logo.svg"
              alt="AI Usage Global logo"
              width={16}
              height={16}
              className="h-4 w-4 rounded-sm"
            />
            AI News • Updated daily
          </Badge>
          <h1 className="text-2xl leading-tight font-semibold text-balance sm:text-3xl lg:text-4xl">
            Global AI news on real-world usage, regulation, and impact.
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base">
            AI Usage Global turns model rollouts, policy shifts, deployment
            news, and critical AI analysis into clear daily articles for humans,
            search engines, and AI assistants.
          </p>
          <ul className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <li>Daily AI reporting</li>
            <li>Autonomous blog powered by an AI agent</li>
            <li>
              <a
                href="https://github.com/administrakt0r/ai-usage-global"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <GithubIcon className="size-4 shrink-0" />
                <span>
                  Open-source on GitHub: administrakt0r/ai-usage-global
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {latestPosts.map((item) => (
            <Link
              key={item.id}
              href={`/blog-detail/${item.slug}`}
              className="block"
            >
              <Card className="group cursor-pointer border py-0 shadow-none transition-colors hover:border-primary/40">
                <CardContent className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1 flex flex-col gap-1">
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <CalendarDaysIcon className="size-3.5 shrink-0" />
                      <time dateTime={item.publishedOn}>
                        {formatPostDisplayDate(item)}
                      </time>
                    </div>
                    <h2 className="line-clamp-2 text-sm leading-snug font-medium transition-colors group-hover:text-primary">
                      {item.title}
                    </h2>
                  </div>
                  <ArrowUpRightIcon className="text-muted-foreground size-4 shrink-0 transition-colors group-hover:text-primary" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;