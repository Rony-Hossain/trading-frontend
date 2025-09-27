'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { marketDataAPI, HistoricalData, realTimeData, StockPrice } from '../lib/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { BarChart3, TrendingUp } from 'lucide-react'

interface StockChartProps {
  symbol: string
  period?: string
  height?: number
}

export function StockChart({ symbol, period = '1y', height = 400 }: StockChartProps) {
  const [data, setData] = useState<HistoricalData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartType, setChartType] = useState<'line' | 'area'>('area')
  const [yDomain, setYDomain] = useState<[number, number] | null>(null)
  const pendingTickRef = useRef<StockPrice | null>(null)
  const flushTimerRef = useRef<NodeJS.Timeout | null>(null)

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
        const processedData = data.map((item) => ({
          ...item,
          date: period === '1d' 
            ? new Date(item.date).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })
            : new Date(item.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: period.includes('y') ? 'numeric' : undefined
              })
        }))
        
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

  // Real-time subscription: buffer ticks and flush at most once per second
  useEffect(() => {
    const onTick = (tick: StockPrice) => {
      pendingTickRef.current = tick
    }

    // Start a flush timer (1000ms)
    flushTimerRef.current = setInterval(() => {
      const tick = pendingTickRef.current
      if (!tick) return

      pendingTickRef.current = null

      const now = new Date()
      const label = period.includes('d')
        ? now.toLocaleTimeString('en-US', { hour12: false })
        : now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

      const nextPoint: HistoricalData = {
        date: label,
        open: tick.open ?? tick.price,
        high: tick.high ?? tick.price,
        low: tick.low ?? tick.price,
        close: tick.price,
        volume: tick.volume ?? 0,
      }

      setData(prev => {
        const updated = [...prev, nextPoint]
        const sliced = updated.slice(Math.max(0, updated.length - 500))
        const [minY, maxY] = yDomain ?? computeDomain(sliced)
        if (nextPoint.low < minY || nextPoint.high > maxY) {
          setYDomain(computeDomain(sliced))
        }
        return sliced
      })
    }, 1000)

    realTimeData.subscribe(symbol, onTick)
    return () => {
      realTimeData.unsubscribe(symbol, onTick)
      if (flushTimerRef.current) {
        clearInterval(flushTimerRef.current)
        flushTimerRef.current = null
      }
      pendingTickRef.current = null
    }
  }, [symbol, period, yDomain])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">Close: ${data.close.toFixed(2)}</p>
            <p className="text-gray-600">Open: ${data.open.toFixed(2)}</p>
            <p className="text-gray-600">High: ${data.high.toFixed(2)}</p>
            <p className="text-gray-600">Low: ${data.low.toFixed(2)}</p>
            <p className="text-gray-600">Volume: {data.volume.toLocaleString()}</p>
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

  const firstPrice = data[0]?.close || 0
  const lastPrice = data[data.length - 1]?.close || 0
  const priceChange = lastPrice - firstPrice
  const priceChangePercent = ((priceChange / firstPrice) * 100)
  const isPositive = priceChange >= 0

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
              <span>{isPositive ? '+' : ''}${priceChange.toFixed(2)}</span>
              <span>({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)</span>
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
                tickFormatter={(value) => `$${value.toFixed(0)}`}
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
                tickFormatter={(value) => `$${value.toFixed(0)}`}
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
