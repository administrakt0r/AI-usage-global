# Marketing Implementation Report for AI Usage Global

**Date:** 2026-04-28  
**App:** AI Usage Global (`aiusageglobal.pages.dev`)  
**Repository analyzed:** `https://github.com/administrakt0r/marketingskillz` (noted: this repository is a collection of AI agent marketing skills with no web app; marketing package was created for the active web app in the working directory, `ai-usage-global`)  
**Analyst:** OpenCode AI Agent

---

## 1. What was analyzed

The codebase in the working directory (`ai-usage-global`) was thoroughly inspected. This is a production Next.js 16 static site deployed on Cloudflare Pages that publishes daily articles about AI infrastructure costs — water usage, energy consumption, compute costs, GPU shortages, and environmental impact.

### Files read and inspected
- `README.md` — full project overview, features, tech stack
- `package.json` — dependencies, scripts, build pipeline
- `next.config.ts` — static export configuration
- `src/app/layout.tsx` — root metadata, fonts, theme
- `src/app/(pages)/page.tsx` — homepage with schema.org JSON-LD
- `src/app/(pages)/about/page.tsx` — about page with structured data
- `src/app/(pages)/contact-us/page.tsx` — contact page
- `src/app/(pages)/responsible-ai-usage/page.tsx` — responsible AI policy
- `src/app/(pages)/blog-detail/[slug]/page.tsx` — blog post detail with dynamic metadata
- `src/app/sitemap.ts` — dynamic sitemap generation
- `src/app/robots.txt` — crawler access rules
- `src/app/manifest.json` — PWA manifest
- `src/app/not-found.tsx` — 404 page
- `src/lib/site.ts` — site configuration
- `src/lib/blog.ts` — blog types and utilities
- `src/assets/data/blog-posts.ts` — post metadata
- `src/components/blocks/hero-section/hero-section.tsx` — homepage hero
- `src/components/blocks/blog-component/blog-component.tsx` — blog listing
- `src/components/blocks/blog-related-post/blog-related-post.tsx` — related posts
- `src/components/layout/header.tsx` and `footer.tsx` — navigation and footer
- `src/content/*.mdx` — article content samples
- `public/_headers` — Cloudflare security and cache headers
- `public/rss.xml` — generated RSS feed

### Key findings
- **App name:** AI Usage Global
- **Purpose:** Daily publication tracking real-world AI costs (water, power, compute, impact)
- **Target audience:** Policy researchers, infrastructure engineers, sustainability analysts, indie builders/publishers, journalists, academics
- **Differentiator:** Source-linked, hype-free, autonomous (AUG Bot), open-source, static/fast
- **Current content:** 6 published posts covering UK offshoring, server shortages, DeepSeek efficiency, gas power emissions, and Maine data center policy
- **Existing SEO:** Strong foundation — metadata, OG, Twitter cards, schema.org JSON-LD, sitemap, robots.txt, RSS, canonical URLs, semantic HTML, accessibility features
- **Monetization/growth angles:** Open-source template value, autonomous publishing workflow, data compilation potential, newsletter/email capture (not yet implemented)

---

## 2. What files were created

### Marketing strategy and guides
| File | Purpose |
|------|---------|
| `/marketing/AI_USAGE_GLOBAL_FREE_MARKETING_GUIDE.md` | Complete 0€ marketing guide including personas, keywords, channels, launch plan, routines, copy-paste messages, checklists |
| `/marketing/SEO_WORKFLOWS.md` | Practical SEO workflows: on-page, technical, metadata, schema, internal linking, content refresh, backlink outreach, programmatic SEO, image SEO, Lighthouse, sitemap, OG, localization, measurement |
| `/marketing/COPY_ASSETS.md` | Ready-to-use copy: hero titles, subtitles, CTAs, product descriptions, directory copy, social posts (LinkedIn, X, Reddit, Facebook), Product Hunt launch copy, HN Show HN, email templates, cold DMs, community intros, microcopy, taglines, page titles, meta descriptions |
| `/marketing/LAUNCH_CHECKLIST.md` | Pre-launch, launch day, first week, first month checklists; community list; anti-spam guidelines; feedback loops; tracking metrics |

### SEO-optimized blog posts (ready for integration)
| File | Search intent | Target keyword |
|------|---------------|----------------|
| `/marketing/blog-posts/how-much-water-do-ai-data-centers-use.md` | Informational | "AI water usage" |
| `/marketing/blog-posts/training-vs-inference-water-energy-cost.md` | Comparison | "AI training vs inference cost" |
| `/marketing/blog-posts/how-to-track-ai-energy-costs.md` | Practical / how-to | "how to track AI energy costs" |

Each post includes SEO title, meta description, slug, target/secondary keywords, search intent, OG tags, full article body, H1/H2/H3 structure, FAQ, internal/external link suggestions, and CTA.

---

## 3. What SEO/code improvements were made

### Blog post metadata enhancement
- **Added `keywords` field** to `BlogPost` type in `src/lib/blog.ts`
- **Added keyword arrays** to all 6 existing posts in `src/assets/data/blog-posts.ts`
- **Updated `generateMetadata`** in `src/app/(pages)/blog-detail/[slug]/page.tsx` to pass post keywords to Next.js metadata

### Page-level metadata improvements
- **About page (`src/app/(pages)/about/page.tsx`):**
  - Enhanced meta description to include "open-source publication"
  - Added `keywords` array
  - Improved OG description to mention Next.js and AUG Bot
- **Contact page (`src/app/(pages)/contact-us/page.tsx`):**
  - Enhanced meta description to include "AI water usage, energy consumption, and infrastructure reporting"
  - Added `keywords` array
  - Improved OG description
- **Responsible AI page (`src/app/(pages)/responsible-ai-usage/page.tsx`):**
  - Enhanced meta description to emphasize "open disclosure"
  - Added `keywords` array
  - Improved OG description

### Root layout improvements (`src/app/layout.tsx`)
- Added `applicationName: SITE_NAME`
- Added `appleWebApp` configuration for Safari add-to-homescreen
- Added `manifest: "/manifest.json"` reference

### 404 page improvements (`src/app/not-found.tsx`)
- Added `metadata` export with `robots: { index: false, follow: true }` to prevent indexing of 404 responses

### No breaking changes introduced
- No new dependencies added
- No existing functionality rewritten
- No design or layout altered
- All changes are additive metadata improvements

---

## 4. What assumptions were made

1. **Repository target:** The URL provided (`administrakt0r/marketingskillz`) is a fork of Corey Haines' AI agent skills collection. It contains no web app, blog system, or pages. All instructions in the prompt reference "web app," "blog/content system," "routes/pages," and "improving existing SEO in the codebase." The only web app available was the active working directory (`ai-usage-global`). I assumed the intent was to market the web app in the current workspace and documented this assumption in the report.

2. **Content placement:** The 3 new blog posts were placed in `/marketing/blog-posts/` rather than directly into `src/content/` because they are marketing deliverables. They can be moved into the production content pipeline when you are ready to publish them (requiring MDX files + metadata entries + image generation).

3. **Tone and positioning:** The copy and strategy assume the site maintains its current positioning — transparent, autonomous, hype-free, source-linked. All marketing copy reflects this tone rather than generic promotional language.

4. **No paid channels:** The guide assumes a 0€ budget, consistent with the request. No paid ads, sponsored posts, or premium tools are recommended.

---

## 5. Recommended next steps

### Immediate (this week)
1. **Review and publish the 3 new blog posts.** Move the Markdown files from `/marketing/blog-posts/` into `src/content/`, add entries to `src/assets/data/blog-posts.ts`, run `pnpm generate:derived`, and deploy.
2. **Set up Google Search Console** if not already done, and submit the sitemap.
3. **Post one stat thread** on X/Bluesky or LinkedIn using copy from `COPY_ASSETS.md`.

### Short-term (next 30 days)
1. **Execute the 30-day checklist** in `LAUNCH_CHECKLIST.md`.
2. **Publish 2–3 additional posts** targeting the primary keywords identified in the marketing guide.
3. **Engage in 2 communities** (e.g., r/energy and Indie Hackers) using the community-specific copy provided.
4. **Reach out to 10 source authors** you have cited to notify them of the coverage.

### Medium-term (next 90 days)
1. **Build a programmatic SEO page** (e.g., a simple table or timeline of GPU shortages or data center regulations) to attract backlinks.
2. **Refresh your top 3 performing posts** with updated data using the content refresh workflow in `SEO_WORKFLOWS.md`.
3. **Acquire 3–5 backlinks** through outreach or guest posting.
4. **Track metrics monthly** using the dashboard template in the marketing guide.

---

## 6. Highest-impact free marketing actions

| Action | Expected impact | Effort |
|--------|-----------------|--------|
| Publish the 3 ready-made cornerstone posts | Immediate SEO footprint expansion | Medium |
| Share a stat thread on Hacker News or Reddit r/energy | Large traffic spike if it resonates | Low |
| Post on Indie Hackers about the autonomous pipeline | Developer audience + GitHub stars | Low |
| Email cited source authors | Backlinks and social shares | Low |
| Set up Google Search Console + submit sitemap | Foundational for all organic growth | Low |
| Add internal links between all related posts | Better crawlability and rankings | Low |
| Refresh top posts monthly | Sustained ranking improvements | Medium |

---

## 7. Limitations and things to manually review

1. **Repository assumption:** Please confirm whether `ai-usage-global` was indeed the intended target. If you meant `marketingskillz` specifically, the marketing package would need to be entirely rewritten for a skills/documentation product rather than a web app.

2. **Blog post integration:** The 3 new posts are written as complete articles but are not yet in the production content system. You need to:
   - Copy them to `src/content/`
   - Add metadata entries to `src/assets/data/blog-posts.ts`
   - Generate social images with `pnpm generate:post-images`
   - Verify they build correctly

3. **Keyword validation:** The keywords and search intent assumptions were based on research logic and the existing content. You should validate them in Google Search Console and Google Trends after publishing.

4. **Community rules:** Reddit, Hacker News, and Indie Hackers all have strict self-promotion rules. Review each community's guidelines before posting. The guide includes anti-spam advice, but enforcement varies.

5. **Contact form limitation:** The contact form currently uses a `mailto:` flow. If you expand to email capture or newsletter signup, the copy assets include suggestions for that, but implementation is not included.

6. **No analytics backend:** The guide assumes Cloudflare Analytics and Google Search Console. If you add Google Analytics or Plausible later, update the tracking workflows accordingly.

7. **Image alt text:** While existing images have alt text, future posts should continue the descriptive pattern. The image SEO workflow in `SEO_WORKFLOWS.md` covers this.

---

## 8. Files changed / created summary

### Created
```
marketing/
├── AI_USAGE_GLOBAL_FREE_MARKETING_GUIDE.md
├── SEO_WORKFLOWS.md
├── COPY_ASSETS.md
├── LAUNCH_CHECKLIST.md
├── MARKETING_IMPLEMENTATION_REPORT.md
└── blog-posts/
    ├── how-much-water-do-ai-data-centers-use.md
    ├── training-vs-inference-water-energy-cost.md
    └── how-to-track-ai-energy-costs.md
```

### Modified
```
src/lib/blog.ts                           (added keywords field to BlogPost)
src/assets/data/blog-posts.ts             (added keywords to all 6 posts)
src/app/(pages)/blog-detail/[slug]/page.tsx (added keywords to generateMetadata)
src/app/(pages)/about/page.tsx            (enhanced metadata + keywords)
src/app/(pages)/contact-us/page.tsx       (enhanced metadata + keywords)
src/app/(pages)/responsible-ai-usage/page.tsx (enhanced metadata + keywords)
src/app/layout.tsx                        (added applicationName, appleWebApp, manifest)
src/app/not-found.tsx                     (added metadata with robots noindex)
```

---

*This report was generated as part of the marketing package implementation for AI Usage Global. Review it alongside the marketing guides and adjust strategy based on real-world results.*
