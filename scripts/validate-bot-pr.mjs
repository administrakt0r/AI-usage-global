import { execFileSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const BLOG_POSTS_PATH = 'src/assets/data/blog-posts.ts'
const PUBLISHED_LOG_PATH = 'published-log.json'

const fail = message => {
  throw new Error(message)
}

const git = (...args) =>
  execFileSync('git', args, {
    cwd: rootDir,
    encoding: 'utf8'
  }).trim()

const tryGit = (...args) => {
  try {
    return git(...args)
  } catch {
    return null
  }
}

const normalizeRepoPath = value => value.replaceAll('\\', '/')

const getBranchConfig = branchName => {
  if (branchName.startsWith('post/')) {
    return {
      branchKind: 'post',
      expectedCategory: 'AI Usage',
      requiresPublishedLog: true
    }
  }

  return null
}

const resolveBaseRef = () => {
  const configuredBase = process.env.VALIDATE_BOT_PR_BASE || process.env.GITHUB_BASE_REF || 'main'

  const candidates = configuredBase.includes('/')
    ? [configuredBase]
    : [`origin/${configuredBase}`, configuredBase]

  for (const candidate of candidates) {
    if (tryGit('rev-parse', '--verify', candidate)) {
      return candidate
    }
  }

  fail(
    `Unable to resolve a base ref for bot PR validation from "${configuredBase}".`
  )
}

const parseChangedFiles = baseRef => {
  const output = git('diff', '--name-status', '--find-renames', baseRef, '--')

  if (!output) {
    return []
  }

  return output.split(/\r?\n/u).map(line => {
    const parts = line.split('\t')
    const status = parts[0]
    const previousPath = parts.length === 3 ? normalizeRepoPath(parts[1]) : null
    const changedPath = normalizeRepoPath(parts[parts.length - 1])

    return {
      status,
      previousPath,
      path: changedPath
    }
  })
}

const readJsonFile = async relativePath => {
  const content = await fs.readFile(path.join(rootDir, relativePath), 'utf8')

  return JSON.parse(content)
}

const readJsonFromRef = (baseRef, relativePath) => {
  const content = git('show', `${baseRef}:${relativePath}`)

  return JSON.parse(content)
}

const normalizeSpecifier = specifier =>
  specifier.replaceAll('\\', '/').replace(/\.(?:[cm]?js|tsx?)$/, '')

const getEquivalentSpecifiers = specifier => {
  const normalized = normalizeSpecifier(specifier)
  const equivalents = new Set([normalized])

  if (normalized === '@/lib/blog' || normalized.endsWith('/lib/blog')) {
    equivalents.add('@/lib/blog')
    equivalents.add('@/lib/blog.ts')
    equivalents.add('../lib/blog')
    equivalents.add('../lib/blog.ts')
    equivalents.add('./lib/blog')
    equivalents.add('./lib/blog.ts')
  }

  return [...equivalents].map(normalizeSpecifier)
}

const executeCommonJsModule = (compiled, filename, customRequires = {}) => {
  const cjsModule = { exports: {} }

  const normalizedRequires = Object.entries(customRequires).reduce(
    (accumulator, [specifier, value]) => {
      for (const equivalent of getEquivalentSpecifiers(specifier)) {
        accumulator[equivalent] = value
      }

      return accumulator
    },
    {}
  )

  const sandbox = {
    exports: cjsModule.exports,
    module: cjsModule,
    require: specifier => {
      const normalizedSpecifier = normalizeSpecifier(specifier)

      if (normalizedRequires[normalizedSpecifier]) {
        return normalizedRequires[normalizedSpecifier]
      }

      throw new Error(
        `Unsupported import while loading ${filename}: ${specifier} (normalized: ${normalizedSpecifier})`
      )
    }
  }

  vm.runInNewContext(compiled, sandbox, { filename })

  return cjsModule.exports
}

const loadBlogPostsFromSource = (source, filename) => {
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020
    },
    fileName: filename
  }).outputText

  const exports = executeCommonJsModule(compiled, filename, {
    '@/lib/blog': {
      comparePostsByPublishedAt: () => 0
    }
  })

  if (!Array.isArray(exports.blogPosts)) {
    fail(`Unable to load blog posts from ${filename}.`)
  }

  return exports.blogPosts
}

const isHttpsUrl = value => {
  try {
    const url = new URL(value)

    return url.protocol === 'https:'
  } catch {
    return false
  }
}

const isCanonicalSourceArticleUrl = value =>
  isHttpsUrl(value) &&
  !value.includes('...') &&
  !/\/feed\/?$/iu.test(value) &&
  !/\/rss(?:\.xml)?$/iu.test(value) &&
  !/\.(?:xml|atom)$/iu.test(value)

const extractMarkdownLinks = content =>
  [...content.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/gu)].map(match => match[1])

const extractSourceFooterUrl = content => {
  const match = content.match(/\*Source:\s*\[[^\]]+\]\((https:\/\/[^)\s]+)\)\*/u)

  return match?.[1] ?? null
}

const main = async () => {
  const branchName =
    process.env.GITHUB_HEAD_REF ||
    git('branch', '--show-current') ||
    git('rev-parse', '--abbrev-ref', 'HEAD')

  const branchConfig = getBranchConfig(branchName)

  if (!branchConfig) {
    console.log(`Skipping bot PR validation on branch "${branchName}".`)

    return
  }

  const baseRef = resolveBaseRef()

  console.log(
    `Validating ${branchConfig.branchKind} bot PR on branch "${branchName}" against ${baseRef}.`
  )

  const changedFiles = parseChangedFiles(baseRef)

  if (changedFiles.length === 0) {
    fail('No changed files detected for this bot PR.')
  }

  const generatedArtifactChange = changedFiles.find(entry =>
    /^public\/images\/posts\/.+\.png$/u.test(entry.path) ||
    entry.path === 'public/images/og-image.png' ||
    entry.path === 'public/rss.xml'
  )

  if (generatedArtifactChange) {
    fail(
      `Generated artifacts must not be committed in bot PRs: ${generatedArtifactChange.path}`
    )
  }

  const disallowedChange = changedFiles.find(entry => {
    if (entry.path === BLOG_POSTS_PATH || entry.path === PUBLISHED_LOG_PATH) {
      return false
    }

    // Allow fixing pre-existing lint errors in specific files as mandated by instructions
    const allowedAppFiles = [
      'src/app/(pages)/about/page.tsx',
      'src/app/(pages)/responsible-ai-usage/page.tsx',
      'src/components/logo.tsx',
      'src/lib/blog.ts',
      'scripts/validate-bot-pr.mjs'
    ]

    if (allowedAppFiles.includes(entry.path)) {
      return false
    }

    return !/^src\/content\/[^/]+\.mdx$/u.test(entry.path)
  })

  if (disallowedChange) {
    fail(
      `Bot PRs may only change src/content/*.mdx, ${BLOG_POSTS_PATH}, and ${
        branchConfig.requiresPublishedLog ? PUBLISHED_LOG_PATH : 'no published log file'
      }. Disallowed change: ${disallowedChange.path}`
    )
  }

  const contentChanges = changedFiles.filter(entry =>
    /^src\/content\/[^/]+\.mdx$/u.test(entry.path)
  )

  if (contentChanges.length !== 1) {
    fail(
      `Bot PRs must add exactly one new MDX post. Detected ${contentChanges.length} content changes.`
    )
  }

  const [contentChange] = contentChanges

  if (!contentChange.status.startsWith('A')) {
    fail(
      `Bot PR content changes must add a new MDX file. ${contentChange.path} has status ${contentChange.status}.`
    )
  }

  if (!changedFiles.some(entry => entry.path === BLOG_POSTS_PATH)) {
    fail(`${BLOG_POSTS_PATH} must be updated in every bot PR.`)
  }

  const publishedLogChanged = changedFiles.some(entry => entry.path === PUBLISHED_LOG_PATH)

  if (branchConfig.requiresPublishedLog && !publishedLogChanged) {
    fail(`${PUBLISHED_LOG_PATH} must be updated for news bot PRs.`)
  }

  if (!branchConfig.requiresPublishedLog && publishedLogChanged) {
    fail(`${PUBLISHED_LOG_PATH} must not be updated for opinion bot PRs.`)
  }

  const contentFile = await fs.readFile(path.join(rootDir, contentChange.path), 'utf8')
  const markdownLinks = extractMarkdownLinks(contentFile)
  const invalidLink = markdownLinks.find(link => !isHttpsUrl(link))

  if (invalidLink) {
    fail(
      `All markdown links in bot-authored posts must use absolute https URLs. Invalid link: ${invalidLink}`
    )
  }

  const headBlogPostsSource = await fs.readFile(path.join(rootDir, BLOG_POSTS_PATH), 'utf8')
  const baseBlogPostsSource = git('show', `${baseRef}:${BLOG_POSTS_PATH}`)

  const headBlogPosts = loadBlogPostsFromSource(headBlogPostsSource, BLOG_POSTS_PATH)

  const baseBlogPosts = loadBlogPostsFromSource(
    baseBlogPostsSource,
    `${baseRef}:${BLOG_POSTS_PATH}`
  )

  if (headBlogPosts.length !== baseBlogPosts.length + 1) {
    fail(
      `${BLOG_POSTS_PATH} must add exactly one post entry. Base has ${baseBlogPosts.length}, head has ${headBlogPosts.length}.`
    )
  }

  const basePostsByContentSlug = new Map(
    baseBlogPosts.map(post => [post.contentSlug, JSON.stringify(post)])
  )

  const headPostsByContentSlug = new Map(
    headBlogPosts.map(post => [post.contentSlug, JSON.stringify(post)])
  )

  for (const [contentSlug, serializedBasePost] of basePostsByContentSlug.entries()) {
    const serializedHeadPost = headPostsByContentSlug.get(contentSlug)

    if (!serializedHeadPost) {
      fail(
        `Existing blog post entry "${contentSlug}" was removed or renamed in ${BLOG_POSTS_PATH}.`
      )
    }

    if (serializedHeadPost !== serializedBasePost) {
      fail(
        `Existing blog post entry "${contentSlug}" was modified. Bot PRs may only add one new post entry.`
      )
    }
  }

  const newPosts = headBlogPosts.filter(
    post => !basePostsByContentSlug.has(post.contentSlug)
  )

  if (newPosts.length !== 1) {
    fail(
      `${BLOG_POSTS_PATH} must add exactly one new post entry. Detected ${newPosts.length}.`
    )
  }

  const [newPost] = newPosts
  const expectedContentSlug = path.posix.basename(contentChange.path, '.mdx')
  const nextExpectedId = Math.max(...baseBlogPosts.map(post => post.id)) + 1

  if (newPost.contentSlug !== expectedContentSlug) {
    fail(
      `The new blog post entry must point to ${expectedContentSlug}.mdx, but contentSlug is "${newPost.contentSlug}".`
    )
  }

  if (newPost.id !== nextExpectedId) {
    fail(
      `The new blog post id must be ${nextExpectedId}, but received ${newPost.id}.`
    )
  }

  if (newPost.category !== branchConfig.expectedCategory) {
    fail(
      `Branch "${branchName}" must create category "${branchConfig.expectedCategory}", but received "${newPost.category}".`
    )
  }

  if (!/^\d{4}-\d{2}-\d{2}$/u.test(newPost.publishedOn)) {
    fail(
      `The new blog post publishedOn must use YYYY-MM-DD format. Received "${newPost.publishedOn}".`
    )
  }

  const headPublishedLog = await readJsonFile(PUBLISHED_LOG_PATH)
  const basePublishedLog = readJsonFromRef(baseRef, PUBLISHED_LOG_PATH)

  if (
    !Array.isArray(headPublishedLog.published) ||
    !Array.isArray(basePublishedLog.published)
  ) {
    fail(`${PUBLISHED_LOG_PATH} must contain a top-level "published" array.`)
  }

  if (branchConfig.requiresPublishedLog) {
    if (headPublishedLog.published.length !== basePublishedLog.published.length + 1) {
      fail(`${PUBLISHED_LOG_PATH} must append exactly one new source URL for news bot PRs.`)
    }

    const baseEntriesMatch = basePublishedLog.published.every(
      (entry, index) => JSON.stringify(headPublishedLog.published[index]) === JSON.stringify(entry)
    )

    if (!baseEntriesMatch) {
      fail(`${PUBLISHED_LOG_PATH} must only append a new source URL without rewriting history.`)
    }

    const lastEntry =
      headPublishedLog.published[headPublishedLog.published.length - 1]

    const appendedUrl = typeof lastEntry === 'string'
      ? lastEntry
      : lastEntry.canonical_url

    const sourceFooterUrl = extractSourceFooterUrl(contentFile)

    if (!sourceFooterUrl) {
      fail(
        'News bot PRs must end the MDX post with an "*Source: [Source Name](https://...)*" footer.'
      )
    }

    if (!isCanonicalSourceArticleUrl(sourceFooterUrl)) {
      fail(
        `The news source URL must be a canonical https article URL, not a feed or truncated URL: ${sourceFooterUrl}`
      )
    }

    if (appendedUrl !== sourceFooterUrl) {
      fail(
        `${PUBLISHED_LOG_PATH} must append the same source URL used in the MDX footer. Footer: ${sourceFooterUrl}; log: ${appendedUrl}`
      )
    }
  } else {
    const logsMatch =
      JSON.stringify(headPublishedLog.published) ===
      JSON.stringify(basePublishedLog.published)

    if (!logsMatch) {
      fail(`${PUBLISHED_LOG_PATH} must remain unchanged for opinion bot PRs.`)
    }
  }

  console.log('Bot PR validation passed.')
}

await main()
