'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StockPrice } from '@/components/StockPrice'
import { StockChart } from '@/components/StockChart'
import { TechnicalAnalysis } from '@/components/TechnicalAnalysis'
import { Search, Star, TrendingUp, Activity, BarChart3 } from 'lucide-react'

interface DashboardProps {
  defaultSymbol?: string
}

export function Dashboard({ defaultSymbol = 'AAPL' }: DashboardProps) {
  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol)
  const [searchQuery, setSearchQuery] = useState('')
  const [watchlist, setWatchlist] = useState(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'])
  const [chartPeriod, setChartPeriod] = useState('1y')

  const handleSymbolChange = (symbol: string) => {
    setSelectedSymbol(symbol)
    setSearchQuery('')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      handleSymbolChange(searchQuery.toUpperCase())
    }
  }

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol])
    }
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(s => s !== symbol))
  }

  const periods = [
    { label: '1D', value: '1d' },
    { label: '5D', value: '5d' },
    { label: '1M', value: '1mo' },
    { label: '3M', value: '3mo' },
    { label: '6M', value: '6mo' },
    { label: '1Y', value: '1y' },
    { label: '2Y', value: '2y' },
    { label: '5Y', value: '5y' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Trading Platform</h1>
              </div>
            </div>
            
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search symbol (e.g., AAPL)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Watchlist */}
          <div className="col-span-12 lg:col-span-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Watchlist</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {watchlist.map((symbol) => (
                    <div
                      key={symbol}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedSymbol === symbol
                          ? 'bg-blue-100 border border-blue-300'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleSymbolChange(symbol)}
                    >
                      <span className="font-medium">{symbol}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFromWatchlist(symbol)
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  
                  {selectedSymbol && !watchlist.includes(selectedSymbol) && (
                    <button
                      onClick={() => addToWatchlist(selectedSymbol)}
                      className="w-full p-2 text-blue-600 hover:text-blue-800 text-sm border border-dashed border-blue-300 rounded-lg"
                    >
                      + Add {selectedSymbol} to Watchlist
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="mt-6 space-y-4">
              <StockPrice symbol={selectedSymbol} />
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            <div className="space-y-6">
              {/* Chart Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Price Chart - {selectedSymbol}</span>
                    </CardTitle>
                    
                    <div className="flex items-center space-x-2">
                      {periods.map((period) => (
                        <button
                          key={period.value}
                          onClick={() => setChartPeriod(period.value)}
                          className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            chartPeriod === period.value
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {period.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <StockChart 
                    symbol={selectedSymbol} 
                    period={chartPeriod}
                    height={400}
                  />
                </CardContent>
              </Card>

              {/* Technical Analysis */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <TechnicalAnalysis symbol={selectedSymbol} period={chartPeriod} />
                
                {/* Placeholder for ML Forecast */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>ML Forecast - {selectedSymbol}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">ML Forecast component coming next</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Market Overview Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500">Market Status</div>
                    <div className="text-2xl font-bold text-green-600">Open</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500">Trading Session</div>
                    <div className="text-2xl font-bold">US Market</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500">Active Symbols</div>
                    <div className="text-2xl font-bold">{watchlist.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500">Current Symbol</div>
                    <div className="text-2xl font-bold text-blue-600">{selectedSymbol}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard