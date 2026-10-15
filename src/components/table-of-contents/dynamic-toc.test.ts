import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { groupTocItems, type TocItem } from './dynamic-toc.tsx';

describe('groupTocItems utility function', () => {
  it('returns empty array when given empty list', () => {
    const result = groupTocItems([]);

    assert.deepEqual(result, []);
  });

  it('groups level 2 headings correctly with no sub-headings', () => {
    const items: TocItem[] = [
      { id: 'heading-1', title: 'Heading 1', level: 2 },
      { id: 'heading-2', title: 'Heading 2', level: 2 },
    ];

    const result = groupTocItems(items);

    assert.deepEqual(result, [
      {
        main: { id: 'heading-1', title: 'Heading 1', level: 2 },
        subs: [],
      },
      {
        main: { id: 'heading-2', title: 'Heading 2', level: 2 },
        subs: [],
      },
    ]);
  });

  it('groups level 3 sub-headings under their preceding level 2 heading', () => {
    const items: TocItem[] = [
      { id: 'heading-1', title: 'Heading 1', level: 2 },
      { id: 'sub-1a', title: 'Sub 1A', level: 3 },
      { id: 'sub-1b', title: 'Sub 1B', level: 3 },
      { id: 'heading-2', title: 'Heading 2', level: 2 },
      { id: 'sub-2a', title: 'Sub 2A', level: 3 },
    ];

    const result = groupTocItems(items);

    assert.deepEqual(result, [
      {
        main: { id: 'heading-1', title: 'Heading 1', level: 2 },
        subs: [
          { id: 'sub-1a', title: 'Sub 1A', level: 3 },
          { id: 'sub-1b', title: 'Sub 1B', level: 3 },
        ],
      },
      {
        main: { id: 'heading-2', title: 'Heading 2', level: 2 },
        subs: [{ id: 'sub-2a', title: 'Sub 2A', level: 3 }],
      },
    ]);
  });

  it('ignores orphan level 3 headings when no level 2 group exists', () => {
    const items: TocItem[] = [
      { id: 'sub-orphan', title: 'Orphan Sub', level: 3 },
      { id: 'heading-1', title: 'Heading 1', level: 2 },
      { id: 'sub-1a', title: 'Sub 1A', level: 3 },
    ];

    const result = groupTocItems(items);

    assert.deepEqual(result, [
      {
        main: { id: 'heading-1', title: 'Heading 1', level: 2 },
        subs: [{ id: 'sub-1a', title: 'Sub 1A', level: 3 }],
      },
    ]);
  });
});
