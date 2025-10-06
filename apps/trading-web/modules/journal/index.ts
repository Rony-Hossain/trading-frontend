/**
 * @modules/journal - Module Entry Point
 * Exports all public APIs for the Journal module
 * Phase 3: Portfolio & Journal
 */

// Configuration
export { journalModuleConfig, journalModuleDependencies } from './module.config'

// Components
export { JournalPage } from '@/components/journal/JournalPage'
export { JournalEntryCard } from '@/components/journal/JournalEntryCard'
export { JournalFilters } from '@/components/journal/JournalFilters'

// Utils
export { exportJournalToCSV, exportCombinedReport } from '@/lib/utils/export'

// Types
export type {
  JournalEntry,
  JournalEventType,
  JournalFilterParams,
  JournalResponse,
} from '@/lib/types/contracts'
