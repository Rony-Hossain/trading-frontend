/**
 * ML Insights Module
 * Phase 6: ML Insights & Regime Hinting
 *
 * Exports:
 * - DiagnosticsChip: Model confidence, drift, and top drivers
 * - RegimeBanner: Market regime indicator with auto-toning
 * - WhyNowPanel: Top 3 drivers for trade recommendations
 * - Driver copy service: Beginner/expert explanations
 * - Regime toning utilities: Auto-adjust copy based on market regime
 */

export { mlInsightsConfig } from './module.config'

// Components
export { DiagnosticsChip } from '@/components/diagnostics/DiagnosticsChip'
export { RegimeBanner } from '@/components/ml-insights/RegimeBanner'
export { WhyNowPanel } from '@/components/ml-insights/WhyNowPanel'

// Copy services
export {
  getDriverCopy,
  hasDriverCopy,
  getAllDriverNames,
} from '@/lib/copy/driver-copy'

export {
  toneActionVerb,
  getTonedCopy,
  toneReasonText,
  getRegimeSafetyReminder,
  requiresExtraDisclaimer,
  getRegimeToneColor,
} from '@/lib/copy/regime-toning'

// Types (re-export from contracts)
export type {
  RegimeType,
  RegimeData,
  MLDriver,
  ConfidenceStability,
  DiagnosticsSummary,
  InsightFeedback,
  MLInsightsResponse,
} from '@/lib/types/contracts'
