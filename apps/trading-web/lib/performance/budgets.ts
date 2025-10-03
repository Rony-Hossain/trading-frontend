/**
 * Performance Budgets
 * Route-level performance targets and bundle size budgets
 * Last updated: 2025-10-03
 */

// =============================================================================
// WEB VITALS THRESHOLDS (Core Web Vitals)
// =============================================================================

export interface WebVitalsThresholds {
  lcp: number // Largest Contentful Paint (ms)
  fid: number // First Input Delay (ms) - deprecated, use INP
  inp: number // Interaction to Next Paint (ms)
  cls: number // Cumulative Layout Shift (score)
  ttfb: number // Time to First Byte (ms)
  fcp: number // First Contentful Paint (ms)
}

/**
 * Good, Needs Improvement, Poor thresholds
 * Based on Google's Core Web Vitals recommendations
 */
export const WEB_VITALS_THRESHOLDS = {
  good: {
    lcp: 2500, // < 2.5s
    fid: 100, // < 100ms
    inp: 200, // < 200ms
    cls: 0.1, // < 0.1
    ttfb: 800, // < 800ms
    fcp: 1800, // < 1.8s
  },
  needsImprovement: {
    lcp: 4000, // 2.5s - 4s
    fid: 300, // 100ms - 300ms
    inp: 500, // 200ms - 500ms
    cls: 0.25, // 0.1 - 0.25
    ttfb: 1800, // 800ms - 1.8s
    fcp: 3000, // 1.8s - 3s
  },
  // Anything above needsImprovement is "poor"
} as const

// =============================================================================
// ROUTE-SPECIFIC PERFORMANCE BUDGETS
// =============================================================================

export interface RouteBudget {
  route: string
  lcp: number // Target LCP (ms)
  inp: number // Target INP (ms)
  ttfb: number // Target TTFB (ms)
  fcp: number // Target FCP (ms)
  tti: number // Time to Interactive (ms)
  total_js_kb: number // Total JS bundle size (KB)
  initial_js_kb: number // Initial JS bundle size (KB)
  total_css_kb: number // Total CSS size (KB)
  image_budget_kb: number // Image budget (KB)
  font_budget_kb: number // Font budget (KB)
}

/**
 * Performance budgets per route
 * Critical paths have stricter budgets
 */
export const ROUTE_BUDGETS: Record<string, RouteBudget> = {
  '/': {
    route: '/',
    lcp: 2000, // Homepage should be fast
    inp: 200,
    ttfb: 600,
    fcp: 1500,
    tti: 3500,
    total_js_kb: 250,
    initial_js_kb: 150,
    total_css_kb: 50,
    image_budget_kb: 200,
    font_budget_kb: 100,
  },
  '/today': {
    route: '/today',
    lcp: 2500, // Critical trading path - fast LCP needed
    inp: 200,
    ttfb: 800,
    fcp: 1800,
    tti: 4000,
    total_js_kb: 300, // Includes chart library
    initial_js_kb: 180,
    total_css_kb: 60,
    image_budget_kb: 100,
    font_budget_kb: 100,
  },
  '/portfolio': {
    route: '/portfolio',
    lcp: 2500,
    inp: 200,
    ttfb: 800,
    fcp: 1800,
    tti: 4000,
    total_js_kb: 280,
    initial_js_kb: 170,
    total_css_kb: 60,
    image_budget_kb: 50,
    font_budget_kb: 100,
  },
  '/alerts': {
    route: '/alerts',
    lcp: 2000, // Fast alerts are critical
    inp: 100, // Very responsive for quick actions
    ttfb: 600,
    fcp: 1500,
    tti: 3000,
    total_js_kb: 220,
    initial_js_kb: 150,
    total_css_kb: 50,
    image_budget_kb: 30,
    font_budget_kb: 100,
  },
  '/journal': {
    route: '/journal',
    lcp: 3000, // Less critical, slightly relaxed
    inp: 200,
    ttfb: 1000,
    fcp: 2000,
    tti: 4500,
    total_js_kb: 260,
    initial_js_kb: 160,
    total_css_kb: 60,
    image_budget_kb: 100,
    font_budget_kb: 100,
  },
  '/settings': {
    route: '/settings',
    lcp: 2500,
    inp: 200,
    ttfb: 800,
    fcp: 1800,
    tti: 3500,
    total_js_kb: 200,
    initial_js_kb: 140,
    total_css_kb: 50,
    image_budget_kb: 20,
    font_budget_kb: 100,
  },
  '/explore': {
    route: '/explore',
    lcp: 3000,
    inp: 200,
    ttfb: 1000,
    fcp: 2000,
    tti: 4500,
    total_js_kb: 320, // May include heavy search/filter logic
    initial_js_kb: 180,
    total_css_kb: 60,
    image_budget_kb: 150,
    font_budget_kb: 100,
  },
  '/learn': {
    route: '/learn',
    lcp: 3000,
    inp: 200,
    ttfb: 1000,
    fcp: 2000,
    tti: 4500,
    total_js_kb: 280,
    initial_js_kb: 160,
    total_css_kb: 70, // Rich content styling
    image_budget_kb: 300, // Educational diagrams/images
    font_budget_kb: 120,
  },
}

// =============================================================================
// EXPERT MODE BUDGETS (Lazy-loaded modules)
// =============================================================================

export interface ModuleBudget {
  module: string
  max_size_kb: number
  load_time_budget_ms: number
}

export const EXPERT_MODULE_BUDGETS: ModuleBudget[] = [
  {
    module: '@modules/indicators',
    max_size_kb: 150,
    load_time_budget_ms: 1000,
  },
  {
    module: '@modules/options',
    max_size_kb: 120,
    load_time_budget_ms: 1000,
  },
  {
    module: '@modules/diagnostics',
    max_size_kb: 100,
    load_time_budget_ms: 800,
  },
  {
    module: '@modules/chart-advanced',
    max_size_kb: 200, // Charting library is heavy
    load_time_budget_ms: 1500,
  },
]

// =============================================================================
// REALTIME DATA BUDGETS
// =============================================================================

export interface RealtimeBudget {
  max_update_rate_ms: number // Minimum ms between updates
  max_concurrent_streams: number // Max number of active streams
  max_points_per_chart: number // Max data points to render
  throttle_threshold_ms: number // When to start throttling
}

export const REALTIME_BUDGETS: Record<'beginner' | 'expert', RealtimeBudget> = {
  beginner: {
    max_update_rate_ms: 1000, // 1 update per second
    max_concurrent_streams: 3,
    max_points_per_chart: 100,
    throttle_threshold_ms: 500,
  },
  expert: {
    max_update_rate_ms: 250, // 4 updates per second
    max_concurrent_streams: 10,
    max_points_per_chart: 500,
    throttle_threshold_ms: 100,
  },
}

// =============================================================================
// BUNDLE SIZE ENFORCEMENT
// =============================================================================

export interface BundleSizeViolation {
  route: string
  metric: string
  budget: number
  actual: number
  overage: number
  overage_pct: number
}

/**
 * Check if bundle size exceeds budget
 */
export function checkBundleBudget(
  route: string,
  actualSizes: {
    total_js_kb?: number
    initial_js_kb?: number
    total_css_kb?: number
    image_kb?: number
    font_kb?: number
  }
): BundleSizeViolation[] {
  const budget = ROUTE_BUDGETS[route]
  if (!budget) return []

  const violations: BundleSizeViolation[] = []

  const checks: Array<{
    key: keyof typeof actualSizes
    budgetKey: keyof RouteBudget
    metric: string
  }> = [
    { key: 'total_js_kb', budgetKey: 'total_js_kb', metric: 'Total JS' },
    { key: 'initial_js_kb', budgetKey: 'initial_js_kb', metric: 'Initial JS' },
    { key: 'total_css_kb', budgetKey: 'total_css_kb', metric: 'Total CSS' },
    { key: 'image_kb', budgetKey: 'image_budget_kb', metric: 'Images' },
    { key: 'font_kb', budgetKey: 'font_budget_kb', metric: 'Fonts' },
  ]

  for (const check of checks) {
    const actual = actualSizes[check.key]
    const budgetValue = budget[check.budgetKey] as number

    if (actual !== undefined && actual > budgetValue) {
      const overage = actual - budgetValue
      violations.push({
        route,
        metric: check.metric,
        budget: budgetValue,
        actual,
        overage,
        overage_pct: (overage / budgetValue) * 100,
      })
    }
  }

  return violations
}

/**
 * Check if Web Vitals meet target
 */
export function checkWebVitals(
  route: string,
  metrics: {
    lcp?: number
    inp?: number
    ttfb?: number
    fcp?: number
  }
): { passed: boolean; violations: string[] } {
  const budget = ROUTE_BUDGETS[route]
  if (!budget) return { passed: true, violations: [] }

  const violations: string[] = []

  if (metrics.lcp !== undefined && metrics.lcp > budget.lcp) {
    violations.push(`LCP ${metrics.lcp}ms exceeds budget of ${budget.lcp}ms`)
  }

  if (metrics.inp !== undefined && metrics.inp > budget.inp) {
    violations.push(`INP ${metrics.inp}ms exceeds budget of ${budget.inp}ms`)
  }

  if (metrics.ttfb !== undefined && metrics.ttfb > budget.ttfb) {
    violations.push(`TTFB ${metrics.ttfb}ms exceeds budget of ${budget.ttfb}ms`)
  }

  if (metrics.fcp !== undefined && metrics.fcp > budget.fcp) {
    violations.push(`FCP ${metrics.fcp}ms exceeds budget of ${budget.fcp}ms`)
  }

  return {
    passed: violations.length === 0,
    violations,
  }
}

/**
 * Get performance rating based on metric value
 */
export function getPerformanceRating(
  metric: keyof WebVitalsThresholds,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const goodThreshold = WEB_VITALS_THRESHOLDS.good[metric]
  const needsImprovementThreshold = WEB_VITALS_THRESHOLDS.needsImprovement[metric]

  if (value <= goodThreshold) return 'good'
  if (value <= needsImprovementThreshold) return 'needs-improvement'
  return 'poor'
}

/**
 * Calculate performance score (0-100)
 */
export function calculatePerformanceScore(metrics: {
  lcp: number
  inp: number
  cls: number
  ttfb: number
  fcp: number
}): number {
  const weights = {
    lcp: 0.25,
    inp: 0.25,
    cls: 0.15,
    ttfb: 0.20,
    fcp: 0.15,
  }

  let score = 0

  for (const [metric, weight] of Object.entries(weights)) {
    const value = metrics[metric as keyof typeof metrics]
    const rating = getPerformanceRating(metric as keyof WebVitalsThresholds, value)

    const metricScore = rating === 'good' ? 100 : rating === 'needs-improvement' ? 50 : 0
    score += metricScore * weight
  }

  return Math.round(score)
}

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

export interface PerformanceReport {
  route: string
  timestamp: string
  metrics: {
    lcp: number
    inp: number
    cls: number
    ttfb: number
    fcp: number
  }
  score: number
  passed: boolean
  violations: string[]
}

/**
 * Generate performance report
 */
export function generatePerformanceReport(
  route: string,
  metrics: PerformanceReport['metrics']
): PerformanceReport {
  const { passed, violations } = checkWebVitals(route, metrics)
  const score = calculatePerformanceScore(metrics)

  return {
    route,
    timestamp: new Date().toISOString(),
    metrics,
    score,
    passed,
    violations,
  }
}
