'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { marketDataAPI, StockPrice as StockPriceType } from '../lib/api'
import { formatCurrency, formatPercentage, cn } from '../lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StockPriceProps {
  symbol: string
  className?: string
}

export function StockPrice({ symbol, className }: StockPriceProps) {
  const [stockData, setStockData] = useState<StockPriceType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStockPrice = async () => {
      try {
        setLoading(true)
        const data = await marketDataAPI.getStockPrice(symbol)
        setStockData(data)
        setError(null)
      } catch (err) {
        setError(`Failed to fetch data for ${symbol}`)
        console.error('Error fetching stock price:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStockPrice()
    
    // Set up polling for real-time updates every 5 seconds
    const interval = setInterval(fetchStockPrice, 5000)
    
    return () => clearInterval(interval)
  }, [symbol])

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !stockData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm">{error || 'No data available'}</p>
        </CardContent>
      </Card>
    )
  }

  const isPositive = stockData.change >= 0

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{stockData.symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {formatCurrency(stockData.price)}
          </div>
          
          <div className={cn(
            "flex items-center space-x-1 text-sm font-medium",
            isPositive ? "text-green-600" : "text-red-600"
          )}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>
              {isPositive ? '+' : ''}{formatCurrency(stockData.change)}
            </span>
            <span>
              ({formatPercentage(stockData.changePercent)})
            </span>
          </div>
          
          <div className="text-xs text-gray-500">
            Volume: {stockData.volume?.toLocaleString() || 'N/A'}
          </div>
          
          <div className="text-xs text-gray-400">
            Updated: {new Date(stockData.timestamp || Date.now()).toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StockPrice