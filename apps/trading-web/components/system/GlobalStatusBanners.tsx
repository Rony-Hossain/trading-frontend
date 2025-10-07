'use client'

import { useMemo } from 'react'
import { AlertCircle, CloudOff, RefreshCw } from 'lucide-react'
import { getCopy, type CopyMode } from '../../lib/copy/copy-service'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import type { NetworkStatusState } from '../../lib/network/status'
import { formatRelativeTime, formatTime } from '../../lib/i18n/format'

const mode: CopyMode = 'beginner'

function OfflineBanner() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="bg-amber-100 text-amber-900 border-b border-amber-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
        <div className="flex items-center gap-3">
          <CloudOff className="h-5 w-5" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">{getCopy('banner.offline', mode)}</p>
            <p className="text-xs opacity-80">{getCopy('banner.degraded', mode)}</p>
          </div>
        </div>
        <button
          onClick={handleReload}
          className="inline-flex items-center gap-2 rounded-md border border-amber-700/40 bg-white/70 px-3 py-1.5 text-xs font-medium text-amber-900 shadow-sm transition hover:bg-white"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {getCopy('action.retry', mode)}
        </button>
      </div>
    </div>
  )
}

function RateLimitBanner({ status }: { status: NetworkStatusState }) {
  const primary = status.rateLimits[0]
  const relative = useMemo(() => {
    if (!primary?.retryAt) return null
    return formatRelativeTime(primary.retryAt, Date.now())
  }, [primary?.retryAt])

  const absolute = primary?.retryAt ? formatTime(primary.retryAt) : null

  return (
    <div className="bg-blue-100 text-blue-900 border-b border-blue-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">{getCopy('banner.rate_limit', mode)}</p>
            <p className="text-xs opacity-80">
              {getCopy('banner.rate_limit_hint', mode)}
              {relative && (
                <span className="ml-1">
                  ({relative}
                  {absolute ? ` · ${absolute}` : ''})
                </span>
              )}
            </p>
          </div>
        </div>
        {primary?.message && (
          <p className="text-xs font-medium text-blue-800">{primary.message}</p>
        )}
      </div>
    </div>
  )
}

export function GlobalStatusBanners() {
  const status = useNetworkStatus()

  if (status.online && status.rateLimits.length === 0) {
    return null
  }

  return (
    <div className="sticky top-0 z-40">
      {!status.online && <OfflineBanner />}
      {status.rateLimits.length > 0 && <RateLimitBanner status={status} />}
    </div>
  )
}

export default GlobalStatusBanners
