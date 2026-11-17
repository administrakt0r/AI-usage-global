import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { act, createElement } from 'react';

import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';

import { useScrollState } from './use-scroll-state.ts';

// Capture original globals for clean teardown
const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
const originalNode = globalThis.Node;
const originalElement = globalThis.Element;
const originalHTMLElement = globalThis.HTMLElement;
const originalHTMLIFrameElement = globalThis.HTMLIFrameElement;
const originalEvent = globalThis.Event;
const originalActEnv = (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
const originalRAF = globalThis.requestAnimationFrame;
const originalCAF = globalThis.cancelAnimationFrame;

type ScrollListener = {
  type: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
};

describe('useScrollState hook', () => {
  let listeners: ScrollListener[];
  let rafCallbacks: Map<number, FrameRequestCallback>;
  let nextRafId: number;
  let cancelledRafIds: Set<number>;
  let currentScrollY: number;
  let mockDocument: any;
  let rootContainer: any;
  let activeRoot: Root | null;

  function createMockNode(nodeType: number, nodeName: string) {
    const children: any[] = [];

    const target: any = {
      nodeType,
      nodeName,
      tagName: nodeType === 1 ? nodeName.toUpperCase() : '',
      childNodes: children,
      children,
      parentNode: null,
      nextSibling: null,
      previousSibling: null,
      get ownerDocument() {
        return mockDocument;
      },
      style: {},
      dataset: {},
      getAttribute: () => null,
      setAttribute: () => {},
      removeAttribute: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      appendChild(child: any) {
        child.parentNode = proxy;
        children.push(child);

        return child;
      },
      insertBefore(child: any, beforeChild: any) {
        child.parentNode = proxy;
        const index = children.indexOf(beforeChild);

        if (index !== -1) {
          children.splice(index, 0, child);
        } else {
          children.push(child);
        }

        return child;
      },
      removeChild(child: any) {
        const index = children.indexOf(child);

        if (index !== -1) {
          children.splice(index, 1);
        }

        child.parentNode = null;

        return child;
      },
    };

    const proxy = new Proxy(target, {
      get(t, prop) {
        return prop in t ? t[prop] : undefined;
      },
      set(t, prop, val) {
        t[prop] = val;

        return true;
      },
    });

    return proxy;
  }

  beforeEach(() => {
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

    listeners = [];
    rafCallbacks = new Map();
    nextRafId = 1;
    cancelledRafIds = new Set();
    currentScrollY = 0;
    activeRoot = null;

    class MockNode {}
    class MockElement extends MockNode {}
    class MockHTMLElement extends MockElement {}
    class MockHTMLIFrameElement extends MockHTMLElement {}
    class MockEvent {
      type: string;
      constructor(type: string) {
        this.type = type;
      }
      initEvent() {}
    }

    (globalThis as any).Node = MockNode;
    (globalThis as any).Element = MockElement;
    (globalThis as any).HTMLElement = MockHTMLElement;
    (globalThis as any).HTMLIFrameElement = MockHTMLIFrameElement;
    (globalThis as any).Event = MockEvent;

    const mockWindow: any = {
      get scrollY() {
        return currentScrollY;
      },
      set scrollY(val: number) {
        currentScrollY = val;
      },
      addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
        listeners.push({ type, listener, options });
      },
      removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
        listeners = listeners.filter((l) => !(l.type === type && l.listener === listener));
      },
      requestAnimationFrame(callback: FrameRequestCallback): number {
        const id = nextRafId++;

        rafCallbacks.set(id, callback);

        return id;
      },
      cancelAnimationFrame(id: number) {
        rafCallbacks.delete(id);
        cancelledRafIds.add(id);
      },
      Node: MockNode,
      Element: MockElement,
      HTMLElement: MockHTMLElement,
      HTMLIFrameElement: MockHTMLIFrameElement,
      Event: MockEvent,
    };

    mockDocument = {
      nodeType: 9,
      nodeName: '#document',
      defaultView: mockWindow,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      createElement(tag: string) {
        return createMockNode(1, tag.toUpperCase());
      },
      createComment(data: string) {
        const comment = createMockNode(8, '#comment');

        comment.data = data;

        return comment;
      },
      createTextNode(data: string) {
        const text = createMockNode(3, '#text');

        text.data = data;

        return text;
      },
      createEvent() {
        return new MockEvent('');
      },
      getElementsByTagName() {
        return [];
      },
    };

    mockWindow.document = mockDocument;
    mockDocument.head = createMockNode(1, 'HEAD');
    mockDocument.documentElement = createMockNode(1, 'HTML');
    rootContainer = createMockNode(1, 'DIV');
    mockDocument.body = rootContainer;

    (globalThis as any).window = mockWindow;
    (globalThis as any).document = mockDocument;
    (globalThis as any).requestAnimationFrame = mockWindow.requestAnimationFrame.bind(mockWindow);
    (globalThis as any).cancelAnimationFrame = mockWindow.cancelAnimationFrame.bind(mockWindow);
  });

  afterEach(() => {
    if (activeRoot) {
      act(() => {
        activeRoot?.unmount();
      });
      activeRoot = null;
    }

    (globalThis as any).window = originalWindow;
    (globalThis as any).document = originalDocument;
    (globalThis as any).Node = originalNode;
    (globalThis as any).Element = originalElement;
    (globalThis as any).HTMLElement = originalHTMLElement;
    (globalThis as any).HTMLIFrameElement = originalHTMLIFrameElement;
    (globalThis as any).Event = originalEvent;
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = originalActEnv;
    (globalThis as any).requestAnimationFrame = originalRAF;
    (globalThis as any).cancelAnimationFrame = originalCAF;
  });

  function renderHook<T>(hookFn: () => T): { getResult: () => T; unmount: () => void } {
    let latestResult: T;

    function TestComponent() {
      latestResult = hookFn();

      return null;
    }

    act(() => {
      activeRoot = createRoot(rootContainer);
      activeRoot.render(createElement(TestComponent));
    });

    return {
      getResult: () => latestResult,
      unmount: () => {
        if (activeRoot) {
          act(() => {
            activeRoot?.unmount();
          });
          activeRoot = null;
        }
      },
    };
  }

  function flushAnimationFrame() {
    const pending = Array.from(rafCallbacks.entries());

    rafCallbacks.clear();

    for (const [, cb] of pending) {
      cb(performance.now());
    }
  }

  function emitScrollEvent() {
    const scrollListeners = listeners.filter((l) => l.type === 'scroll');

    for (const l of scrollListeners) {
      if (typeof l.listener === 'function') {
        l.listener(new (globalThis as any).Event('scroll'));
      } else if (l.listener && typeof (l.listener as any).handleEvent === 'function') {
        (l.listener as any).handleEvent(new (globalThis as any).Event('scroll'));
      }
    }
  }

  it('returns false initially when scrollY is 0', () => {
    currentScrollY = 0;
    const { getResult } = renderHook(() => useScrollState());

    // Before rAF fires, initial useState is false
    assert.equal(getResult(), false);

    // Flush initial rAF queued by handleScrollState on mount
    act(() => {
      flushAnimationFrame();
    });

    assert.equal(getResult(), false);
  });

  it('returns true after rAF fires on mount if scrollY is greater than threshold', () => {
    currentScrollY = 50;
    const { getResult } = renderHook(() => useScrollState(0));

    // Initially state is false before effect / rAF executes
    assert.equal(getResult(), false);

    // Flush mount rAF
    act(() => {
      flushAnimationFrame();
    });

    assert.equal(getResult(), true);
  });

  it('updates state to true when scrolled past default threshold (0)', () => {
    currentScrollY = 0;
    const { getResult } = renderHook(() => useScrollState());

    act(() => {
      flushAnimationFrame();
    });
    assert.equal(getResult(), false);

    // Trigger scroll event with scrollY > 0
    currentScrollY = 10;
    act(() => {
      emitScrollEvent();
    });

    // Before rAF flush, state hasn't updated yet
    assert.equal(getResult(), false);

    // Flush rAF scheduled by scroll event
    act(() => {
      flushAnimationFrame();
    });

    assert.equal(getResult(), true);
  });

  it('updates state back to false when scrollY returns to threshold or below', () => {
    currentScrollY = 100;
    const { getResult } = renderHook(() => useScrollState());

    act(() => {
      flushAnimationFrame();
    });
    assert.equal(getResult(), true);

    // Scroll back to 0
    currentScrollY = 0;
    act(() => {
      emitScrollEvent();
      flushAnimationFrame();
    });

    assert.equal(getResult(), false);
  });

  it('respects a custom threshold parameter', () => {
    currentScrollY = 100;
    const { getResult } = renderHook(() => useScrollState(150));

    act(() => {
      flushAnimationFrame();
    });

    // 100 is <= 150 threshold
    assert.equal(getResult(), false);

    // Scroll past threshold to 200
    currentScrollY = 200;
    act(() => {
      emitScrollEvent();
      flushAnimationFrame();
    });

    assert.equal(getResult(), true);

    // Scroll back to exactly threshold (150)
    currentScrollY = 150;
    act(() => {
      emitScrollEvent();
      flushAnimationFrame();
    });

    // 150 is not > 150 threshold, so isScrolled should be false
    assert.equal(getResult(), false);
  });

  it('throttles rapid scroll events to a single requestAnimationFrame', () => {
    currentScrollY = 0;
    const { getResult } = renderHook(() => useScrollState());

    act(() => {
      flushAnimationFrame();
    });

    // Fire multiple scroll events in rapid succession before rAF executes
    currentScrollY = 10;
    act(() => {
      emitScrollEvent();
      currentScrollY = 20;
      emitScrollEvent();
      currentScrollY = 30;
      emitScrollEvent();
    });

    // Only one rAF callback should have been scheduled
    assert.equal(rafCallbacks.size, 1);

    act(() => {
      flushAnimationFrame();
    });

    assert.equal(getResult(), true);
  });

  it('removes event listener and cancels pending animation frame on unmount', () => {
    currentScrollY = 0;
    const { unmount } = renderHook(() => useScrollState());

    // Flush initial mount rAF
    act(() => {
      flushAnimationFrame();
    });

    // Trigger scroll event to queue a new rAF callback
    currentScrollY = 50;
    act(() => {
      emitScrollEvent();
    });

    assert.equal(rafCallbacks.size, 1);
    const pendingRafId = Array.from(rafCallbacks.keys())[0];

    // Verify listener is registered
    assert.equal(listeners.length, 1);

    // Unmount
    unmount();

    // Listener should be removed from window
    assert.equal(listeners.length, 0);

    // Pending rAF should be cancelled
    assert.ok(cancelledRafIds.has(pendingRafId));
    assert.equal(rafCallbacks.size, 0);
  });
});
