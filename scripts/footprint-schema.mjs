// Shared schema check for src/assets/data/ai-footprint.json.
// Used by the bot PR validator and by unit tests.

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const REQUIRED_METRICS = ['ai-electricity', 'datacenter-electricity', 'ai-water', 'ai-emissions']

const isFiniteNumber = value => typeof value === 'number' && Number.isFinite(value)

const isHttpsUrl = value => {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export const validateFootprintData = data => {
  const errors = []

  if (!data || typeof data !== 'object') {
    return ['Footprint data must be a JSON object.']
  }

  if (!ISO_DATE.test(String(data.lastReviewed ?? ''))) {
    errors.push('lastReviewed must be an ISO date (YYYY-MM-DD).')
  }

  if (!Number.isInteger(data.estimateYear) || data.estimateYear < 2024 || data.estimateYear > 2100) {
    errors.push('estimateYear must be a plausible integer year.')
  }

  if (typeof data.methodology !== 'string' || data.methodology.trim().length < 40) {
    errors.push('methodology must explain how the estimates were derived.')
  }

  const sources = Array.isArray(data.sources) ? data.sources : []

  if (sources.length === 0) {
    errors.push('sources must be a non-empty array.')
  }

  const sourceIds = new Set()

  for (const source of sources) {
    if (!source?.id || !source?.title || !source?.publisher) {
      errors.push(`Source ${JSON.stringify(source?.id ?? source)} needs id, title and publisher.`)
    }

    if (!isHttpsUrl(source?.url)) {
      errors.push(`Source ${source?.id} must use an https URL.`)
    }

    if (sourceIds.has(source?.id)) {
      errors.push(`Duplicate source id ${source?.id}.`)
    }

    sourceIds.add(source?.id)
  }

  const metrics = Array.isArray(data.metrics) ? data.metrics : []
  const metricIds = new Set(metrics.map(metric => metric?.id))

  for (const id of REQUIRED_METRICS) {
    if (!metricIds.has(id)) {
      errors.push(`Missing required metric ${id}.`)
    }
  }

  for (const metric of metrics) {
    const label = metric?.id ?? '(unknown metric)'
    const annual = metric?.annual ?? {}

    if (!metric?.label || !metric?.unit || !metric?.scope) {
      errors.push(`Metric ${label} needs label, unit and scope.`)
    }

    if (![annual.low, annual.central, annual.high].every(isFiniteNumber)) {
      errors.push(`Metric ${label} annual low/central/high must be numbers.`)
    } else if (!(annual.low > 0 && annual.low <= annual.central && annual.central <= annual.high)) {
      errors.push(`Metric ${label} must satisfy 0 < low <= central <= high.`)
    }

    for (const key of ['baseline', 'projection']) {
      const point = metric?.[key]

      if (point && (!Number.isInteger(point.year) || !isFiniteNumber(point.value))) {
        errors.push(`Metric ${label} ${key} needs an integer year and numeric value.`)
      }
    }

    if (typeof metric?.derivation !== 'string' || metric.derivation.trim().length < 20) {
      errors.push(`Metric ${label} needs a derivation note.`)
    }

    const refs = Array.isArray(metric?.sourceIds) ? metric.sourceIds : []

    if (refs.length === 0) {
      errors.push(`Metric ${label} must cite at least one source.`)
    }

    for (const ref of refs) {
      if (!sourceIds.has(ref)) {
        errors.push(`Metric ${label} cites unknown source ${ref}.`)
      }
    }

    const comparisons = metric?.comparisons ?? []

    if (!Array.isArray(comparisons)) {
      errors.push(`Metric ${label} comparisons must be an array.`)
    } else {
      for (const comparison of comparisons) {
        const name = `${label}/${comparison?.id ?? '(unknown comparison)'}`

        if (!comparison?.id || typeof comparison?.label !== 'string' || comparison.label.trim().length < 8) {
          errors.push(`Comparison ${name} needs an id and a readable label.`)
        }

        if (!isFiniteNumber(comparison?.per) || comparison.per <= 0) {
          errors.push(`Comparison ${name} needs a positive "per" amount in counter units.`)
        }

        const comparisonRefs = Array.isArray(comparison?.sourceIds) ? comparison.sourceIds : []

        if (comparisonRefs.length === 0) {
          errors.push(`Comparison ${name} must cite at least one source.`)
        }

        for (const ref of comparisonRefs) {
          if (!sourceIds.has(ref)) {
            errors.push(`Comparison ${name} cites unknown source ${ref}.`)
          }
        }
      }
    }
  }

  const history = Array.isArray(data.history) ? data.history : []

  if (history.length === 0) {
    errors.push('history must record at least one review.')
  }

  for (const entry of history) {
    if (!ISO_DATE.test(String(entry?.date ?? '')) || !entry?.note) {
      errors.push('Each history entry needs an ISO date and a note.')
    }
  }

  if (history.length > 0 && history.at(-1).date !== data.lastReviewed) {
    errors.push('The last history entry date must equal lastReviewed.')
  }

  return errors
}
