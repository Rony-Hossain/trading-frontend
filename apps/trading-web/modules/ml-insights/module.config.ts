/**
 * ML Insights Module Configuration
 * Phase 6: ML Insights & Regime Hinting
 */

import type { ModuleConfig } from '../types'

export const mlInsightsConfig: ModuleConfig = {
  id: 'ml-insights',
  name: 'ML Insights & Regime Hinting',
  version: '1.0.0',
  phase: 6,

  description: 'Machine learning model diagnostics, market regime detection, and trade drivers',

  // No dedicated routes - this module enhances existing views
  routes: [],

  // Feature flags
  features: {
    diagnosticsChip: true,
    regimeBanner: true,
    whyNowPanel: true,
    confidenceStability: true,
    driverCopy: true,
    regimeToning: true,
    feedbackCollection: true,
  },

  // Dependencies
  dependencies: {
    required: ['today', 'settings'], // Enhanced plan display, settings to toggle
    optional: ['portfolio'], // Can enhance portfolio views too
  },

  // Telemetry namespace
  telemetryNamespace: 'ml_insights',

  // Site configuration keys
  siteConfigKeys: [
    'modules.mlInsights', // Enable/disable entire module
    'features.mlInsightsEnabled', // Legacy feature flag
  ],

  // Performance budgets
  performance: {
    bundleSizeKb: 25, // Small - mostly UI components and copy
    lazyLoadable: true,
    criticalPath: false,
  },

  // Accessibility requirements
  accessibility: {
    keyboardNavigable: true,
    screenReaderOptimized: true,
    colorBlindSafe: true,
    reducedMotionSupport: true,
  },

  // Content localization
  i18n: {
    supported: true,
    namespaces: ['ml-insights', 'drivers', 'regimes'],
    fallbackLocale: 'en-US',
  },
}
