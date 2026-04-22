import path from 'node:path'

import fs from 'node:fs/promises'

import { loadBlogPosts, loadBlogUtils, rootDir } from './load-blog-data.mjs'

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.CF_PAGES_URL
    ? `https://${process.env.CF_PAGES_URL}`
    : 'https://ai-usage-global.pages.dev')

const siteName = 'AI Usage Global'

const siteDescription =
  'AI Usage Global publishes daily English-language AI news focused on real-world usage, adoption, regulation, impact, and major product rollouts worldwide.'

const outputPath = path.join(rootDir, 'public', 'rss.xml')

const escapeXml = value =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

const blogPosts = await loadBlogPosts()
const { comparePostsByPublishedAt, getPostRssDate } = await loadBlogUtils()
const sortedPosts = [...blogPosts].sort(comparePostsByPublishedAt)

const itemsXml = sortedPosts
  .map(post => {
    const postUrl = `${siteUrl}/blog-detail/${post.slug}`

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <link>${escapeXml(postUrl)}</link>
      <guid>${escapeXml(postUrl)}</guid>
      <pubDate>${getPostRssDate(post)}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <author>${escapeXml(post.author)}</author>
    </item>`
  })
  .join('')

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <description>${escapeXml(siteDescription)}</description>
    <link>${escapeXml(siteUrl)}</link>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml" />
    <image>
      <url>${escapeXml(`${siteUrl}/images/og-image.png`)}</url>
      <title>${escapeXml(siteName)}</title>
      <link>${escapeXml(siteUrl)}</link>
    </image>${itemsXml}
  </channel>
</rss>
`

await fs.writeFile(outputPath, rssXml, 'utf8')

console.log(`Generated ${path.relative(rootDir, outputPath)}`)
