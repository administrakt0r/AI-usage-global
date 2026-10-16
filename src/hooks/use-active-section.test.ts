import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import React, { act, useEffect } from "react";
import { createRoot, Root } from "react-dom/client";
import { useActiveSection } from "./use-active-section.ts";

class MockElement {
  nodeType = 1;
  tagName = "DIV";
  style = {};
  children: MockElement[] = [];
  ownerDocument: unknown = null;
  id = "";
  offsetTop = 0;
  offsetHeight = 0;

  appendChild(c: MockElement) {
    this.children.push(c);
  }

  removeChild(c: MockElement) {
    const idx = this.children.indexOf(c);
    if (idx !== -1) {
      this.children.splice(idx, 1);
    }
  }

  setAttribute() {}
  removeAttribute() {}
  addEventListener() {}
  removeEventListener() {}
}

class MockHTMLIFrameElement extends MockElement {}

describe("useActiveSection hook", () => {
  let originalGlobals: Record<string, unknown>;
  let scrollListeners: Set<EventListener>;
  let pendingRafCallbacks: Map<number, FrameRequestCallback>;
  let rafIdCounter: number;
  let mockSections: MockElement[];

  let mockWindow: Record<string, unknown>;
  let mockDocument: {
    nodeType: number;
    defaultView: unknown;
    createElement: (tag: string) => MockElement;
    createComment: () => { nodeType: number };
    querySelectorAll: (selector: string) => MockElement[];
    addEventListener: () => void;
    removeEventListener: () => void;
    activeElement: unknown;
  };

  let testContainer: MockElement;
  let root: Root | null = null;
  let currentActiveSection: string = "";

  function TestComponent() {
    const active = useActiveSection();

    useEffect(() => {
      currentActiveSection = active;
    }, [active]);

    return null;
  }

  function flushRaf() {
    const callbacks = Array.from(pendingRafCallbacks.entries());
    pendingRafCallbacks.clear();
    for (const [, cb] of callbacks) {
      cb(performance.now());
    }
  }

  function triggerScroll() {
    for (const listener of scrollListeners) {
      listener({ type: "scroll" } as Event);
    }
  }

  beforeEach(() => {
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

    originalGlobals = {
      window: globalThis.window,
      document: globalThis.document,
      Element: globalThis.Element,
      HTMLIFrameElement: globalThis.HTMLIFrameElement,
      requestAnimationFrame: globalThis.requestAnimationFrame,
      cancelAnimationFrame: globalThis.cancelAnimationFrame,
    };

    scrollListeners = new Set();
    pendingRafCallbacks = new Map();
    rafIdCounter = 0;
    mockSections = [];
    currentActiveSection = "";

    mockWindow = {
      scrollY: 0,
      innerHeight: 1000,
      addEventListener: (event: string, fn: EventListener) => {
        if (event === "scroll") {
          scrollListeners.add(fn);
        }
      },
      removeEventListener: (event: string, fn: EventListener) => {
        if (event === "scroll") {
          scrollListeners.delete(fn);
        }
      },
      HTMLIFrameElement: MockHTMLIFrameElement,
    };

    mockDocument = {
      nodeType: 9,
      defaultView: mockWindow,
      createElement: (tag: string) => {
        const el = new MockElement();
        el.tagName = tag.toUpperCase();
        el.ownerDocument = mockDocument;
        return el;
      },
      createComment: () => ({ nodeType: 8 }),
      querySelectorAll: (selector: string) => {
        if (selector === "section[id]") {
          return mockSections;
        }
        return [];
      },
      addEventListener: () => {},
      removeEventListener: () => {},
      activeElement: null,
    };

    globalThis.window = mockWindow as unknown as Window & typeof globalThis;
    globalThis.document = mockDocument as unknown as Document;
    globalThis.Element = MockElement as unknown as typeof Element;
    globalThis.HTMLIFrameElement = MockHTMLIFrameElement as unknown as typeof HTMLIFrameElement;

    globalThis.requestAnimationFrame = (cb: FrameRequestCallback): number => {
      const id = ++rafIdCounter;
      pendingRafCallbacks.set(id, cb);
      return id;
    };

    globalThis.cancelAnimationFrame = (id: number) => {
      pendingRafCallbacks.delete(id);
    };

    testContainer = mockDocument.createElement("div");
  });

  afterEach(() => {
    if (root) {
      act(() => {
        root?.unmount();
      });
      root = null;
    }

    Object.assign(globalThis, originalGlobals);
  });

  it("returns empty string initially before RAF callback runs", () => {
    act(() => {
      root = createRoot(testContainer as unknown as HTMLElement);
      root.render(React.createElement(TestComponent));
    });

    assert.equal(currentActiveSection, "");
  });

  it("identifies active section based on scroll position and section bounds", () => {
    const sec1 = new MockElement();
    sec1.id = "hero";
    sec1.offsetTop = 0;
    sec1.offsetHeight = 600;

    const sec2 = new MockElement();
    sec2.id = "about";
    sec2.offsetTop = 600;
    sec2.offsetHeight = 800;

    mockSections = [sec1, sec2];

    act(() => {
      root = createRoot(testContainer as unknown as HTMLElement);
      root.render(React.createElement(TestComponent));
    });

    // Initial run queued by hook mount
    act(() => {
      flushRaf();
    });

    // scrollY=0 + innerHeight/2=500 -> hits sec1 (0 <= 500 < 600)
    assert.equal(currentActiveSection, "hero");

    // Scroll down so scrollPosition = 700 + 500 = 1200 (hits sec2: 600 <= 1200 < 1400)
    mockWindow.scrollY = 700;

    act(() => {
      triggerScroll();
      flushRaf();
    });

    assert.equal(currentActiveSection, "about");
  });

  it("clears active section when scroll position is outside all sections", () => {
    const sec1 = new MockElement();
    sec1.id = "hero";
    sec1.offsetTop = 100;
    sec1.offsetHeight = 400; // bounds 100..500

    mockSections = [sec1];

    act(() => {
      root = createRoot(testContainer as unknown as HTMLElement);
      root.render(React.createElement(TestComponent));
    });

    act(() => {
      flushRaf();
    });

    // scrollY=0 + innerHeight/2=500 -> 500 is not < 500 (sec1 offsetTop + offsetHeight = 500)
    assert.equal(currentActiveSection, "");
  });

  it("handles empty section list gracefully when mounted with no sections", () => {
    mockSections = [];

    act(() => {
      root = createRoot(testContainer as unknown as HTMLElement);
      root.render(React.createElement(TestComponent));
    });

    act(() => {
      flushRaf();
    });

    assert.equal(currentActiveSection, "");
  });

  it("throttles scroll events to animation frames", () => {
    const sec1 = new MockElement();
    sec1.id = "hero";
    sec1.offsetTop = 0;
    sec1.offsetHeight = 1000;

    mockSections = [sec1];

    act(() => {
      root = createRoot(testContainer as unknown as HTMLElement);
      root.render(React.createElement(TestComponent));
    });

    // Hook mounted, queued 1st RAF
    assert.equal(pendingRafCallbacks.size, 1);

    // Multiple scroll events fired before RAF flushes
    triggerScroll();
    triggerScroll();

    // No extra RAF should be requested because rafRef.current is non-zero
    assert.equal(pendingRafCallbacks.size, 1);

    act(() => {
      flushRaf();
    });

    assert.equal(currentActiveSection, "hero");
  });

  it("removes scroll listener and cancels pending animation frame on unmount", () => {
    act(() => {
      root = createRoot(testContainer as unknown as HTMLElement);
      root.render(React.createElement(TestComponent));
    });

    assert.equal(scrollListeners.size, 1);
    assert.equal(pendingRafCallbacks.size, 1);

    act(() => {
      root?.unmount();
      root = null;
    });

    assert.equal(scrollListeners.size, 0);
    assert.equal(pendingRafCallbacks.size, 0);
  });
});
