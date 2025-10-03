/**
 * PlanBadges - Show compliance and limit badges
 */

'use client'

import { Box, Chip } from '@mui/material'
import { Pick } from '@/lib/types/contracts'
import { getCopy } from '@/lib/copy/copy-service'

interface PlanBadgesProps {
  pick: Pick
  mode: 'beginner' | 'expert'
}

export function PlanBadges({ pick, mode }: PlanBadgesProps) {
  const badges: Array<{ label: string; color: 'info' | 'warning' | 'success' }> = []

  // Paper trading badge
  if (pick.compliance.paper_trade_only) {
    badges.push({
      label: mode === 'beginner' ? 'Practice Mode' : 'Paper Only',
      color: 'info',
    })
  }

  // Limits applied
  if (pick.limits_applied.volatility_brake) {
    badges.push({
      label: mode === 'beginner' ? 'Volatility Reduced' : 'Vol Brake',
      color: 'warning',
    })
  }

  if (pick.limits_applied.earnings_window) {
    badges.push({
      label: mode === 'beginner' ? 'Earnings Period' : 'Earnings Window',
      color: 'warning',
    })
  }

  if (pick.limits_applied.cap_hit) {
    badges.push({
      label: mode === 'beginner' ? 'Position Limit' : 'Cap Hit',
      color: 'warning',
    })
  }

  if (pick.limits_applied.drift_downgrade) {
    badges.push({
      label: mode === 'beginner' ? 'Model Adjusted' : 'Drift Downgrade',
      color: 'info',
    })
  }

  if (badges.length === 0) return null

  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {badges.map((badge, index) => (
        <Chip
          key={index}
          label={badge.label}
          size="small"
          color={badge.color}
          variant="outlined"
        />
      ))}
    </Box>
  )
}
