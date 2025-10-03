/**
 * @modules/today - Module Configuration
 * Beginner Today view module with routes, translations, and feature flags
 */

import { ModuleMetadata, ModuleDependencies } from '@/lib/module-registry/types'

export const todayModuleConfig: ModuleMetadata = {
  id: 'today',
  name: 'Today View',
  version: '1.0.0',
  description: 'Beginner-friendly daily trading plan view',
  author: 'Trading Platform Team',
  license: 'MIT',

  // Module provides these routes
  routes: [
    {
      path: '/today',
      component: 'TodayPage',
      title: 'Today\'s Plan',
      icon: 'TodayIcon',
      requireAuth: true,
      permissions: ['view_plan'],
    },
  ],

  // Module provides these translations
  translations: {
    en: {
      'today.title': 'Today\'s Trading Plan',
      'today.subtitle': 'AI-powered recommendations for today',
      'today.no_picks': 'No trading opportunities found for today',
      'today.refresh': 'Refresh Plan',
      'today.stale_warning': 'This plan is outdated',
      'today.loading': 'Loading today\'s plan...',
    },
  },

  // Feature flags
  featureFlags: {
    'today.enable_refresh': {
      enabled: true,
      description: 'Allow users to manually refresh the plan',
    },
    'today.show_confidence': {
      enabled: true,
      description: 'Show confidence scores on picks',
    },
    'today.show_safety_line': {
      enabled: true,
      description: 'Show safety line (stop-loss) on picks',
    },
    'today.show_budget_impact': {
      enabled: true,
      description: 'Show budget impact on picks',
    },
    'today.enable_explain': {
      enabled: true,
      description: 'Enable term explanation popovers',
    },
    'today.stale_threshold_ms': {
      enabled: true,
      description: 'Time in ms before plan is considered stale',
      value: 5 * 60 * 1000, // 5 minutes
    },
  },

  // Dependencies
  dependencies: {
    modules: [
      '@modules/auth', // Authentication
      '@modules/api', // API client
      '@modules/telemetry', // Event tracking
    ],
    services: [
      'CopyService',
      'TelemetryService',
    ],
  },

  // Permissions required
  permissions: ['view_plan', 'refresh_plan'],

  // Configuration schema
  config: {
    defaultRefreshInterval: 5 * 60 * 1000, // 5 minutes
    maxPicksPerDay: 3,
    showBeginnerHints: true,
    enablePaperTradingBadge: true,
  },

  // Lifecycle hooks
  hooks: {
    onLoad: 'initializeTodayModule',
    onUnload: 'cleanupTodayModule',
    onError: 'handleTodayModuleError',
  },

  // Extension points
  extensionPoints: [
    {
      id: 'today.pick-card-actions',
      description: 'Custom actions for pick cards',
      type: 'component',
    },
    {
      id: 'today.plan-header',
      description: 'Custom header content for today page',
      type: 'component',
    },
  ],
}

/**
 * Module Dependencies
 */
export const todayModuleDependencies: ModuleDependencies = {
  required: [
    '@modules/auth@^1.0.0',
    '@modules/api@^1.0.0',
  ],
  optional: [
    '@modules/telemetry@^1.0.0',
    '@modules/notifications@^1.0.0',
  ],
  incompatible: [],
}

/**
 * Module initialization
 */
export async function initializeTodayModule() {
  console.log('[Today Module] Initializing...')
  // Register routes
  // Register translations
  // Initialize feature flags
  // Set up event listeners
  console.log('[Today Module] Initialized successfully')
}

/**
 * Module cleanup
 */
export async function cleanupTodayModule() {
  console.log('[Today Module] Cleaning up...')
  // Unregister routes
  // Clear caches
  // Remove event listeners
  console.log('[Today Module] Cleanup complete')
}

/**
 * Module error handler
 */
export function handleTodayModuleError(error: Error) {
  console.error('[Today Module] Error:', error)
  // Track error
  // Show user-friendly message
  // Attempt recovery
}
