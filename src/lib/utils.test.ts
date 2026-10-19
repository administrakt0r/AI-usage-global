import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { cn, serializeJsonLd } from './utils.ts';

describe('cn utility function', () => {
  it('merges basic class strings', () => {
    assert.equal(cn('class1', 'class2'), 'class1 class2');
    assert.equal(cn('class1 class2', 'class3'), 'class1 class2 class3');
  });

  it('handles conditional classes (clsx feature)', () => {
    assert.equal(cn('class1', { class2: true, class3: false }), 'class1 class2');
    assert.equal(cn('class1', true && 'class2', false && 'class3'), 'class1 class2');
  });

  it('handles falsy values (clsx feature)', () => {
    assert.equal(cn('class1', null, undefined, false, '', 0, 'class2'), 'class1 class2');
  });

  it('handles arrays of classes (clsx feature)', () => {
    assert.equal(cn(['class1', 'class2'], ['class3', ['class4']]), 'class1 class2 class3 class4');
  });

  it('resolves tailwind class conflicts (tailwind-merge feature)', () => {
    // Basic override
    assert.equal(cn('px-2 py-1', 'p-4'), 'p-4');

    // Last one wins
    assert.equal(cn('bg-red-500', 'bg-blue-500'), 'bg-blue-500');

    // Margin override
    assert.equal(cn('mt-4', 'my-2', 'm-1'), 'm-1');

    // Text color override
    assert.equal(cn('text-black', 'text-white/50'), 'text-white/50');

    // Font weight override
    assert.equal(cn('font-bold', 'font-normal'), 'font-normal');
  });

  it('handles complex combinations', () => {
    assert.equal(
      cn(
        'base-class',
        ['array-class1', 'array-class2'],
        { 'conditional-class': true, 'ignored-class': false },
        'bg-red-500',
        'p-4',
        'bg-blue-500' // This should override bg-red-500
      ),
      'base-class array-class1 array-class2 conditional-class p-4 bg-blue-500'
    );
  });
});

describe('serializeJsonLd utility function', () => {
  it('serializes simple objects to JSON string', () => {
    const data = { title: 'Test Title', id: 123 };

    assert.equal(serializeJsonLd(data), '{"title":"Test Title","id":123}');
  });

  it('escapes sensitive HTML control characters to unicode sequences', () => {
    const data = {
      malicious: '</script><script>alert("XSS")</script>',
      html: 'Me & You > Them < Us',
    };

    const serialized = serializeJsonLd(data);

    assert.ok(!serialized.includes('<'));
    assert.ok(!serialized.includes('>'));
    assert.ok(!serialized.includes('&'));
    assert.equal(
      serialized,
      '{"malicious":"\\u003c/script\\u003e\\u003cscript\\u003ealert(\\"XSS\\")\\u003c/script\\u003e","html":"Me \\u0026 You \\u003e Them \\u003c Us"}'
    );
  });

  it('escapes line separators \\u2028 and \\u2029', () => {
    const data = {
      lineSep: 'line1\u2028line2',
      paraSep: 'para1\u2029para2',
    };

    const serialized = serializeJsonLd(data);

    assert.equal(
      serialized,
      '{"lineSep":"line1\\u2028line2","paraSep":"para1\\u2029para2"}'
    );
  });

  it('produces valid JSON when parsed back', () => {
    const data = {
      title: 'AI & Data Center <Report>',
      details: { author: 'John & Jane Doe' },
    };

    const serialized = serializeJsonLd(data);
    const parsed = JSON.parse(serialized);

    assert.deepEqual(parsed, data);
  });
});
