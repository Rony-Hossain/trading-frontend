'use client'

/**
 * JournalFilters - Filter controls for journal entries
 * Phase 3: Portfolio & Journal
 */

import { useState } from 'react'
import { JournalEventType, JournalFilterParams } from '@/lib/types/contracts'
import { Filter, X, Search } from 'lucide-react'

interface JournalFiltersProps {
  filters: JournalFilterParams
  onFiltersChange: (filters: JournalFilterParams) => void
  availableTags: string[]
  availableSymbols: string[]
}

const EVENT_TYPE_LABELS: Record<JournalEventType, string> = {
  trade_executed: 'Trades',
  alert_triggered: 'Alerts',
  safety_adjusted: 'Safety Adjustments',
  target_set: 'Targets',
  manual_note: 'Notes',
  position_opened: 'Positions Opened',
  position_closed: 'Positions Closed',
}

export function JournalFilters({
  filters,
  onFiltersChange,
  availableTags,
  availableSymbols,
}: JournalFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.search || '')

  const handleEventTypeToggle = (eventType: JournalEventType) => {
    const currentTypes = filters.event_types || []
    const newTypes = currentTypes.includes(eventType)
      ? currentTypes.filter((t) => t !== eventType)
      : [...currentTypes, eventType]

    onFiltersChange({
      ...filters,
      event_types: newTypes.length > 0 ? newTypes : undefined,
    })
  }

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag]

    onFiltersChange({
      ...filters,
      tags: newTags.length > 0 ? newTags : undefined,
    })
  }

  const handleSymbolToggle = (symbol: string) => {
    const currentSymbols = filters.symbols || []
    const newSymbols = currentSymbols.includes(symbol)
      ? currentSymbols.filter((s) => s !== symbol)
      : [...currentSymbols, symbol]

    onFiltersChange({
      ...filters,
      symbols: newSymbols.length > 0 ? newSymbols : undefined,
    })
  }

  const handleSearch = () => {
    onFiltersChange({
      ...filters,
      search: searchInput || undefined,
    })
  }

  const handleClearFilters = () => {
    setSearchInput('')
    onFiltersChange({})
  }

  const activeFilterCount =
    (filters.event_types?.length || 0) +
    (filters.tags?.length || 0) +
    (filters.symbols?.length || 0) +
    (filters.search ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            placeholder="Search entries..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearFilters}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            title="Clear all filters"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4 border border-gray-200 dark:border-gray-700">
          {/* Event Types */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Types
            </h4>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(EVENT_TYPE_LABELS) as JournalEventType[]).map((eventType) => {
                const isSelected = filters.event_types?.includes(eventType)
                return (
                  <button
                    key={eventType}
                    onClick={() => handleEventTypeToggle(eventType)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-500'
                    }`}
                  >
                    {EVENT_TYPE_LABELS[eventType]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Symbols */}
          {availableSymbols.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Symbols
              </h4>
              <div className="flex flex-wrap gap-2">
                {availableSymbols.map((symbol) => {
                  const isSelected = filters.symbols?.includes(symbol)
                  return (
                    <button
                      key={symbol}
                      onClick={() => handleSymbolToggle(symbol)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-500'
                      }`}
                    >
                      {symbol}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          {availableTags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = filters.tags?.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-500'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Date Range */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="start-date"
                  className="block text-xs text-gray-600 dark:text-gray-400 mb-1"
                >
                  From
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={filters.start_date?.split('T')[0] || ''}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      start_date: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="end-date"
                  className="block text-xs text-gray-600 dark:text-gray-400 mb-1"
                >
                  To
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={filters.end_date?.split('T')[0] || ''}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      end_date: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
