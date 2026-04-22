import fs from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const rootDir = path.resolve(__dirname, '..')

const compileModule = async filePath => {
  const source = await fs.readFile(filePath, 'utf8')

  return ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020
    },
    fileName: filePath
  }).outputText
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

export const executeCommonJsModule = (compiled, filename, customRequires = {}) => {
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
        `Unsupported import while loading derived data in ${filename}: ${specifier} (normalized: ${normalizedSpecifier})`
      )
    }
  }

  vm.runInNewContext(compiled, sandbox, { filename })

  return cjsModule.exports
}

export const loadBlogUtils = async () => {
  const filePath = path.join(rootDir, 'src', 'lib', 'blog.ts')
  const compiled = await compileModule(filePath)
  const exports = executeCommonJsModule(compiled, 'blog-utils.js')

  if (
    typeof exports.comparePostsByPublishedAt !== 'function' ||
    typeof exports.getPostRssDate !== 'function'
  ) {
    throw new Error('Unable to load blog helpers for derived asset generation.')
  }

  return exports
}

export const loadBlogPosts = async () => {
  const blogUtils = await loadBlogUtils()

  const filePath = path.join(rootDir, 'src', 'assets', 'data', 'blog-posts.ts')
  const compiled = await compileModule(filePath)

  const exports = executeCommonJsModule(compiled, 'blog-posts.js', {
    '@/lib/blog': blogUtils
  })

  if (!Array.isArray(exports.blogPosts)) {
    throw new Error('Unable to load blog posts for derived asset generation.')
  }

  return exports.blogPosts
}
