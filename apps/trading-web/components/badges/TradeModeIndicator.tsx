'use client'

/**
 * TradeModeIndicator - Displays whether user is in paper or live trading mode
 * Phase 3: Portfolio & Journal
 * Provides clarity on trading mode with prominent display
 */

import { useEffect } from 'react'
import { Shield, AlertCircle } from 'lucide-react'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'

interface TradeModeIndicatorProps {
  isPaperTrade: boolean
  visibility?: 'prominent' | 'subtle'
  page: string
  showWarning?: boolean
}

export function TradeModeIndicator({
  isPaperTrade,
  visibility = 'prominent',
  page,
  showWarning = false,
}: TradeModeIndicatorProps) {
  useEffect(() => {
    // Track when mode indicator is viewed
    trackEvent({
      category: TelemetryCategory.NAVIGATION,
      action: 'trade_mode_indicator_viewed',
      mode: isPaperTrade ? 'paper' : 'live',
      page,
      visibility,
    })
  }, [isPaperTrade, page, visibility])

  if (visibility === 'subtle') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
          isPaperTrade
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
        }`}
      >
        {isPaperTrade ? (
          <>
            <Shield className="h-3 w-3" />
            <span>Paper</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-3 w-3" />
            <span>Live</span>
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border ${
        isPaperTrade
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
      }`}
    >
      {isPaperTrade ? (
        <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-semibold ${
              isPaperTrade
                ? 'text-blue-900 dark:text-blue-200'
                : 'text-amber-900 dark:text-amber-200'
            }`}
          >
            {isPaperTrade ? 'Paper Trading Mode' : 'Live Trading Mode'}
          </span>
        </div>
        <p
          className={`text-xs mt-1 ${
            isPaperTrade
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-amber-700 dark:text-amber-300'
          }`}
        >
          {isPaperTrade
            ? 'All trades are simulated with virtual money. No real money at risk.'
            : 'You are trading with real money. Trades will affect your actual account balance.'}
        </p>
        {showWarning && !isPaperTrade && (
          <p className="text-xs mt-2 font-medium text-amber-900 dark:text-amber-200">
            ⚠️ Double-check all trades before confirming
          </p>
        )}
      </div>
    </div>
  )
}
