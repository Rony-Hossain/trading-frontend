import axios from 'axios'

// API Configuration
const MARKET_DATA_API = process.env.NEXT_PUBLIC_MARKET_DATA_API || 'http://localhost:8002'
const ANALYSIS_API = process.env.NEXT_PUBLIC_ANALYSIS_API || 'http://localhost:8003'

// Create axios instances
const marketDataClient = axios.create({
  baseURL: MARKET_DATA_API,
  timeout: 10000,
})

const analysisClient = axios.create({
  baseURL: ANALYSIS_API,
  timeout: 30000,
})

// Types
export interface StockPrice {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: string
}

export interface HistoricalData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface TechnicalAnalysis {
  symbol: string
  current_price: number
  moving_averages: {
    sma_20?: number
    sma_50?: number
    sma_200?: number
    ema_12?: number
    ema_26?: number
  }
  oscillators: {
    rsi_14?: number
  }
  macd: {
    macd?: number
    signal?: number
    histogram?: number
  }
  signals: {
    overall_signal: string
    strength: number
    individual_signals: Record<string, string>
  }
  patterns?: any
  advanced_indicators?: any
}

export interface ForecastData {
  symbol: string
  predictions: number[]
  dates: string[]
  current_price: number
  model_type: string
  price_analysis: {
    expected_return_1d: number
    expected_return_5d: number
    max_expected_gain: number
    max_expected_loss: number
  }
  trend_forecast: {
    direction: string
    confidence: string
  }
}

// Market Data API calls
export const marketDataAPI = {
  // Get real-time stock price
  getStockPrice: async (symbol: string): Promise<StockPrice> => {
    const response = await marketDataClient.get(`/stocks/${symbol}`)
    return response.data
  },

  // Get historical data
  getHistoricalData: async (symbol: string, period: string = '1y'): Promise<HistoricalData[]> => {
    const response = await marketDataClient.get(`/stocks/${symbol}/history?period=${period}`)
    return response.data.data
  },

  // Get multiple stock prices
  getMultipleStocks: async (symbols: string[]): Promise<Record<string, StockPrice>> => {
    const requests = symbols.map(symbol => marketDataClient.get(`/stocks/${symbol}`))
    const responses = await Promise.allSettled(requests)
    
    const result: Record<string, StockPrice> = {}
    responses.forEach((response, index) => {
      if (response.status === 'fulfilled') {
        result[symbols[index]] = response.value.data
      }
    })
    return result
  },

  // Search stocks
  searchStocks: async (query: string): Promise<any[]> => {
    const response = await marketDataClient.get(`/stocks/search?q=${query}`)
    return response.data
  },

  // Get company profile
  getCompanyProfile: async (symbol: string): Promise<any> => {
    const response = await marketDataClient.get(`/stocks/${symbol}/profile`)
    return response.data
  }
}

// Analysis API calls
export const analysisAPI = {
  // Get comprehensive technical analysis
  getTechnicalAnalysis: async (symbol: string, period: string = '6mo'): Promise<TechnicalAnalysis> => {
    const response = await analysisClient.get(`/analyze/${symbol}?period=${period}`)
    return response.data.technical_analysis
  },

  // Get chart patterns
  getChartPatterns: async (symbol: string, period: string = '3mo'): Promise<any> => {
    const response = await analysisClient.get(`/analyze/${symbol}/patterns?period=${period}`)
    return response.data.patterns
  },

  // Get advanced indicators
  getAdvancedIndicators: async (symbol: string, indicators: string[], period: string = '6mo'): Promise<any> => {
    const indicatorParams = indicators.join(',')
    const response = await analysisClient.get(`/analyze/${symbol}/advanced?period=${period}&indicators=${indicatorParams}`)
    return response.data.advanced_indicators
  },

  // Get ML forecast
  getForecast: async (symbol: string, modelType: string = 'ensemble', horizon: number = 5): Promise<ForecastData> => {
    const response = await analysisClient.get(`/forecast/${symbol}?model_type=${modelType}&horizon=${horizon}`)
    return response.data
  },

  // Get comprehensive analysis
  getComprehensiveAnalysis: async (symbol: string, period: string = '6mo'): Promise<any> => {
    const response = await analysisClient.get(`/analyze/${symbol}/comprehensive?period=${period}`)
    return response.data
  },

  // Get batch analysis for multiple symbols
  getBatchAnalysis: async (symbols: string[]): Promise<any> => {
    const response = await analysisClient.post('/analyze/batch', { symbols })
    return response.data
  }
}

// WebSocket for real-time updates
export class RealTimeData {
  private ws: WebSocket | null = null
  private subscribers: Map<string, Set<(data: any) => void>> = new Map()

  connect() {
    // Note: WebSocket implementation depends on your backend setup
    // For now, we'll use polling as a fallback
    console.log('WebSocket connection would be established here')
  }

  subscribe(symbol: string, callback: (data: StockPrice) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set())
    }
    this.subscribers.get(symbol)!.add(callback)

    // Start polling for this symbol (fallback until WebSocket is implemented)
    this.startPolling(symbol)
  }

  unsubscribe(symbol: string, callback: (data: StockPrice) => void) {
    this.subscribers.get(symbol)?.delete(callback)
  }

  private startPolling(symbol: string) {
    // Poll every 5 seconds for real-time updates
    const pollInterval = setInterval(async () => {
      try {
        const data = await marketDataAPI.getStockPrice(symbol)
        const callbacks = this.subscribers.get(symbol)
        callbacks?.forEach(callback => callback(data))
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 5000)

    // Store interval ID for cleanup
    // In a real implementation, you'd want to manage these intervals better
  }

  disconnect() {
    this.ws?.close()
    this.subscribers.clear()
  }
}

// Export singleton instance
export const realTimeData = new RealTimeData()