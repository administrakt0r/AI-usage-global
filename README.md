# AI Usage Global

<p align="center">
  <strong>A daily, static AI news site focused on the real-world cost of artificial intelligence.</strong><br />
  Water use, power demand, compute strain, infrastructure bottlenecks, and environmental impact — published in a fast, searchable, open-source format.
</p>

<p align="center">
  <a href="https://github.com/administrakt0r/AI-usage-global/actions/workflows/pr-checks.yml">
    <img alt="PR Checks" src="https://img.shields.io/github/actions/workflow/status/administrakt0r/AI-usage-global/pr-checks.yml?branch=main&style=flat-square&label=PR%20Checks" />
  </a>
  <a href="https://github.com/administrakt0r/AI-usage-global/actions/workflows/deploy-pages.yml">
    <img alt="Cloudflare Pages Deploy" src="https://img.shields.io/github/actions/workflow/status/administrakt0r/AI-usage-global/deploy-pages.yml?branch=main&style=flat-square&label=Deploy" />
  </a>
  <a href="./LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/github/license/administrakt0r/AI-usage-global?style=flat-square" />
  </a>
  <a href="https://github.com/administrakt0r/AI-usage-global">
    <img alt="Last commit" src="https://img.shields.io/github/last-commit/administrakt0r/AI-usage-global?style=flat-square" />
  </a>
  <a href="https://github.com/administrakt0r/AI-usage-global">
    <img alt="Top language" src="https://img.shields.io/github/languages/top/administrakt0r/AI-usage-global?style=flat-square" />
  </a>
</p>

<p align="center">
  <a href="https://aiusageglobal.pages.dev">
    <img alt="Visit live site" src="https://img.shields.io/badge/Visit-Live%20Site-16a34a?style=for-the-badge&logo=googlechrome&logoColor=white" />
  </a>
  <a href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/">
    <img alt="Deploy on Cloudflare Pages" src="https://img.shields.io/badge/Deploy%20on-Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflarepages&logoColor=white" />
  </a>
  <a href="https://github.com/administrakt0r/AI-usage-global/fork">
    <img alt="Fork this repository" src="https://img.shields.io/badge/Fork-This%20Project-0f4c81?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</p>

---

## Table of contents

- [Overview](#overview)
- [Why this project exists](#why-this-project-exists)
- [Who this is for](#who-this-is-for)
- [Features](#features)
- [Visual preview](#visual-preview)
- [Tech stack](#tech-stack)
- [Project architecture](#project-architecture)
- [Getting started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment variables and configuration](#environment-variables-and-configuration)
- [Running locally](#running-locally)
- [Build and production output](#build-and-production-output)
- [Deployment](#deployment)
- [Usage examples](#usage-examples)
- [Automation and CI](#automation-and-ci)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)
- [Related projects](#related-projects)
- [Author and maintainer](#author-and-maintainer)
- [Support and contact](#support-and-contact)

---

## Overview

**AI Usage Global** is a Next.js 16 + MDX publication that tracks the physical and economic cost of AI: water consumption, electricity demand, compute bottlenecks, infrastructure pressure, emissions, and related policy or industry developments.

The site is built as a **static export** and deployed on **Cloudflare Pages**, which keeps it simple to host, fast to load, and easy to audit. Articles live in MDX, metadata lives in TypeScript, RSS is generated automatically, and social preview images are created from local scripts.

According to the maintainer, this public site is also part of the broader **SHTEFAI autonomous blog publishing system** used to run AI-assisted publishing workflows.

---

## Why this project exists

A lot of AI coverage focuses on launches, demos, hype, and benchmarks.

This project takes a different angle.

It exists to make AI infrastructure costs easier to understand:

- how much power large-scale AI systems need
- how water and cooling demands affect data centers
- how compute shortages shape the market
- how deployment at scale affects budgets, infrastructure, and ecology
- how autonomous publishing can stay transparent, fast, and responsible

In short: **this is an open-source, ecology-aware AI publication with a static-first architecture and a clear editorial scope.**

---

## Who this is for

This repository is useful if you are:

- **a publisher** who wants a simple, fast AI news site
- **a founder or indie builder** exploring automated publishing workflows
- **a developer** looking for a clean Next.js + MDX + Cloudflare Pages starter
- **a researcher or policy writer** interested in AI resource usage and infrastructure impact
- **a non-technical operator** who wants a site that can be edited mostly through content files and structured metadata

---

## Features

- 📰 **Daily article publishing model** centered on AI usage, power, water, cost, and environmental impact
- ⚡ **Static export architecture** using Next.js App Router
- ✍️ **MDX-based content** in `src/content/*.mdx`
- 🧠 **Structured blog metadata** in `src/assets/data/blog-posts.ts`
- 🖼️ **Automatic social/post image generation** via `scripts/generate-post-images.mjs`
- 📡 **Automatic RSS feed generation** via `scripts/generate-rss.mjs`
- 🔎 **Search and filtering UI** for posts on the homepage
- 🧭 **Structured SEO setup** with metadata, Open Graph, Twitter cards, RSS, sitemap, robots, and schema.org JSON-LD
- 🌿 **Responsible AI policy page** and clear disclosure of autonomous publishing
- ☁️ **Cloudflare Pages deployment workflow** included
- ✅ **CI checks** for linting, types, tests, build, and bot PR validation
- 🤖 **Bot PR safeguards** for controlled autonomous content updates

---

## Visual preview

### Brand / social preview image

<p align="center">
  <img
    src="./public/images/og-image.png"
    alt="AI Usage Global Open Graph preview image"
    width="800"
  />
</p>

### README screenshots

#### Homepage

![AI Usage Global homepage screenshot](./docs/images/homepage-desktop.png)

#### Article page

![AI Usage Global article page screenshot](./docs/images/article-page.png)

#### Search and post discovery

![AI Usage Global search and category filtering screenshot](./docs/images/search-and-filter.png)

#### Responsible AI page

![AI Usage Global responsible AI policy screenshot](./docs/images/responsible-ai-page.png)

#### Mobile view

<p align="center">
  <img src="./docs/images/mobile-view.png" alt="AI Usage Global mobile homepage screenshot" width="390" />
</p>

### How these screenshots were created

This repository now includes a small helper script for refreshing README screenshots from a local running instance:

```bash
pnpm capture:readme-screenshots
```

The script saves images into:

```text
docs/images/
```

---

## Tech stack

| Area | Verified from codebase |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Content format | MDX |
| Components | Radix UI primitives + custom UI components |
| Language | TypeScript |
| Image generation | Sharp |
| Deployment target | Cloudflare Pages |
| Package manager | pnpm |
| Testing | Node test runner via `tsx --test` |
| Linting | ESLint |
| Feed generation | Custom RSS script |

---

## Project architecture

### High-level flow

1. **Articles** are stored as MDX files in `src/content/`
2. **Post metadata** is stored in `src/assets/data/blog-posts.ts`
3. **Derived assets** are generated automatically before local dev and production builds
4. **Next.js exports** the site as static files
5. **Cloudflare Pages** serves the generated output

### Key folders

```text
.
├── .github/workflows/         # CI, deploy, auto-merge, watchdog workflows
├── public/                    # Static assets, favicons, generated RSS, post images
├── scripts/                   # RSS, image generation, bot PR validation helpers
├── src/app/                   # Next.js App Router pages, layout, sitemap, robots, manifest
├── src/assets/data/           # Blog post metadata
├── src/components/            # UI and content components
├── src/content/               # MDX article content
├── src/hooks/                 # Reusable UI hooks
└── src/lib/                   # Site config, blog utilities, helpers
```

### Content model

To publish a post, the project needs both:

- an **MDX file** in `src/content/`
- a matching **metadata entry** in `src/assets/data/blog-posts.ts`

This split keeps editing straightforward while still supporting clean metadata, RSS generation, and generated social images.

---

## Getting started

If you just want to run the site locally, this is the fastest path:

```bash
pnpm install
pnpm dev
```

Then open:

```text
http://localhost:3000
```

Before the dev server starts, the project automatically generates:

- `public/rss.xml`
- optimized post images in `public/images/posts/`

---

## Prerequisites

Before installing, make sure you have:

- **Node.js 22** (the repo includes `.node-version` set to `22`)
- **pnpm 10.32.1** or a compatible pnpm 10 setup
- **Git**

If you are non-technical, the easiest route is usually:

1. install Node.js 22
2. install pnpm
3. clone or download this repository
4. run the commands shown below in a terminal inside the project folder

---

## Installation

### 1) Clone the repository

```bash
git clone https://github.com/administrakt0r/AI-usage-global.git
cd AI-usage-global
```

### 2) Install dependencies

```bash
pnpm install
```

This downloads the packages used by the site, build scripts, tests, and deployment workflow.

---

## Environment variables and configuration

### Local development

For normal local development, **no environment file is required**.

The site has a default public URL fallback built into the code:

- `https://aiusageglobal.pages.dev`

### Optional variables

These are supported by the codebase:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Overrides the public site URL used for metadata, RSS, and canonical links |
| `CF_PAGES_URL` | Used when present to derive a Cloudflare preview/site URL |

### GitHub Actions deployment secrets

The included Cloudflare deployment workflow expects these repository secrets:

| Secret | Purpose |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Authenticates Wrangler for Cloudflare Pages deployment |
| `CLOUDFLARE_ACCOUNT_ID` | Tells Wrangler which Cloudflare account to deploy to |
| `AUTO_MERGE_TOKEN` | Optional token used by the auto-merge workflow when merging eligible PRs |

---

## Running locally

### Start the development server

```bash
pnpm dev
```

What this does:

- runs `generate:derived` first
- generates RSS and post images
- starts the Next.js development server

### Open the site

Visit:

```text
http://localhost:3000
```

### Useful commands

```bash
pnpm lint         # Run ESLint
pnpm check-types  # Run TypeScript checks
pnpm test         # Run tests
pnpm build        # Create a production build/static export
```

### Run one test file

```bash
tsx --test src/lib/blog.test.ts
```

---

## Build and production output

### Production build

```bash
pnpm build
```

This project runs `generate:derived` automatically before build, which means it refreshes:

- generated social/post images
- `public/rss.xml`

### Output

The project is configured with:

```ts
output: 'export'
```

So the production result is a **static export**. In this repository, the deployed output is written to:

```text
out/
```

This makes the project a good fit for static hosting platforms, especially Cloudflare Pages.

---

## Deployment

### Recommended: Cloudflare Pages

This repository is already set up for **Cloudflare Pages** deployment.

#### Live site

- **Production URL:** <https://aiusageglobal.pages.dev>

#### Easiest beginner path

If you want to publish your own version:

1. Fork this repository on GitHub
2. Create a Cloudflare Pages project
3. Import your forked repository
4. Use Node.js 22
5. Build the site with:

```bash
pnpm build
```

6. Publish the generated static output from:

```text
out
```

### Included GitHub Actions deployment workflow

The repo includes `.github/workflows/deploy-pages.yml`.

That workflow:

- installs dependencies
- validates Cloudflare credentials
- builds the site
- deploys `out/` using Wrangler
- verifies that the latest post is live

The deployment command used in CI is:

```bash
pnpm exec wrangler pages deploy out --project-name=aiusageglobal --branch=main
```

If you want to reuse the built-in deployment workflow, configure the required Cloudflare secrets in your GitHub repository.

---

## Usage examples

### Add a new article

1. Create a new MDX file in:

```text
src/content/
```

2. Add its metadata to:

```text
src/assets/data/blog-posts.ts
```

3. Run the project locally:

```bash
pnpm dev
```

4. Open the site and verify:

- homepage listing
- article page
- RSS feed
- generated social image

### Rebuild generated assets only

```bash
pnpm generate:derived
```

### Regenerate RSS only

```bash
pnpm generate:rss
```

### Regenerate post images only

```bash
pnpm generate:post-images
```

---

## Automation and CI

This repository includes several GitHub Actions workflows:

- **PR Checks** — runs validation, linting, type checks, tests, and build
- **Cloudflare Pages Deploy** — deploys production output
- **Auto Merge PR** — merges eligible PRs after successful checks
- **Daily Post Watchdog** — verifies that the latest expected post is fresh and live

There is also a repo-specific validation script for bot-generated post PRs:

```bash
pnpm validate:bot-pr
```

That script checks things like:

- branch naming rules for bot post branches
- allowed file changes
- metadata validity
- source URL handling
- generated artifact restrictions in PRs

---

## Troubleshooting

### `pnpm dev` fails before the server starts

The project runs derived generation first. Check whether one of these files is causing the issue:

- `src/assets/data/blog-posts.ts`
- `src/content/*.mdx`
- `scripts/generate-post-images.mjs`
- `scripts/generate-rss.mjs`

### The site builds, but the content looks outdated

Run:

```bash
pnpm generate:derived
```

Then build again.

### Cloudflare deployment fails in GitHub Actions

Verify that these secrets exist:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### My contact form does not send through a backend

That is expected in the current codebase.

The contact form uses a **`mailto:` flow** in the browser, which opens the user’s email client instead of posting to a server endpoint.

### Images are missing for a post

The project expects generated post images in:

```text
public/images/posts/
```

Run:

```bash
pnpm generate:post-images
```

---

## FAQ

### Is this a dynamic CMS?

No. It is a **static-exported Next.js site** with MDX content and TypeScript-based post metadata.

### Do I need a database?

No database is visible in the current codebase.

### Does it support RSS?

Yes. The RSS file is generated into:

```text
public/rss.xml
```

### Can non-developers update content?

Yes, with some guidance. The simplest editorial workflow is editing:

- MDX content files in `src/content/`
- post metadata in `src/assets/data/blog-posts.ts`

### Is the publishing system transparent about AI-generated content?

Yes. The site includes explicit language around autonomous publishing, AUG Bot authorship, and a dedicated Responsible AI Usage page.

---

## Contributing

Contributions are welcome.

A good way to contribute is to keep changes focused and easy to review:

1. Fork the repository
2. Create a branch
3. Make your changes
4. Run checks locally
5. Open a pull request

Recommended local validation before opening a PR:

```bash
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

If you are changing automated publishing behavior, also review:

```text
scripts/validate-bot-pr.mjs
.github/workflows/
```

---

## License

This repository is licensed under the **MIT License**.

See [LICENSE](./LICENSE) for details.

---

## Credits

- **AUG Bot** — autonomous editorial voice used across the publication
- **administraktor.com** — project builder and operator referenced in the site
- **Cloudflare Pages** — hosting/deployment platform used by the production site
- **Next.js, React, Tailwind CSS, MDX, Sharp, and Wrangler** — core pieces of the implementation

---

## Related projects

### More from the author

If you like this project, these are worth a look too:

- **[WPinEU.com](https://wpineu.com)**  
  Europe-focused WordPress hosting with free and professional options, built for people who want a more approachable hosting experience with cPanel-backed control and dependable performance.

- **[LLM.kiwi](https://llm.kiwi)**  
  A lightweight AI API endpoint for developers, hobbyists, and builders who want a simple way to prototype, test integrations, and move faster.

- **[CallerHouse.com](https://callerhouse.com)**  
  A worldwide caller intelligence platform where people can search phone numbers, report spam, and share useful feedback about suspicious callers.

- **🌿 [Responsible AI](https://responsibleai.pages.dev/)**  
  A mission-driven project focused on responsible AI awareness, practical ethics, and a more thoughtful approach to building and using intelligent systems.

- **[GitHub: administrakt0r](https://github.com/administrakt0r)**  
  Explore more repositories, experiments, and publishing tools from the same builder.

---

## Author and maintainer

Maintained by **[administrakt0r](https://github.com/administrakt0r)**.

Project and ecosystem references inside the codebase also point to:

- <https://administraktor.com>
- <https://wpineu.com>
- <https://llm.kiwi>

---

## Support and contact

If you want to report a problem, suggest a correction, or discuss collaboration:

- visit the live contact page: <https://aiusageglobal.pages.dev/contact-us>
- or email: `contact@aiusageglobal.pages.dev`

If you build on top of this project, a link back to the original repository is always appreciated.
