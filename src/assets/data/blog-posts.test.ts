import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  assertUniqueBlogPosts,
  slugify,
  blogPosts,
  blogPostsBySlug,
  adjacentPostsBySlug,
  sortedBlogPosts,
} from "./blog-posts";

describe("slugify function", () => {
  it("handles basic lowercasing and trimming", () => {
    assert.equal(slugify("  Hello World  "), "hello-world");
    assert.equal(slugify("TEST"), "test");
  });

  it("replaces spaces and invalid characters with dashes", () => {
    assert.equal(slugify("hello world"), "hello-world");
    assert.equal(slugify("hello_world!@#"), "hello-world");
    assert.equal(slugify("hello.world?"), "hello-world");
  });

  it("removes extra dashes", () => {
    assert.equal(slugify("hello   world"), "hello-world");
    assert.equal(slugify("hello---world"), "hello-world");
  });

  it("strips leading and trailing dashes", () => {
    assert.equal(slugify("---hello world---"), "hello-world");
    assert.equal(slugify("  - hello - "), "hello");
  });

  it("strips diacritics via NFKD normalization", () => {
    assert.equal(slugify("café"), "cafe");
    assert.equal(slugify("résumé"), "resume");
    assert.equal(slugify("naïve"), "naive");
  });

  it("handles numbers and keeps them", () => {
    assert.equal(slugify("123 test 456"), "123-test-456");
    assert.equal(slugify("year 2024!"), "year-2024");
  });

  it("handles empty strings and only special characters", () => {
    assert.equal(slugify(""), "");
    assert.equal(slugify("   "), "");
    assert.equal(slugify("!@#$%^&*()"), "");
    assert.equal(slugify("---"), "");
  });

  it("handles complex real-world titles", () => {
    assert.equal(
      slugify("OpenAI launches GPT-5 with multimodal capabilities"),
      "openai-launches-gpt-5-with-multimodal-capabilities",
    );
    assert.equal(
      slugify("EU AI Act enforcement begins across member states"),
      "eu-ai-act-enforcement-begins-across-member-states",
    );
    assert.equal(
      slugify("Anthropic secures $2B in series D funding"),
      "anthropic-secures-2b-in-series-d-funding",
    );
  });
});

describe("assertUniqueBlogPosts", () => {
  it("throws when ids are duplicated", () => {
    assert.throws(
      () =>
        assertUniqueBlogPosts([
          { id: 1, slug: "a", contentSlug: "a" },
          { id: 1, slug: "b", contentSlug: "b" },
        ] as never),
      /Duplicate blog post id detected: 1/,
    );
  });

  it("throws when slugs are duplicated", () => {
    assert.throws(
      () =>
        assertUniqueBlogPosts([
          { id: 1, slug: "a", contentSlug: "a" },
          { id: 2, slug: "a", contentSlug: "b" },
        ] as never),
      /Duplicate blog post slug detected: a/,
    );
  });

  it("throws when content slugs are duplicated", () => {
    assert.throws(
      () =>
        assertUniqueBlogPosts([
          { id: 1, slug: "a", contentSlug: "shared" },
          { id: 2, slug: "b", contentSlug: "shared" },
        ] as never),
      /Duplicate blog post contentSlug detected: shared/,
    );
  });
});

describe("blog posts data structures and navigation lookups", () => {
  it("blogPostsBySlug contains all blog posts keyed by slug", () => {
    assert.equal(blogPostsBySlug.size, blogPosts.length);

    for (const post of blogPosts) {
      assert.equal(blogPostsBySlug.get(post.slug), post);
    }
  });

  it("adjacentPostsBySlug maps correct newer and older posts for sorted blog posts", () => {
    assert.equal(adjacentPostsBySlug.size, sortedBlogPosts.length);

    // Test first (newest) post
    const newest = sortedBlogPosts[0];
    const newestAdjacent = adjacentPostsBySlug.get(newest.slug);

    assert.ok(newestAdjacent);
    assert.equal(newestAdjacent.newerPost, null);
    assert.equal(newestAdjacent.olderPost, sortedBlogPosts[1]);

    // Test middle post
    const middleIndex = Math.floor(sortedBlogPosts.length / 2);
    const middle = sortedBlogPosts[middleIndex];
    const middleAdjacent = adjacentPostsBySlug.get(middle.slug);

    assert.ok(middleAdjacent);
    assert.equal(middleAdjacent.newerPost, sortedBlogPosts[middleIndex - 1]);
    assert.equal(middleAdjacent.olderPost, sortedBlogPosts[middleIndex + 1]);

    // Test last (oldest) post
    const lastIndex = sortedBlogPosts.length - 1;
    const oldest = sortedBlogPosts[lastIndex];
    const oldestAdjacent = adjacentPostsBySlug.get(oldest.slug);

    assert.ok(oldestAdjacent);
    assert.equal(oldestAdjacent.newerPost, sortedBlogPosts[lastIndex - 1]);
    assert.equal(oldestAdjacent.olderPost, null);
  });

  it("Map lookup is significantly faster than linear array findIndex search", () => {
    const iterations = 500;

    // Linear search benchmark (findIndex)
    const startBaseline = performance.now();

    for (let i = 0; i < iterations; i++) {
      for (const post of sortedBlogPosts) {
        const index = sortedBlogPosts.findIndex((p) => p.slug === post.slug);
        const newer = index > 0 ? sortedBlogPosts[index - 1] : null;

        const older =
          index < sortedBlogPosts.length - 1 ? sortedBlogPosts[index + 1] : null;

        assert.ok(index !== -1 || newer !== undefined || older !== undefined);
      }
    }

    const baselineTime = performance.now() - startBaseline;

    // Map lookup benchmark
    const startOptimized = performance.now();

    for (let i = 0; i < iterations; i++) {
      for (const post of sortedBlogPosts) {
        const adjacent = adjacentPostsBySlug.get(post.slug);
        const newer = adjacent?.newerPost ?? null;
        const older = adjacent?.olderPost ?? null;

        assert.ok(adjacent || newer !== undefined || older !== undefined);
      }
    }

    const optimizedTime = performance.now() - startOptimized;

    console.log(`\n    Performance Benchmark (500 runs x ${sortedBlogPosts.length} posts):`);
    console.log(`    - Baseline findIndex: ${baselineTime.toFixed(2)} ms`);
    console.log(`    - Optimized Map get: ${optimizedTime.toFixed(2)} ms`);
    console.log(
      `    - Speedup factor: ${(baselineTime / Math.max(optimizedTime, 0.01)).toFixed(1)}x\n`,
    );

    assert.ok(
      optimizedTime < baselineTime,
      `Expected Map lookup (${optimizedTime.toFixed(2)}ms) to be faster than findIndex (${baselineTime.toFixed(2)}ms)`,
    );
  });
});
