/**
 * Web Vitals Monitor
 * Applies performance budgets and emits telemetry for core web vitals.
 */

import type { PerformanceMetricEvent } from '@/lib/telemetry/taxonomy'
import {
  ROUTE_BUDGETS,
  type RouteBudget,
} from './budgets'
import {
  trackPerformance,
  trackPerformanceBudgetViolation,
} from '@/lib/telemetry/taxonomy'

type SupportedMetricName = 'LCP' | 'FCP' | 'TTFB' | 'CLS' | 'INP' | 'FID'

export interface NextWebVitalsMetricLike {
  id: string
  name: SupportedMetricName
  label: string
  startTime: number
  value: number
  delta: number
  entries?: PerformanceEntry[]
  navigationType?: string
  path?: string
  page?: string
}

const METRIC_TO_TELEMETRY_KEY: Partial<Record<SupportedMetricName, PerformanceMetricEvent['metric']>> = {
  LCP: 'lcp',
  FCP: 'fcp',
  TTFB: 'ttfb',
  CLS: 'cls',
  INP: 'inp',
}

const METRIC_TO_BUDGET_FIELD: Partial<Record<SupportedMetricName, keyof RouteBudget>> = {
  LCP: 'lcp',
  INP: 'inp',
  TTFB: 'ttfb',
  FCP: 'fcp',
}

const reportedViolations = new Set<string>()

function normaliseRoute(path?: string): string {
  if (!path) return '/'
  if (ROUTE_BUDGETS[path]) return path

  // Find the longest matching route budget
  const matchingRoute = Object.keys(ROUTE_BUDGETS)
    .filter((candidate) => path === candidate || path.startsWith(candidate + '/'))
    .sort((a, b) => b.length - a.length)[0]

  return matchingRoute ?? '/'
}

function maybeReportBudgetViolation(route: string, metric: SupportedMetricName, value: number) {
  const budgetField = METRIC_TO_BUDGET_FIELD[metric]
  if (!budgetField) return

  const budget = ROUTE_BUDGETS[route]
  if (!budget) return

  const allowed = budget[budgetField]
  if (typeof allowed !== 'number') return

  if (value <= allowed) return

  const violationKey = `${route}:${budgetField}`
  if (reportedViolations.has(violationKey)) return

  reportedViolations.add(violationKey)
  trackPerformanceBudgetViolation({
    route,
    metric: budgetField,
    budget: allowed,
    actual: value,
    overage_pct: ((value - allowed) / allowed) * 100,
  })

  if (process.env.NODE_ENV !== 'production') {
    const rounded = Number(value.toFixed(0))
    // eslint-disable-next-line no-console
    console.warn(
      `[Performance] ${metric} ${rounded}ms exceeds budget ${allowed}ms for route ${route}`
    )
  }
}

export function handleWebVitalsMetric(metric: NextWebVitalsMetricLike) {
  const route = normaliseRoute(metric.path ?? metric.page ?? '/')

  const telemetryMetric = METRIC_TO_TELEMETRY_KEY[metric.name]
  if (telemetryMetric) {
    trackPerformance(telemetryMetric, metric.value, route)
  }

  maybeReportBudgetViolation(route, metric.name, metric.value)
}
