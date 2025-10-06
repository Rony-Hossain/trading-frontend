'use client'

/**
 * ExpertPanelIndicators - Technical indicators panel with template persistence
 * Phase 4: Expert Surfaces
 * Lazy-loaded for performance
 */

import { useState } from 'react'
import { TrendingUp, Settings, Save, Upload, Download, Plus, X } from 'lucide-react'

interface Indicator {
  id: string
  name: string
  category: 'trend' | 'momentum' | 'volatility' | 'volume'
  enabled: boolean
  params: Record<string, number | string>
}

interface IndicatorTemplate {
  id: string
  name: string
  indicators: Indicator[]
  createdAt: string
}

const AVAILABLE_INDICATORS: Omit<Indicator, 'id' | 'enabled'>[] = [
  {
    name: 'RSI',
    category: 'momentum',
    params: { period: 14, overbought: 70, oversold: 30 }
  },
  {
    name: 'MACD',
    category: 'momentum',
    params: { fast: 12, slow: 26, signal: 9 }
  },
  {
    name: 'Bollinger Bands',
    category: 'volatility',
    params: { period: 20, stdDev: 2 }
  },
  {
    name: 'SMA',
    category: 'trend',
    params: { period: 50 }
  },
  {
    name: 'EMA',
    category: 'trend',
    params: { period: 20 }
  },
  {
    name: 'Stochastic',
    category: 'momentum',
    params: { kPeriod: 14, dPeriod: 3, smooth: 3 }
  },
  {
    name: 'ATR',
    category: 'volatility',
    params: { period: 14 }
  },
  {
    name: 'Volume',
    category: 'volume',
    params: { period: 20 }
  },
]

export function ExpertPanelIndicators() {
  const [activeIndicators, setActiveIndicators] = useState<Indicator[]>([])
  const [templates, setTemplates] = useState<IndicatorTemplate[]>([])
  const [showAddIndicator, setShowAddIndicator] = useState(false)

  const addIndicator = (indicator: typeof AVAILABLE_INDICATORS[0]) => {
    const newIndicator: Indicator = {
      id: `${indicator.name}-${Date.now()}`,
      ...indicator,
      enabled: true,
    }
    setActiveIndicators(prev => [...prev, newIndicator])
    setShowAddIndicator(false)
  }

  const removeIndicator = (id: string) => {
    setActiveIndicators(prev => prev.filter(ind => ind.id !== id))
  }

  const toggleIndicator = (id: string) => {
    setActiveIndicators(prev =>
      prev.map(ind => (ind.id === id ? { ...ind, enabled: !ind.enabled } : ind))
    )
  }

  const saveAsTemplate = () => {
    const templateName = prompt('Enter template name:')
    if (!templateName) return

    const newTemplate: IndicatorTemplate = {
      id: `template-${Date.now()}`,
      name: templateName,
      indicators: activeIndicators,
      createdAt: new Date().toISOString(),
    }

    setTemplates(prev => [...prev, newTemplate])
    // TODO: Persist to backend/localStorage
  }

  const loadTemplate = (template: IndicatorTemplate) => {
    setActiveIndicators(template.indicators)
  }

  const exportTemplate = (template: IndicatorTemplate) => {
    const dataStr = JSON.stringify(template, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${template.name}-indicators.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importTemplate = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const template = JSON.parse(e.target?.result as string)
          setTemplates(prev => [...prev, template])
        } catch (err) {
          alert('Invalid template file')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const groupedIndicators = AVAILABLE_INDICATORS.reduce((acc, ind) => {
    if (!acc[ind.category]) acc[ind.category] = []
    acc[ind.category].push(ind)
    return acc
  }, {} as Record<string, typeof AVAILABLE_INDICATORS>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Technical Indicators
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddIndicator(!showAddIndicator)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Indicator
          </button>
          {activeIndicators.length > 0 && (
            <button
              onClick={saveAsTemplate}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Template
            </button>
          )}
        </div>
      </div>

      {/* Add Indicator Panel */}
      {showAddIndicator && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Available Indicators
            </h3>
            <button
              onClick={() => setShowAddIndicator(false)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {Object.entries(groupedIndicators).map(([category, indicators]) => (
            <div key={category} className="mb-4 last:mb-0">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase mb-2">
                {category}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {indicators.map((indicator) => (
                  <button
                    key={indicator.name}
                    onClick={() => addIndicator(indicator)}
                    className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
                  >
                    {indicator.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Indicators */}
      {activeIndicators.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Active Indicators ({activeIndicators.length})
          </h3>
          {activeIndicators.map((indicator) => (
            <div
              key={indicator.id}
              className={`p-4 rounded-lg border transition-all ${
                indicator.enabled
                  ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {indicator.name}
                    </h4>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                      {indicator.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(indicator.params).map(([key, value]) => (
                      <span
                        key={key}
                        className="text-xs text-gray-600 dark:text-gray-400"
                      >
                        {key}: <strong>{value}</strong>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleIndicator(indicator.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      indicator.enabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        indicator.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => removeIndicator(indicator.id)}
                    className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">No indicators active</p>
          <p className="text-sm text-gray-500">
            Click "Add Indicator" to start building your indicator set
          </p>
        </div>
      )}

      {/* Templates */}
      {templates.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Saved Templates ({templates.length})
            </h3>
            <button
              onClick={importTemplate}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Upload className="h-3 w-3" />
              Import
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {template.indicators.length} indicators
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadTemplate(template)}
                    className="flex-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => exportTemplate(template)}
                    className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Export"
                  >
                    <Download className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
