/**
 * @modules/journal - Module Configuration
 * Trading journal with auto-ingest, filtering, and export
 * Phase 3: Portfolio & Journal
 */

import { ModuleMetadata, ModuleDependencies } from '@/lib/module-registry/types'

export const journalModuleConfig: ModuleMetadata = {
  id: 'journal',
  name: 'Trading Journal',
  version: '1.0.0',
  description: 'Trading journal with auto-ingest, filtering, tags, and export',
  author: 'Trading Platform Team',
  license: 'MIT',

  // Module provides these routes
  routes: [
    {
      path: '/journal',
      component: 'JournalPage',
      title: 'Journal',
      icon: 'JournalIcon',
      requireAuth: true,
      permissions: ['view_journal'],
    },
  ],

  // Module provides these translations
  translations: {
    en: {
      'journal.title': 'Trading Journal',
      'journal.subtitle': 'Track your trades and lessons',
      'journal.no_entries': 'No journal entries',
      'journal.add_entry': 'Add Entry',
      'journal.add_note': 'Add Note',
      'journal.export': 'Export Journal',
      'journal.coverage': 'Coverage',
      'journal.immutable_notice': 'System entries are immutable. Notes can only be appended.',
    },
  },

  // Feature flags
  featureFlags: {
    'journal.enable_auto_ingest': {
      enabled: true,
      description: 'Automatically create entries from trade events',
    },
    'journal.enable_filters': {
      enabled: true,
      description: 'Enable filtering by event type, symbol, tags',
    },
    'journal.enable_tags': {
      enabled: true,
      description: 'Allow tagging journal entries',
    },
    'journal.enable_export': {
      enabled: true,
      description: 'Allow CSV export of journal',
    },
    'journal.enable_append_notes': {
      enabled: true,
      description: 'Allow appending notes to entries',
    },
    'journal.show_coverage': {
      enabled: true,
      description: 'Show journal coverage percentage',
    },
    'journal.immutable_system_entries': {
      enabled: true,
      description: 'System-generated entries are immutable',
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
  permissions: ['view_journal', 'create_journal_entry', 'export_journal'],

  // Configuration schema
  config: {
    // Display settings
    showCoverage: true,
    showImmutabilityNotice: true,
    defaultPageSize: 50,

    // Auto-ingest settings
    autoIngestTrades: true,
    autoIngestAlerts: true,
    autoIngestSafetyAdjustments: true,

    // Filtering
    enableFilters: true,
    enableSearch: true,
    enableDateRange: true,

    // Tags
    enableTags: true,
    suggestedTags: [
      'lesson',
      'mistake',
      'win',
      'loss',
      'strategy',
      'analysis',
      'review',
    ],

    // Export settings
    exportFormats: ['csv'],
    includeTimezone: true,
    includeNotes: true,
  },

  // Lifecycle hooks
  hooks: {
    onLoad: 'initializeJournalModule',
    onUnload: 'cleanupJournalModule',
    onError: 'handleJournalModuleError',
  },

  // Extension points
  extensionPoints: [
    {
      id: 'journal.entry-card-actions',
      description: 'Custom actions for journal entries',
      type: 'component',
    },
    {
      id: 'journal.filter-options',
      description: 'Additional filter options',
      type: 'component',
    },
    {
      id: 'journal.coverage-metrics',
      description: 'Custom coverage metrics',
      type: 'component',
    },
  ],
}

/**
 * Module Dependencies
 */
export const journalModuleDependencies: ModuleDependencies = {
  required: [
    '@modules/auth@^1.0.0',
    '@modules/api@^1.0.0',
  ],
  optional: [
    '@modules/telemetry@^1.0.0',
    '@modules/portfolio@^1.0.0',
  ],
  incompatible: [],
}

/**
 * Module initialization
 */
export async function initializeJournalModule() {
  console.log('[Journal Module] Initializing...')
  // Register routes
  // Register translations
  // Initialize feature flags
  // Set up auto-ingest listeners
  console.log('[Journal Module] Initialized successfully')
}

/**
 * Module cleanup
 */
export async function cleanupJournalModule() {
  console.log('[Journal Module] Cleaning up...')
  // Remove event listeners
  // Clear journal store
  console.log('[Journal Module] Cleanup complete')
}

/**
 * Module error handler
 */
export function handleJournalModuleError(error: Error) {
  console.error('[Journal Module] Error:', error)
  // Track error
  // Show user-friendly message
  // Attempt recovery
}
