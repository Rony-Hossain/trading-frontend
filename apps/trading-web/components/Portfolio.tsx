'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { marketDataAPI } from '../lib/api'
import { formatCurrency, formatPercentage } from '../lib/utils'
import { TrendingUp, TrendingDown, Plus, Minus, DollarSign, PieChart, Target, AlertCircle } from 'lucide-react'

interface PortfolioPosition {
  symbol: string
  shares: number
  avgPrice: number
  currentPrice: number
  totalValue: number
  gainLoss: number
  gainLossPercent: number
}

interface PortfolioProps {
  watchlist: string[]
  onSymbolSelect: (symbol: string) => void
  onAddToWatchlist: (symbol: string) => void
  onRemoveFromWatchlist: (symbol: string) => void
}

export function Portfolio({ 
  watchlist, 
  onSymbolSelect, 
  onAddToWatchlist, 
  onRemoveFromWatchlist 
}: PortfolioProps) {
  const [positions, setPositions] = useState<PortfolioPosition[]>([])
  const [watchlistPrices, setWatchlistPrices] = useState<{[key: string]: number}>({})
  const [loading, setLoading] = useState(true)
  const [newSymbol, setNewSymbol] = useState('')
  const [showAddPosition, setShowAddPosition] = useState(false)
  const [newPosition, setNewPosition] = useState({ symbol: '', shares: '', avgPrice: '' })

  // Mock portfolio positions (in a real app, this would come from a backend)
  const mockPositions: PortfolioPosition[] = [
    { symbol: 'AAPL', shares: 50, avgPrice: 150.00, currentPrice: 0, totalValue: 0, gainLoss: 0, gainLossPercent: 0 },
    { symbol: 'GOOGL', shares: 10, avgPrice: 2800.00, currentPrice: 0, totalValue: 0, gainLoss: 0, gainLossPercent: 0 },
    { symbol: 'MSFT', shares: 25, avgPrice: 300.00, currentPrice: 0, totalValue: 0, gainLoss: 0, gainLossPercent: 0 },
    { symbol: 'TSLA', shares: 15, avgPrice: 800.00, currentPrice: 0, totalValue: 0, gainLoss: 0, gainLossPercent: 0 }
  ]

  useEffect(() => {
    const fetchPricesAndCalculatePositions = async () => {
      try {
        setLoading(true)
        
        // Fetch current prices for positions
        const positionsWithPrices = await Promise.all(
          mockPositions.map(async (position) => {
            try {
              const priceData = await marketDataAPI.getStockPrice(position.symbol)
              const currentPrice = priceData.price || position.avgPrice
              const totalValue = position.shares * currentPrice
              const gainLoss = totalValue - (position.shares * position.avgPrice)
              const gainLossPercent = ((currentPrice - position.avgPrice) / position.avgPrice) * 100

              return {
                ...position,
                currentPrice,
                totalValue,
                gainLoss,
                gainLossPercent
              }
            } catch (error) {
              return {
                ...position,
                currentPrice: position.avgPrice,
                totalValue: position.shares * position.avgPrice,
                gainLoss: 0,
                gainLossPercent: 0
              }
            }
          })
        )

        setPositions(positionsWithPrices)

        // Fetch prices for watchlist
        const prices: {[key: string]: number} = {}
        await Promise.all(
          watchlist.map(async (symbol) => {
            try {
              const priceData = await marketDataAPI.getStockPrice(symbol)
              prices[symbol] = priceData.price || 0
            } catch (error) {
              prices[symbol] = 0
            }
          })
        )
        setWatchlistPrices(prices)

      } catch (error) {
        console.error('Error fetching portfolio data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPricesAndCalculatePositions()
  }, [watchlist])

  const addToWatchlist = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSymbol.trim() && !watchlist.includes(newSymbol.toUpperCase())) {
      onAddToWatchlist(newSymbol.toUpperCase())
      setNewSymbol('')
    }
  }

  const addPosition = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPosition.symbol && newPosition.shares && newPosition.avgPrice) {
      // In a real app, this would save to backend
      console.log('Adding position:', newPosition)
      setNewPosition({ symbol: '', shares: '', avgPrice: '' })
      setShowAddPosition(false)
    }
  }

  const totalPortfolioValue = positions.reduce((sum, pos) => sum + pos.totalValue, 0)
  const totalGainLoss = positions.reduce((sum, pos) => sum + pos.gainLoss, 0)
  const totalInvested = positions.reduce((sum, pos) => sum + (pos.shares * pos.avgPrice), 0)
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Portfolio Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5" />
            <span>Portfolio Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-500">Total Value</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalPortfolioValue)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500">Total Gain/Loss</div>
              <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500">Total Return</div>
              <div className={`text-2xl font-bold ${totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(totalGainLossPercent)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500">Positions</div>
              <div className="text-2xl font-bold text-gray-700">
                {positions.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Positions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Positions</span>
            </CardTitle>
            <button
              onClick={() => setShowAddPosition(!showAddPosition)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 inline mr-1" />
              Add Position
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddPosition && (
            <form onSubmit={addPosition} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Symbol (e.g. AAPL)"
                  value={newPosition.symbol}
                  onChange={(e) => setNewPosition({...newPosition, symbol: e.target.value.toUpperCase()})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="number"
                  placeholder="Shares"
                  value={newPosition.shares}
                  onChange={(e) => setNewPosition({...newPosition, shares: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Avg Price"
                  value={newPosition.avgPrice}
                  onChange={(e) => setNewPosition({...newPosition, avgPrice: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="mt-3 flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                  Add Position
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPosition(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading positions...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {positions.map((position) => (
                <div
                  key={position.symbol}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => onSymbolSelect(position.symbol)}
                >
                  <div className="flex-1">
                    <div className="font-medium text-lg">{position.symbol}</div>
                    <div className="text-sm text-gray-600">
                      {position.shares} shares @ {formatCurrency(position.avgPrice)}
                    </div>
                  </div>
                  
                  <div className="text-center px-4">
                    <div className="font-medium">{formatCurrency(position.currentPrice)}</div>
                    <div className="text-sm text-gray-600">Current Price</div>
                  </div>
                  
                  <div className="text-center px-4">
                    <div className="font-medium">{formatCurrency(position.totalValue)}</div>
                    <div className="text-sm text-gray-600">Market Value</div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-medium ${position.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {position.gainLoss >= 0 ? '+' : ''}{formatCurrency(position.gainLoss)}
                    </div>
                    <div className={`text-sm ${position.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(position.gainLossPercent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Watchlist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Watchlist</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addToWatchlist} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add symbol to watchlist"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </form>
          
          <div className="space-y-2">
            {watchlist.map((symbol) => (
              <div
                key={symbol}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => onSymbolSelect(symbol)}
              >
                <div className="flex-1">
                  <span className="font-medium text-lg">{symbol}</span>
                </div>
                
                <div className="text-center px-4">
                  <div className="font-medium">
                    {watchlistPrices[symbol] ? formatCurrency(watchlistPrices[symbol]) : '--'}
                  </div>
                  <div className="text-sm text-gray-600">Price</div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!positions.some(p => p.symbol === symbol)) {
                        setNewPosition({...newPosition, symbol})
                        setShowAddPosition(true)
                      }
                    }}
                    className="p-1 text-green-600 hover:text-green-800"
                    title="Add to Portfolio"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveFromWatchlist(symbol)
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Remove from Watchlist"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Portfolio Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {positions
              .filter(p => Math.abs(p.gainLossPercent) > 5)
              .map(position => (
                <div
                  key={position.symbol}
                  className={`p-3 rounded-lg border-l-4 ${
                    position.gainLossPercent > 5 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{position.symbol}</div>
                      <div className="text-sm text-gray-600">
                        {position.gainLossPercent > 5 ? 'Strong Performer' : 'Significant Loss'}
                      </div>
                    </div>
                    <div className={`font-bold ${position.gainLossPercent > 5 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(position.gainLossPercent)}
                    </div>
                  </div>
                </div>
              ))
            }
            
            {positions.filter(p => Math.abs(p.gainLossPercent) > 5).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No significant alerts for your portfolio
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Portfolio
