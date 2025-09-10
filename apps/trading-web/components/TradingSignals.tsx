'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { analysisAPI } from '../lib/api'
import { getSignalColor, formatCurrency, formatPercentage } from '../lib/utils'
import { TrendingUp, TrendingDown, Shield, AlertTriangle, Target, DollarSign, Percent, Calendar } from 'lucide-react'

interface TradingSignal {
  id: string
  symbol: string
  signal: 'BUY' | 'SELL' | 'HOLD' | 'STRONG_BUY' | 'STRONG_SELL'
  confidence: number
  targetPrice: number
  stopLoss: number
  riskReward: number
  timeframe: string
  strategy: string
  reasoning: string
  createdAt: Date
}

interface RiskMetrics {
  portfolioValue: number
  maxRiskPerTrade: number
  dailyVaR: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  profitFactor: number
  totalTrades: number
}

interface TradingSignalsProps {
  watchlist: string[]
  onSymbolSelect: (symbol: string) => void
}

export function TradingSignals({ watchlist, onSymbolSelect }: TradingSignalsProps) {
  const [signals, setSignals] = useState<TradingSignal[]>([])
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeStrategy, setActiveStrategy] = useState('all')
  const [riskTolerance, setRiskTolerance] = useState('moderate')

  // Mock trading signals
  const mockSignals: TradingSignal[] = [
    {
      id: '1',
      symbol: 'AAPL',
      signal: 'STRONG_BUY',
      confidence: 85,
      targetPrice: 190.00,
      stopLoss: 165.00,
      riskReward: 2.5,
      timeframe: '2-4 weeks',
      strategy: 'Momentum Breakout',
      reasoning: 'Strong upward momentum with RSI oversold recovery and volume confirmation',
      createdAt: new Date('2024-01-16T09:30:00')
    },
    {
      id: '2',
      symbol: 'TSLA',
      signal: 'SELL',
      confidence: 72,
      targetPrice: 200.00,
      stopLoss: 280.00,
      riskReward: 1.8,
      timeframe: '1-2 weeks',
      strategy: 'Mean Reversion',
      reasoning: 'Overbought conditions with bearish divergence on MACD',
      createdAt: new Date('2024-01-16T10:15:00')
    },
    {
      id: '3',
      symbol: 'GOOGL',
      signal: 'BUY',
      confidence: 78,
      targetPrice: 155.00,
      stopLoss: 135.00,
      riskReward: 2.0,
      timeframe: '3-5 weeks',
      strategy: 'Support Bounce',
      reasoning: 'Price bouncing off major support level with increased volume',
      createdAt: new Date('2024-01-16T11:00:00')
    },
    {
      id: '4',
      symbol: 'MSFT',
      signal: 'HOLD',
      confidence: 65,
      targetPrice: 0,
      stopLoss: 0,
      riskReward: 0,
      timeframe: 'Ongoing',
      strategy: 'Range Trading',
      reasoning: 'Consolidating in range, wait for breakout confirmation',
      createdAt: new Date('2024-01-16T12:30:00')
    }
  ]

  const mockRiskMetrics: RiskMetrics = {
    portfolioValue: 125000,
    maxRiskPerTrade: 2.5,
    dailyVaR: 1250,
    sharpeRatio: 1.34,
    maxDrawdown: 8.5,
    winRate: 64.2,
    profitFactor: 1.78,
    totalTrades: 156
  }

  useEffect(() => {
    setSignals(mockSignals)
    setRiskMetrics(mockRiskMetrics)
    setLoading(false)
  }, [watchlist])

  const filteredSignals = signals.filter(signal => 
    activeStrategy === 'all' || signal.strategy.toLowerCase().includes(activeStrategy.toLowerCase())
  )

  const getSignalIcon = (signal: string) => {
    if (signal.includes('BUY')) return <TrendingUp className="h-4 w-4" />
    if (signal.includes('SELL')) return <TrendingDown className="h-4 w-4" />
    return <Target className="h-4 w-4" />
  }

  const getTimeframeBadge = (timeframe: string) => {
    if (timeframe.includes('week')) return 'bg-blue-100 text-blue-800'
    if (timeframe.includes('day')) return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  const calculatePositionSize = (signal: TradingSignal): number => {
    if (!riskMetrics || signal.stopLoss === 0) return 0
    const riskAmount = (riskMetrics.portfolioValue * riskMetrics.maxRiskPerTrade) / 100
    const priceRisk = Math.abs(signal.targetPrice - signal.stopLoss)
    return Math.floor(riskAmount / priceRisk)
  }

  return (
    <div className="space-y-6">
      {/* Risk Management Dashboard */}
      {riskMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Risk Management Dashboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">Portfolio Value</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(riskMetrics.portfolioValue)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500">Daily VaR</div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(riskMetrics.dailyVaR)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500">Sharpe Ratio</div>
                <div className="text-2xl font-bold text-green-600">
                  {riskMetrics.sharpeRatio}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500">Win Rate</div>
                <div className="text-2xl font-bold text-purple-600">
                  {riskMetrics.winRate}%
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Max Risk/Trade</span>
                  <span className="font-medium">{riskMetrics.maxRiskPerTrade}%</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Max Drawdown</span>
                  <span className="font-medium text-red-600">{riskMetrics.maxDrawdown}%</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profit Factor</span>
                  <span className="font-medium text-green-600">{riskMetrics.profitFactor}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategy Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Trading Signals</span>
            </CardTitle>
            
            <div className="flex space-x-2">
              <select
                value={activeStrategy}
                onChange={(e) => setActiveStrategy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Strategies</option>
                <option value="momentum">Momentum</option>
                <option value="mean reversion">Mean Reversion</option>
                <option value="support">Support/Resistance</option>
                <option value="range">Range Trading</option>
              </select>
              
              <select
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading signals...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSignals.map((signal) => (
                <div
                  key={signal.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSymbolSelect(signal.symbol)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="font-bold text-lg">{signal.symbol}</div>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${getSignalColor(signal.signal)} bg-opacity-10`}>
                          {getSignalIcon(signal.signal)}
                          <span>{signal.signal}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Confidence: {signal.confidence}%
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-700 mb-3">
                        <strong>Strategy:</strong> {signal.strategy}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        {signal.reasoning}
                      </div>
                      
                      {signal.signal !== 'HOLD' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Target:</span>
                            <div className="font-medium">{formatCurrency(signal.targetPrice)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Stop Loss:</span>
                            <div className="font-medium">{formatCurrency(signal.stopLoss)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Risk/Reward:</span>
                            <div className="font-medium">{signal.riskReward}:1</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Position Size:</span>
                            <div className="font-medium">{calculatePositionSize(signal)} shares</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className={`px-2 py-1 rounded-full text-xs ${getTimeframeBadge(signal.timeframe)}`}>
                        {signal.timeframe}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {signal.createdAt.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredSignals.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No signals found for the selected strategy
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Risk Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entry Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stop Loss Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Stop loss"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Size (shares)
                </label>
                <input
                  type="number"
                  placeholder="Number of shares"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Risk Amount</div>
                <div className="text-2xl font-bold text-red-600">$0.00</div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Risk Percentage</div>
                <div className="text-2xl font-bold text-orange-600">0.00%</div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Risk Rating</div>
                <div className="text-lg font-bold text-gray-600">Enter values to calculate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Signal Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Profitable Signals</div>
              <div className="text-2xl font-bold text-green-600">78%</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Avg. Return</div>
              <div className="text-2xl font-bold text-blue-600">+12.4%</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Best Signal</div>
              <div className="text-2xl font-bold text-purple-600">+34.8%</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600">Avg. Duration</div>
              <div className="text-2xl font-bold text-orange-600">18 days</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TradingSignals