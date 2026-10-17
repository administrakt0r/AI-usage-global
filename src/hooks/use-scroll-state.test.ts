import assert from "node:assert/strict";
import { after, afterEach, beforeEach, describe, it } from "node:test";

import React, { act, useEffect } from "react";

import { createRoot, type Root } from "react-dom/client";

import { useScrollState } from "./use-scroll-state.ts";

class MockNode {}
class MockElement extends MockNode {}
class MockHTMLElement extends MockElement {}
class MockHTMLIFrameElement extends MockHTMLElement {}
class MockHTMLInputElement extends MockHTMLElement {}
class MockHTMLTextAreaElement extends MockHTMLElement {}
class MockHTMLSelectElement extends MockHTMLElement {}
class MockSVGElement extends MockElement {}
class MockDocument extends MockNode {}

type EventCallback = (...args: any[]) => void;

describe("useScrollState hook", () => {
  let listeners: Map<string, Set<EventCallback>>;
  let rafCallbacks: Map<number, FrameRequestCallback>;
  let nextRafId: number;
  let currentScrolledValue: boolean;
  let root: Root | null = null;
  let rootContainer: any = null;

  const originalGlobals = {
    window: globalThis.window,
    document: globalThis.document,
    Node: (globalThis as any).Node,
    Element: (globalThis as any).Element,
    HTMLElement: (globalThis as any).HTMLElement,
    HTMLIFrameElement: (globalThis as any).HTMLIFrameElement,
    HTMLInputElement: (globalThis as any).HTMLInputElement,
    HTMLTextAreaElement: (globalThis as any).HTMLTextAreaElement,
    HTMLSelectElement: (globalThis as any).HTMLSelectElement,
    SVGElement: (globalThis as any).SVGElement,
    Document: (globalThis as any).Document,
    HTMLDocument: (globalThis as any).HTMLDocument,
    requestAnimationFrame: globalThis.requestAnimationFrame,
    cancelAnimationFrame: globalThis.cancelAnimationFrame,
    IS_REACT_ACT_ENVIRONMENT: (globalThis as any).IS_REACT_ACT_ENVIRONMENT,
  };

  function setupEnvironment() {
    listeners = new Map();
    rafCallbacks = new Map();
    nextRafId = 1;
    currentScrolledValue = false;

    (globalThis as any).Node = MockNode;
    (globalThis as any).Element = MockElement;
    (globalThis as any).HTMLElement = MockHTMLElement;
    (globalThis as any).HTMLIFrameElement = MockHTMLIFrameElement;
    (globalThis as any).HTMLInputElement = MockHTMLInputElement;
    (globalThis as any).HTMLTextAreaElement = MockHTMLTextAreaElement;
    (globalThis as any).HTMLSelectElement = MockHTMLSelectElement;
    (globalThis as any).SVGElement = MockSVGElement;
    (globalThis as any).Document = MockDocument;
    (globalThis as any).HTMLDocument = MockDocument;
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

    const mockWindow = {
      Node: MockNode,
      Element: MockElement,
      HTMLElement: MockHTMLElement,
      HTMLIFrameElement: MockHTMLIFrameElement,
      HTMLInputElement: MockHTMLInputElement,
      HTMLTextAreaElement: MockHTMLTextAreaElement,
      HTMLSelectElement: MockHTMLSelectElement,
      SVGElement: MockSVGElement,
      Document: MockDocument,
      HTMLDocument: MockDocument,
      scrollY: 0,
      addEventListener: (type: string, listener: EventCallback) => {
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type)!.add(listener);
      },
      removeEventListener: (type: string, listener: EventCallback) => {
        listeners.get(type)?.delete(listener);
      },
      requestAnimationFrame: (cb: FrameRequestCallback) => {
        const id = nextRafId++;

        rafCallbacks.set(id, cb);

        return id;
      },
      cancelAnimationFrame: (id: number) => {
        rafCallbacks.delete(id);
      },
    };

    (globalThis as any).window = mockWindow;
    (globalThis as any).requestAnimationFrame = mockWindow.requestAnimationFrame;
    (globalThis as any).cancelAnimationFrame = mockWindow.cancelAnimationFrame;

    const doc = Object.assign(new MockDocument(), {
      nodeType: 9,
      nodeName: "#DOCUMENT",
      activeElement: null,
      defaultView: mockWindow,
      addEventListener: () => {},
      removeEventListener: () => {},
      createElement: (tag: string) => {
        const el = Object.assign(new MockHTMLElement(), {
          nodeType: 1,
          nodeName: tag.toUpperCase(),
          tagName: tag.toUpperCase(),
          childNodes: [] as any[],
          ownerDocument: doc,
          appendChild(child: any) {
            this.childNodes.push(child);
          },
          removeChild(child: any) {
            const idx = this.childNodes.indexOf(child);

            if (idx !== -1) this.childNodes.splice(idx, 1);
          },
          insertBefore(child: any) {
            this.childNodes.push(child);
          },
          addEventListener: () => {},
          removeEventListener: () => {},
        });

        return el;
      },
      createElementNS: (_ns: string, tag: string) => {
        const el = Object.assign(new MockElement(), {
          nodeType: 1,
          nodeName: tag.toUpperCase(),
          tagName: tag.toUpperCase(),
          childNodes: [] as any[],
          ownerDocument: doc,
          appendChild(child: any) {
            this.childNodes.push(child);
          },
          removeChild(child: any) {
            const idx = this.childNodes.indexOf(child);

            if (idx !== -1) this.childNodes.splice(idx, 1);
          },
          insertBefore(child: any) {
            this.childNodes.push(child);
          },
          addEventListener: () => {},
          removeEventListener: () => {},
        });

        return el;
      },
      createTextNode: (text: string) =>
        Object.assign(new MockNode(), {
          nodeType: 3,
          nodeName: "#text",
          nodeValue: text,
          ownerDocument: doc,
        }),
    });

    (globalThis as any).document = doc;
  }

  function restoreEnvironment() {
    for (const [key, value] of Object.entries(originalGlobals)) {
      if (value === undefined) {
        delete (globalThis as any)[key];
      } else {
        (globalThis as any)[key] = value;
      }
    }
  }

  function TestComponent({ threshold }: { threshold?: number }) {
    const isScrolled = useScrollState(threshold);

    useEffect(() => {
      currentScrolledValue = isScrolled;
    }, [isScrolled]);

    return null;
  }

  function mountHook(threshold?: number) {
    rootContainer = (globalThis as any).document.createElement("div");
    root = createRoot(rootContainer);
    act(() => {
      root!.render(React.createElement(TestComponent, { threshold }));
    });
  }

  function updateHook(threshold?: number) {
    act(() => {
      root!.render(React.createElement(TestComponent, { threshold }));
    });
  }

  function unmountHook() {
    if (root) {
      act(() => {
        root!.unmount();
      });
      root = null;
    }
  }

  function flushRaf() {
    const currentCallbacks = Array.from(rafCallbacks.entries());

    rafCallbacks.clear();

    for (const [, cb] of currentCallbacks) {
      cb(performance.now());
    }
  }

  function fireScrollEvent() {
    const scrollListeners = listeners.get("scroll");

    if (scrollListeners) {
      for (const listener of Array.from(scrollListeners)) {
        listener();
      }
    }
  }

  beforeEach(() => {
    setupEnvironment();
  });

  afterEach(() => {
    unmountHook();
  });

  after(() => {
    restoreEnvironment();
  });

  it("initializes as false when scrollY is 0 and threshold is 0", () => {
    mountHook(0);
    act(() => {
      flushRaf();
    });
    assert.equal(currentScrolledValue, false);
  });

  it("initializes as true when scrollY is greater than default threshold on mount", () => {
    (globalThis as any).window.scrollY = 50;
    mountHook();
    act(() => {
      flushRaf();
    });
    assert.equal(currentScrolledValue, true);
  });

  it("updates state when window is scrolled past threshold", () => {
    mountHook(100);
    act(() => {
      flushRaf();
    });
    assert.equal(currentScrolledValue, false);

    (globalThis as any).window.scrollY = 150;
    act(() => {
      fireScrollEvent();
      flushRaf();
    });
    assert.equal(currentScrolledValue, true);

    (globalThis as any).window.scrollY = 80;
    act(() => {
      fireScrollEvent();
      flushRaf();
    });
    assert.equal(currentScrolledValue, false);
  });

  it("throttles multiple rapid scroll events to animation frames", () => {
    mountHook(50);
    act(() => {
      flushRaf();
    });

    // Fire multiple scroll events without flushing animation frame
    (globalThis as any).window.scrollY = 20;
    act(() => {
      fireScrollEvent();
      fireScrollEvent();
      fireScrollEvent();
    });

    // Only 1 animation frame should be scheduled
    assert.equal(rafCallbacks.size, 1);

    (globalThis as any).window.scrollY = 100;
    act(() => {
      flushRaf();
    });
    assert.equal(currentScrolledValue, true);
  });

  it("re-evaluates scroll state when threshold prop changes", () => {
    (globalThis as any).window.scrollY = 80;
    mountHook(100);
    act(() => {
      flushRaf();
    });
    assert.equal(currentScrolledValue, false);

    // Lower threshold to 50
    updateHook(50);
    act(() => {
      flushRaf();
    });
    assert.equal(currentScrolledValue, true);
  });

  it("cleans up event listeners and cancels pending animation frame on unmount", () => {
    mountHook(0);
    act(() => {
      flushRaf();
    });

    // Trigger scroll event to queue an animation frame
    (globalThis as any).window.scrollY = 10;
    act(() => {
      fireScrollEvent();
    });

    assert.equal(rafCallbacks.size, 1);
    assert.equal(listeners.get("scroll")?.size, 1);

    unmountHook();

    // Event listener should be removed and rAF canceled
    assert.equal(listeners.get("scroll")?.size, 0);
    assert.equal(rafCallbacks.size, 0);
  });
});
