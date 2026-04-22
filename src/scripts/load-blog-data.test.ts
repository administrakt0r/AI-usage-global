import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { executeCommonJsModule } from '../../scripts/load-blog-data.mjs';

describe('executeCommonJsModule', () => {
  it('resolves equivalent specifiers for the blog utility module', () => {
    const exports = executeCommonJsModule(
      'module.exports = require("../lib/blog.ts")',
      'blog-posts.js',
      {
        '@/lib/blog': { loadBlogPosts: () => [] },
      }
    ) as { loadBlogPosts: () => [] };

    assert.equal(typeof exports.loadBlogPosts, 'function');
  });

  it('includes filename and normalized specifier in unsupported import errors', () => {
    assert.throws(
      () => executeCommonJsModule('require("../lib/not-blog.ts")', 'blog-posts.js', {}),
      /blog-posts\.js: ..\/lib\/not-blog\.ts \(normalized: ..\/lib\/not-blog\)/
    );
  });
});
