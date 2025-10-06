'use client'

/**
 * GlossarySearch - Searchable glossary component
 * Phase 7: Learn Hub & Micro-Lessons
 */

import { useState } from 'react'
import { Search, Book, Calendar } from 'lucide-react'
import type { GlossaryEntry } from '@/lib/types/contracts'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'

export function GlossarySearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<GlossaryEntry[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Mock glossary data
  const mockGlossary: GlossaryEntry[] = [
    {
      term: 'RSI',
      category: 'technical',
      difficulty: 'beginner',
      definition: 'Relative Strength Index - measures momentum on a 0-100 scale',
      howWeUse: 'We use RSI to identify overbought (>70) and oversold (<30) conditions',
      relatedTerms: ['MACD', 'Momentum', 'Overbought'],
      relatedLessons: ['2'],
      lastReviewed: '2025-09-01',
      version: 1,
      freshnessStatus: 'current',
    },
    {
      term: 'Stop Loss',
      category: 'risk',
      difficulty: 'beginner',
      definition: 'An order to sell a stock when it reaches a certain price to limit losses',
      howWeUse: 'We recommend setting stop losses at 5-10% below entry for risk management',
      relatedTerms: ['Risk Management', 'Position Sizing'],
      relatedLessons: ['3'],
      lastReviewed: '2025-08-15',
      version: 1,
      freshnessStatus: 'current',
    },
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Simple fuzzy search
    const results = mockGlossary.filter(entry =>
      entry.term.toLowerCase().includes(query.toLowerCase()) ||
      entry.definition.toLowerCase().includes(query.toLowerCase())
    )

    setSearchResults(results)
    setIsSearching(false)

    trackEvent({
      category: TelemetryCategory.LEARN,
      action: 'glossary_searched',
      query,
      result_count: results.length,
    })
  }

  const handleTermClick = (term: string) => {
    trackEvent({
      category: TelemetryCategory.LEARN,
      action: 'glossary_term_viewed',
      term,
      source: 'search',
    })
  }

  const getFreshnessColor = (status: GlossaryEntry['freshnessStatus']) => {
    switch (status) {
      case 'current':
        return 'text-green-600'
      case 'review_soon':
        return 'text-yellow-600'
      case 'outdated':
        return 'text-red-600'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Book className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Trading Glossary
        </h2>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search trading terms..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Results */}
      {searchQuery.length >= 2 && (
        <div className="space-y-3">
          {isSearching ? (
            <p className="text-sm text-gray-500">Searching...</p>
          ) : searchResults.length === 0 ? (
            <p className="text-sm text-gray-500">No terms found matching "{searchQuery}"</p>
          ) : (
            searchResults.map((entry) => (
              <button
                key={entry.term}
                onClick={() => handleTermClick(entry.term)}
                className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {entry.term}
                  </h3>
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" />
                    <span className={getFreshnessColor(entry.freshnessStatus)}>
                      {entry.freshnessStatus === 'current' ? 'Current' :
                       entry.freshnessStatus === 'review_soon' ? 'Review Soon' : 'Outdated'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {entry.definition}
                </p>
                <p className="text-xs text-gray-500">
                  <strong>How we use it:</strong> {entry.howWeUse}
                </p>
                {entry.relatedTerms.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {entry.relatedTerms.map((term) => (
                      <span
                        key={term}
                        className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
