import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isCanonicalSourceArticleUrl, isHttpsUrl } from '../../scripts/validate-bot-pr.mjs';

describe('isHttpsUrl', () => {
  it('returns true for valid https URLs', () => {
    assert.equal(isHttpsUrl('https://example.com'), true);
    assert.equal(isHttpsUrl('https://example.com/path/to/page?query=value#hash'), true);
    assert.equal(isHttpsUrl('https://sub.domain.org:8080/path'), true);
  });

  it('returns false for non-https valid URLs', () => {
    assert.equal(isHttpsUrl('http://example.com'), false);
    assert.equal(isHttpsUrl('ftp://example.com/file'), false);
    assert.equal(isHttpsUrl('file:///path/to/file'), false);
  });

  it('returns false when new URL() throws an error for invalid URL strings', () => {
    assert.equal(isHttpsUrl('not-a-url'), false);
    assert.equal(isHttpsUrl('relative/path/to/file'), false);
    assert.equal(isHttpsUrl(''), false);
    assert.equal(isHttpsUrl('https://'), false);
    assert.equal(isHttpsUrl('http://:'), false);
    assert.equal(isHttpsUrl('://invalid'), false);
  });
});

describe('isCanonicalSourceArticleUrl', () => {
  it('returns true for valid canonical https article URLs', () => {
    assert.equal(isCanonicalSourceArticleUrl('https://example.com/news/article-1'), true);
    assert.equal(isCanonicalSourceArticleUrl('https://techcrunch.com/2026/08/01/ai-datacenter/'), true);
  });

  it('returns false for non-https or invalid URLs', () => {
    assert.equal(isCanonicalSourceArticleUrl('http://example.com/news/article-1'), false);
    assert.equal(isCanonicalSourceArticleUrl('invalid-url'), false);
  });

  it('returns false for truncated URLs containing "..."', () => {
    assert.equal(isCanonicalSourceArticleUrl('https://example.com/news/article...'), false);
  });

  it('returns false for RSS feeds, ATOM feeds, or XML files', () => {
    assert.equal(isCanonicalSourceArticleUrl('https://example.com/feed'), false);
    assert.equal(isCanonicalSourceArticleUrl('https://example.com/feed/'), false);
    assert.equal(isCanonicalSourceArticleUrl('https://example.com/rss'), false);
    assert.equal(isCanonicalSourceArticleUrl('https://example.com/rss.xml'), false);
    assert.equal(isCanonicalSourceArticleUrl('https://example.com/news.xml'), false);
    assert.equal(isCanonicalSourceArticleUrl('https://example.com/news.atom'), false);
  });
});
