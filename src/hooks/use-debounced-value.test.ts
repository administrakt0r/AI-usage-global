import assert from "node:assert/strict";
import { describe, it, mock, beforeEach, afterEach } from "node:test";

import React, { act, useEffect } from "react";

import { createRoot, type Root } from "react-dom/client";

import { useDebouncedValue } from "./use-debounced-value.ts";

// Set up minimal DOM globals required for React 19 client rendering in Node test environment
function setupDOM() {
  class FakeElement {
    nodeType = 1;
    nodeName = "DIV";
    tagName = "DIV";
    namespaceURI = "http://www.w3.org/1999/xhtml";
    childNodes: unknown[] = [];
    parentNode: unknown = null;
    style = {};
    ownerDocument = globalThis.document;

    appendChild(child: unknown) {
      this.childNodes.push(child);
      (child as { parentNode: unknown }).parentNode = this;

      return child;
    }

    removeChild(child: unknown) {
      const idx = this.childNodes.indexOf(child);

      if (idx !== -1) this.childNodes.splice(idx, 1);
      (child as { parentNode: unknown }).parentNode = null;

      return child;
    }

    insertBefore(child: unknown, before: unknown) {
      const idx = this.childNodes.indexOf(before);

      if (idx !== -1) this.childNodes.splice(idx, 0, child);
      else this.appendChild(child);

      return child;
    }

    addEventListener() {}
    removeEventListener() {}
    getAttribute() {
      return null;
    }
    setAttribute() {}
    removeAttribute() {}
  }

  class FakeTextNode {
    nodeType = 3;
    nodeName = "#text";
    parentNode = null;
    ownerDocument = globalThis.document;
    textContent = "";
    constructor(text: string) {
      this.textContent = text;
    }
  }

  class HTMLDocument {}
  class HTMLElement {}
  class HTMLIFrameElement {}

  // @ts-ignore
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  // @ts-ignore
  globalThis.HTMLDocument = HTMLDocument;

  // @ts-ignore
  globalThis.HTMLElement = HTMLElement;

  // @ts-ignore
  globalThis.HTMLIFrameElement = HTMLIFrameElement;

  // @ts-ignore
  globalThis.document = {
    nodeType: 9,
    nodeName: "#document",
    createElement: () => new FakeElement() as any,
    createTextNode: (text: string) => new FakeTextNode(text) as any,
    createElementNS: () => new FakeElement() as any,
    addEventListener: () => {},
    removeEventListener: () => {},
    activeElement: null,
  };

  // @ts-ignore
  globalThis.window = globalThis;
}

setupDOM();

function TestComponent<T>({
  value,
  delay,
  onValue,
}: {
  value: T;
  delay: number;
  onValue: (val: T) => void;
}) {
  const debounced = useDebouncedValue(value, delay);

  useEffect(() => {
    onValue(debounced);
  }, [debounced, onValue]);

  return null;
}

describe("useDebouncedValue", () => {
  let container: unknown;
  let root: Root;

  beforeEach(() => {
    mock.timers.enable();
    container = globalThis.document.createElement("div");
    root = createRoot(container as HTMLElement);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    mock.timers.reset();
  });

  function renderHook<T>(hookProps: { value: T; delay: number }) {
    let currentResult: T = undefined as unknown as T;

    const handleValue = (val: T) => {
      currentResult = val;
    };

    act(() => {
      root.render(
        React.createElement(TestComponent<T>, {
          ...hookProps,
          onValue: handleValue,
        }),
      );
    });

    return {
      getResult: () => currentResult,
      rerender: (newProps: { value: T; delay: number }) => {
        act(() => {
          root.render(
            React.createElement(TestComponent<T>, {
              ...newProps,
              onValue: handleValue,
            }),
          );
        });
      },
    };
  }

  it("returns initial value immediately on render", () => {
    const { getResult } = renderHook({ value: "hello", delay: 200 });

    assert.equal(getResult(), "hello");
  });

  it("does not update value immediately when input value changes", () => {
    const { getResult, rerender } = renderHook({ value: "hello", delay: 200 });

    rerender({ value: "world", delay: 200 });
    assert.equal(getResult(), "hello");
  });

  it("updates value after specified delay", () => {
    const { getResult, rerender } = renderHook({ value: "hello", delay: 200 });

    rerender({ value: "world", delay: 200 });

    act(() => {
      mock.timers.tick(100);
    });
    assert.equal(getResult(), "hello");

    act(() => {
      mock.timers.tick(100);
    });
    assert.equal(getResult(), "world");
  });

  it("resets debounce timer if value changes before delay elapses", () => {
    const { getResult, rerender } = renderHook({ value: "v1", delay: 200 });

    rerender({ value: "v2", delay: 200 });
    act(() => {
      mock.timers.tick(150);
    });
    assert.equal(getResult(), "v1");

    rerender({ value: "v3", delay: 200 });
    act(() => {
      mock.timers.tick(150);
    });
    assert.equal(getResult(), "v1");

    act(() => {
      mock.timers.tick(50);
    });
    assert.equal(getResult(), "v3");
  });

  it("handles delay time change", () => {
    const { getResult, rerender } = renderHook({ value: "v1", delay: 500 });

    rerender({ value: "v2", delay: 100 });
    act(() => {
      mock.timers.tick(100);
    });

    assert.equal(getResult(), "v2");
  });
});
