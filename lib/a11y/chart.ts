export type ChartSummaryItem = {
  name: string
  value: string
}

export function buildChartImageLabel(
  title: string,
  summaryItems: string[],
  t: (path: string, options?: string | Record<string, unknown>) => string,
) {
  const summary = summaryItems.length
    ? summaryItems.join(', ')
    : t('charts.noData', 'No data available.')

  const template = t('charts.imageLabel', '{{title}}: {{summary}}')

  return template
    .replace('{{title}}', title)
    .replace('{{summary}}', summary)
}

export function buildChartSummary(
  summaryItems: string[],
  t: (path: string, options?: string | Record<string, unknown>) => string,
) {
  if (!summaryItems.length) {
    return t('charts.noData', 'No data available.')
  }

  return summaryItems.join(', ')
}

/**
 * Generates an accessible aria-label string for a multi-series trend chart.
 *
 * @param title    - Human-readable chart title, e.g. "6-Month Trends"
 * @param data     - Array of data-point objects (one per period)
 * @param keys     - The numeric series keys to summarise, e.g. ["remittances","savings"]
 * @returns A concise label such as:
 *          "6-Month Trends chart. Remittances range: 2800–3400.
 *           Savings range: 1200–1600. Bills range: 380–550. Insurance range: 80–80."
 */
export function generateTrendChartLabel(
  title: string,
  data: Record<string, unknown>[],
  keys: string[],
): string {
  if (!data.length || !keys.length) {
    return `${title} chart. No data available.`
  }

  const rangeParts = keys.map((key) => {
    const values = data
      .map((d) => d[key])
      .filter((v): v is number => typeof v === 'number')

    if (!values.length) return null

    const min = Math.min(...values)
    const max = Math.max(...values)
    const label = key.charAt(0).toUpperCase() + key.slice(1)
    return `${label} range: ${min}–${max}`
  }).filter(Boolean)

  return `${title} chart. ${rangeParts.join('. ')}.`
}

/**
 * Generates a plain-text summary of a multi-series trend chart suitable for
 * screen-reader description regions (e.g. a visually hidden <p>).
 *
 * @param data  - Array of data-point objects (one per period)
 * @param keys  - The numeric series keys to summarise
 * @returns A human-readable paragraph describing trends across all series.
 */
export function generateTrendChartSummary(
  data: Record<string, unknown>[],
  keys: string[],
): string {
  if (!data.length || !keys.length) {
    return 'No chart data available.'
  }

  const parts = keys.map((key) => {
    const values = data
      .map((d) => d[key])
      .filter((v): v is number => typeof v === 'number')

    if (values.length < 2) return null

    const first = values[0]
    const last = values[values.length - 1]
    const diff = last - first
    const direction = diff > 0 ? 'increased' : diff < 0 ? 'decreased' : 'remained stable'
    const label = key.charAt(0).toUpperCase() + key.slice(1)

    return `${label} ${direction} from ${first} to ${last}`
  }).filter(Boolean)

  return parts.length
    ? `Over the period shown: ${parts.join('; ')}.`
    : 'No trend data available.'
}