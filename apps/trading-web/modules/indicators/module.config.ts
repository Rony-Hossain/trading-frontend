/**
 * @modules/indicators - Module Configuration
 * Technical indicators with template persistence and validation
 * Phase 4: Expert Surfaces
 */

import { ModuleMetadata, ModuleDependencies } from '@/lib/module-registry/types'

export const indicatorsModuleConfig: ModuleMetadata = {
  id: 'indicators',
  name: 'Technical Indicators',
  version: '1.0.0',
  description: 'Advanced technical indicators with template persistence and validation',
  author: 'Trading Platform Team',
  license: 'MIT',

  // Module provides these routes
  routes: [
    {
      path: '/indicators',
      component: 'IndicatorsPage',
      title: 'Technical Indicators',
      icon: 'TrendingUpIcon',
      requireAuth: true,
      permissions: ['view_expert_features'],
    },
  ],

  // Module provides these translations
  translations: {
    en: {
      'indicators.title': 'Technical Indicators',
      'indicators.subtitle': 'Advanced technical analysis tools',
      'indicators.no_indicators': 'No indicators active',
      'indicators.add': 'Add Indicator',
      'indicators.save_template': 'Save Template',
      'indicators.load_template': 'Load Template',
    },
  },

  // Feature flags
  featureFlags: {
    'indicators.enable_templates': {
      enabled: true,
      description: 'Allow saving and loading indicator templates',
    },
    'indicators.enable_validation': {
      enabled: true,
      description: 'Validate indicator configurations',
    },
    'indicators.enable_presets': {
      enabled: true,
      description: 'Provide sample indicator presets',
    },
    'indicators.enable_dependencies': {
      enabled: true,
      description: 'Support indicator-on-indicator dependencies',
    },
    'indicators.max_active': {
      enabled: true,
      description: 'Maximum number of active indicators',
      value: 10,
    },
    'indicators.sync_to_backend': {
      enabled: true,
      description: 'Sync templates to backend',
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
  permissions: ['view_expert_features', 'manage_indicators'],

  // Configuration schema
  config: {
    // Available indicators
    availableIndicators: [
      'RSI',
      'MACD',
      'Bollinger Bands',
      'SMA',
      'EMA',
      'Stochastic',
      'ATR',
      'Volume',
    ],

    // Template settings
    maxTemplates: 20,
    allowImport: true,
    allowExport: true,

    // Validation
    enforceValidation: true,
    showWarnings: true,

    // Presets
    enablePresets: true,
    defaultPresets: [
      'Momentum Trader',
      'Trend Follower',
      'Mean Reversion',
      'Volatility Tracker',
      'Classic Setup',
    ],
  },

  // Lifecycle hooks
  hooks: {
    onLoad: 'initializeIndicatorsModule',
    onUnload: 'cleanupIndicatorsModule',
    onError: 'handleIndicatorsModuleError',
  },

  // Extension points
  extensionPoints: [
    {
      id: 'indicators.custom-indicators',
      description: 'Register custom indicators',
      type: 'component',
    },
    {
      id: 'indicators.validation-rules',
      description: 'Add custom validation rules',
      type: 'function',
    },
  ],
}

/**
 * Module Dependencies
 */
export const indicatorsModuleDependencies: ModuleDependencies = {
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
export async function initializeIndicatorsModule() {
  console.log('[Indicators Module] Initializing...')
  // Load saved templates
  // Register validation rules
  // Initialize feature flags
  console.log('[Indicators Module] Initialized successfully')
}

/**
 * Module cleanup
 */
export async function cleanupIndicatorsModule() {
  console.log('[Indicators Module] Cleaning up...')
  // Save pending templates
  // Clear validation cache
  console.log('[Indicators Module] Cleanup complete')
}

/**
 * Module error handler
 */
export function handleIndicatorsModuleError(error: Error) {
  console.error('[Indicators Module] Error:', error)
}
