/**
 * Market Store - Manages market data and real-time updates
 */
import { create } from 'zustand'

export interface Quote {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  previousClose: number
  timestamp: number
}

export interface MarketData {
  symbol: string
  timeframe: string
  bars: OHLCV[]
  lastUpdate: number
}

export interface OHLCV {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Position {
  symbol: string
  quantity: number
  averagePrice: number
  currentPrice: number
  unrealizedPnl: number
  unrealizedPnlPercent: number
  marketValue: number
  costBasis: number
}

export interface Order {
  id: string
  symbol: string
  type: 'market' | 'limit' | 'stop' | 'stop-limit'
  side: 'buy' | 'sell'
  quantity: number
  price?: number
  stopPrice?: number
  status: 'pending' | 'filled' | 'cancelled' | 'rejected'
  filledQuantity: number
  timestamp: number
}

interface MarketState {
  // Watchlist
  watchlist: string[]
  quotes: Record<string, Quote>

  // Chart data
  chartData: Record<string, MarketData>
  activeSymbol: string
  activeTimeframe: string

  // Portfolio
  positions: Position[]
  orders: Order[]
  accountBalance: number
  buyingPower: number

  // WebSocket connection
  isConnected: boolean

  // Actions - Watchlist
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void
  updateQuote: (quote: Quote) => void

  // Actions - Chart
  setActiveSymbol: (symbol: string) => void
  setActiveTimeframe: (timeframe: string) => void
  updateChartData: (symbol: string, timeframe: string, bars: OHLCV[]) => void

  // Actions - Portfolio
  updatePositions: (positions: Position[]) => void
  updateOrders: (orders: Order[]) => void
  updateAccountBalance: (balance: number) => void

  // Actions - WebSocket
  setConnected: (connected: boolean) => void
}

export const useMarketStore = create<MarketState>((set, get) => ({
  // Initial state
  watchlist: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA'],
  quotes: {},
  chartData: {},
  activeSymbol: 'AAPL',
  activeTimeframe: '1D',
  positions: [],
  orders: [],
  accountBalance: 100000,
  buyingPower: 100000,
  isConnected: false,

  // Watchlist actions
  addToWatchlist: (symbol) => {
    const { watchlist } = get()
    if (!watchlist.includes(symbol)) {
      set({ watchlist: [...watchlist, symbol] })
    }
  },

  removeFromWatchlist: (symbol) => {
    const { watchlist } = get()
    set({ watchlist: watchlist.filter((s) => s !== symbol) })
  },

  updateQuote: (quote) => {
    set((state) => ({
      quotes: {
        ...state.quotes,
        [quote.symbol]: quote,
      },
    }))
  },

  // Chart actions
  setActiveSymbol: (symbol) => {
    set({ activeSymbol: symbol })
  },

  setActiveTimeframe: (timeframe) => {
    set({ activeTimeframe: timeframe })
  },

  updateChartData: (symbol, timeframe, bars) => {
    const key = `${symbol}:${timeframe}`
    set((state) => ({
      chartData: {
        ...state.chartData,
        [key]: {
          symbol,
          timeframe,
          bars,
          lastUpdate: Date.now(),
        },
      },
    }))
  },

  // Portfolio actions
  updatePositions: (positions) => {
    set({ positions })
  },

  updateOrders: (orders) => {
    set({ orders })
  },

  updateAccountBalance: (balance) => {
    set({ accountBalance: balance })
  },

  // WebSocket actions
  setConnected: (connected) => {
    set({ isConnected: connected })
  },
}))
