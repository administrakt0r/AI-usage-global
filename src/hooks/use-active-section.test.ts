import assert from "node:assert/strict";
import { describe, it } from "node:test";

import React, { useEffect } from "react";

import { createRoot } from "react-dom/client";

(global as any).IS_REACT_ACT_ENVIRONMENT = true;

type EventCallback = () => void;

class MockElement {
  nodeType = 1;
  tagName = "DIV";
  ownerDocument = null;
  id = "";
  offsetTop = 0;
  offsetHeight = 0;
  appendChild(child: unknown) {
    return child;
  }

  removeChild(child: unknown) {
    return child;
  }

  insertBefore(child: unknown) {
    return child;
  }

  setAttribute() {}
  removeAttribute() {}
  style = {};
  addEventListener() {}
  removeEventListener() {}
}

class MockHTMLIFrameElement extends MockElement {}

(global as any).Element = MockElement;
(global as any).HTMLIFrameElement = MockHTMLIFrameElement;

const scrollListeners: EventCallback[] = [];
const rafCallbacks: Map<number, FrameRequestCallback> = new Map();
let rafIdCounter = 0;
let cancelledRafIds: number[] = [];

const mockWindow: {
  scrollY: number;
  innerHeight: number;
  HTMLIFrameElement: typeof MockHTMLIFrameElement;
  Element: typeof MockElement;
  document?: unknown;
  addEventListener: (event: string, fn: EventCallback) => void;
  removeEventListener: (event: string, fn: EventCallback) => void;
} = {
  scrollY: 0,
  innerHeight: 1000,
  HTMLIFrameElement: MockHTMLIFrameElement,
  Element: MockElement,
  addEventListener: (event: string, fn: EventCallback) => {
    if (event === "scroll") scrollListeners.push(fn);
  },
  removeEventListener: (event: string, fn: EventCallback) => {
    const idx = scrollListeners.indexOf(fn);

    if (idx !== -1) scrollListeners.splice(idx, 1);
  },
};

(global as any).window = mockWindow;

(global as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
  const id = ++rafIdCounter;

  rafCallbacks.set(id, cb);

  return id;
};

(global as any).cancelAnimationFrame = (id: number) => {
  cancelledRafIds.push(id);
  rafCallbacks.delete(id);
};

let querySelectorAllResult: MockElement[] = [];

const mockDocument = {
  nodeType: 9,
  nodeName: "#document",
  defaultView: mockWindow,
  HTMLIFrameElement: MockHTMLIFrameElement,
  Element: MockElement,
  activeElement: null,
  querySelectorAll: () => querySelectorAllResult,
  addEventListener: () => {},
  removeEventListener: () => {},
  createElement: (tag: string) => createMockElement(tag),
  createElementNS: () => createMockElement("div"),
  createTextNode: (str: string) => ({
    nodeType: 3,
    nodeValue: str,
    textContent: str,
    ownerDocument: mockDocument,
  }),
  createComment: (str: string) => ({
    nodeType: 8,
    nodeName: "#comment",
    nodeValue: str,
    textContent: str,
    ownerDocument: mockDocument,
  }),
};

mockWindow.document = mockDocument;

function createMockElement(tag: string) {
  const el = new MockElement();

  el.tagName = tag.toUpperCase();
  (el as any).ownerDocument = mockDocument;

  return el;
}

(global as any).document = mockDocument;

import { useActiveSection } from "./use-active-section.ts";

function flushAnimationFrame() {
  const callbacks = Array.from(rafCallbacks.entries());

  rafCallbacks.clear();
  React.act(() => {
    callbacks.forEach(([, cb]) => cb(performance.now()));
  });
}

function triggerScroll() {
  scrollListeners.forEach((fn) => fn());
}

function TestComponent({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  const active = useActiveSection();

  useEffect(() => {
    onChange(active);
  }, [active, onChange]);

  return null;
}

describe("useActiveSection hook", () => {
  it("returns empty string when no sections are present in the DOM", () => {
    querySelectorAllResult = [];
    mockWindow.scrollY = 0;

    let activeSection = "INITIAL";

    const container = mockDocument.createElement("div");
    const root = createRoot(container as unknown as Element);

    React.act(() => {
      root.render(
        React.createElement(TestComponent, {
          onChange: (val) => {
            activeSection = val;
          },
        }),
      );
    });
    flushAnimationFrame();

    assert.equal(activeSection, "");

    React.act(() => {
      root.unmount();
    });
  });

  it("detects active section based on scroll position and updates on scroll", () => {
    const sec1 = new MockElement();

    sec1.id = "overview";
    sec1.offsetTop = 0;
    sec1.offsetHeight = 500;

    const sec2 = new MockElement();

    sec2.id = "details";
    sec2.offsetTop = 500;
    sec2.offsetHeight = 500;

    querySelectorAllResult = [sec1, sec2];
    mockWindow.scrollY = 250; // scrollPosition = 250 + 500 = 750 (sec2: 500..1000)

    let activeSection = "";

    const container = mockDocument.createElement("div");
    const root = createRoot(container as unknown as Element);

    React.act(() => {
      root.render(
        React.createElement(TestComponent, {
          onChange: (val) => {
            activeSection = val;
          },
        }),
      );
    });
    flushAnimationFrame();

    assert.equal(activeSection, "details");

    // Scroll back to overview section
    mockWindow.scrollY = -100; // scrollPosition = -100 + 500 = 400 (sec1: 0..500)
    triggerScroll();
    flushAnimationFrame();

    assert.equal(activeSection, "overview");

    // Scroll past all sections
    mockWindow.scrollY = 2000; // scrollPosition = 2500 (> 1000)
    triggerScroll();
    flushAnimationFrame();

    assert.equal(activeSection, "");

    React.act(() => {
      root.unmount();
    });
  });

  it("throttles scroll handling via requestAnimationFrame", () => {
    const sec1 = new MockElement();

    sec1.id = "section-1";
    sec1.offsetTop = 0;
    sec1.offsetHeight = 1000;

    querySelectorAllResult = [sec1];
    mockWindow.scrollY = 0;

    let activeSection = "";

    const container = mockDocument.createElement("div");
    const root = createRoot(container as unknown as Element);

    React.act(() => {
      root.render(
        React.createElement(TestComponent, {
          onChange: (val) => {
            activeSection = val;
          },
        }),
      );
    });
    flushAnimationFrame();

    rafCallbacks.clear();

    // Fire multiple scroll events in succession
    triggerScroll();
    const countAfterFirstScroll = rafCallbacks.size;

    triggerScroll();
    triggerScroll();
    const countAfterMultipleScrolls = rafCallbacks.size;

    assert.equal(countAfterFirstScroll, 1);
    assert.equal(countAfterMultipleScrolls, 1);

    flushAnimationFrame();
    assert.equal(activeSection, "section-1");

    React.act(() => {
      root.unmount();
    });
  });

  it("cleans up scroll listener and cancels pending animation frame on unmount", () => {
    const sec1 = new MockElement();

    sec1.id = "section-1";
    sec1.offsetTop = 0;
    sec1.offsetHeight = 1000;

    querySelectorAllResult = [sec1];
    mockWindow.scrollY = 0;

    const container = mockDocument.createElement("div");
    const root = createRoot(container as unknown as Element);

    React.act(() => {
      root.render(
        React.createElement(TestComponent, {
          onChange: () => {},
        }),
      );
    });
    flushAnimationFrame();

    const initialListenerCount = scrollListeners.length;

    assert.ok(initialListenerCount > 0);

    triggerScroll(); // schedules pending rAF
    const pendingRafId = Array.from(rafCallbacks.keys())[0];

    cancelledRafIds = [];
    React.act(() => {
      root.unmount();
    });

    assert.ok(cancelledRafIds.includes(pendingRafId));
    assert.equal(scrollListeners.length, 0);
  });
});
