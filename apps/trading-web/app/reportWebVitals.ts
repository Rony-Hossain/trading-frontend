import { handleWebVitalsMetric } from '@/lib/performance/vitals-monitor'
import type { NextWebVitalsMetricLike } from '@/lib/performance/vitals-monitor'

export function reportWebVitals(metric: NextWebVitalsMetricLike) {
  handleWebVitalsMetric(metric)
}
