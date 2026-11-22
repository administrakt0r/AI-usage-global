import fs from 'node:fs/promises'
import path from 'node:path'

import { chromium, devices } from 'playwright'

import { rootDir } from './load-blog-data.mjs'

const baseUrl = process.env.README_SCREENSHOT_BASE_URL ?? 'http://127.0.0.1:3000'
const outputDir = path.join(rootDir, 'docs', 'images')

await fs.mkdir(outputDir, { recursive: true })

// Set README_SCREENSHOT_CHROME to a local Chrome/Chromium binary to skip `playwright install`.
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.README_SCREENSHOT_CHROME || undefined,
})

const desktopContext = await browser.newContext({
  viewport: { width: 1440, height: 1080 },
  colorScheme: 'light',
  deviceScaleFactor: 1,
})

const mobileContext = await browser.newContext({
  ...devices['iPhone 13'],
  colorScheme: 'light',
})

const captureViewport = async ({ context, url, fileName, beforeShot }) => {
  const page = await context.newPage()

  await page.goto(`${baseUrl}${url}`, { waitUntil: 'networkidle' })

  if (beforeShot) {
    await beforeShot(page)
  }

  await page.screenshot({ path: path.join(outputDir, fileName), fullPage: false })
  await page.close()
}

await captureViewport({
  context: desktopContext,
  url: '/',
  fileName: 'homepage-desktop.png',
})

await captureViewport({
  context: desktopContext,
  url: '/blog-detail/ai-gas-power-plans-could-emit-129-million-tons-a-year',
  fileName: 'article-page.png',
})

await captureViewport({
  context: desktopContext,
  url: '/ai-footprint',
  fileName: 'ai-footprint.png',
  beforeShot: async (page) => {
    await page.waitForTimeout(1500)
  },
})

await captureViewport({
  context: mobileContext,
  url: '/',
  fileName: 'mobile-view.png',
})

await desktopContext.close()
await mobileContext.close()
await browser.close()

console.log(`Saved README screenshots to ${outputDir}`)
