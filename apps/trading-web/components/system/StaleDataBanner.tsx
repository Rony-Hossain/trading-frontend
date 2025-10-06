'use client'

/**
 * StaleDataBanner - Warning banner for stale data
 * Phase 8: Hardening
 */

import { useState } from 'react'
import { AlertCircle, RefreshCw, X } from 'lucide-react'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'

interface StaleDataBannerProps {
  lastUpdated: Date
  maxAgeSeconds: number
  onRefresh: () => void
  onDismiss?: () => void
}

export function StaleDataBanner({ lastUpdated, maxAgeSeconds, onRefresh, onDismiss }: StaleDataBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  const ageSeconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000)
  const isStale = ageSeconds > maxAgeSeconds

  const handleRefresh = () => {
    trackEvent({
      category: TelemetryCategory.PERFORMANCE,
      action: 'stale_data_refresh',
      age_seconds: ageSeconds,
    })
    onRefresh()
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
    trackEvent({
      category: TelemetryCategory.PERFORMANCE,
      action: 'stale_data_dismissed',
      age_seconds: ageSeconds,
    })
  }

  if (!isStale || isDismissed) return null

  const minutesAgo = Math.floor(ageSeconds / 60)

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                Data may be stale
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Last updated {minutesAgo} {minutesAgo === 1 ? 'minute' : 'minutes'} ago.
                Click refresh to get the latest information.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            {onDismiss && (
              <button
                onClick={handleDismiss}
                className="p-2 text-yellow-600 hover:text-yellow-700 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
