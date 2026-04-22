import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { cn } from './utils.ts';

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
