'use client'

/**
 * JournalPage - Main journal page component
 * Phase 3: Portfolio & Journal
 * Auto-ingests trade events and displays journal entries with filters
 */

import { useState } from 'react'
import { JournalEntry, JournalFilterParams } from '@/lib/types/contracts'
import { JournalEntryCard } from './JournalEntryCard'
import { JournalFilters } from './JournalFilters'
import { BookOpen, Download, Plus, Loader2, Info } from 'lucide-react'

interface JournalPageProps {
  entries: JournalEntry[]
  loading?: boolean
  coveragePercentage?: number
  onAddNote?: (entryId: string) => void
  onCreateEntry?: () => void
  onExport?: () => void
}

export function JournalPage({
  entries,
  loading = false,
  coveragePercentage = 0,
  onAddNote,
  onCreateEntry,
  onExport,
}: JournalPageProps) {
  const [filters, setFilters] = useState<JournalFilterParams>({})

  // Extract available tags and symbols from entries
  const availableTags = Array.from(new Set(entries.flatMap((e) => e.tags)))
  const availableSymbols = Array.from(
    new Set(entries.map((e) => e.symbol).filter(Boolean) as string[])
  )

  // Apply filters
  const filteredEntries = entries.filter((entry) => {
    // Event type filter
    if (filters.event_types && filters.event_types.length > 0) {
      if (!filters.event_types.includes(entry.event_type)) return false
    }

    // Symbol filter
    if (filters.symbols && filters.symbols.length > 0) {
      if (!entry.symbol || !filters.symbols.includes(entry.symbol)) return false
    }

    // Tag filter
    if (filters.tags && filters.tags.length > 0) {
      if (!filters.tags.some((tag) => entry.tags.includes(tag))) return false
    }

    // Date range filter
    if (filters.start_date) {
      if (new Date(entry.timestamp) < new Date(filters.start_date)) return false
    }
    if (filters.end_date) {
      if (new Date(entry.timestamp) > new Date(filters.end_date)) return false
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesTitle = entry.title.toLowerCase().includes(searchLower)
      const matchesDescription = entry.description.toLowerCase().includes(searchLower)
      const matchesSymbol = entry.symbol?.toLowerCase().includes(searchLower)
      const matchesTags = entry.tags.some((tag) => tag.toLowerCase().includes(searchLower))

      if (!matchesTitle && !matchesDescription && !matchesSymbol && !matchesTags) return false
    }

    return true
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trading Journal</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {entries.length} entries · {coveragePercentage.toFixed(0)}% coverage
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          )}
          {onCreateEntry && (
            <button
              onClick={onCreateEntry}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Entry</span>
            </button>
          )}
        </div>
      </div>

      {/* Coverage Info */}
      {coveragePercentage < 100 && (
        <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
              Journal Coverage: {coveragePercentage.toFixed(0)}%
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              {coveragePercentage < 50
                ? 'Consider adding notes to your recent trades to improve your journal coverage.'
                : 'Good progress! Keep documenting your trades for better insights.'}
            </p>
          </div>
        </div>
      )}

      {/* Audit Immutability Notice */}
      <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Info className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Audit Log:</strong> System-generated entries are immutable. You can only append
          notes to maintain an accurate trading history.
        </p>
      </div>

      {/* Filters */}
      <JournalFilters
        filters={filters}
        onFiltersChange={setFilters}
        availableTags={availableTags}
        availableSymbols={availableSymbols}
      />

      {/* Entries List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading journal entries...</span>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {filters.search ||
            filters.event_types?.length ||
            filters.tags?.length ||
            filters.symbols?.length
              ? 'No entries match your filters'
              : 'No journal entries yet'}
          </p>
          <p className="text-sm text-gray-500">
            {entries.length === 0
              ? 'Your trading activity will be automatically logged here'
              : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredEntries.length} of {entries.length} entries
          </div>
          {filteredEntries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} onAddNote={onAddNote} />
          ))}
        </div>
      )}
    </div>
  )
}
