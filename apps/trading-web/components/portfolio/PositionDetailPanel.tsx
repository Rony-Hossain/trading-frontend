'use client'

/**
 * PositionDetailPanel - Detailed view of a single position with action buttons
 * Phase 3: Portfolio & Journal
 */

import { Position } from '@/lib/types/contracts'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { X, TrendingUp, TrendingDown, AlertTriangle, Settings, DollarSign } from 'lucide-react'

interface PositionDetailPanelProps {
  position: Position | null
  onClose: () => void
  onAdjustSafety: (symbol: string) => void
  onSell: (symbol: string) => void
  onSetTarget: (symbol: string) => void
}

export function PositionDetailPanel({
  position,
  onClose,
  onAdjustSafety,
  onSell,
  onSetTarget,
}: PositionDetailPanelProps) {
  if (!position) return null

  const isProfit = position.pnlUsd >= 0
  const isNearStopLoss = position.currentPrice <= position.safetyLine * 1.02
  const potentialLoss = (position.currentPrice - position.safetyLine) * position.shares

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {position.symbol}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Position Summary */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Position Summary
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Shares</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {position.shares}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Entry Price</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(position.entryPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Price</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(position.currentPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* P&L Card */}
        <div
          className={`p-4 rounded-lg ${
            isProfit
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isProfit ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
            <span className="text-sm font-medium text-gray-600">Profit & Loss</span>
          </div>
          <div
            className={`text-2xl font-bold ${
              isProfit ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isProfit ? '+' : ''}
            {formatCurrency(position.pnlUsd)}
          </div>
          <div
            className={`text-sm font-medium ${
              isProfit ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatPercentage(position.pnlPct)}
          </div>
        </div>

        {/* Safety Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Safety & Risk
          </h3>
          {isNearStopLoss && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  Near Safety Line
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Position is within 2% of your safety line
                </p>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Safety Line</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(position.safetyLine)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Max Planned Loss</span>
              <span className="text-sm font-medium text-red-600">
                {formatCurrency(position.maxPlannedLossUsd)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Risk</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(Math.abs(potentialLoss))}
              </span>
            </div>
          </div>
        </div>

        {/* AI Message */}
        {position.message && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-200">{position.message}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onAdjustSafety(position.symbol)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Adjust Safety Line
          </button>

          <button
            onClick={() => onSetTarget(position.symbol)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <DollarSign className="h-4 w-4" />
            Set Target Price
          </button>

          <button
            onClick={() => onSell(position.symbol)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <TrendingDown className="h-4 w-4" />
            Sell Position
          </button>
        </div>
      </div>
    </div>
  )
}
