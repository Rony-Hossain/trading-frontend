'use client'

/**
 * SetTargetDialog - Modal for setting price target for a position
 * Phase 3: Portfolio & Journal
 */

import { useState } from 'react'
import { Position } from '@/lib/types/contracts'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { X, Target, TrendingUp, AlertTriangle, Shield } from 'lucide-react'

interface SetTargetDialogProps {
  position: Position | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (symbol: string, targetPrice: number | null) => Promise<void>
  isPaperTrade?: boolean
}

export function SetTargetDialog({
  position,
  isOpen,
  onClose,
  onConfirm,
  isPaperTrade = true,
}: SetTargetDialogProps) {
  const [targetPrice, setTargetPrice] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !position) return null

  const targetValue = parseFloat(targetPrice) || 0
  const potentialProfit = targetValue > 0 ? (targetValue - position.entryPrice) * position.shares : 0
  const profitPercent = targetValue > 0 ? ((targetValue - position.entryPrice) / position.entryPrice) * 100 : 0
  const currentToTarget = targetValue > 0 ? ((targetValue - position.currentPrice) / position.currentPrice) * 100 : 0

  const handleSubmit = async (removeTarget = false) => {
    if (!removeTarget) {
      if (!targetPrice) {
        setError('Please enter a target price')
        return
      }

      const value = parseFloat(targetPrice)
      if (isNaN(value) || value <= 0) {
        setError('Please enter a valid price')
        return
      }

      if (value <= position.currentPrice) {
        setError('Target price should be above current price')
        return
      }
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const targetValue = removeTarget ? null : parseFloat(targetPrice)
      await onConfirm(position.symbol, targetValue)
      onClose()
      setTargetPrice('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set target price')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Set Target Price
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Paper Trade Badge */}
          {isPaperTrade && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Paper Trading Mode
              </span>
            </div>
          )}

          {/* Position Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Symbol</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {position.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Price</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(position.currentPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Entry Price</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(position.entryPrice)}
              </span>
            </div>
            {position.target && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Target</span>
                <span className="text-sm font-medium text-green-600">
                  {formatCurrency(position.target)}
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <div>
            <label
              htmlFor="target-price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Target Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="target-price"
                type="number"
                step="0.01"
                value={targetPrice}
                onChange={(e) => {
                  setTargetPrice(e.target.value)
                  setError(null)
                }}
                placeholder={position.target?.toFixed(2) || (position.currentPrice * 1.1).toFixed(2)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Suggested: {formatCurrency(position.currentPrice * 1.05)} (5% gain) to{' '}
              {formatCurrency(position.currentPrice * 1.2)} (20% gain)
            </p>
          </div>

          {/* Profit Preview */}
          {targetPrice && targetValue > position.currentPrice && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Potential Profit
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Gain from Current</span>
                  <span className="font-medium text-green-600">
                    +{formatPercentage(currentToTarget)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Profit at Target</span>
                  <span className="font-medium text-green-600">
                    +{formatCurrency(potentialProfit)} ({formatPercentage(profitPercent)})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Warning for unrealistic targets */}
          {targetValue > position.currentPrice * 1.5 && targetPrice && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  Ambitious Target
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  This target is {formatPercentage(currentToTarget)} above current price. Make sure
                  this aligns with your analysis.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <TrendingUp className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-900 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-900 dark:text-blue-200">
              Setting a target helps track your profit goals. You'll receive an alert when your
              position reaches the target price.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            {position.target && (
              <button
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Remove Target
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || !targetPrice}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Setting...
                </>
              ) : (
                'Set Target'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
