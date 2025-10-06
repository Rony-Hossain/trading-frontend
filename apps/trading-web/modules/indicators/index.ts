/**
 * @modules/indicators - Module Entry Point
 * Exports all public APIs for the Indicators module
 * Phase 4: Expert Surfaces
 */

// Configuration
export { indicatorsModuleConfig, indicatorsModuleDependencies } from './module.config'

// Components - lazy-loaded via dynamic imports
export { ExpertPanelIndicators, ChartSettingsPanel } from '@/components/expert'

// Hooks
export { useIndicatorTemplates } from '@/lib/hooks/useTemplatePersistence'

// Validation
export {
  validateIndicator,
  validateDependencies,
  validateIndicatorSet,
  getSamplePresets,
  getDependencyHints,
} from '@/lib/validation/indicator-validation'

export type {
  IndicatorConfig,
  ValidationRule,
  ValidationResult,
  IndicatorPreset,
} from '@/lib/validation/indicator-validation'
