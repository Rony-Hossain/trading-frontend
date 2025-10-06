'use client'

/**
 * ChartSettingsPanel - Chart configuration with layouts and persistence
 * Phase 4: Expert Surfaces
 */

import { useState } from 'react'
import { BarChart2, Grid, Maximize2, Copy, Save, Download, Upload } from 'lucide-react'

interface ChartLayout {
  id: string
  name: string
  grid: '1x1' | '2x1' | '2x2' | '3x1' | '1x2'
  charts: ChartConfig[]
  createdAt: string
}

interface ChartConfig {
  id: string
  symbol: string
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
  chartType: 'candlestick' | 'line' | 'area' | 'heikin-ashi'
  indicators: string[] // References to indicator IDs
}

const GRID_LAYOUTS = [
  { value: '1x1', label: 'Single Chart', cols: 1, rows: 1 },
  { value: '2x1', label: '2 Charts Horizontal', cols: 2, rows: 1 },
  { value: '1x2', label: '2 Charts Vertical', cols: 1, rows: 2 },
  { value: '2x2', label: '4 Charts Grid', cols: 2, rows: 2 },
  { value: '3x1', label: '3 Charts Horizontal', cols: 3, rows: 1 },
] as const

export function ChartSettingsPanel() {
  const [layouts, setLayouts] = useState<ChartLayout[]>([])
  const [activeLayout, setActiveLayout] = useState<ChartLayout | null>(null)
  const [selectedGrid, setSelectedGrid] = useState<typeof GRID_LAYOUTS[number]['value']>('1x1')

  const createLayout = () => {
    const layoutName = prompt('Enter layout name:')
    if (!layoutName) return

    const gridConfig = GRID_LAYOUTS.find(g => g.value === selectedGrid)
    if (!gridConfig) return

    const numCharts = gridConfig.cols * gridConfig.rows

    const newLayout: ChartLayout = {
      id: `layout-${Date.now()}`,
      name: layoutName,
      grid: selectedGrid,
      charts: Array.from({ length: numCharts }, (_, i) => ({
        id: `chart-${i + 1}`,
        symbol: 'SPY',
        timeframe: '1h',
        chartType: 'candlestick',
        indicators: [],
      })),
      createdAt: new Date().toISOString(),
    }

    setLayouts(prev => [...prev, newLayout])
    setActiveLayout(newLayout)
  }

  const duplicateLayout = (layout: ChartLayout) => {
    const newLayout: ChartLayout = {
      ...layout,
      id: `layout-${Date.now()}`,
      name: `${layout.name} (Copy)`,
      createdAt: new Date().toISOString(),
    }
    setLayouts(prev => [...prev, newLayout])
  }

  const exportLayout = (layout: ChartLayout) => {
    const dataStr = JSON.stringify(layout, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${layout.name}-chart-layout.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importLayout = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const layout = JSON.parse(e.target?.result as string)
          setLayouts(prev => [...prev, layout])
        } catch (err) {
          alert('Invalid layout file')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const gridConfig = GRID_LAYOUTS.find(g => g.value === selectedGrid)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chart Layouts
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {layouts.length > 0 && (
            <button
              onClick={importLayout}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Import
            </button>
          )}
        </div>
      </div>

      {/* Grid Selector */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Select Layout Grid
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {GRID_LAYOUTS.map((layout) => (
            <button
              key={layout.value}
              onClick={() => setSelectedGrid(layout.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedGrid === layout.value
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800'
              }`}
            >
              <Grid className="h-6 w-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
              <div className="text-xs font-medium text-gray-900 dark:text-white text-center">
                {layout.label}
              </div>
              <div className="text-xs text-gray-500 text-center mt-1">
                {layout.cols}×{layout.rows}
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={createLayout}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          Create Layout ({gridConfig?.label})
        </button>
      </div>

      {/* Saved Layouts */}
      {layouts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Saved Layouts ({layouts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {layouts.map((layout) => {
              const layoutConfig = GRID_LAYOUTS.find(g => g.value === layout.grid)

              return (
                <div
                  key={layout.id}
                  className={`p-4 rounded-lg border transition-all ${
                    activeLayout?.id === layout.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {layout.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {layoutConfig?.label} • {layout.charts.length} charts
                      </p>
                    </div>
                    {activeLayout?.id === layout.id && (
                      <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Chart Preview */}
                  <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                    <div
                      className="grid gap-1"
                      style={{
                        gridTemplateColumns: `repeat(${layoutConfig?.cols || 1}, 1fr)`,
                        gridTemplateRows: `repeat(${layoutConfig?.rows || 1}, 1fr)`,
                      }}
                    >
                      {layout.charts.map((chart, idx) => (
                        <div
                          key={chart.id}
                          className="aspect-video bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center"
                        >
                          <div className="text-center">
                            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {chart.symbol}
                            </div>
                            <div className="text-xs text-gray-500">
                              {chart.timeframe}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveLayout(layout)}
                      className="flex-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <Maximize2 className="h-3 w-3 inline mr-1" />
                      {activeLayout?.id === layout.id ? 'Active' : 'Load'}
                    </button>
                    <button
                      onClick={() => duplicateLayout(layout)}
                      className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => exportLayout(layout)}
                      className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Export"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {layouts.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <Grid className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">No saved layouts</p>
          <p className="text-sm text-gray-500">
            Select a grid layout above and create your first chart layout
          </p>
        </div>
      )}

      {/* Active Layout Configuration */}
      {activeLayout && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Configure: {activeLayout.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLayout.charts.map((chart, idx) => (
              <div
                key={chart.id}
                className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chart {idx + 1}
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">
                      Symbol
                    </label>
                    <input
                      type="text"
                      value={chart.symbol}
                      readOnly
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">
                      Timeframe
                    </label>
                    <select
                      value={chart.timeframe}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
                    >
                      <option value="1m">1 Minute</option>
                      <option value="5m">5 Minutes</option>
                      <option value="15m">15 Minutes</option>
                      <option value="1h">1 Hour</option>
                      <option value="4h">4 Hours</option>
                      <option value="1d">1 Day</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400">
                      Chart Type
                    </label>
                    <select
                      value={chart.chartType}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
                    >
                      <option value="candlestick">Candlestick</option>
                      <option value="line">Line</option>
                      <option value="area">Area</option>
                      <option value="heikin-ashi">Heikin-Ashi</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
