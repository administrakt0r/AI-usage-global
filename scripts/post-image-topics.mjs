// Pure helpers that pick a visual topic and a headline stat for post images.
// Kept separate from the renderer so they can be unit tested.

export const TOPICS = {
  water: {
    weight: 1.5,
    label: 'WATER',
    patterns: [/\bwater\b/i, /\bcooling\b/i, /\bdrought\b/i, /\baquifer/i, /\blit(?:er|re)s?\b/i, /\bgallons?\b/i, /\bdesalinat/i],
    colors: { from: '#031b2e', to: '#0b4a6f', accent: '#38bdf8', soft: '#7dd3fc' }
  },
  nuclear: {
    weight: 1.5,
    label: 'NUCLEAR',
    patterns: [/\bnuclear\b/i, /\breactor/i, /\bSMRs?\b/, /\buranium\b/i, /\bfusion\b/i, /\bfission\b/i],
    colors: { from: '#160c2e', to: '#3b1d6e', accent: '#a78bfa', soft: '#c4b5fd' }
  },
  geothermal: {
    weight: 1.5,
    label: 'GEOTHERMAL',
    patterns: [/\bgeothermal\b/i, /\bhot rock\b/i, /\bheat reuse\b/i, /\bwaste heat\b/i],
    colors: { from: '#2a0d06', to: '#7c2d12', accent: '#fb923c', soft: '#fdba74' }
  },
  emissions: {
    weight: 1.2,
    label: 'EMISSIONS',
    patterns: [/\bemission/i, /\bcarbon\b/i, /\bCO2\b/i, /\bclimate\b/i, /\bnet[- ]zero\b/i, /\bgas[- ]fired\b/i, /\bcoal\b/i, /\bpollut/i],
    colors: { from: '#151a1f', to: '#3f4a55', accent: '#f87171', soft: '#fca5a5' }
  },
  policy: {
    weight: 1.2,
    label: 'POLICY',
    patterns: [/\bban\b/i, /\bbill\b/i, /\blaw\b/i, /\bsues?\b/i, /\blawsuit/i, /\bregulat/i, /\bmoratorium/i, /\bzoning\b/i, /\bcourt\b/i, /\bcongress\b/i, /\bsenate\b/i, /\bcommission\b/i, /\bEU\b/, /\bprotest/i, /\btax\b/i],
    colors: { from: '#0f1430', to: '#283a8c', accent: '#818cf8', soft: '#a5b4fc' }
  },
  power: {
    weight: 0.6,
    label: 'POWER',
    patterns: [/\bpower\b/i, /\bgrid\b/i, /\belectric/i, /\butilit/i, /\b\d[\d.,]*\s?(?:MW|GW|TWh|GWh)\b/i, /\bsolar\b/i, /\bwind\b/i, /\bbattery\b/i, /\bturbines?\b/i, /\benergy\b/i],
    colors: { from: '#211504', to: '#6b4407', accent: '#fbbf24', soft: '#fde68a' }
  },
  chips: {
    weight: 1,
    label: 'COMPUTE',
    patterns: [/\bGPUs?\b/i, /\bchips?\b/i, /\bsemiconductor/i, /\bNVIDIA\b/i, /\bTPUs?\b/i, /\bcompute\b/i, /\bHBM\b/i, /\bfab\b/i, /\bTSMC\b/i],
    colors: { from: '#04201c', to: '#0f5a4f', accent: '#2dd4bf', soft: '#99f6e4' }
  },
  finance: {
    weight: 0.8,
    label: 'MONEY',
    patterns: [/[$€£]\s?\d/, /\bbillion\b/i, /\binvest/i, /\bfunding\b/i, /\braises?\b/i, /\bIPO\b/, /\bdeal\b/i, /\bacquir/i, /\bcapex\b/i, /\bvaluation\b/i],
    colors: { from: '#061f10', to: '#14532d', accent: '#4ade80', soft: '#bbf7d0' }
  },
  datacenter: {
    weight: 1,
    label: 'DATA CENTERS',
    patterns: [],
    colors: { from: '#06140d', to: '#134e32', accent: '#22c55e', soft: '#86efac' }
  }
}

const TOPIC_ORDER = ['water', 'nuclear', 'geothermal', 'emissions', 'policy', 'power', 'chips', 'finance']

/**
 * Picks the topic with the highest weighted pattern score. Title hits count
 * three times as much as description/keyword hits; specific topics (water,
 * nuclear) outweigh generic ones (power, money). Ties go to the earlier topic.
 */
export const classifyTopic = ({ title = '', description = '', keywords = [] } = {}) => {
  const extra = `${description} ${(keywords ?? []).join(' ')}`
  let best = 'datacenter'
  let bestScore = 0

  for (const id of TOPIC_ORDER) {
    const topic = TOPICS[id]

    const hits = topic.patterns.reduce(
      (total, pattern) => total + (pattern.test(title) ? 3 : 0) + (pattern.test(extra) ? 1 : 0),
      0
    )

    const score = hits * topic.weight

    if (score > bestScore) {
      best = id
      bestScore = score
    }
  }

  return best
}

const UNIT_LABELS = {
  MW: 'of capacity',
  GW: 'of capacity',
  kW: 'of capacity',
  TWh: 'of electricity',
  GWh: 'of electricity',
  MWh: 'of electricity',
  '%': 'change',
  L: 'of water',
  gal: 'of water',
  t: 'of CO2'
}

const SCALE_SUFFIX = { trillion: 'T', billion: 'B', bn: 'B', million: 'M', mn: 'M', thousand: 'K' }

const STAT_PATTERN =
  /([$€£])?\s?(\d+(?:[.,]\d+)*)\s?(trillion|billion|bn|million|mn|thousand|[KMBT](?![a-z]))?\s?(TWh|GWh|MWh|GW|MW|kW|%|percent|lit(?:er|re)s|gallons|tonnes|tons)?/gi

/**
 * Extracts the most headline-worthy number from a title, e.g. "50MW", "$24B",
 * "457MW" or "30%". Returns null when the title has no meaningful figure.
 */
export const extractKeyStat = title => {
  const candidates = []

  for (const match of String(title ?? '').matchAll(STAT_PATTERN)) {
    const [, currency, rawNumber, scale, rawUnit] = match

    if (!currency && !scale && !rawUnit) {
      continue
    }

    // Skip bare years such as "2026" that only matched because of a stray scale letter.
    if (!currency && !rawUnit && /^(19|20)\d{2}$/.test(rawNumber)) {
      continue
    }

    const number = rawNumber
    const suffix = scale ? (SCALE_SUFFIX[scale.toLowerCase()] ?? scale.toUpperCase()) : ''
    let unit = rawUnit ?? ''

    if (/^percent$/i.test(unit)) unit = '%'
    if (/^lit/i.test(unit)) unit = 'L'
    if (/^gallon/i.test(unit)) unit = 'gal'
    if (/^ton/i.test(unit)) unit = 't'

    if (/^(twh|gwh|mwh|gw|mw|kw)$/i.test(unit)) {
      unit = unit.replace(/^(t|g|m|k)(w)(h?)$/i, (_, prefix, w, h) => `${prefix === 'k' ? 'k' : prefix.toUpperCase()}W${h ? 'h' : ''}`)
    }

    const spaced = ['L', 'gal', 't'].includes(unit)
    const value = `${currency ?? ''}${number}${suffix}${spaced ? ' ' : ''}${unit}`
    const label = currency ? 'deal value' : (UNIT_LABELS[unit] ?? 'headline figure')
    const priority = currency ? 3 : unit ? 2 : 1

    candidates.push({ value: value.trim(), label, priority, index: match.index })
  }

  if (candidates.length === 0) {
    return null
  }

  candidates.sort((a, b) => b.priority - a.priority || a.index - b.index)
  const { value, label } = candidates[0]

  return value.length <= 9 ? { value, label } : null
}
