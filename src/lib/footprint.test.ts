import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import data from '../assets/data/ai-footprint.json' with { type: 'json' };
import { validateFootprintData } from '../../scripts/footprint-schema.mjs';
import {
  getCounterUnit,
  getDaysSinceReview,
  getPerSecondRate,
  getYearToDate,
  isFootprintStale,
} from './footprint.ts';

const metric = { unit: 'TWh', annual: { low: 1, central: 365, high: 400 } };

describe('footprint data file', () => {
  it('passes the shared schema check', () => {
    assert.deepEqual(validateFootprintData(data), []);
  });

  it('rejects inverted ranges and unknown sources', () => {
    const broken = structuredClone(data);

    broken.metrics[0].annual = { low: 10, central: 5, high: 20 };
    broken.metrics[1].sourceIds = ['missing-source'];
    const errors = validateFootprintData(broken);

    assert.ok(errors.some((error: string) => error.includes('low <= central <= high')));
    assert.ok(errors.some((error: string) => error.includes('unknown source missing-source')));
  });

  it('requires history to end on lastReviewed', () => {
    const broken = structuredClone(data);

    broken.lastReviewed = '2099-01-01';
    assert.ok(validateFootprintData(broken).some((error: string) => error.includes('lastReviewed')));
  });
});

describe('footprint math', () => {
  it('converts TWh per year to kWh per second', () => {
    assert.equal(getCounterUnit(metric).unit, 'kWh');

    // 365 TWh over a 365-day year = 1 TWh/day = 1e9 kWh / 86,400 s
    assert.ok(Math.abs(getPerSecondRate(metric, 2026) - 1e9 / 86_400) < 1e-6);
  });

  it('accumulates year-to-date from 1 January UTC', () => {
    assert.equal(getYearToDate(metric, new Date('2026-01-01T00:00:00Z')), 0);
    const oneDay = getYearToDate(metric, new Date('2026-01-02T00:00:00Z'));

    assert.ok(Math.abs(oneDay - 1e9) < 1);
  });

  it('flags stale reviews after the allowed age', () => {
    const now = new Date('2026-11-25T12:00:00Z');

    assert.equal(getDaysSinceReview('2026-11-17', now), 8);
    assert.equal(isFootprintStale('2026-11-17', now), true);
    assert.equal(isFootprintStale('2026-11-20', now), false);
  });
});
