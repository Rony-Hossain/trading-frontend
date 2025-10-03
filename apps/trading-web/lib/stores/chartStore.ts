/**
 * Chart Store - Manages chart state, indicators, and layout
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ChartType = 'candlestick' | 'line' | 'area' | 'heikin-ashi' | 'renko' | 'point-figure' | 'volume-profile'
export type ChartLayout = 1 | 2 | 4 | 6

export interface Indicator {
  id: string
  name: string
  type: string
  params: Record<string, any>
  enabled: boolean
  color?: string
}

export interface DrawingTool {
  id: string
  type: 'trendline' | 'horizontal' | 'fibonacci' | 'rectangle' | 'text'
  points: Array<{ time: number; price: number }>
  color?: string
  label?: string
}

export interface ChartConfig {
  chartId: string
  symbol: string
  timeframe: string
  chartType: ChartType
  indicators: Indicator[]
  drawings: DrawingTool[]
  showVolume: boolean
  showGrid: boolean
  crosshairMode: boolean
}

interface ChartState {
  // Layout
  layout: ChartLayout
  charts: ChartConfig[]

  // Active chart
  activeChartId: string | null

  // Indicator library
  availableIndicators: Array<{
    id: string
    name: string
    category: 'trend' | 'momentum' | 'volume' | 'volatility'
    params: Array<{
      name: string
      type: 'number' | 'color' | 'select'
      default: any
      options?: any[]
    }>
  }>

  // Actions - Layout
  setLayout: (layout: ChartLayout) => void
  addChart: (config: Partial<ChartConfig>) => void
  removeChart: (chartId: string) => void
  setActiveChart: (chartId: string) => void

  // Actions - Chart config
  updateChartSymbol: (chartId: string, symbol: string) => void
  updateChartTimeframe: (chartId: string, timeframe: string) => void
  updateChartType: (chartId: string, chartType: ChartType) => void

  // Actions - Indicators
  addIndicator: (chartId: string, indicator: Omit<Indicator, 'id'>) => void
  removeIndicator: (chartId: string, indicatorId: string) => void
  toggleIndicator: (chartId: string, indicatorId: string) => void
  updateIndicator: (chartId: string, indicatorId: string, updates: Partial<Indicator>) => void

  // Actions - Drawings
  addDrawing: (chartId: string, drawing: Omit<DrawingTool, 'id'>) => void
  removeDrawing: (chartId: string, drawingId: string) => void
  clearDrawings: (chartId: string) => void

  // Getters
  getChart: (chartId: string) => ChartConfig | undefined
  getActiveChart: () => ChartConfig | undefined
}

const defaultIndicators = [
  {
    id: 'sma',
    name: 'Simple Moving Average',
    category: 'trend' as const,
    params: [
      { name: 'period', type: 'number' as const, default: 20 },
      { name: 'color', type: 'color' as const, default: '#2196F3' },
    ],
  },
  {
    id: 'ema',
    name: 'Exponential Moving Average',
    category: 'trend' as const,
    params: [
      { name: 'period', type: 'number' as const, default: 20 },
      { name: 'color', type: 'color' as const, default: '#FF9800' },
    ],
  },
  {
    id: 'rsi',
    name: 'Relative Strength Index',
    category: 'momentum' as const,
    params: [
      { name: 'period', type: 'number' as const, default: 14 },
      { name: 'overbought', type: 'number' as const, default: 70 },
      { name: 'oversold', type: 'number' as const, default: 30 },
    ],
  },
  {
    id: 'macd',
    name: 'MACD',
    category: 'momentum' as const,
    params: [
      { name: 'fastPeriod', type: 'number' as const, default: 12 },
      { name: 'slowPeriod', type: 'number' as const, default: 26 },
      { name: 'signalPeriod', type: 'number' as const, default: 9 },
    ],
  },
  {
    id: 'bollinger',
    name: 'Bollinger Bands',
    category: 'volatility' as const,
    params: [
      { name: 'period', type: 'number' as const, default: 20 },
      { name: 'stdDev', type: 'number' as const, default: 2 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    category: 'volume' as const,
    params: [
      { name: 'color', type: 'color' as const, default: '#9E9E9E' },
    ],
  },
]

export const useChartStore = create<ChartState>()(
  persist(
    (set, get) => ({
      // Initial state
      layout: 1,
      charts: [
        {
          chartId: 'chart_1',
          symbol: 'AAPL',
          timeframe: '1D',
          chartType: 'candlestick',
          indicators: [],
          drawings: [],
          showVolume: true,
          showGrid: true,
          crosshairMode: true,
        },
      ],
      activeChartId: 'chart_1',
      availableIndicators: defaultIndicators,

      // Layout actions
      setLayout: (layout) => {
        const currentCharts = get().charts
        const chartsNeeded = layout

        if (currentCharts.length < chartsNeeded) {
          // Add more charts
          const newCharts = [...currentCharts]
          for (let i = currentCharts.length; i < chartsNeeded; i++) {
            newCharts.push({
              chartId: `chart_${i + 1}`,
              symbol: 'AAPL',
              timeframe: '1D',
              chartType: 'candlestick',
              indicators: [],
              drawings: [],
              showVolume: true,
              showGrid: true,
              crosshairMode: true,
            })
          }
          set({ layout, charts: newCharts })
        } else if (currentCharts.length > chartsNeeded) {
          // Remove extra charts
          set({ layout, charts: currentCharts.slice(0, chartsNeeded) })
        } else {
          set({ layout })
        }
      },

      addChart: (config) => {
        const charts = get().charts
        const newChart: ChartConfig = {
          chartId: `chart_${Date.now()}`,
          symbol: config.symbol || 'AAPL',
          timeframe: config.timeframe || '1D',
          chartType: config.chartType || 'candlestick',
          indicators: config.indicators || [],
          drawings: config.drawings || [],
          showVolume: config.showVolume ?? true,
          showGrid: config.showGrid ?? true,
          crosshairMode: config.crosshairMode ?? true,
        }
        set({ charts: [...charts, newChart], activeChartId: newChart.chartId })
      },

      removeChart: (chartId) => {
        const charts = get().charts.filter((c) => c.chartId !== chartId)
        set({ charts })
      },

      setActiveChart: (chartId) => {
        set({ activeChartId: chartId })
      },

      // Chart config actions
      updateChartSymbol: (chartId, symbol) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.chartId === chartId ? { ...chart, symbol } : chart
          ),
        }))
      },

      updateChartTimeframe: (chartId, timeframe) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.chartId === chartId ? { ...chart, timeframe } : chart
          ),
        }))
      },

      updateChartType: (chartId, chartType) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.chartId === chartId ? { ...chart, chartType } : chart
          ),
        }))
      },

      // Indicator actions
      addIndicator: (chartId, indicatorData) => {
        const indicator: Indicator = {
          ...indicatorData,
          id: `ind_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          enabled: true,
        }
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.chartId === chartId
              ? { ...chart, indicators: [...chart.indicators, indicator] }
              : chart
          ),
        }))
      },

      removeIndicator: (chartId, indicatorId) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.chartId === chartId
              ? {
                  ...chart,
                  indicators: chart.indicators.filter((ind) => ind.id !== indicatorId),
                }
              : chart
          ),
        }))
      },

      toggleIndicator: (chartId, indicatorId) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.chartId === chartId
              ? {
                  ...chart,
                  indicators: chart.indicators.map((ind) =>
                    ind.id === indicatorId ? { ...ind, enabled: !ind.enabled } : ind
                  ),
                }
              : chart
          ),
        }))
      },

      updateIndicator: (chartId, indicatorId, updates) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.chartId === chartId
              ? {
                  ...chart,
                  indicators: chart.indicators.map((ind) =>
                    ind.id === indicatorId ? { ...ind, ...updates } : ind
                  ),
                }
              : chart
          ),
        }))
      },

      // Drawing actions
      addDrawing: (chartId, drawingData) => {
        const drawing: DrawingTool = {
          ...drawingData,
          id: `draw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.chartId === chartId
              ? { ...chart, drawings: [...chart.drawings, drawing] }
              : chart
          ),
        }))
      },

      removeDrawing: (chartId, drawingId) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.chartId === chartId
              ? {
                  ...chart,
                  drawings: chart.drawings.filter((draw) => draw.id !== drawingId),
                }
              : chart
          ),
        }))
      },

      clearDrawings: (chartId) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.chartId === chartId ? { ...chart, drawings: [] } : chart
          ),
        }))
      },

      // Getters
      getChart: (chartId) => {
        return get().charts.find((c) => c.chartId === chartId)
      },

      getActiveChart: () => {
        const { activeChartId, charts } = get()
        return charts.find((c) => c.chartId === activeChartId)
      },
    }),
    {
      name: 'chart-storage',
      partialize: (state) => ({
        layout: state.layout,
        charts: state.charts,
      }),
    }
  )
)
