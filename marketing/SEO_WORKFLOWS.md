# SEO Workflows for AI Usage Global

Practical, repeatable workflows for improving the search visibility of `aiusageglobal.pages.dev`. Every workflow is designed to be executed by a single person with free tools.

---

## 1. On-page SEO checklist

Use this before publishing any new article or page.

- [ ] **Title tag** is 50–60 characters, includes target keyword near the front, and is unique
- [ ] **Meta description** is 150–160 characters, includes keyword, and has a clear value proposition
- [ ] **H1** is descriptive, includes primary keyword, and there is only one per page
- [ ] **H2/H3** structure uses logical subheadings with secondary keywords where natural
- [ ] **First 100 words** include the primary keyword and a clear answer to search intent
- [ ] **Internal links** point to 2–3 related posts or pages using descriptive anchor text
- [ ] **External links** cite original sources and open in a new tab (`rel="noopener noreferrer"`)
- [ ] **Images** have descriptive alt text that includes keywords only if natural
- [ ] **URL slug** is short, lowercase, hyphenated, and includes the primary keyword
- [ ] **Schema.org structured data** is present and validates in Google's Rich Results Test
- [ ] **Canonical URL** is set correctly (absolute path preferred)
- [ ] **Open Graph tags** (title, description, image, type, url) are complete
- [ ] **Twitter card tags** are complete
- [ ] **Content is at least 600 words** for news briefs, 900+ for deep-dives
- [ ] **No broken links** (run a manual check or use a free crawler)

---

## 2. Technical SEO checklist

Run this monthly.

- [ ] **Sitemap.xml** is auto-generated and includes all live URLs with correct `lastmod`
- [ ] **Robots.txt** allows all intended crawlers and points to sitemap
- [ ] **No index bloat** — only valuable pages are indexed (check with `site:aiusageglobal.pages.dev`)
- [ ] **HTTPS** is enforced (Cloudflare Pages handles this by default)
- [ ] **Core Web Vitals** pass in PageSpeed Insights (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] **Mobile usability** passes in Google Search Console
- [ ] **No render-blocking resources** critical above the fold
- [ ] **Images are optimized** (WebP where possible, proper sizing, lazy loading)
- [ ] **JavaScript is not required** to read core content (static export helps here)
- [ ] **404 page** returns proper 404 status and links back to homepage
- [ ] **Redirect chains** do not exist
- [ ] **Hreflang** is not needed unless you add localized content
- [ ] **Pagination** uses `rel="prev/next"` if you expand beyond one page of posts

---

## 3. Metadata workflow

### For new blog posts
1. Write the article in MDX.
2. Add metadata to `src/assets/data/blog-posts.ts`.
3. Run `pnpm generate:derived` to create the social image and RSS.
4. Verify the generated `<title>` and `<meta name="description">` in the built HTML.
5. Check the Open Graph image URL resolves correctly.
6. Use Facebook Sharing Debugger and Twitter Card Validator to preview.

### For static pages (About, Contact, Responsible AI)
1. Edit the `metadata` export in the page's `page.tsx`.
2. Ensure `alternates.canonical` matches the route exactly.
3. Update `openGraph.url` to the full URL.
4. Verify after build.

---

## 4. Schema.org structured data recommendations

AI Usage Global already uses JSON-LD well. Here is how to expand and maintain it.

### Current schemas (keep these)
- **Homepage:** `WebSite`, `Blog`, `FAQPage`, `BreadcrumbList`
- **Blog detail:** `BlogPosting`, `BreadcrumbList`
- **About:** `AboutPage`
- **Contact:** `ContactPage`

### Recommended additions
- **`Organization` schema** on the homepage with `sameAs` links to GitHub, social profiles
- **`Dataset` schema** for data compilation posts (e.g., GPU shortage timeline)
- **`HowTo` schema** for practical posts (e.g., "How to track AI energy costs")
- **`NewsArticle` schema** instead of `BlogPosting` for time-sensitive news briefs
- **`Speakable` schema** to mark key passages for voice assistants

### Validation workflow
1. Write or update schema in the page component.
2. Build the site: `pnpm build`
3. Open the generated HTML and copy the `<script type="application/ld+json">` block.
4. Paste into [Google Rich Results Test](https://search.google.com/test/rich-results).
5. Fix any errors before deploying.

---

## 5. Internal linking workflow

### Rules
- Every new post must link to at least 2 older posts.
- Use descriptive anchor text (not "click here" or "read more").
- Link from older posts to new ones when you publish a related update.
- The homepage FAQ section should link to the most relevant cornerstone articles.

### Process
1. Before publishing, search the codebase for related topics using `grep`.
2. Add 2–3 inline links in the new MDX content.
3. Open 2–3 older MDX files and add a link to the new post.
4. Update the homepage FAQ if a new post answers one of the questions better.

### Example anchor text
- Bad: "Read more here"
- Good: "how much water AI data centers consume"
- Good: "Maine's veto of the data center moratorium"

---

## 6. Blog publishing workflow

### Before writing
1. Check Google Search Console for queries with impressions but low CTR.
2. Check Google Trends for "AI water usage," "data center energy," "GPU shortage."
3. Pick a keyword with search volume and clear intent.

### Writing
1. Draft in MDX with H2/H3 structure.
2. Include a source link in the first or second paragraph.
3. Add a "Why this matters" or "What happens next" section.
4. End with a 2-sentence summary and a CTA to related posts.

### Publishing
1. Add metadata to `src/assets/data/blog-posts.ts`.
2. Run `pnpm generate:derived`.
3. Run `pnpm build`.
4. Verify the post renders, social image exists, and schema validates.
5. Deploy.

### After publishing
1. Submit the URL to Google Search Console for indexing.
2. Share on X/Bluesky with a stat from the article.
3. Add internal links from 2–3 older posts.
4. Schedule a content refresh in 60 days.

---

## 7. Keyword research workflow using only free tools

### Tools
- **Google Search Console** — queries you already rank for
- **Google Trends** — trend direction and regional interest
- **AnswerThePublic** (free tier) — question-based keywords
- **Ubersuggest** (free tier) — volume and difficulty estimates
- **AlsoAsked** (free tier) — People Also Ask data
- **Reddit** — search subreddits for phrases people actually use

### Workflow
1. **Seed:** Start with a broad term like "AI water usage."
2. **Expand:** Enter it into AnswerThePublic and AlsoAsked. Save all questions.
3. **Filter:** Remove queries with no clear search intent or that are too broad.
4. **Prioritize:** Sort by relevance to your content and estimated difficulty.
5. **Assign:** Map 1 primary keyword to each new post.
6. **Track:** After 30 days, check GSC to see if the post ranks for the target keyword.

---

## 8. Content refresh workflow

Every post should be refreshed every 60–90 days or after a major news event.

1. Identify the post to refresh (prioritize top 5 by traffic or impressions).
2. Check all external links — replace broken ones, update stats.
3. Add a new H2 section with updated data or a new development.
4. Update the meta description to reflect new information.
5. Add internal links to newer related posts.
6. Update the `publishedOn` in `blog-posts.ts` only if the content changes substantially; otherwise keep the original date for historical accuracy.
7. Regenerate the social image if the headline changes.
8. Rebuild and redeploy.
9. Resubmit to Google Search Console.

---

## 9. Backlink outreach workflow

### Weekly target: 5 outreach emails

1. **Find targets:** Search for articles that mention AI water usage, data center energy, or GPU shortages but lack a good source.
2. **Find contact:** Use the site's contact form or LinkedIn.
3. **Draft email:**
   > Subject: Source for your [topic] article
   > Hi [Name],
   > I enjoyed your article on [topic]. I run AI Usage Global, a daily tracker of AI infrastructure costs, and we recently published a piece on [related topic] that might complement your section on [specific point].
   > Here is the link: [URL]
   > No pressure — just thought it might be useful.
   > Best,
   > [Your name]
4. **Track:** Use a simple spreadsheet with columns: Site, Contact, Date Sent, Response, Link Acquired.
5. **Follow up:** One polite follow-up after 7 days.

---

## 10. Programmatic SEO ideas

Programmatic SEO means generating many pages from structured data. For AI Usage Global, consider these when you have enough data:

| Idea | Data source | Page template |
|------|-------------|---------------|
| **AI data center tracker by state/country** | Public filings, news reports | `/data-centers/[region]` |
| **GPU shortage timeline** | News archives, TrendForce reports | `/gpu-shortage-timeline` |
| **AI model cost comparison** | Published training cost estimates | `/model-costs/[model-name]` |
| **Company AI sustainability scorecard** | Corporate sustainability reports | `/companies/[company]/sustainability` |
| **Regulation tracker by region** | Government websites | `/regulation/[country-or-state]` |

**MVP approach:** Start with a single comparison page or timeline. If it gets traffic and backlinks, expand to programmatic pages.

---

## 11. Image SEO workflow

1. **Filenames:** Use descriptive filenames like `data-center-water-cooling-maine.webp` instead of `IMG_001.webp`.
2. **Alt text:** Describe the image and its context. Include keywords only if natural.
3. **Dimensions:** Provide `width` and `height` to prevent layout shift.
4. **Formats:** Use WebP for photos; PNG for graphics with text.
5. **Lazy loading:** Use `loading="lazy"` for images below the fold.
6. **Captions:** Use captions where they add context (good for SEO and accessibility).
7. **Social images:** Ensure every post has a 1200x630 OG image with readable text.

---

## 12. Lighthouse / Core Web Vitals workflow

### Monthly check
1. Open Chrome DevTools > Lighthouse.
2. Run audit for Mobile and Desktop.
3. Record scores for Performance, Accessibility, Best Practices, SEO.
4. If Performance < 90:
   - Check image sizes and formats
   - Check for unused CSS/JS
   - Verify static export is working (no unnecessary JS hydration)
5. If Accessibility < 95:
   - Check color contrast
   - Check heading hierarchy
   - Verify alt text on all images
   - Test keyboard navigation
6. If SEO < 100:
   - Check for missing meta descriptions
   - Check for non-descriptive link text
   - Verify hreflang and canonical tags

### PageSpeed Insights
1. Go to [pagespeed.web.dev](https://pagespeed.web.dev).
2. Test the homepage and 2 blog posts.
3. Record LCP, INP, CLS.
4. Address any "Opportunities" marked as high impact.

---

## 13. Sitemap / robots.txt checklist

### Sitemap (`src/app/sitemap.ts`)
- [ ] Includes all static routes (home, about, contact, responsible-ai)
- [ ] Includes all blog posts with correct `lastModified` dates
- [ ] `changeFrequency` reflects actual update cadence (daily for home, weekly for posts, monthly for static pages)
- [ ] `priority` values are logical (home = 1.0, posts = 0.8, static = 0.5–0.6)
- [ ] URL format is consistent (trailing slash policy matches the site)

### Robots (`src/app/robots.txt`)
- [ ] Allows all major search engines and AI crawlers
- [ ] Points to the correct sitemap URL
- [ ] Blocks only what should be blocked (e.g., preview domains via `_headers`)
- [ ] No `Disallow: /` accidentally applied

---

## 14. Open Graph / Twitter card checklist

For every page type:

### Homepage
- [ ] `og:title` matches the brand + value prop
- [ ] `og:description` is under 200 characters
- [ ] `og:image` is 1200x630, under 1MB, hosted on the same domain
- [ ] `og:type` is `website`
- [ ] `twitter:card` is `summary_large_image`

### Blog posts
- [ ] `og:title` matches the article title
- [ ] `og:description` matches the meta description
- [ ] `og:image` is the generated post social image (1200x630)
- [ ] `og:type` is `article`
- [ ] `article:published_time` and `article:author` are set
- [ ] `twitter:card` is `summary_large_image`

### Validation
- [ ] Facebook Sharing Debugger shows no warnings
- [ ] Twitter Card Validator shows no warnings
- [ ] LinkedIn Post Inspector shows correct preview

---

## 15. Localization / i18n SEO ideas

AI Usage Global is currently English-only. If you expand:

- **Priority languages:** Spanish (Latin American energy markets), German (EU policy focus), Mandarin (China is a major data center market).
- **URL structure:** Use subdirectories (`/es/`, `/de/`, `/zh/`) for SEO authority consolidation.
- **Hreflang:** Add `hreflang` tags to every page pointing to its translated versions.
- **Localized content:** Do not auto-translate. Rewrite for regional relevance (e.g., focus on EU regulations for the German version).
- **Local keywords:** Research regional search terms (e.g., "KI Wasserverbrauch" for German AI water usage).

**MVP:** Add a single Spanish version of your top 3 posts and measure demand before building full i18n.

---

## 16. Measuring SEO with Google Search Console and free tools

### Google Search Console (weekly review)
1. **Performance > Search Results**
   - Filter by query containing your target keyword.
   - Check impressions, clicks, CTR, and average position.
   - If CTR is low (< 2%), rewrite the title and meta description.
   - If position is 11–20, add more depth and internal links to push to page 1.
2. **Indexing > Pages**
   - Check for "Not indexed" or "Crawl anomaly" pages.
   - Fix errors and request validation.
3. **Experience > Core Web Vitals**
   - Address any URL groups flagged as "Poor" or "Needs Improvement."

### Free tools stack
| Tool | Purpose | Frequency |
|------|---------|-----------|
| Google Search Console | Rankings, indexing, CTR | Weekly |
| Google Analytics (or Cloudflare Analytics) | Traffic, referrals | Weekly |
| PageSpeed Insights | Core Web Vitals | Monthly |
| Screaming Frog (free tier, 500 URLs) | Crawl audit | Monthly |
| W3C HTML Validator | Markup quality | Per release |
| Google Rich Results Test | Schema validation | Per release |

### Simple SEO dashboard (spreadsheet)
Track these monthly:
- Total indexed pages
- Total impressions
- Total clicks
- Average position (top 10 keywords)
- Lighthouse Performance score
- Number of backlinks (from Search Console > Links)

---

*Run through this document monthly. SEO is compounding. Small, consistent improvements beat sporadic overhauls.*
