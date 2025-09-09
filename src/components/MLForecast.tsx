'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { analysisAPI, ForecastData } from '@/lib/api'
import { formatCurrency, formatPercentage, cn } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Activity, Brain, TrendingUp, TrendingDown, Target, Zap } from 'lucide-react'

interface MLForecastProps {
  symbol: string
  modelType?: 'lstm' | 'random_forest' | 'arima' | 'ensemble'
  horizon?: number
}

export function MLForecast({ symbol, modelType = 'ensemble', horizon = 5 }: MLForecastProps) {
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState(modelType)

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true)
        const data = await analysisAPI.getForecast(symbol, selectedModel, horizon)
        setForecast(data)
        setError(null)
      } catch (err) {
        setError(`Failed to fetch forecast for ${symbol}`)
        console.error('Error fetching ML forecast:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchForecast()
  }, [symbol, selectedModel, horizon])

  const models = [
    { id: 'ensemble', name: 'Ensemble', icon: Brain, description: 'Combined ML models' },
    { id: 'lstm', name: 'LSTM', icon: Activity, description: 'Neural network' },
    { id: 'random_forest', name: 'Random Forest', icon: Target, description: 'Tree-based model' },
    { id: 'arima', name: 'ARIMA', icon: TrendingUp, description: 'Time series model' }
  ]

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>ML Forecast - {symbol}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !forecast) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>ML Forecast - {symbol}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error || 'No forecast available'}</p>
        </CardContent>
      </Card>
    )
  }

  // Prepare chart data
  const chartData = forecast.dates.map((date, index) => ({
    date: new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    predicted: forecast.predictions[index],
    current: index === 0 ? forecast.current_price : null
  }))

  const isUptrend = forecast.trend_forecast.direction === 'bullish'
  const trendColor = isUptrend ? 'text-green-600' : 'text-red-600'
  const trendIcon = isUptrend ? TrendingUp : TrendingDown

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">Predicted: {formatCurrency(data.predicted)}</p>
            {data.current && (
              <p className="text-gray-600">Current: {formatCurrency(data.current)}</p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>ML Forecast - {symbol}</span>
          </CardTitle>
          
          {/* Model Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {models.slice(0, 2).map((model) => {
              const Icon = model.icon
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id as any)}
                  className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-md transition-colors ${
                    selectedModel === model.id 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title={model.description}
                >
                  <Icon className="h-3 w-3" />
                  <span>{model.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Forecast Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Current price reference line */}
              <ReferenceLine 
                y={forecast.current_price} 
                stroke="#6B7280" 
                strokeDasharray="5 5"
                label={{ value: "Current", position: "insideTopRight" }}
              />
              
              {/* Forecast line */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3B82F6' }}
                connectNulls={false}
              />
              
              {/* Current price point */}
              <Line
                type="monotone"
                dataKey="current"
                stroke="#EF4444"
                strokeWidth={0}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Forecast Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-xs text-blue-600 uppercase tracking-wide">Current Price</div>
            <div className="text-lg font-bold text-blue-700">
              {formatCurrency(forecast.current_price)}
            </div>
          </div>
          
          <div className={cn("p-3 rounded-lg", isUptrend ? "bg-green-50" : "bg-red-50")}>
            <div className={cn("text-xs uppercase tracking-wide flex items-center space-x-1", trendColor)}>
              {React.createElement(trendIcon, { className: "h-3 w-3" })}
              <span>Trend</span>
            </div>
            <div className={cn("text-lg font-bold capitalize", trendColor)}>
              {forecast.trend_forecast.direction}
            </div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-xs text-purple-600 uppercase tracking-wide">Confidence</div>
            <div className="text-lg font-bold text-purple-700 capitalize">
              {forecast.trend_forecast.confidence}
            </div>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-xs text-orange-600 uppercase tracking-wide">Model</div>
            <div className="text-lg font-bold text-orange-700 capitalize">
              {forecast.model_type}
            </div>
          </div>
        </div>

        {/* Price Analysis */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Price Analysis</span>
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500">1-Day Expected</div>
              <div className={cn(
                "font-semibold",
                forecast.price_analysis.expected_return_1d >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {formatPercentage(forecast.price_analysis.expected_return_1d)}
              </div>
            </div>
            
            <div>
              <div className="text-gray-500">5-Day Expected</div>
              <div className={cn(
                "font-semibold",
                forecast.price_analysis.expected_return_5d >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {formatPercentage(forecast.price_analysis.expected_return_5d)}
              </div>
            </div>
            
            <div>
              <div className="text-gray-500">Max Expected Gain</div>
              <div className="font-semibold text-green-600">
                {formatPercentage(forecast.price_analysis.max_expected_gain)}
              </div>
            </div>
            
            <div>
              <div className="text-gray-500">Max Expected Loss</div>
              <div className="font-semibold text-red-600">
                {formatPercentage(forecast.price_analysis.max_expected_loss)}
              </div>
            </div>
          </div>
        </div>

        {/* Model Performance Note */}
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
          <div className="flex items-center space-x-1 mb-1">
            <Brain className="h-3 w-3" />
            <span className="font-medium">Model Information:</span>
          </div>
          <p>
            {selectedModel === 'ensemble' && 'Combines LSTM, Random Forest, and ARIMA models for enhanced accuracy.'}
            {selectedModel === 'lstm' && 'Long Short-Term Memory neural network optimized for time series prediction.'}
            {selectedModel === 'random_forest' && 'Ensemble of decision trees using technical indicators and market features.'}
            {selectedModel === 'arima' && 'Autoregressive Integrated Moving Average model for trend analysis.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default MLForecast