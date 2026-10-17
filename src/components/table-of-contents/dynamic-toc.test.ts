import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { groupTocItems } from "./dynamic-toc.tsx";

describe("groupTocItems utility function", () => {
  it("returns an empty array when given an empty list of items", () => {
    assert.deepEqual(groupTocItems([]), []);
  });

  it("groups single level-2 items with no sub-items", () => {
    const items = [
      { id: "heading-1", title: "Heading 1", level: 2 },
      { id: "heading-2", title: "Heading 2", level: 2 },
    ];

    assert.deepEqual(groupTocItems(items), [
      {
        main: { id: "heading-1", title: "Heading 1", level: 2 },
        subs: [],
      },
      {
        main: { id: "heading-2", title: "Heading 2", level: 2 },
        subs: [],
      },
    ]);
  });

  it("groups level-3 sub-items under their respective main level-2 parent", () => {
    const items = [
      { id: "h2-1", title: "Main 1", level: 2 },
      { id: "h3-1", title: "Sub 1.1", level: 3 },
      { id: "h3-2", title: "Sub 1.2", level: 3 },
      { id: "h2-2", title: "Main 2", level: 2 },
      { id: "h3-3", title: "Sub 2.1", level: 3 },
    ];

    assert.deepEqual(groupTocItems(items), [
      {
        main: { id: "h2-1", title: "Main 1", level: 2 },
        subs: [
          { id: "h3-1", title: "Sub 1.1", level: 3 },
          { id: "h3-2", title: "Sub 1.2", level: 3 },
        ],
      },
      {
        main: { id: "h2-2", title: "Main 2", level: 2 },
        subs: [{ id: "h3-3", title: "Sub 2.1", level: 3 }],
      },
    ]);
  });

  it("ignores orphan level-3 items that appear before any level-2 item", () => {
    const items = [
      { id: "h3-orphan", title: "Orphan Sub", level: 3 },
      { id: "h2-1", title: "Main 1", level: 2 },
      { id: "h3-1", title: "Sub 1", level: 3 },
    ];

    assert.deepEqual(groupTocItems(items), [
      {
        main: { id: "h2-1", title: "Main 1", level: 2 },
        subs: [{ id: "h3-1", title: "Sub 1", level: 3 }],
      },
    ]);
  });

  it("ignores items with levels other than 2 or 3", () => {
    const items = [
      { id: "h1-1", title: "Title H1", level: 1 },
      { id: "h2-1", title: "Main 1", level: 2 },
      { id: "h4-1", title: "Deep Sub H4", level: 4 },
      { id: "h3-1", title: "Sub 1", level: 3 },
    ];

    assert.deepEqual(groupTocItems(items), [
      {
        main: { id: "h2-1", title: "Main 1", level: 2 },
        subs: [{ id: "h3-1", title: "Sub 1", level: 3 }],
      },
    ]);
  });
});
