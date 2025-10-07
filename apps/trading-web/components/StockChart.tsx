'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { marketDataAPI, HistoricalData, realTimeData, StockPrice } from '../lib/api'
import { formatCurrency, formatNumber, formatPercent, formatTime, formatDate } from '../lib/i18n/format'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { BarChart3, TrendingUp } from 'lucide-react'

interface StockChartProps {
  symbol: string
  period?: string
  height?: number
  mode?: 'beginner' | 'expert'
  onPeriodChange?: (period: string) => void
}

const MAX_POINTS = 500

export function StockChart({ symbol, period = '1y', height = 400, mode = 'beginner', onPeriodChange }: StockChartProps) {
  const [data, setData] = useState<HistoricalData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartType, setChartType] = useState<'line' | 'area'>('area')
  const [yDomain, setYDomain] = useState<[number, number] | null>(null)
  void onPeriodChange

  const computeDomain = (points: HistoricalData[]): [number, number] => {
    if (!points.length) return [0, 1]
    const lows = points.map(p => p.low ?? p.close)
    const highs = points.map(p => p.high ?? p.close)
    const min = Math.min(...lows)
    const max = Math.max(...highs)
    if (min === max) return [min * 0.99, max * 1.01]
    const pad = (max - min) * 0.02 // 2% padding to reduce axis jitter
    return [min - pad, max + pad]
  }

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true)
        
        // Use intraday data for 1d period, historical for others
        const data = period === '1d' 
          ? await marketDataAPI.getIntradayData(symbol, '1m')
          : await marketDataAPI.getHistoricalData(symbol, period)
        
        // Process data for chart
        const processedData = data.map((item) => {
          const dateObj = new Date(item.date)
          const formattedDate =
            period === '1d'
              ? formatTime(dateObj)
              : formatDate(dateObj, {
                  month: 'short',
                  day: 'numeric',
                  year: period.includes('y') ? 'numeric' : undefined,
                })

          return {
            ...item,
            date: formattedDate,
          }
        })
        
        setData(processedData)
        setYDomain(computeDomain(processedData))
        setError(null)
      } catch (err) {
        setError(`Failed to fetch chart data for ${symbol}`)
        console.error('Error fetching historical data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [symbol, period])

  // Real-time subscription with built-in throttling/backpressure
  useEffect(() => {
    const handleTick = (tick: StockPrice) => {
      const now = new Date()
      const label = period.includes('d')
        ? formatTime(now)
        : formatDate(now, {
            month: 'short',
            day: 'numeric',
            year: period.includes('y') ? 'numeric' : undefined,
          })

      const nextPoint: HistoricalData = {
        date: label,
        open: tick.open ?? tick.price,
        high: tick.high ?? tick.price,
        low: tick.low ?? tick.price,
        close: tick.price,
        volume: tick.volume ?? 0,
      }

      setData((previous) => {
        const updated = [...previous, nextPoint]
        if (updated.length > MAX_POINTS) {
          updated.splice(0, updated.length - MAX_POINTS)
        }

        setYDomain((previousDomain) => {
          if (!previousDomain) {
            return computeDomain(updated)
          }
          const [minY, maxY] = previousDomain
          if (nextPoint.low < minY || nextPoint.high > maxY) {
            return computeDomain(updated)
          }
          return previousDomain
        })

        return updated
      })
    }

    realTimeData.subscribe(symbol, handleTick, { mode })
    return () => {
      realTimeData.unsubscribe(symbol, handleTick)
    }
  }, [symbol, mode, period])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">Close: {formatCurrency(data.close)}</p>
            <p className="text-gray-600">Open: {formatCurrency(data.open)}</p>
            <p className="text-gray-600">High: {formatCurrency(data.high)}</p>
            <p className="text-gray-600">Low: {formatCurrency(data.low)}</p>
            <p className="text-gray-600">Volume: {formatNumber(data.volume, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Price Chart - {symbol}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Price Chart - {symbol}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error || 'No chart data available'}</p>
        </CardContent>
      </Card>
    )
  }

  const firstPrice = data[0]?.close ?? 0
  const lastPrice = data[data.length - 1]?.close ?? 0
  const priceChange = lastPrice - firstPrice
  const priceChangeRatio = firstPrice ? priceChange / firstPrice : 0
  const isPositive = priceChange >= 0
  const formattedChange = formatCurrency(Math.abs(priceChange))
  const formattedChangePercent = formatPercent(Math.abs(priceChangeRatio), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Price Chart - {symbol}</span>
          </CardTitle>
          
          <div className="flex items-center space-x-4">
            {/* Period Performance */}
            <div className={`flex items-center space-x-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-4 w-4 ${!isPositive ? 'rotate-180' : ''}`} />
              <span>
                {isPositive ? '+' : '-'}
                {formattedChange}
              </span>
              <span>
                ({isPositive ? '+' : '-'}
                {formattedChangePercent})
              </span>
            </div>
            
            {/* Chart Type Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  chartType === 'line' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  chartType === 'area' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Area
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={yDomain ?? ['auto', 'auto'] as any}
                tickFormatter={(value) =>
                  formatCurrency(value, 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="close"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
                isAnimationActive={false}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={yDomain ?? ['auto', 'auto'] as any}
                tickFormatter={(value) =>
                  formatCurrency(value, 'USD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#3B82F6' }}
                isAnimationActive={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default StockChart
