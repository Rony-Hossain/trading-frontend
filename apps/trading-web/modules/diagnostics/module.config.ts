/**
 * @modules/diagnostics - Module Configuration
 * Model diagnostics with confidence, drift, and driver analysis
 * Phase 4: Expert Surfaces
 */

import { ModuleMetadata, ModuleDependencies } from '@/lib/module-registry/types'

export const diagnosticsModuleConfig: ModuleMetadata = {
  id: 'diagnostics',
  name: 'Model Diagnostics',
  version: '1.0.0',
  description: 'ML model confidence, drift detection, and driver analysis',
  author: 'Trading Platform Team',
  license: 'MIT',

  // Module provides these routes
  routes: [
    {
      path: '/diagnostics',
      component: 'DiagnosticsPage',
      title: 'Model Diagnostics',
      icon: 'ActivityIcon',
      requireAuth: true,
      permissions: ['view_expert_features'],
    },
  ],

  // Module provides these translations
  translations: {
    en: {
      'diagnostics.title': 'Model Diagnostics',
      'diagnostics.subtitle': 'ML model insights and analysis',
      'diagnostics.confidence': 'Model Confidence',
      'diagnostics.drift': 'Drift Detection',
      'diagnostics.drivers': 'Top Drivers',
      'diagnostics.regime': 'Market Regime',
    },
  },

  // Feature flags
  featureFlags: {
    'diagnostics.show_confidence': {
      enabled: true,
      description: 'Display model confidence scores',
    },
    'diagnostics.show_drift': {
      enabled: true,
      description: 'Show drift detection alerts',
    },
    'diagnostics.show_drivers': {
      enabled: true,
      description: 'Display top signal drivers',
    },
    'diagnostics.show_regime': {
      enabled: true,
      description: 'Show market regime hints',
    },
    'diagnostics.beginner_simplification': {
      enabled: true,
      description: 'Simplify labels for beginner mode',
    },
    'diagnostics.max_drivers': {
      enabled: true,
      description: 'Maximum drivers to display',
      value: 3,
    },
  },

  // Dependencies
  dependencies: {
    modules: [
      '@modules/auth',
      '@modules/api',
      '@modules/telemetry',
    ],
    services: [
      'CopyService',
      'TelemetryService',
    ],
  },

  // Permissions required
  permissions: ['view_expert_features', 'view_diagnostics'],

  // Configuration schema
  config: {
    // Display settings
    showInPlanCard: true, // Show compact chip in plan cards
    expandByDefault: false,

    // Confidence thresholds
    highConfidenceThreshold: 0.8,
    mediumConfidenceThreshold: 0.6,

    // Drift settings
    driftAlertEnabled: true,
    driftSeverityLevels: ['low', 'medium', 'high'],

    // Drivers
    maxDriversDisplay: 3,
    driverContributionThreshold: 0.1, // Only show drivers >10% contribution

    // Regime
    regimeHintsEnabled: true,
    regimeConfidenceThreshold: 0.7,
  },

  // Lifecycle hooks
  hooks: {
    onLoad: 'initializeDiagnosticsModule',
    onUnload: 'cleanupDiagnosticsModule',
    onError: 'handleDiagnosticsModuleError',
  },

  // Extension points
  extensionPoints: [
    {
      id: 'diagnostics.custom-metrics',
      description: 'Add custom diagnostic metrics',
      type: 'component',
    },
  ],
}

/**
 * Module Dependencies
 */
export const diagnosticsModuleDependencies: ModuleDependencies = {
  required: [
    '@modules/auth@^1.0.0',
  ],
  optional: [
    '@modules/telemetry@^1.0.0',
  ],
  incompatible: [],
}

/**
 * Module initialization
 */
export async function initializeDiagnosticsModule() {
  console.log('[Diagnostics Module] Initializing...')
  // Initialize feature flags
  // Set up drift monitoring
  console.log('[Diagnostics Module] Initialized successfully')
}

/**
 * Module cleanup
 */
export async function cleanupDiagnosticsModule() {
  console.log('[Diagnostics Module] Cleaning up...')
  // Clear diagnostic caches
  console.log('[Diagnostics Module] Cleanup complete')
}

/**
 * Module error handler
 */
export function handleDiagnosticsModuleError(error: Error) {
  console.error('[Diagnostics Module] Error:', error)
}
