import type { ComponentPropsWithoutRef } from "react";

import type { MDXComponents } from "mdx/types";

const components = {
  h2: ({ children }: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="font-serif mt-16 mb-4 scroll-mt-24 text-3xl tracking-tight text-foreground">
      {children}
    </h2>
  ),
  h3: ({ children }: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-4 leading-7 text-muted-foreground">{children}</p>
  ),
  ul: ({ children }: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-5 list-disc space-y-3 pl-5 text-muted-foreground">
      {children}
    </ul>
  ),
  li: ({ children }: ComponentPropsWithoutRef<"li">) => (
    <li className="pl-1">{children}</li>
  ),
  a: ({ children, href }: ComponentPropsWithoutRef<"a">) => (
    <a
      href={href}
      className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
    >
      {children}
    </a>
  ),
  strong: ({ children }: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  blockquote: ({ children }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="my-6 border-l-4 border-primary/40 pl-4 italic text-foreground">
      {children}
    </blockquote>
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
