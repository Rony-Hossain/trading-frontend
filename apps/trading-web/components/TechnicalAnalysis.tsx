'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { analysisAPI, TechnicalAnalysis as TechnicalAnalysisType } from '../lib/api'
import { getSignalColor, formatCurrency } from '../lib/utils'
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
        {/* Market Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Market Status</span>
            </div>
            <div className={`flex items-center space-x-2 font-semibold ${getSignalColor(analysis.market_status.status)}`}>
              {getSignalIcon(analysis.market_status.direction)}
              <span>{analysis.market_status.status}</span>
              <span className="text-sm">({analysis.market_status.momentum} momentum)</span>
            </div>
          </div>
        </div>

        {/* Current Price */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Current Price</span>
          <span className="text-xl font-bold">{formatCurrency(analysis.realtime_data.current_price)}</span>
        </div>

        {/* Technical Indicators */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Technical Analysis</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span>1-Day Change</span>
              <span className={analysis.quick_technical.price_change_1d >= 0 ? 'text-green-600' : 'text-red-600'}>
                {analysis.quick_technical.price_change_1d >= 0 ? '+' : ''}${analysis.quick_technical.price_change_1d.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>5-Day Change</span>
              <span className={analysis.quick_technical.price_change_5d >= 0 ? 'text-green-600' : 'text-red-600'}>
                {analysis.quick_technical.price_change_5d >= 0 ? '+' : ''}${analysis.quick_technical.price_change_5d.toFixed(2)}
              </span>
              </div>
            <div className="flex justify-between">
              <span>Volume Ratio</span>
              <span className={analysis.quick_technical.volume_ratio >= 1 ? 'text-green-600' : 'text-red-600'}>
                {analysis.quick_technical.volume_ratio.toFixed(2)}x
              </span>
            </div>
          </div>
        </div>

        {/* Volatility Analysis */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Volatility Analysis</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span>5-Day Volatility</span>
              <span>{(analysis.realtime_data.volatility_5d * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span>20-Day Volatility</span>
              <span>{(analysis.quick_technical.volatility_20d * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Market Data */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Market Data</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span>Average Volume (5d)</span>
              <span>{Math.round(analysis.realtime_data.avg_volume_5d).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Data Source</span>
              <span className="text-blue-600">{analysis.realtime_data.source}</span>
            </div>
          </div>
        </div>

        {/* Analysis Info */}
        <div className="text-xs text-gray-500 border-t pt-4">
          <p>Last updated: {new Date(analysis.analysis_timestamp).toLocaleString()}</p>
          <p>Data from: {analysis.realtime_data.source}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default TechnicalAnalysis