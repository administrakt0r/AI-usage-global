import assert from 'node:assert/strict'
import test from 'node:test'

 
// @ts-ignore -- plain ESM helper without type declarations
import { classifyTopic, extractKeyStat } from '../../scripts/post-image-topics.mjs'

test('classifyTopic prefers specific topics over generic power words', () => {
  assert.equal(classifyTopic({ title: 'AEP and X-energy Partner on 960 MW Indiana Nuclear Project' }), 'nuclear')
  assert.equal(classifyTopic({ title: 'Google Signs 50MW Superhot Rock Geothermal Deal in Oregon' }), 'geothermal')
  assert.equal(classifyTopic({ title: 'Data center water use climbs during drought' }), 'water')
  assert.equal(classifyTopic({ title: 'Prologis Sues Ohio City Over Retroactive 25MW Data Center Ban' }), 'policy')
  assert.equal(classifyTopic({ title: 'Utility adds 2 GW of grid capacity' }), 'power')
})

test('classifyTopic falls back to datacenter when nothing matches', () => {
  assert.equal(classifyTopic({ title: 'A quiet week for hyperscalers' }), 'datacenter')
  assert.equal(classifyTopic({}), 'datacenter')
})

test('extractKeyStat finds capacity, money and percentage figures', () => {
  assert.deepEqual(extractKeyStat('OpenAI Secures 457MW AI Compute Capacity'), { value: '457MW', label: 'of capacity' })
  assert.deepEqual(extractKeyStat('Meta adds 1.2 GW in Texas'), { value: '1.2GW', label: 'of capacity' })
  assert.deepEqual(extractKeyStat('Microsoft invests $24 billion in 457MW campus'), { value: '$24B', label: 'deal value' })
  assert.deepEqual(extractKeyStat('Water use up 30 percent'), { value: '30%', label: 'change' })
  assert.deepEqual(extractKeyStat('Site draws 5 million gallons a day'), { value: '5M gal', label: 'of water' })
})

test('extractKeyStat ignores years and bare numbers', () => {
  assert.equal(extractKeyStat('TSMC Q3 revenue 2026'), null)
  assert.equal(extractKeyStat('Top 10 data center markets'), null)
  assert.equal(extractKeyStat(''), null)
})
