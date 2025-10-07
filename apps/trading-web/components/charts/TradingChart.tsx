'use client'

/**
 * Trading Chart Component
 * Advanced chart using Lightweight Charts library
 */
import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  IconButton,
  ButtonGroup,
  Button,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
} from '@mui/material'
import {
  Timeline,
  ShowChart,
  StackedLineChart,
  MoreVert,
  Fullscreen,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts'
import { useUserStore, THEME_PRESETS } from '../../lib/stores/userStore'
import { useChartStore, ChartType } from '../../lib/stores/chartStore'
import { getChartTheme, getCandlestickColors } from '../../lib/theme/themeConfig'

interface TradingChartProps {
  chartId: string
  height?: number
}

const timeframes = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1H', value: '1H' },
  { label: '4H', value: '4H' },
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
]

export function TradingChart({ chartId, height = 500 }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  const { preferences } = useUserStore()
  const { getChart, updateChartSymbol, updateChartTimeframe, updateChartType } = useChartStore()

  const chartConfig = getChart(chartId)

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current || !chartConfig) return

    const preset = THEME_PRESETS[preferences.themePreset]
    const mode = preferences.themeMode === 'dark' ? 'dark' : 'light'
    const theme = getChartTheme(preset, mode)

    const chart = createChart(chartContainerRef.current, {
      ...theme,
      width: chartContainerRef.current.clientWidth,
      height,
    })

    const candlestickSeries = chart.addCandlestickSeries(getCandlestickColors(preset))

    // Mock data - replace with real data from API
    const mockData = generateMockData(100)
    candlestickSeries.setData(mockData)

    chartRef.current = chart
    seriesRef.current = candlestickSeries

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [chartId, height, preferences.themeMode, preferences.themePreset])

  // Update chart when symbol/timeframe changes
  useEffect(() => {
    if (!seriesRef.current || !chartConfig) return

    // Fetch new data for symbol/timeframe
    const mockData = generateMockData(100)
    seriesRef.current.setData(mockData)
  }, [chartConfig?.symbol, chartConfig?.timeframe])

  if (!chartConfig) return null

  const handleTimeframeChange = (timeframe: string) => {
    updateChartTimeframe(chartId, timeframe)
  }

  const handleChartTypeChange = (type: ChartType) => {
    updateChartType(chartId, type)
    setMenuAnchor(null)
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Chart Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={chartConfig.symbol}
              color="primary"
              sx={{ fontWeight: 600, fontSize: '1rem' }}
            />
            <ButtonGroup size="small" variant="outlined">
              {timeframes.map((tf) => (
                <Button
                  key={tf.value}
                  variant={chartConfig.timeframe === tf.value ? 'contained' : 'outlined'}
                  onClick={() => handleTimeframeChange(tf.value)}
                >
                  {tf.label}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Chart Type">
              <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
                <Timeline />
              </IconButton>
            </Tooltip>
            <Tooltip title="Indicators">
              <IconButton size="small">
                <StackedLineChart />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton size="small">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Fullscreen">
              <IconButton size="small">
                <Fullscreen />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Chart Container */}
        <Box ref={chartContainerRef} sx={{ width: '100%', height }} />

        {/* Chart Type Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => handleChartTypeChange('candlestick')}>
            Candlestick
          </MenuItem>
          <MenuItem onClick={() => handleChartTypeChange('line')}>
            Line
          </MenuItem>
          <MenuItem onClick={() => handleChartTypeChange('area')}>
            Area
          </MenuItem>
          <MenuItem onClick={() => handleChartTypeChange('heikin-ashi')}>
            Heikin-Ashi
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  )
}

// Mock data generator
function generateMockData(count: number) {
  const data = []
  let basePrice = 150
  const now = Math.floor(Date.now() / 1000)

  for (let i = count; i >= 0; i--) {
    const time = now - i * 86400 // Daily bars
    const change = (Math.random() - 0.5) * 5
    basePrice += change

    const open = basePrice
    const high = basePrice + Math.random() * 3
    const low = basePrice - Math.random() * 3
    const close = low + Math.random() * (high - low)

    data.push({
      time,
      open,
      high,
      low,
      close,
    })
  }

  return data
}
