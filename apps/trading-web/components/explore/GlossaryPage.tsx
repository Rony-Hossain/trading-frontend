'use client'

/**
 * GlossaryPage - Searchable glossary of trading terms powered by ExplainService
 * Phase 4: Expert Surfaces
 */

import { useState, useMemo, useEffect } from 'react'
import { Search, BookOpen, TrendingUp, Filter, X } from 'lucide-react'
import { GLOSSARY_TERMS, type GlossaryEntry } from '@/lib/data/glossary-terms'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'

interface GlossaryPageProps {
  mode: 'beginner' | 'expert'
}

export function GlossaryPage({ mode }: GlossaryPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<GlossaryEntry | null>(null)

  // Track glossary page view
  useEffect(() => {
    trackEvent({
      category: TelemetryCategory.EXPLORE,
      action: 'glossary_viewed',
      mode,
      total_terms: GLOSSARY_TERMS.length,
    })
  }, [mode])

  // Track term selection
  useEffect(() => {
    if (selectedEntry) {
      trackEvent({
        category: TelemetryCategory.EXPLORE,
        action: 'glossary_term_selected',
        term: selectedEntry.term,
        term_category: selectedEntry.category,
        mode,
      })
    }
  }, [selectedEntry, mode])

  const categories = [
    { value: 'technical', label: 'Technical Analysis', count: 0 },
    { value: 'fundamental', label: 'Fundamentals', count: 0 },
    { value: 'options', label: 'Options', count: 0 },
    { value: 'risk', label: 'Risk Management', count: 0 },
    { value: 'general', label: 'General', count: 0 },
  ]

  // Count entries per category
  categories.forEach(cat => {
    cat.count = GLOSSARY_TERMS.filter(entry => entry.category === cat.value).length
  })

  const filteredEntries = useMemo(() => {
    let entries = GLOSSARY_TERMS

    // Filter by category
    if (selectedCategory) {
      entries = entries.filter(entry => entry.category === selectedCategory)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      entries = entries.filter(entry =>
        entry.term.toLowerCase().includes(query) ||
        entry.beginnerDefinition.toLowerCase().includes(query) ||
        entry.expertDefinition.toLowerCase().includes(query)
      )
    }

    return entries.sort((a, b) => a.term.localeCompare(b.term))
  }, [searchQuery, selectedCategory])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Trading Glossary
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {GLOSSARY_TERMS.length} terms • {mode === 'beginner' ? 'Beginner' : 'Expert'} mode
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search terms..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-gray-600" />
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All ({GLOSSARY_TERMS.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              selectedCategory === cat.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terms List */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {filteredEntries.length} terms
          </div>
          {filteredEntries.map(entry => (
            <button
              key={entry.term}
              onClick={() => setSelectedEntry(entry)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedEntry?.term === entry.term
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {entry.term}
                </span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                  {entry.category}
                </span>
              </div>
            </button>
          ))}

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No terms found</p>
              <p className="text-sm text-gray-500 mt-1">Try a different search or filter</p>
            </div>
          )}
        </div>

        {/* Term Detail */}
        <div className="lg:col-span-2">
          {selectedEntry ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              {/* Term Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedEntry.term}
                  </h2>
                  <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    {selectedEntry.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Last reviewed: {new Date(selectedEntry.lastReviewed).toLocaleDateString()}
                </p>
              </div>

              {/* Definition */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Definition
                </h3>
                <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                  {mode === 'beginner'
                    ? selectedEntry.beginnerDefinition
                    : selectedEntry.expertDefinition}
                </p>
              </div>

              {/* Example */}
              {selectedEntry.example && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="text-xs font-medium text-blue-900 dark:text-blue-200 mb-1">
                    Example
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    {selectedEntry.example}
                  </p>
                </div>
              )}

              {/* Related Terms */}
              {selectedEntry.relatedTerms.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Related Terms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.relatedTerms.map(term => (
                      <button
                        key={term}
                        onClick={() => {
                          const entry = GLOSSARY_TERMS.find(e => e.term === term)
                          if (entry) setSelectedEntry(entry)
                        }}
                        className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mode Toggle Hint */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {mode === 'beginner' ? (
                    <>
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      Switch to Expert mode for technical details
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-3 w-3 inline mr-1" />
                      Switch to Beginner mode for simplified explanations
                    </>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Select a term to view details
              </p>
              <p className="text-sm text-gray-500">
                Browse the list or search for specific terms
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
