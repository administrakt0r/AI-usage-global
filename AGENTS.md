# AGENTS.md

## Dev commands

```bash
pnpm dev          # starts dev server (runs generate:derived first)
pnpm build        # builds for production (runs generate:derived first)
pnpm lint         # ESLint
pnpm check-types # TypeScript
pnpm test         # runs all tests
```

## Test specifics

- Uses Node's built-in `node:test` runner via `tsx --test`
- Test files: `src/**/*.test.ts`
- Run single test: `pnpm exec tsx --test src/lib/blog.test.ts`

## Build pipeline

- `generate:derived` (runs both `generate:post-images` and `generate:rss`) runs automatically before `dev` and `build`
- Generated outputs: `public/rss.xml`, optimized post images in `public/images/posts/`

## Deployment

- Cloudflare Pages (not Vercel)
- Auto-deploys on push to `main`
- URL: https://aiusageglobal.pages.dev

## Autonomous bot

- `newsprompt.md` is the ONLY bot prompt (sources, scope, template, footprint refresh)
- `.github/workflows/aug-bot.yml` runs it on a schedule via `anthropics/claude-code-action`; it needs `ANTHROPIC_API_KEY`/`CLAUDE_CODE_OAUTH_TOKEN` + `AUTO_MERGE_TOKEN`
- Bot branches are `post/{slug}`, PR titles `[aug-bot] <Title> - <YYYY-MM-DD>`
- Bot may only touch `src/content/*.mdx`, `src/assets/data/blog-posts.ts`, `published-log.json`, `src/assets/data/ai-footprint.json`
- Source list: `rss-feeds.json` (tiered feeds + watch pages)

## AI footprint tracker

- Data: `src/assets/data/ai-footprint.json` (schema in `scripts/footprint-schema.mjs`)
- Logic: `src/lib/footprint.ts`; UI: `src/components/blocks/footprint/`, page `src/app/(pages)/ai-footprint/page.tsx`

## Post images

- `scripts/generate-post-images.mjs` renders topic-themed covers; topic + headline stat come from `scripts/post-image-topics.mjs` (tested in `src/lib/post-image-topics.test.ts`)

## Validation

- `pnpm validate:bot-pr` checks bot-generated PRs (must pass before merge)

## Architecture

- Next.js 16 with App Router + React 19
- MDX for blog content (`src/content/*.mdx`)
- Blog data in `src/assets/data/blog-posts.ts`
- Radix UI + Tailwind 4 for components

## Key paths

- Pages: `src/app/(pages)/*/page.tsx`
- Components: `src/components/blocks/` and `src/components/ui/`
- Blog lib: `src/lib/blog.ts`
- Scripts: `scripts/*.mjs`