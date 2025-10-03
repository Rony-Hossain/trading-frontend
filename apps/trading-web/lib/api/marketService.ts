/**
 * Market Service - API client for market data
 */
import { apiClient, wsClient } from './client'
import { Quote, OHLCV, Position, Order } from '../stores/marketStore'

export interface QuoteResponse {
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

export interface HistoricalDataRequest {
  symbol: string
  timeframe: string
  start?: number
  end?: number
  limit?: number
}

export interface HistoricalDataResponse {
  symbol: string
  timeframe: string
  bars: OHLCV[]
}

export class MarketService {
  /**
   * Get current quote for a symbol
   */
  async getQuote(symbol: string): Promise<Quote> {
    return apiClient.get<Quote>(`/api/market/quote/${symbol}`)
  }

  /**
   * Get quotes for multiple symbols
   */
  async getQuotes(symbols: string[]): Promise<Quote[]> {
    return apiClient.post<Quote[]>('/api/market/quotes', { symbols })
  }

  /**
   * Get historical OHLCV data
   */
  async getHistoricalData(
    request: HistoricalDataRequest
  ): Promise<HistoricalDataResponse> {
    const params = new URLSearchParams({
      timeframe: request.timeframe,
      ...(request.start && { start: request.start.toString() }),
      ...(request.end && { end: request.end.toString() }),
      ...(request.limit && { limit: request.limit.toString() }),
    })

    return apiClient.get<HistoricalDataResponse>(
      `/api/market/historical/${request.symbol}?${params}`
    )
  }

  /**
   * Search for symbols
   */
  async searchSymbols(query: string): Promise<
    Array<{
      symbol: string
      name: string
      exchange: string
      type: string
    }>
  > {
    return apiClient.get(`/api/market/search?q=${encodeURIComponent(query)}`)
  }

  /**
   * Subscribe to real-time quotes
   */
  subscribeToQuotes(symbols: string[], onUpdate: (quote: Quote) => void) {
    symbols.forEach((symbol) => {
      wsClient.subscribe(`quote.${symbol}`, onUpdate)
    })
  }

  /**
   * Unsubscribe from real-time quotes
   */
  unsubscribeFromQuotes(symbols: string[], onUpdate: (quote: Quote) => void) {
    symbols.forEach((symbol) => {
      wsClient.unsubscribe(`quote.${symbol}`, onUpdate)
    })
  }

  /**
   * Get account positions
   */
  async getPositions(): Promise<Position[]> {
    return apiClient.get<Position[]>('/api/portfolio/positions')
  }

  /**
   * Get open orders
   */
  async getOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>('/api/orders')
  }

  /**
   * Place a new order
   */
  async placeOrder(order: {
    symbol: string
    type: 'market' | 'limit' | 'stop' | 'stop-limit'
    side: 'buy' | 'sell'
    quantity: number
    price?: number
    stopPrice?: number
  }): Promise<Order> {
    return apiClient.post<Order>('/api/orders', order)
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<void> {
    return apiClient.delete(`/api/orders/${orderId}`)
  }

  /**
   * Get account balance
   */
  async getAccountBalance(): Promise<{
    balance: number
    buyingPower: number
    equity: number
  }> {
    return apiClient.get('/api/account/balance')
  }
}

export const marketService = new MarketService()
