/**
 * PlanList - List of trading picks for today
 */

'use client'

import { useEffect, useRef } from 'react'
import { Box, CircularProgress, Alert, Button } from '@mui/material'
import { RefreshOutlined } from '@mui/icons-material'
import { PlanCard } from './PlanCard'
import { usePlanQuery } from '@/lib/hooks/usePlanQuery'
import { getCopy } from '@/lib/copy/copy-service'
import { getEmptyState, getLoadingState } from '@/lib/states/vocabulary'
import { trackEvent } from '@/lib/telemetry/taxonomy'

export function PlanList() {
  const { data, isLoading, error, refetch, isStale } = usePlanQuery()
  const firstPlanTimeRef = useRef<number | null>(null)

  const mode = data?.mode || 'beginner'

  // Track time-to-first-plan performance
  useEffect(() => {
    if (!isLoading && data && data.picks && data.picks.length > 0 && !firstPlanTimeRef.current) {
      const timeToFirstPlan = performance.now()
      firstPlanTimeRef.current = timeToFirstPlan

      trackEvent({
        category: 'Performance',
        action: 'time_to_first_plan',
        label: timeToFirstPlan < 5000 ? 'fast' : 'slow',
        value: Math.round(timeToFirstPlan),
        metadata: {
          duration_ms: timeToFirstPlan,
          pick_count: data.picks.length,
          mode: data.mode,
          meets_target: timeToFirstPlan < 5000,
        },
      })
    }
  }, [isLoading, data])

  // Loading state
  if (isLoading) {
    const loadingState = getLoadingState('plan', mode)
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <CircularProgress />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {loadingState.message}
        </Box>
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {getCopy('error.server', mode)}
        <Button
          onClick={() => refetch()}
          startIcon={<RefreshOutlined />}
          sx={{ ml: 2 }}
        >
          {getCopy('action.refresh', mode)}
        </Button>
      </Alert>
    )
  }

  // Empty state
  if (!data?.picks || data.picks.length === 0) {
    const emptyState = getEmptyState('plan', mode)
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyState.message}
        </Typography>
        <Button
          onClick={() => refetch()}
          startIcon={<RefreshOutlined />}
          sx={{ mt: 2 }}
        >
          {getCopy('action.refresh', mode)}
        </Button>
      </Box>
    )
  }

  // Stale data warning
  const isDataStale = isStale || (data?.metadata?.generated_at &&
    (Date.now() - new Date(data.metadata.generated_at).getTime()) > 5 * 60 * 1000)

  return (
    <Box>
      {isDataStale && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => refetch()}
              startIcon={<RefreshOutlined />}
            >
              {getCopy('action.refresh', mode)}
            </Button>
          }
        >
          {getCopy('banner.stale_data', mode)}
        </Alert>
      )}

      {/* Daily cap status */}
      {data.daily_cap.status !== 'ok' && (
        <Alert
          severity={data.daily_cap.status === 'hit' ? 'error' : 'warning'}
          sx={{ mb: 3 }}
        >
          {data.daily_cap.status === 'hit'
            ? getCopy('compliance.daily_cap_hit', mode)
            : getCopy('compliance.daily_cap_warning', mode)
          }
        </Alert>
      )}

      {/* Plan cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.picks.map((pick) => (
          <PlanCard key={pick.symbol} pick={pick} mode={mode} />
        ))}
      </Box>
    </Box>
  )
}
