'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { analysisAPI, TechnicalAnalysis as TechnicalAnalysisType } from '@/lib/api'
import { getSignalColor, formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, Activity, Target } from 'lucide-react'

interface TechnicalAnalysisProps {
  symbol: string
  period?: string
}

export function TechnicalAnalysis({ symbol, period = '6mo' }: TechnicalAnalysisProps) {
  const [analysis, setAnalysis] = useState<TechnicalAnalysisType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        const data = await analysisAPI.getTechnicalAnalysis(symbol, period)
        setAnalysis(data)
        setError(null)
      } catch (err) {
        setError(`Failed to fetch technical analysis for ${symbol}`)
        console.error('Error fetching technical analysis:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [symbol, period])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Technical Analysis - {symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Technical Analysis - {symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error || 'No analysis available'}</p>
        </CardContent>
      </Card>
    )
  }

  const getSignalIcon = (signal: string) => {
    switch (signal?.toUpperCase()) {
      case 'BUY':
      case 'STRONG_BUY':
        return <TrendingUp className="h-4 w-4" />
      case 'SELL':
      case 'STRONG_SELL':
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Technical Analysis - {symbol}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Signal */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Overall Signal</span>
            </div>
            <div className={`flex items-center space-x-2 font-semibold ${getSignalColor(analysis.signals.overall_signal)}`}>
              {getSignalIcon(analysis.signals.overall_signal)}
              <span>{analysis.signals.overall_signal}</span>
              <span className="text-sm">({analysis.signals.strength}/100)</span>
            </div>
          </div>
        </div>

        {/* Current Price */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Current Price</span>
          <span className="text-xl font-bold">{formatCurrency(analysis.current_price)}</span>
        </div>

        {/* Moving Averages */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Moving Averages</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {analysis.moving_averages.sma_20 && (
              <div className="flex justify-between">
                <span>SMA 20</span>
                <span>{formatCurrency(analysis.moving_averages.sma_20)}</span>
              </div>
            )}
            {analysis.moving_averages.sma_50 && (
              <div className="flex justify-between">
                <span>SMA 50</span>
                <span>{formatCurrency(analysis.moving_averages.sma_50)}</span>
              </div>
            )}
            {analysis.moving_averages.ema_12 && (
              <div className="flex justify-between">
                <span>EMA 12</span>
                <span>{formatCurrency(analysis.moving_averages.ema_12)}</span>
              </div>
            )}
            {analysis.moving_averages.ema_26 && (
              <div className="flex justify-between">
                <span>EMA 26</span>
                <span>{formatCurrency(analysis.moving_averages.ema_26)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Oscillators */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Oscillators</h4>
          <div className="text-sm">
            {analysis.oscillators.rsi_14 && (
              <div className="flex justify-between">
                <span>RSI (14)</span>
                <div className="flex items-center space-x-2">
                  <span>{analysis.oscillators.rsi_14.toFixed(2)}</span>
                  <span className={`text-xs ${
                    analysis.oscillators.rsi_14 > 70 ? 'text-red-600' :
                    analysis.oscillators.rsi_14 < 30 ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    {analysis.oscillators.rsi_14 > 70 ? 'Overbought' :
                     analysis.oscillators.rsi_14 < 30 ? 'Oversold' : 'Neutral'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MACD */}
        {analysis.macd.macd && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700">MACD</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-xs text-gray-500">MACD</div>
                <div className="font-medium">{analysis.macd.macd.toFixed(4)}</div>
              </div>
              {analysis.macd.signal && (
                <div className="text-center">
                  <div className="text-xs text-gray-500">Signal</div>
                  <div className="font-medium">{analysis.macd.signal.toFixed(4)}</div>
                </div>
              )}
              {analysis.macd.histogram && (
                <div className="text-center">
                  <div className="text-xs text-gray-500">Histogram</div>
                  <div className={`font-medium ${analysis.macd.histogram > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analysis.macd.histogram.toFixed(4)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Individual Signals */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Individual Signals</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(analysis.signals.individual_signals).map(([indicator, signal]) => (
              <div key={indicator} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="capitalize">{indicator.replace('_', ' ')}</span>
                <div className={`flex items-center space-x-1 ${getSignalColor(signal)}`}>
                  {getSignalIcon(signal)}
                  <span className="font-medium">{signal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TechnicalAnalysis