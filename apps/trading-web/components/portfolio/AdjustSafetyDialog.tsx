'use client'

/**
 * AdjustSafetyDialog - Modal for adjusting position safety line
 * Phase 3: Portfolio & Journal
 */

import { useState } from 'react'
import { Position } from '@/lib/types/contracts'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { X, AlertTriangle, Shield, TrendingDown } from 'lucide-react'

interface AdjustSafetyDialogProps {
  position: Position | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (symbol: string, newSafetyLine: number) => Promise<void>
  isPaperTrade?: boolean
}

export function AdjustSafetyDialog({
  position,
  isOpen,
  onClose,
  onConfirm,
  isPaperTrade = true,
}: AdjustSafetyDialogProps) {
  const [newSafetyLine, setNewSafetyLine] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !position) return null

  const safetyLineValue = parseFloat(newSafetyLine) || position.safetyLine
  const newMaxLoss = (position.entryPrice - safetyLineValue) * position.shares
  const lossPercent = ((position.entryPrice - safetyLineValue) / position.entryPrice) * 100
  const currentToSafety = ((position.currentPrice - safetyLineValue) / position.currentPrice) * 100

  const handleSubmit = async () => {
    if (!newSafetyLine) {
      setError('Please enter a safety line value')
      return
    }

    const value = parseFloat(newSafetyLine)
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid price')
      return
    }

    if (value >= position.currentPrice) {
      setError('Safety line must be below current price')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onConfirm(position.symbol, value)
      onClose()
      setNewSafetyLine('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update safety line')
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
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Adjust Safety Line
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
              <span className="text-sm text-gray-600">Current Safety Line</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(position.safetyLine)}
              </span>
            </div>
          </div>

          {/* Input */}
          <div>
            <label
              htmlFor="safety-line"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              New Safety Line
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="safety-line"
                type="number"
                step="0.01"
                value={newSafetyLine}
                onChange={(e) => {
                  setNewSafetyLine(e.target.value)
                  setError(null)
                }}
                placeholder={position.safetyLine.toFixed(2)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Impact Preview */}
          {newSafetyLine && (
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Distance from Current</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatPercentage(currentToSafety)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Max Loss if Triggered</span>
                <span className="font-medium text-red-600">
                  {formatCurrency(Math.abs(newMaxLoss))}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Loss Percentage</span>
                <span className="font-medium text-red-600">
                  {formatPercentage(lossPercent)}
                </span>
              </div>
            </div>
          )}

          {/* Warning */}
          {lossPercent > 10 && newSafetyLine && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  High Risk Warning
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  This safety line allows for a loss greater than 10%. Consider a tighter stop.
                </p>
              </div>
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
            disabled={isSubmitting || !newSafetyLine}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              'Update Safety Line'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
