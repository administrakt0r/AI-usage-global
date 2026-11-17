import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { groupTocItems } from "./dynamic-toc.tsx";

describe("groupTocItems", () => {
  it("returns an empty array when given an empty list", () => {
    assert.deepEqual(groupTocItems([]), []);
  });

  it("groups flat H2 items with no sub-items", () => {
    const items = [
      { id: "section-1", title: "Section 1", level: 2 },
      { id: "section-2", title: "Section 2", level: 2 },
    ];

    const result = groupTocItems(items);

    assert.deepEqual(result, [
      {
        main: { id: "section-1", title: "Section 1", level: 2 },
        subs: [],
      },
      {
        main: { id: "section-2", title: "Section 2", level: 2 },
        subs: [],
      },
    ]);
  });

  it("groups H2 items with nested H3 sub-items", () => {
    const items = [
      { id: "intro", title: "Introduction", level: 2 },
      { id: "background", title: "Background", level: 3 },
      { id: "overview", title: "Overview", level: 3 },
      { id: "details", title: "Details", level: 2 },
      { id: "deep-dive", title: "Deep Dive", level: 3 },
    ];

    const result = groupTocItems(items);

    assert.deepEqual(result, [
      {
        main: { id: "intro", title: "Introduction", level: 2 },
        subs: [
          { id: "background", title: "Background", level: 3 },
          { id: "overview", title: "Overview", level: 3 },
        ],
      },
      {
        main: { id: "details", title: "Details", level: 2 },
        subs: [{ id: "deep-dive", title: "Deep Dive", level: 3 }],
      },
    ]);
  });

  it("ignores H3 items appearing before any H2 item", () => {
    const items = [
      { id: "orphaned", title: "Orphaned Subtitle", level: 3 },
      { id: "main-1", title: "Main Title 1", level: 2 },
      { id: "sub-1", title: "Sub Title 1", level: 3 },
    ];

    const result = groupTocItems(items);

    assert.deepEqual(result, [
      {
        main: { id: "main-1", title: "Main Title 1", level: 2 },
        subs: [{ id: "sub-1", title: "Sub Title 1", level: 3 }],
      },
    ]);
  });

  it("ignores items with unsupported heading levels (e.g., level 1 or 4)", () => {
    const items = [
      { id: "h1-item", title: "Title H1", level: 1 },
      { id: "h2-item", title: "Title H2", level: 2 },
      { id: "h4-item", title: "Title H4", level: 4 },
      { id: "h3-item", title: "Title H3", level: 3 },
    ];

    const result = groupTocItems(items);

    assert.deepEqual(result, [
      {
        main: { id: "h2-item", title: "Title H2", level: 2 },
        subs: [{ id: "h3-item", title: "Title H3", level: 3 }],
      },
    ]);
  });
});
