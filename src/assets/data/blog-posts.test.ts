import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { assertUniqueBlogPosts, slugify } from './blog-posts.ts';

describe('slugify function', () => {
  it('handles basic lowercasing and trimming', () => {
    assert.equal(slugify('  Hello World  '), 'hello-world');
    assert.equal(slugify('TEST'), 'test');
  });

  it('replaces spaces and invalid characters with dashes', () => {
    assert.equal(slugify('hello world'), 'hello-world');
    assert.equal(slugify('hello_world!@#'), 'hello-world');
    assert.equal(slugify('hello.world?'), 'hello-world');
  });

  it('removes extra dashes', () => {
    assert.equal(slugify('hello   world'), 'hello-world');
    assert.equal(slugify('hello---world'), 'hello-world');
  });

  it('strips leading and trailing dashes', () => {
    assert.equal(slugify('---hello world---'), 'hello-world');
    assert.equal(slugify('  - hello - '), 'hello');
  });

  it('strips diacritics via NFKD normalization', () => {
    assert.equal(slugify('café'), 'cafe');
    assert.equal(slugify('résumé'), 'resume');
    assert.equal(slugify('naïve'), 'naive');
  });

  it('handles numbers and keeps them', () => {
    assert.equal(slugify('123 test 456'), '123-test-456');
    assert.equal(slugify('year 2024!'), 'year-2024');
  });

  it('handles empty strings and only special characters', () => {
    assert.equal(slugify(''), '');
    assert.equal(slugify('   '), '');
    assert.equal(slugify('!@#$%^&*()'), '');
    assert.equal(slugify('---'), '');
  });

  it('handles complex real-world titles', () => {
    assert.equal(
      slugify('OpenAI launches GPT-5 with multimodal capabilities'),
      'openai-launches-gpt-5-with-multimodal-capabilities'
    );
    assert.equal(
      slugify('EU AI Act enforcement begins across member states'),
      'eu-ai-act-enforcement-begins-across-member-states'
    );
    assert.equal(
      slugify('Anthropic secures $2B in series D funding'),
      'anthropic-secures-2b-in-series-d-funding'
    );
  });
});

describe('assertUniqueBlogPosts', () => {
  it('throws when ids are duplicated', () => {
    assert.throws(
      () =>
        assertUniqueBlogPosts([
          { id: 1, slug: 'a', contentSlug: 'a' },
          { id: 1, slug: 'b', contentSlug: 'b' },
        ] as never),
      /Duplicate blog post id detected: 1/
    );
  });

  it('throws when slugs are duplicated', () => {
    assert.throws(
      () =>
        assertUniqueBlogPosts([
          { id: 1, slug: 'a', contentSlug: 'a' },
          { id: 2, slug: 'a', contentSlug: 'b' },
        ] as never),
      /Duplicate blog post slug detected: a/
    );
  });

  it('throws when content slugs are duplicated', () => {
    assert.throws(
      () =>
        assertUniqueBlogPosts([
          { id: 1, slug: 'a', contentSlug: 'shared' },
          { id: 2, slug: 'b', contentSlug: 'shared' },
        ] as never),
      /Duplicate blog post contentSlug detected: shared/
    );
  });
});