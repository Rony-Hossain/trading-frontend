/**
 * Journal Store - Manages trade journal entries
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TradeEntry {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  entryPrice: number
  exitPrice?: number
  entryDate: number
  exitDate?: number
  pnl?: number
  pnlPercent?: number
  fees: number
  status: 'open' | 'closed'
  strategy?: string
  setupType?: string
  notes?: string
  screenshots?: string[]
  tags?: string[]
  emotions?: string[]
  mistakes?: string[]
  lessons?: string
}

export interface JournalStats {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalPnl: number
  averageWin: number
  averageLoss: number
  profitFactor: number
  largestWin: number
  largestLoss: number
  averageHoldingTime: number // minutes
  bestDay: { date: string; pnl: number }
  worstDay: { date: string; pnl: number }
}

interface JournalState {
  // Trades
  trades: TradeEntry[]
  selectedTradeId: string | null

  // Filters
  filterSymbol: string | null
  filterStrategy: string | null
  filterDateRange: { start: number; end: number } | null

  // Actions - Trades
  addTrade: (trade: Omit<TradeEntry, 'id'>) => void
  updateTrade: (id: string, updates: Partial<TradeEntry>) => void
  deleteTrade: (id: string) => void
  closeTrade: (id: string, exitPrice: number, exitDate: number) => void
  selectTrade: (id: string | null) => void

  // Actions - Filters
  setFilterSymbol: (symbol: string | null) => void
  setFilterStrategy: (strategy: string | null) => void
  setFilterDateRange: (range: { start: number; end: number } | null) => void
  clearFilters: () => void

  // Getters
  getFilteredTrades: () => TradeEntry[]
  getStats: () => JournalStats
  getOpenTrades: () => TradeEntry[]
  getClosedTrades: () => TradeEntry[]
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      // Initial state
      trades: [],
      selectedTradeId: null,
      filterSymbol: null,
      filterStrategy: null,
      filterDateRange: null,

      // Trade actions
      addTrade: (tradeData) => {
        const trade: TradeEntry = {
          ...tradeData,
          id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }
        set((state) => ({
          trades: [...state.trades, trade],
        }))
      },

      updateTrade: (id, updates) => {
        set((state) => ({
          trades: state.trades.map((trade) =>
            trade.id === id ? { ...trade, ...updates } : trade
          ),
        }))
      },

      deleteTrade: (id) => {
        set((state) => ({
          trades: state.trades.filter((trade) => trade.id !== id),
        }))
      },

      closeTrade: (id, exitPrice, exitDate) => {
        const trade = get().trades.find((t) => t.id === id)
        if (!trade) return

        const pnl =
          trade.side === 'buy'
            ? (exitPrice - trade.entryPrice) * trade.quantity - trade.fees
            : (trade.entryPrice - exitPrice) * trade.quantity - trade.fees

        const pnlPercent =
          trade.side === 'buy'
            ? ((exitPrice - trade.entryPrice) / trade.entryPrice) * 100
            : ((trade.entryPrice - exitPrice) / trade.entryPrice) * 100

        get().updateTrade(id, {
          exitPrice,
          exitDate,
          pnl,
          pnlPercent,
          status: 'closed',
        })
      },

      selectTrade: (id) => {
        set({ selectedTradeId: id })
      },

      // Filter actions
      setFilterSymbol: (symbol) => {
        set({ filterSymbol: symbol })
      },

      setFilterStrategy: (strategy) => {
        set({ filterStrategy: strategy })
      },

      setFilterDateRange: (range) => {
        set({ filterDateRange: range })
      },

      clearFilters: () => {
        set({
          filterSymbol: null,
          filterStrategy: null,
          filterDateRange: null,
        })
      },

      // Getters
      getFilteredTrades: () => {
        const { trades, filterSymbol, filterStrategy, filterDateRange } = get()

        return trades.filter((trade) => {
          if (filterSymbol && trade.symbol !== filterSymbol) return false
          if (filterStrategy && trade.strategy !== filterStrategy) return false
          if (filterDateRange) {
            if (
              trade.entryDate < filterDateRange.start ||
              trade.entryDate > filterDateRange.end
            ) {
              return false
            }
          }
          return true
        })
      },

      getStats: () => {
        const trades = get().getClosedTrades()

        if (trades.length === 0) {
          return {
            totalTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            winRate: 0,
            totalPnl: 0,
            averageWin: 0,
            averageLoss: 0,
            profitFactor: 0,
            largestWin: 0,
            largestLoss: 0,
            averageHoldingTime: 0,
            bestDay: { date: '', pnl: 0 },
            worstDay: { date: '', pnl: 0 },
          }
        }

        const winningTrades = trades.filter((t) => (t.pnl || 0) > 0)
        const losingTrades = trades.filter((t) => (t.pnl || 0) < 0)

        const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0)
        const totalWins = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0)
        const totalLosses = Math.abs(
          losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0)
        )

        const averageWin =
          winningTrades.length > 0 ? totalWins / winningTrades.length : 0
        const averageLoss =
          losingTrades.length > 0 ? totalLosses / losingTrades.length : 0

        const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0

        const largestWin = Math.max(
          ...winningTrades.map((t) => t.pnl || 0),
          0
        )
        const largestLoss = Math.min(
          ...losingTrades.map((t) => t.pnl || 0),
          0
        )

        const holdingTimes = trades
          .filter((t) => t.exitDate)
          .map((t) => (t.exitDate! - t.entryDate) / 60000) // minutes

        const averageHoldingTime =
          holdingTimes.length > 0
            ? holdingTimes.reduce((sum, t) => sum + t, 0) / holdingTimes.length
            : 0

        // Daily P&L
        const dailyPnl: Record<string, number> = {}
        trades.forEach((trade) => {
          const date = new Date(trade.exitDate || trade.entryDate)
            .toISOString()
            .split('T')[0]
          dailyPnl[date] = (dailyPnl[date] || 0) + (trade.pnl || 0)
        })

        const sortedDays = Object.entries(dailyPnl).sort((a, b) => b[1] - a[1])
        const bestDay = sortedDays[0] || ['', 0]
        const worstDay = sortedDays[sortedDays.length - 1] || ['', 0]

        return {
          totalTrades: trades.length,
          winningTrades: winningTrades.length,
          losingTrades: losingTrades.length,
          winRate: (winningTrades.length / trades.length) * 100,
          totalPnl,
          averageWin,
          averageLoss,
          profitFactor,
          largestWin,
          largestLoss,
          averageHoldingTime,
          bestDay: { date: bestDay[0], pnl: bestDay[1] },
          worstDay: { date: worstDay[0], pnl: worstDay[1] },
        }
      },

      getOpenTrades: () => {
        return get().trades.filter((t) => t.status === 'open')
      },

      getClosedTrades: () => {
        return get().trades.filter((t) => t.status === 'closed')
      },
    }),
    {
      name: 'journal-storage',
    }
  )
)
