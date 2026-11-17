import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { renderHook, act } from '@testing-library/react';
import { JSDOM } from 'jsdom';

import { useDebouncedValue } from './use-debounced-value.ts';

// Set up JSDOM environment for React 19 hook testing
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
});

(globalThis as any).window = dom.window;
(globalThis as any).document = dom.window.document;
(globalThis as any).Node = dom.window.Node;
(globalThis as any).Element = dom.window.Element;
(globalThis as any).HTMLElement = dom.window.HTMLElement;
(globalThis as any).HTMLIFrameElement = dom.window.HTMLIFrameElement;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useDebouncedValue hook', () => {
  beforeEach(() => {
    mock.timers.enable();
  });

  afterEach(() => {
    mock.timers.reset();
  });

  it('returns initial value immediately on render', () => {
    const { result, unmount } = renderHook(() =>
      useDebouncedValue('hello', 300)
    );

    assert.equal(result.current, 'hello');
    unmount();
  });

  it('delays updating the debounced value until delay has elapsed', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 300 },
      }
    );

    assert.equal(result.current, 'initial');

    rerender({ value: 'updated', delay: 300 });

    // Before delay elapses
    assert.equal(result.current, 'initial');

    // Advance partial delay (200ms)
    act(() => {
      mock.timers.tick(200);
    });
    assert.equal(result.current, 'initial');

    // Advance remaining delay (100ms)
    act(() => {
      mock.timers.tick(100);
    });
    assert.equal(result.current, 'updated');

    unmount();
  });

  it('resets timer on rapid value changes', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebouncedValue(value, delay),
      {
        initialProps: { value: 'a', delay: 300 },
      }
    );

    // Update to 'ab' after 100ms
    act(() => {
      mock.timers.tick(100);
    });
    rerender({ value: 'ab', delay: 300 });

    // Update to 'abc' after another 100ms
    act(() => {
      mock.timers.tick(100);
    });
    rerender({ value: 'abc', delay: 300 });

    assert.equal(result.current, 'a');

    // Advance 200ms (total 400ms from start, but only 200ms since last change)
    act(() => {
      mock.timers.tick(200);
    });
    assert.equal(result.current, 'a');

    // Advance final 100ms (300ms since last change)
    act(() => {
      mock.timers.tick(100);
    });
    assert.equal(result.current, 'abc');

    unmount();
  });

  it('handles non-primitive data types correctly', () => {
    const initialObj = { search: 'foo', count: 1 };
    const updatedObj = { search: 'bar', count: 2 };

    const { result, rerender, unmount } = renderHook(
      ({ value, delay }: { value: { search: string; count: number }; delay: number }) =>
        useDebouncedValue(value, delay),
      {
        initialProps: { value: initialObj, delay: 150 },
      }
    );

    assert.deepEqual(result.current, initialObj);

    rerender({ value: updatedObj, delay: 150 });

    act(() => {
      mock.timers.tick(150);
    });

    assert.deepEqual(result.current, updatedObj);

    unmount();
  });

  it('clears pending timeout when component unmounts', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 300 },
      }
    );

    rerender({ value: 'pending-update', delay: 300 });

    // Unmount before delay completes
    unmount();

    // Advance timer past delay
    act(() => {
      mock.timers.tick(300);
    });

    assert.equal(result.current, 'initial');
  });
});
