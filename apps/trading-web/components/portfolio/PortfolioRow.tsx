'use client'

/**
 * PortfolioRow - Single position row in the portfolio list
 * Phase 3: Portfolio & Journal
 */

import { Position } from '@/lib/types/contracts'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { TrendingUp, TrendingDown, AlertTriangle, ChevronRight } from 'lucide-react'

interface PortfolioRowProps {
  position: Position
  onSelect: (symbol: string) => void
}

export function PortfolioRow({ position, onSelect }: PortfolioRowProps) {
  const isProfit = position.pnlUsd >= 0
  const isNearStopLoss = position.currentPrice <= position.safetyLine * 1.02
  const pnlWidth = Math.min(Math.abs(position.pnlPct) * 10, 100)

  return (
    <div
      onClick={() => onSelect(position.symbol)}
      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border border-gray-200 dark:border-gray-700"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(position.symbol)
        }
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {position.symbol}
          </h3>
          {isNearStopLoss && (
            <AlertTriangle className="h-4 w-4 text-amber-500" title="Near safety line" />
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {position.shares} shares @ {formatCurrency(position.entryPrice)}
        </p>
        <p className="text-xs text-gray-500 mt-1">{position.message}</p>
      </div>

      <div className="flex items-center gap-6">
        {/* Current Price */}
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400">Current</div>
          <div className="text-base font-medium text-gray-900 dark:text-white">
            {formatCurrency(position.currentPrice)}
          </div>
        </div>

        {/* Safety Line */}
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400">Safety</div>
          <div className="text-base font-medium text-gray-900 dark:text-white">
            {formatCurrency(position.safetyLine)}
          </div>
        </div>

        {/* P&L */}
        <div className="text-right min-w-[120px]">
          <div className="flex items-center justify-end gap-1 mb-1">
            {isProfit ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={`text-lg font-semibold ${
                isProfit ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isProfit ? '+' : ''}
              {formatCurrency(position.pnlUsd)}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <div
              className={`h-1 rounded-full ${
                isProfit ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${pnlWidth}px` }}
            />
            <span
              className={`text-sm font-medium ${
                isProfit ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatPercentage(position.pnlPct)}
            </span>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  )
}
