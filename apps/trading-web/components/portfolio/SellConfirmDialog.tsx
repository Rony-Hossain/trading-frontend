'use client'

/**
 * SellConfirmDialog - Confirmation modal for selling a position
 * Phase 3: Portfolio & Journal
 */

import { useState } from 'react'
import { Position } from '@/lib/types/contracts'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { X, TrendingDown, TrendingUp, AlertTriangle, Shield } from 'lucide-react'

interface SellConfirmDialogProps {
  position: Position | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (symbol: string, shares: number) => Promise<void>
  isPaperTrade?: boolean
}

export function SellConfirmDialog({
  position,
  isOpen,
  onClose,
  onConfirm,
  isPaperTrade = true,
}: SellConfirmDialogProps) {
  const [sharesToSell, setSharesToSell] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !position) return null

  const shares = parseInt(sharesToSell) || position.shares
  const isSellAll = shares === position.shares
  const estimatedProceeds = position.currentPrice * shares
  const estimatedPnL = (position.currentPrice - position.entryPrice) * shares
  const estimatedPnLPct = ((position.currentPrice - position.entryPrice) / position.entryPrice) * 100
  const isProfitable = estimatedPnL >= 0

  const handleSubmit = async () => {
    if (!sharesToSell) {
      setError('Please enter number of shares to sell')
      return
    }

    const value = parseInt(sharesToSell)
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid number of shares')
      return
    }

    if (value > position.shares) {
      setError(`You only have ${position.shares} shares`)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onConfirm(position.symbol, value)
      onClose()
      setSharesToSell('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sell position')
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
            <TrendingDown className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sell Position
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
              <span className="text-sm text-gray-600">Shares Owned</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {position.shares}
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
          </div>

          {/* Input */}
          <div>
            <label
              htmlFor="shares-to-sell"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Shares to Sell
            </label>
            <input
              id="shares-to-sell"
              type="number"
              step="1"
              min="1"
              max={position.shares}
              value={sharesToSell}
              onChange={(e) => {
                setSharesToSell(e.target.value)
                setError(null)
              }}
              placeholder={position.shares.toString()}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={() => setSharesToSell(position.shares.toString())}
              className="text-xs text-blue-600 hover:text-blue-700 mt-1"
            >
              Sell all {position.shares} shares
            </button>
          </div>

          {/* Transaction Preview */}
          {sharesToSell && (
            <div
              className={`p-3 rounded-lg border ${
                isProfitable
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isProfitable ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Transaction Preview
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Estimated Proceeds</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(estimatedProceeds)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Estimated P&L</span>
                  <span
                    className={`font-medium ${
                      isProfitable ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isProfitable ? '+' : ''}
                    {formatCurrency(estimatedPnL)} ({formatPercentage(estimatedPnLPct)})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {!isProfitable && sharesToSell && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  Selling at a Loss
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  This sale will realize a loss of {formatCurrency(Math.abs(estimatedPnL))}.
                  Consider waiting if conditions may improve.
                </p>
              </div>
            </div>
          )}

          {isSellAll && sharesToSell && (
            <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                You are selling your entire position. This action will close the position.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-900 dark:text-red-200">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !sharesToSell}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Selling...
              </>
            ) : (
              'Confirm Sale'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
