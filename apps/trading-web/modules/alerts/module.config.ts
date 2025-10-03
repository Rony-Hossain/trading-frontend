/**
 * @modules/alerts - Module Configuration
 * Real-time alerts with streaming, quiet hours, and adaptive frequency
 */

import { ModuleMetadata, ModuleDependencies } from '@/lib/module-registry/types'

export const alertsModuleConfig: ModuleMetadata = {
  id: 'alerts',
  name: 'Alerts System',
  version: '1.0.0',
  description: 'Real-time trading alerts with streaming, quiet hours, and adaptive frequency',
  author: 'Trading Platform Team',
  license: 'MIT',

  // Module provides these routes
  routes: [
    {
      path: '/alerts-v2',
      component: 'AlertsPageV2',
      title: 'Alerts',
      icon: 'NotificationsIcon',
      requireAuth: true,
      permissions: ['view_alerts'],
    },
  ],

  // Module provides these translations
  translations: {
    en: {
      'alerts.title': 'Alerts & Notifications',
      'alerts.subtitle': 'Real-time market alerts and notifications',
      'alerts.no_alerts': 'No alerts',
      'alerts.muted': 'Alerts muted',
      'alerts.armed': 'Alerts active',
    },
  },

  // Feature flags
  featureFlags: {
    'alerts.enable_streaming': {
      enabled: true,
      description: 'Enable real-time WebSocket alert streaming',
    },
    'alerts.enable_quiet_hours': {
      enabled: true,
      description: 'Allow quiet hours configuration',
    },
    'alerts.enable_adaptive_frequency': {
      enabled: true,
      description: 'Adaptive throttling based on user feedback',
    },
    'alerts.enable_feedback': {
      enabled: true,
      description: 'Collect helpful/not helpful feedback on alerts',
    },
    'alerts.enable_snooze': {
      enabled: true,
      description: 'Allow users to snooze alerts',
    },
    'alerts.cooldown_sec': {
      enabled: true,
      description: 'Default cooldown period in seconds',
      value: 900, // 15 minutes
    },
    'alerts.stale_threshold_sec': {
      enabled: true,
      description: 'Time before alert is considered stale',
      value: 300, // 5 minutes
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
      'AlertsUiStore',
    ],
  },

  // Permissions required
  permissions: ['view_alerts', 'manage_alerts', 'take_alert_action'],

  // Configuration schema
  config: {
    // Delivery channels (tenant-configurable)
    enabledChannels: {
      in_app: true,
      push: true,
      email: true, // Can be disabled per tenant
      sms: true, // Can be disabled per tenant
    },

    // Alert types
    enabledAlertTypes: {
      opportunity: true,
      protect: true,
    },

    // Throttling
    adaptiveThrottleThreshold: 3, // Number of "not helpful" before suggesting
    autoThrottleThreshold: 5, // Number of "not helpful" before auto-throttle

    // WebSocket
    wsReconnectAttempts: 5,
    wsReconnectDelay: 5000,
  },

  // Lifecycle hooks
  hooks: {
    onLoad: 'initializeAlertsModule',
    onUnload: 'cleanupAlertsModule',
    onError: 'handleAlertsModuleError',
  },

  // Extension points
  extensionPoints: [
    {
      id: 'alerts.alert-card-actions',
      description: 'Custom actions for alert cards',
      type: 'component',
    },
    {
      id: 'alerts.drawer-header',
      description: 'Custom header content for alerts drawer',
      type: 'component',
    },
    {
      id: 'alerts.delivery-channels',
      description: 'Custom delivery channels',
      type: 'component',
    },
  ],
}

/**
 * Module Dependencies
 */
export const alertsModuleDependencies: ModuleDependencies = {
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
export async function initializeAlertsModule() {
  console.log('[Alerts Module] Initializing...')
  // Register routes
  // Register translations
  // Initialize feature flags
  // Set up WebSocket connection
  // Initialize alert store
  console.log('[Alerts Module] Initialized successfully')
}

/**
 * Module cleanup
 */
export async function cleanupAlertsModule() {
  console.log('[Alerts Module] Cleaning up...')
  // Close WebSocket connection
  // Clear alert store
  // Remove event listeners
  console.log('[Alerts Module] Cleanup complete')
}

/**
 * Module error handler
 */
export function handleAlertsModuleError(error: Error) {
  console.error('[Alerts Module] Error:', error)
  // Track error
  // Show user-friendly message
  // Attempt recovery
}
