import axios from 'axios'
import { REALTIME_BUDGETS } from '@/lib/performance/budgets'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'
import { notifyRateLimitHit, clearRateLimit } from '@/lib/network/status'

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

function parseRetryAfter(header?: string | null): Date | undefined {
  if (!header) return undefined
  const numeric = Number(header)
  if (!Number.isNaN(numeric)) {
    return new Date(Date.now() + numeric * 1000)
  }
  const date = new Date(header)
  if (!Number.isNaN(date.getTime())) {
    return date
  }
  return undefined
}

marketDataClient.interceptors.response.use(
  (response) => {
    clearRateLimit('market-data')
    return response
  },
  (error) => {
    if (error?.response?.status === 429) {
      const headers = error.response.headers || {}
      notifyRateLimitHit({
        source: 'market-data',
        retryAt: parseRetryAfter(headers['retry-after'] ?? headers['Retry-After']),
        limit: Number(headers['x-ratelimit-limit']) || undefined,
        remaining: Number(headers['x-ratelimit-remaining']) || undefined,
        message: error.response.data?.message,
      })
    }
    return Promise.reject(error)
  }
)

analysisClient.interceptors.response.use(
  (response) => {
    clearRateLimit('analysis')
    return response
  },
  (error) => {
    if (error?.response?.status === 429) {
      const headers = error.response.headers || {}
      notifyRateLimitHit({
        source: 'analysis',
        retryAt: parseRetryAfter(headers['retry-after'] ?? headers['Retry-After']),
        limit: Number(headers['x-ratelimit-limit']) || undefined,
        remaining: Number(headers['x-ratelimit-remaining']) || undefined,
        message: error.response.data?.message,
      })
    }
    return Promise.reject(error)
  }
)

// Types
export interface StockPrice {
  symbol: string
  price: number
  change: number
  change_percent: number
  volume: number
  timestamp: string
  high?: number
  low?: number
  open?: number
  previous_close?: number
  source?: string
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
  analysis_timestamp: string
  realtime_data: {
    symbol: string
    current_price: number
    timestamp: string
    source: string
    price_change_5d: number
    volatility_5d: number
    avg_volume_5d: number
  }
  quick_technical: {
    current_price: number
    price_change_1d: number
    price_change_5d: number
    volume_ratio: number
    volatility_20d: number
  }
  market_status: {
    momentum: string
    direction: string
    status: string
  }
}

export interface ForecastData {
  symbol: string
  predictions: number[]
  dates: string[]
  current_price: number
  model_type: string
  price_analysis?: {
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
    const response = await marketDataClient.get(`/stocks/${symbol}/price`)
    return response.data
  },

  // Get historical data
  getHistoricalData: async (symbol: string, period: string = '1y'): Promise<HistoricalData[]> => {
    const response = await marketDataClient.get(`/stocks/${symbol}/history?period=${period}`)
    return response.data.data
  },

  // Get intraday data (1-minute bars)
  getIntradayData: async (symbol: string, interval: string = '1m'): Promise<HistoricalData[]> => {
    const response = await marketDataClient.get(`/stocks/${symbol}/intraday?interval=${interval}`)
    if (response.data.data) {
      return response.data.data.map((item: any) => ({
        date: item.timestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      }))
    }
    return []
  },

  // Get multiple stock prices
  getMultipleStocks: async (symbols: string[]): Promise<Record<string, StockPrice>> => {
    const requests = symbols.map(symbol => marketDataClient.get(`/stocks/${symbol}/price`))
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
  },

  // Alert Engine API calls
  createAlertRule: async (symbol: string, alertType: string, condition: string, threshold: number, cooldownMinutes: number = 5) => {
    const response = await marketDataClient.post('/alerts/rules', {
      symbol,
      alert_type: alertType,
      condition,
      threshold,
      cooldown_minutes: cooldownMinutes
    })
    return response.data
  },

  getAlertRules: async (symbol: string) => {
    const response = await marketDataClient.get(`/alerts/rules/${symbol}`)
    return response.data
  },

  deleteAlertRule: async (ruleId: string) => {
    const response = await marketDataClient.delete(`/alerts/rules/${ruleId}`)
    return response.data
  },

  getAlertTriggers: async (limit: number = 50) => {
    const response = await marketDataClient.get(`/alerts/triggers?limit=${limit}`)
    return response.data
  },

  getAlertStats: async () => {
    const response = await marketDataClient.get('/alerts/stats')
    return response.data
  }
}

// Analysis API calls
export const analysisAPI = {
  // Get comprehensive technical analysis
  getTechnicalAnalysis: async (symbol: string, period: string = '6mo'): Promise<TechnicalAnalysis> => {
    const response = await analysisClient.get(`/analyze/${symbol}/quick`)
    return response.data
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

type RealtimeCallback = (data: StockPrice) => void
type TimeoutHandle = ReturnType<typeof setTimeout>

export interface RealtimeSubscriptionOptions {
  mode?: 'beginner' | 'expert'
  throttleMs?: number
  dropStrategy?: 'drop-oldest' | 'drop-latest'
}

interface SubscriptionState {
  options: Required<Pick<RealtimeSubscriptionOptions, 'mode' | 'throttleMs' | 'dropStrategy'>>
  lastEmit: number
  pending: StockPrice | null
  timeout: TimeoutHandle | null
  dropped: number
  reported: boolean
}

// WebSocket for real-time updates
export class RealTimeData {
  private subscribers: Map<string, Set<RealtimeCallback>> = new Map()
  private subscriberState: Map<string, Map<RealtimeCallback, SubscriptionState>> = new Map()
  private sockets: Map<string, WebSocket> = new Map()
  private pollers: Map<string, any> = new Map()

  private wsUrlFor(symbol: string) {
    const base = MARKET_DATA_API
    const wsBase = base.startsWith('https') ? base.replace('https', 'wss') : base.replace('http', 'ws')
    return `${wsBase}/ws/${encodeURIComponent(symbol)}`
  }

  subscribe(symbol: string, callback: RealtimeCallback, options: RealtimeSubscriptionOptions = {}) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set())
    }
    this.subscribers.get(symbol)!.add(callback)

    if (!this.subscriberState.has(symbol)) {
      this.subscriberState.set(symbol, new Map())
    }

    const mode = options.mode ?? 'beginner'
    const budgets = REALTIME_BUDGETS[mode]
    const throttleMs = options.throttleMs ?? budgets.max_update_rate_ms
    const dropStrategy = options.dropStrategy ?? 'drop-oldest'

    this.subscriberState.get(symbol)!.set(callback, {
      options: { mode, throttleMs, dropStrategy },
      lastEmit: 0,
      pending: null,
      timeout: null,
      dropped: 0,
      reported: false,
    })

    if (this.sockets.has(symbol) || this.pollers.has(symbol)) return

    try {
      const url = this.wsUrlFor(symbol)
      const ws = new WebSocket(url)
      this.sockets.set(symbol, ws)

      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data)
          this.dispatchTick(symbol, data)
        } catch {}
      }
      ws.onerror = () => {
        this.startPolling(symbol)
      }
      ws.onclose = () => {
        if ((this.subscribers.get(symbol)?.size || 0) > 0) {
          this.startPolling(symbol)
        }
        this.sockets.delete(symbol)
      }
    } catch {
      this.startPolling(symbol)
    }
  }

  private dispatchTick(symbol: string, data: StockPrice) {
    const callbacks = this.subscribers.get(symbol)
    if (!callbacks) return
    callbacks.forEach((callback) => this.emitToSubscriber(symbol, callback, data))
  }

  private emitToSubscriber(symbol: string, callback: RealtimeCallback, data: StockPrice) {
    const state = this.subscriberState.get(symbol)?.get(callback)
    if (!state) {
      callback(data)
      return
    }

    const now = Date.now()
    const elapsed = now - state.lastEmit

    if (elapsed >= state.options.throttleMs) {
      this.flushNow(symbol, callback, data, state, now)
      return
    }

    // Apply backpressure policy: keep latest tick and drop older ones
    if (state.options.dropStrategy === 'drop-oldest') {
      state.pending = data
    } else if (!state.pending) {
      state.pending = data
    }

    state.dropped += 1
    if (!state.reported) {
      trackEvent({
        category: TelemetryCategory.PERFORMANCE,
        action: 'realtime_throttled',
        max_points_exceeded: false,
        update_rate_ms: state.options.throttleMs,
        dropped_updates: state.dropped,
      })
      state.reported = true
    }

    if (!state.timeout) {
      const delay = Math.max(0, state.options.throttleMs - elapsed)
      state.timeout = setTimeout(() => this.flushPending(symbol, callback), delay)
    }
  }

  private flushPending(symbol: string, callback: RealtimeCallback) {
    const state = this.subscriberState.get(symbol)?.get(callback)
    if (!state) return

    const pending = state.pending
    state.timeout = null
    state.pending = null
    if (!pending) return

    this.flushNow(symbol, callback, pending, state, Date.now())
  }

  private flushNow(
    symbol: string,
    callback: RealtimeCallback,
    data: StockPrice,
    state: SubscriptionState,
    timestamp: number
  ) {
    state.lastEmit = timestamp
    if (state.timeout) {
      clearTimeout(state.timeout)
      state.timeout = null
    }
    state.pending = null
    callback(data)
  }

  unsubscribe(symbol: string, callback: RealtimeCallback) {
    const set = this.subscribers.get(symbol)
    if (!set) return
    set.delete(callback)

    const stateMap = this.subscriberState.get(symbol)
    const state = stateMap?.get(callback)
    if (state) {
      if (state.timeout) {
        clearTimeout(state.timeout)
      }
      stateMap?.delete(callback)
    }

    if (set.size === 0) {
      const ws = this.sockets.get(symbol)
      if (ws) {
        try { ws.close() } catch {}
        this.sockets.delete(symbol)
      }
      const poll = this.pollers.get(symbol)
      if (poll) {
        clearInterval(poll)
        this.pollers.delete(symbol)
      }
      if (stateMap) {
        stateMap.clear()
        this.subscriberState.delete(symbol)
      }
    }
  }

  private startPolling(symbol: string) {
    if (this.pollers.has(symbol)) return
    const pollInterval = setInterval(async () => {
      try {
        const data = await marketDataAPI.getStockPrice(symbol)
        this.dispatchTick(symbol, data)
      } catch {}
    }, 5000)
    this.pollers.set(symbol, pollInterval)
  }

  disconnectAll() {
    this.sockets.forEach(ws => { try { ws.close() } catch {} })
    this.sockets.clear()
    this.pollers.forEach(id => clearInterval(id))
    this.pollers.clear()
    this.subscriberState.forEach((map) => {
      map.forEach((state) => {
        if (state.timeout) {
          clearTimeout(state.timeout)
        }
      })
      map.clear()
    })
    this.subscriberState.clear()
    this.subscribers.clear()
  }
}

// Export singleton instance
export const realTimeData = new RealTimeData()
