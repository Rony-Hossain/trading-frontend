'use client'

import { useEffect } from 'react'
import { launchKpiTracker } from '../../lib/analytics/launch-kpi-tracker'
import { scheduleLaunchReview, trackLaunchKpiSnapshot } from '../../lib/telemetry/taxonomy'

const REVIEW_STORAGE_KEY = 'launch-review-scheduled'

export function LaunchKpiMonitor() {
  useEffect(() => {
    const snapshot = launchKpiTracker.snapshot()
    trackLaunchKpiSnapshot(snapshot)

    const interval = window.setInterval(() => {
      const snap = launchKpiTracker.snapshot()
      trackLaunchKpiSnapshot(snap)
    }, 60_000)

    if (typeof window !== 'undefined') {
      const scheduled = window.localStorage.getItem(REVIEW_STORAGE_KEY)
      if (!scheduled) {
        const reviewDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        scheduleLaunchReview(reviewDate)
        window.localStorage.setItem(REVIEW_STORAGE_KEY, reviewDate.toISOString())
      }
    }

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  return null
}

export default LaunchKpiMonitor
