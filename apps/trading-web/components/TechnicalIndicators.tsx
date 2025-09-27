'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingUp, Activity, BarChart3, Target } from 'lucide-react'

interface TechnicalIndicatorsProps {
  data: Array<{
    date: string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }>
  symbol: string
}

interface IndicatorData {
  date: string
  close: number
  sma20: number
  sma50: number
  ema12: number
  ema26: number
  rsi: number
  volume: number
  bollinger_upper: number
  bollinger_lower: number
  macd: number
  macd_signal: number
  macd_histogram: number
}

export function TechnicalIndicators({ data, symbol }: TechnicalIndicatorsProps) {
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['SMA20', 'SMA50'])
  const [processedData, setProcessedData] = useState<IndicatorData[]>([])

  // Calculate technical indicators
  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) {
      setProcessedData([])
      return
    }

    const calculated = data.map((item, index) => {
      const closes = data.slice(Math.max(0, index - 49), index + 1).map(d => d.close)
      const closes20 = closes.slice(-20)
      const closes50 = closes.slice(-50)
      
      // Simple Moving Averages
      const sma20 = closes20.length >= 20 ? closes20.reduce((a, b) => a + b) / closes20.length : item.close
      const sma50 = closes50.length >= 50 ? closes50.reduce((a, b) => a + b) / closes50.length : item.close
      
      // Exponential Moving Averages
      const ema12 = calculateEMA(closes, 12)
      const ema26 = calculateEMA(closes, 26)
      
      // RSI
      const rsi = calculateRSI(closes.slice(-14))
      
      // Bollinger Bands
      const { upper: bollinger_upper, lower: bollinger_lower } = calculateBollingerBands(closes20, sma20)
      
      // MACD
      const macd = ema12 - ema26
      const macd_signal = calculateEMA([macd], 9)
      const macd_histogram = macd - macd_signal

      return {
        date: item.date,
        close: item.close,
        sma20,
        sma50,
        ema12,
        ema26,
        rsi,
        volume: item.volume,
        bollinger_upper,
        bollinger_lower,
        macd,
        macd_signal,
        macd_histogram
      }
    })

    setProcessedData(calculated)
  }, [data])

  const calculateEMA = (prices: number[], period: number): number => {
    if (prices.length === 0) return 0
    if (prices.length < period) return prices[prices.length - 1]
    
    const multiplier = 2 / (period + 1)
    let ema = prices.slice(0, period).reduce((a, b) => a + b) / period
    
    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier))
    }
    
    return ema
  }

  const calculateRSI = (prices: number[]): number => {
    if (prices.length < 14) return 50
    
    let gains = 0
    let losses = 0
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1]
      if (change > 0) gains += change
      else losses -= change
    }
    
    const avgGain = gains / 13
    const avgLoss = losses / 13
    
    if (avgLoss === 0) return 100
    
    const rs = avgGain / avgLoss
    return 100 - (100 / (1 + rs))
  }

  const calculateBollingerBands = (prices: number[], sma: number) => {
    if (prices.length < 20) return { upper: sma, lower: sma }
    
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / prices.length
    const stdDev = Math.sqrt(variance)
    
    return {
      upper: sma + (stdDev * 2),
      lower: sma - (stdDev * 2)
    }
  }

  const toggleIndicator = (indicator: string) => {
    setActiveIndicators(prev => 
      prev.includes(indicator)
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    )
  }

  const indicators = [
    { key: 'SMA20', label: 'SMA (20)', color: '#F59E0B', dataKey: 'sma20' },
    { key: 'SMA50', label: 'SMA (50)', color: '#EF4444', dataKey: 'sma50' },
    { key: 'EMA12', label: 'EMA (12)', color: '#10B981', dataKey: 'ema12' },
    { key: 'EMA26', label: 'EMA (26)', color: '#8B5CF6', dataKey: 'ema26' },
    { key: 'BOLLINGER', label: 'Bollinger Bands', color: '#6B7280', dataKey: 'bollinger_upper' }
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">Close: ${data.close.toFixed(2)}</p>
            {activeIndicators.includes('SMA20') && (
              <p className="text-amber-600">SMA (20): ${data.sma20.toFixed(2)}</p>
            )}
            {activeIndicators.includes('SMA50') && (
              <p className="text-red-600">SMA (50): ${data.sma50.toFixed(2)}</p>
            )}
            {activeIndicators.includes('EMA12') && (
              <p className="text-green-600">EMA (12): ${data.ema12.toFixed(2)}</p>
            )}
            {activeIndicators.includes('EMA26') && (
              <p className="text-purple-600">EMA (26): ${data.ema26.toFixed(2)}</p>
            )}
            {activeIndicators.includes('BOLLINGER') && (
              <>
                <p className="text-gray-600">BB Upper: ${data.bollinger_upper.toFixed(2)}</p>
                <p className="text-gray-600">BB Lower: ${data.bollinger_lower.toFixed(2)}</p>
              </>
            )}
            <p className="text-gray-600">RSI: {data.rsi.toFixed(1)}</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      {/* Price Chart with Technical Indicators */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Technical Analysis - {symbol}</span>
            </CardTitle>
            
            <div className="flex flex-wrap gap-2">
              {indicators.map((indicator) => (
                <button
                  key={indicator.key}
                  onClick={() => toggleIndicator(indicator.key)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    activeIndicators.includes(indicator.key)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {indicator.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={['dataMin - 5', 'dataMax + 5']}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Price Line */}
              <Line
                type="monotone"
                dataKey="close"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                name="Close Price"
              />
              
              {/* Technical Indicators */}
              {activeIndicators.includes('SMA20') && (
                <Line
                  type="monotone"
                  dataKey="sma20"
                  stroke="#F59E0B"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="5 5"
                  name="SMA (20)"
                />
              )}
              
              {activeIndicators.includes('SMA50') && (
                <Line
                  type="monotone"
                  dataKey="sma50"
                  stroke="#EF4444"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="5 5"
                  name="SMA (50)"
                />
              )}
              
              {activeIndicators.includes('EMA12') && (
                <Line
                  type="monotone"
                  dataKey="ema12"
                  stroke="#10B981"
                  strokeWidth={1}
                  dot={false}
                  name="EMA (12)"
                />
              )}
              
              {activeIndicators.includes('EMA26') && (
                <Line
                  type="monotone"
                  dataKey="ema26"
                  stroke="#8B5CF6"
                  strokeWidth={1}
                  dot={false}
                  name="EMA (26)"
                />
              )}
              
              {activeIndicators.includes('BOLLINGER') && (
                <>
                  <Line
                    type="monotone"
                    dataKey="bollinger_upper"
                    stroke="#6B7280"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="2 2"
                    name="Bollinger Upper"
                  />
                  <Line
                    type="monotone"
                    dataKey="bollinger_lower"
                    stroke="#6B7280"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="2 2"
                    name="Bollinger Lower"
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* RSI Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>RSI (14) - Relative Strength Index</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <ResponsiveContainer width="100%" height={150}>
            <ComposedChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}`, 'RSI']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              
              {/* RSI Overbought/Oversold Lines */}
              <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="2 2" />
              <ReferenceLine y={30} stroke="#10B981" strokeDasharray="2 2" />
              <ReferenceLine y={50} stroke="#6B7280" strokeDasharray="1 1" />
              
              <Line
                type="monotone"
                dataKey="rsi"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
                name="RSI"
              />
            </ComposedChart>
          </ResponsiveContainer>
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Oversold (&lt; 30)</span>
            <span>Neutral (30-70)</span>
            <span>Overbought (&gt; 70)</span>
          </div>
        </CardContent>
      </Card>

      {/* Volume Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Volume Analysis</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <ResponsiveContainer width="100%" height={150}>
            <ComposedChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M`, 'Volume']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              
              <Bar
                dataKey="volume"
                fill="#3B82F6"
                fillOpacity={0.6}
                name="Volume"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default TechnicalIndicators
