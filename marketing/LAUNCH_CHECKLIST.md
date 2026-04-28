# Launch Checklist for AI Usage Global

A step-by-step checklist for launching and promoting AI Usage Global without paid ads.

---

## 1. Pre-launch checklist

### Technical foundation
- [ ] Site builds successfully: `pnpm build`
- [ ] All pages render without errors
- [ ] No 404s on core routes (/, /about, /contact-us, /responsible-ai-usage, /blog-detail/*)
- [ ] RSS feed validates (check with W3C RSS Validator)
- [ ] Sitemap.xml includes all URLs
- [ ] Robots.txt allows crawlers and points to sitemap
- [ ] All social preview images exist in `public/images/posts/`
- [ ] OG tags validate on Facebook Sharing Debugger
- [ ] Twitter cards validate on Twitter Card Validator
- [ ] Lighthouse scores: Performance 90+, Accessibility 95+, SEO 100
- [ ] Mobile layout tested on iOS Safari and Android Chrome
- [ ] Contact form `mailto:` link works
- [ ] GitHub repo link works
- [ ] Internal links work (no broken relative paths)

### Content readiness
- [ ] At least 5 published posts with complete metadata
- [ ] Homepage FAQ answers common questions
- [ ] About page explains the editorial scope and pipeline
- [ ] Responsible AI Usage Policy is clear and linked
- [ ] Each post cites at least one external source
- [ ] Each post links to 2–3 related posts

### SEO setup
- [ ] Google Search Console property created and verified
- [ ] Sitemap submitted to Google Search Console
- [ ] Bing Webmaster Tools property created and verified
- [ ] Sitemap submitted to Bing
- [ ] Canonical URLs set on all pages
- [ ] Schema.org JSON-LD validates on all page types

### Analytics and tracking
- [ ] Cloudflare Analytics is active (built into Cloudflare Pages)
- [ ] Google Search Console is the primary keyword tracking tool
- [ ] RSS feed tracking is set up (check server logs or use a simple counter)

### Social and community accounts
- [ ] X/Twitter account created with bio linking to site
- [ ] Bluesky account created
- [ ] LinkedIn page or personal profile updated with site link
- [ ] GitHub repo README is polished and includes live URL
- [ ] Indie Hackers account ready
- [ ] Hacker News account ready (aged accounts perform better)

---

## 2. Launch day checklist

### Morning (publish and verify)
- [ ] Deploy latest build to Cloudflare Pages
- [ ] Verify live site loads correctly
- [ ] Verify latest post is live and indexed-ready
- [ ] Submit latest post URL to Google Search Console for indexing
- [ ] Post launch announcement on X/Bluesky
- [ ] Post launch announcement on LinkedIn

### Afternoon (communities)
- [ ] Submit "Show HN" post on Hacker News (if ready — see strategy below)
- [ ] Post in Indie Hackers with focus on the autonomous pipeline
- [ ] Post in 1 relevant subreddit (r/webdev, r/nextjs, or r/SideProject)
- [ ] Reply to 3 relevant posts on X/Bluesky with a stat and a link

### Evening (monitor and respond)
- [ ] Monitor Hacker News comments for 2 hours
- [ ] Respond to all comments on Indie Hackers post
- [ ] Respond to all replies on X/Bluesky/LinkedIn
- [ ] Check Google Search Console for crawl activity
- [ ] Note referral traffic sources in a spreadsheet

---

## 3. First week checklist

- [ ] Publish 1 new post (maintain daily rhythm if possible)
- [ ] Share new post on X/Bluesky and LinkedIn
- [ ] Comment thoughtfully on 5 Hacker News threads about AI or energy
- [ ] Answer 2 questions on Reddit with a link to a relevant article
- [ ] Send 3 outreach emails to source authors you cited
- [ ] Check Lighthouse scores again after any fixes
- [ ] Review Google Search Console for indexing status of all pages
- [ ] Fix any 404s or crawl errors immediately
- [ ] Add internal links from older posts to the newest post
- [ ] Update this checklist with what worked and what did not

---

## 4. First month checklist

- [ ] Publish 8–12 new posts (2–3 per week minimum)
- [ ] Post on X/Bluesky 2–3 times per week
- [ ] Post on LinkedIn 1–2 times per week
- [ ] Engage in 1 new community (e.g., r/energy, r/climate, Lobsters)
- [ ] Reach out to 10 newsletters or journalists for mentions
- [ ] Acquire 1–3 backlinks through outreach or guest posting
- [ ] Refresh the top 3 posts with updated data or internal links
- [ ] Run a full technical SEO audit (Lighthouse, sitemap, robots)
- [ ] Review GSC query data and adjust content strategy
- [ ] Set up a simple traffic dashboard (spreadsheet or Notion)
- [ ] Plan month 2 content calendar based on search trends

---

## 5. Free traffic channels

| Channel | Type | Effort | Expected result |
|---------|------|--------|-----------------|
| Google Search | Organic | High (ongoing) | Primary long-term traffic |
| Reddit | Community | Medium | Spikes + targeted visitors |
| Hacker News | Community | Medium | Large spikes if front page |
| Indie Hackers | Community | Low | Consistent indie builder traffic |
| X / Bluesky | Social | Medium | Awareness + journalist attention |
| LinkedIn | Social | Low | Professional / policy audience |
| RSS | Direct | Low | Loyal repeat readers |
| GitHub | Discovery | Low | Developer + forker traffic |
| Newsletter mentions | Outreach | High | Quality referral traffic |
| Guest posts | Outreach | High | Backlinks + new audience |

---

## 6. Communities to post in

### Technical / builder communities
- Hacker News
- Indie Hackers
- Lobsters
- r/webdev, r/nextjs, r/reactjs, r/SideProject, r/IndieHackers
- Dev.to
- GitHub Discussions (relevant repos)

### AI / ML communities
- r/MachineLearning (infrastructure threads)
- r/artificial
- r/LocalLLaMA (cost and hardware discussions)
- AI Twitter / Bluesky

### Energy / climate communities
- r/energy
- r/climate
- r/sustainability
- r/Futurology (data center and infrastructure threads)
- Climate Tech Slack/Discord groups

### Policy / research communities
- LinkedIn (energy and policy professionals)
- ResearchGate (if sharing data compilations)
- Academic Twitter / Bluesky

---

## 7. What to prepare before posting

Before posting in any community, prepare:

1. **A specific link.** Never post the homepage. Link to the most relevant article.
2. **A compelling stat or insight.** Lead with data, not a description.
3. **Context for that community.** Frame the post for the audience (technical angle for developers, policy angle for energy groups).
4. **Answers to likely questions.** Be ready to explain the autonomous pipeline, source methodology, and editorial scope.
5. **Thick skin.** Not everyone will like autonomous content. Stay polite and factual.

---

## 8. How to avoid getting banned from communities

- **Read the rules.** Every subreddit and forum has posting guidelines. Follow them.
- **No more than 10% self-promotion.** For every post about your site, make 9 genuine contributions.
- **Never use URL shorteners.** They look spammy and are often auto-filtered.
- **No clickbait titles.** Use descriptive, honest titles.
- **Do not delete and repost.** If a post flops, wait a week before trying again.
- **Do not argue with moderators.** If a post is removed, ask politely why, learn, and move on.
- **Disclose your affiliation.** If you are posting your own site, say so.

---

## 9. How to respond to comments

### Positive comments
- Thank the person.
- Add one extra insight or link to a related post.
- Invite them to subscribe to RSS or follow on social.

### Critical comments
- Acknowledge the critique.
- Correct factual errors politely.
- Do not defend the project emotionally. Stay data-driven.
- If someone dislikes autonomous authorship, explain the human review process and link to the Responsible AI page.

### Questions
- Answer within 2 hours if possible.
- If you do not know, say so and offer to follow up.
- Use questions as inspiration for future posts.

---

## 10. How to collect feedback

1. **Contact form:** Monitor `contact@aiusageglobal.pages.dev` daily.
2. **GitHub Issues:** Encourage bug reports and story suggestions via issues.
3. **Comments on social:** Track replies and DMs for recurring themes.
4. **Google Search Console:** Look for queries that suggest unmet demand.
5. **Direct outreach:** Ask 5 readers what topic they want covered next.

Store feedback in a simple spreadsheet or Notion database with columns: Source, Date, Feedback, Action, Status.

---

## 11. How to turn feedback into SEO / blog content

| Feedback type | Content opportunity |
|---------------|---------------------|
| "How do you calculate water usage?" | How-to post: "How to Estimate AI Data Center Water Consumption" |
| "What about nuclear power for AI?" | News post: "Nuclear Energy and AI Data Centers: A Growing Trend" |
| "Can I use this stack for my own blog?" | Technical post: "How to Build an Autonomous MDX Blog with Next.js" |
| "Your site is too US-focused." | Regional post: "AI Data Center Costs in Europe and Asia" |
| "Where is the raw data?" | Data compilation page: "AI Infrastructure Cost Dataset" |

---

## 12. How to track results

### Weekly tracking
- [ ] Organic impressions (Google Search Console)
- [ ] Organic clicks (Google Search Console)
- [ ] Referral traffic by source (Cloudflare Analytics)
- [ ] New posts published
- [ ] Community posts made
- [ ] Backlinks acquired

### Monthly tracking
- [ ] Average position for top 10 keywords
- [ ] Lighthouse scores
- [ ] RSS feed requests (if trackable)
- [ ] GitHub stars
- [ ] Social followers gained
- [ ] Email contacts made (if contact form expands)

### Tools
- **Google Search Console** — rankings, clicks, impressions
- **Cloudflare Analytics** — traffic, referrers, performance
- **Lighthouse** — Core Web Vitals and quality scores
- **Spreadsheet** — manual tracking of outreach, posts, and results

---

*Use this checklist for every major milestone: launch, 30 days, 90 days, and 6 months.*
