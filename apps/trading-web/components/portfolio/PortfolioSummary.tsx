'use client'

/**
 * PortfolioSummary - Displays total portfolio value, P&L, and key metrics
 * Phase 3: Portfolio & Journal
 * Includes cost basis, dividends, and realized/unrealized split
 */

import { useMemo } from 'react'
import { Position } from '@/lib/types/contracts'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, PieChart, Target, BarChart3 } from 'lucide-react'

interface PortfolioSummaryProps {
  positions: Position[]
  cashAvailable: number
  totalValue: number
  totalPnlUsd: number
  totalPnlPct: number
  /** Extended metrics for investment view */
  costBasis?: number
  dividendsYTD?: number
  realizedPnl?: number
  unrealizedPnl?: number
}

export function PortfolioSummary({
  positions,
  cashAvailable,
  totalValue,
  totalPnlUsd,
  totalPnlPct,
  costBasis = 0,
  dividendsYTD = 0,
  realizedPnl = 0,
  unrealizedPnl = 0,
}: PortfolioSummaryProps) {
  const metrics = useMemo(() => {
    const positionValue = totalValue - cashAvailable
    const allocation = totalValue > 0 ? (positionValue / totalValue) * 100 : 0

    return {
      positionValue,
      allocation,
      totalReturn: costBasis > 0 ? ((totalValue - costBasis) / costBasis) * 100 : 0,
    }
  }, [totalValue, cashAvailable, costBasis])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Portfolio Value */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Value</span>
          <PieChart className="h-4 w-4 text-blue-500" />
        </div>
        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
          {formatCurrency(totalValue)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {positions.length} positions · {formatCurrency(cashAvailable)} cash
        </div>
      </div>

      {/* Total P&L */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total P&L</span>
          {totalPnlUsd >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </div>
        <div
          className={`text-2xl font-semibold ${
            totalPnlUsd >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {totalPnlUsd >= 0 ? '+' : ''}
          {formatCurrency(totalPnlUsd)}
        </div>
        <div
          className={`text-xs mt-1 ${
            totalPnlPct >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {formatPercentage(totalPnlPct)}
        </div>
      </div>

      {/* Realized vs Unrealized */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Realized / Unrealized</span>
          <BarChart3 className="h-4 w-4 text-purple-500" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Realized:</span>
            <span
              className={`font-medium ${
                realizedPnl >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {realizedPnl >= 0 ? '+' : ''}
              {formatCurrency(realizedPnl)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Unrealized:</span>
            <span
              className={`font-medium ${
                unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {unrealizedPnl >= 0 ? '+' : ''}
              {formatCurrency(unrealizedPnl)}
            </span>
          </div>
        </div>
      </div>

      {/* Cost Basis & Dividends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Cost Basis & Income</span>
          <DollarSign className="h-4 w-4 text-amber-500" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Cost Basis:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(costBasis)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Dividends YTD:</span>
            <span className="font-medium text-green-600">
              +{formatCurrency(dividendsYTD)}
            </span>
          </div>
        </div>
      </div>

      {/* Allocation Indicator */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 col-span-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Allocation</span>
          <Target className="h-4 w-4 text-indigo-500" />
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(metrics.allocation, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
          <span>Invested: {formatPercentage(metrics.allocation)}</span>
          <span>Cash: {formatPercentage(100 - metrics.allocation)}</span>
        </div>
      </div>
    </div>
  )
}
