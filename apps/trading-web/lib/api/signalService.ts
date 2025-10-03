/**
 * Signal Service - API client for trading signals
 */
import { apiClient, wsClient } from './client'

export interface Signal {
  id: string
  symbol: string
  direction: 'buy' | 'sell' | 'neutral'
  confidence: number
  strategy: string
  entryPrice: number
  targetPrice?: number
  stopLoss?: number
  reasoning: string
  timestamp: number
  metadata?: Record<string, any>
}

export interface SignalFilter {
  symbols?: string[]
  strategies?: string[]
  minConfidence?: number
  startDate?: number
  endDate?: number
}

export class SignalService {
  /**
   * Get latest signals
   */
  async getLatestSignals(limit: number = 50): Promise<Signal[]> {
    return apiClient.get<Signal[]>(`/api/signals/latest?limit=${limit}`)
  }

  /**
   * Get signals for a specific symbol
   */
  async getSymbolSignals(symbol: string, limit: number = 20): Promise<Signal[]> {
    return apiClient.get<Signal[]>(`/api/signals/${symbol}?limit=${limit}`)
  }

  /**
   * Get filtered signals
   */
  async getFilteredSignals(filter: SignalFilter): Promise<Signal[]> {
    return apiClient.post<Signal[]>('/api/signals/filter', filter)
  }

  /**
   * Get signal by ID
   */
  async getSignal(id: string): Promise<Signal> {
    return apiClient.get<Signal>(`/api/signals/${id}`)
  }

  /**
   * Subscribe to real-time signals
   */
  subscribeToSignals(onSignal: (signal: Signal) => void) {
    wsClient.subscribe('signals', onSignal)
  }

  /**
   * Unsubscribe from signals
   */
  unsubscribeFromSignals(onSignal: (signal: Signal) => void) {
    wsClient.unsubscribe('signals', onSignal)
  }

  /**
   * Subscribe to signals for specific symbols
   */
  subscribeToSymbolSignals(symbols: string[], onSignal: (signal: Signal) => void) {
    symbols.forEach((symbol) => {
      wsClient.subscribe(`signals.${symbol}`, onSignal)
    })
  }

  /**
   * Get signal performance metrics
   */
  async getSignalPerformance(
    strategy?: string,
    days: number = 30
  ): Promise<{
    totalSignals: number
    winRate: number
    averageReturn: number
    sharpeRatio: number
    maxDrawdown: number
  }> {
    const params = new URLSearchParams({ days: days.toString() })
    if (strategy) params.append('strategy', strategy)

    return apiClient.get(`/api/signals/performance?${params}`)
  }

  /**
   * Get available strategies
   */
  async getStrategies(): Promise<
    Array<{
      id: string
      name: string
      description: string
      winRate: number
      active: boolean
    }>
  > {
    return apiClient.get('/api/signals/strategies')
  }
}

export const signalService = new SignalService()
