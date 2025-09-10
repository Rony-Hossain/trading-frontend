'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { StockPrice } from './StockPrice'
import { StockChart } from './StockChart'
import { TechnicalAnalysis } from './TechnicalAnalysis'
import { TechnicalIndicators } from './TechnicalIndicators'
import { Portfolio } from './Portfolio'
import { AlertsNotifications } from './AlertsNotifications'
import { TradingSignals } from './TradingSignals'
import { marketDataAPI } from '../lib/api'
import { Search, Star, TrendingUp, Activity, BarChart3, LineChart, Briefcase, Bell, Zap, User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { UserProfile } from './auth/UserProfile'

interface DashboardProps {
  defaultSymbol?: string
}

export function Dashboard({ defaultSymbol = 'AAPL' }: DashboardProps) {
  const { user, logout } = useAuth()
  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol)
  const [searchQuery, setSearchQuery] = useState('')
  const [watchlist, setWatchlist] = useState(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'])
  const [chartPeriod, setChartPeriod] = useState('1y')
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'analysis' | 'portfolio' | 'alerts' | 'signals' | 'profile'>('overview')
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [showUserMenu, setShowUserMenu] = useState(false)

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

  // Fetch historical data for technical indicators
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const data = await marketDataAPI.getHistoricalData(selectedSymbol, chartPeriod)
        setHistoricalData(data)
      } catch (error) {
        console.error('Error fetching historical data:', error)
        setHistoricalData([])
      }
    }

    fetchHistoricalData()
  }, [selectedSymbol, chartPeriod])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

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
            
            <div className="flex items-center space-x-4">
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

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    {user?.firstName[0]}{user?.lastName[0]}
                  </div>
                  <span className="text-gray-700 font-medium">{user?.firstName}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('profile')
                        setShowUserMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        logout()
                        setShowUserMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
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
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('technical')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'technical'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LineChart className="h-4 w-4" />
                <span>Technical Analysis</span>
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'analysis'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Activity className="h-4 w-4" />
                <span>Analysis</span>
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'portfolio'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                <span>Portfolio</span>
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'alerts'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Bell className="h-4 w-4" />
                <span>Alerts</span>
              </button>
              <button
                onClick={() => setActiveTab('signals')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'signals'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Zap className="h-4 w-4" />
                <span>Signals</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <>
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
                </>
              )}

              {/* Technical Analysis Tab */}
              {activeTab === 'technical' && (
                <TechnicalIndicators 
                  data={historicalData} 
                  symbol={selectedSymbol} 
                />
              )}

              {/* Analysis Tab */}
              {activeTab === 'analysis' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <TechnicalAnalysis symbol={selectedSymbol} period={chartPeriod} />
                  
                  {/* ML Forecast */}
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
              )}

              {/* Portfolio Tab */}
              {activeTab === 'portfolio' && (
                <Portfolio
                  watchlist={watchlist}
                  onSymbolSelect={handleSymbolChange}
                  onAddToWatchlist={addToWatchlist}
                  onRemoveFromWatchlist={removeFromWatchlist}
                />
              )}

              {/* Alerts Tab */}
              {activeTab === 'alerts' && (
                <AlertsNotifications
                  watchlist={watchlist}
                />
              )}

              {/* Signals Tab */}
              {activeTab === 'signals' && (
                <TradingSignals
                  watchlist={watchlist}
                  onSymbolSelect={handleSymbolChange}
                />
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <UserProfile />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard