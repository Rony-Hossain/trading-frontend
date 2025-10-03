/**
 * PlanSafety - Safety metrics and stop-loss info
 */

'use client'

import { Box, Typography, LinearProgress, Alert } from '@mui/material'
import { ShieldOutlined } from '@mui/icons-material'
import { Pick } from '@/lib/types/contracts'
import { getCopy } from '@/lib/copy/copy-service'

interface PlanSafetyProps {
  pick: Pick
  mode: 'beginner' | 'expert'
}

export function PlanSafety({ pick, mode }: PlanSafetyProps) {
  // Calculate risk percentage
  const riskPct = pick.entry_hint > 0
    ? ((pick.entry_hint - pick.safety_line) / pick.entry_hint) * 100
    : 0

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <ShieldOutlined fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary">
          Safety Details
        </Typography>
      </Box>

      <Box sx={{ pl: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Risk per share
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              ${(pick.entry_hint - pick.safety_line).toFixed(2)} ({riskPct.toFixed(1)}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(riskPct, 100)}
            color={riskPct > 5 ? 'error' : riskPct > 3 ? 'warning' : 'success'}
            sx={{ height: 6, borderRadius: 1 }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              {getCopy('plan.safety_line', mode)}:
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              ${pick.safety_line.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              Max loss (total):
            </Typography>
            <Typography variant="caption" fontWeight={600} color="error.main">
              ${pick.max_risk_usd.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              Position size:
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {pick.shares} shares
            </Typography>
          </Box>

          {pick.constraints.min_holding_period_sec > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Min hold time:
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {Math.floor(pick.constraints.min_holding_period_sec / 60)} min
              </Typography>
            </Box>
          )}
        </Box>

        {mode === 'beginner' && riskPct > 5 && (
          <Alert severity="info" sx={{ mt: 1, py: 0 }}>
            <Typography variant="caption">
              Higher risk trade. Consider starting with a smaller position size.
            </Typography>
          </Alert>
        )}
      </Box>
    </Box>
  )
}
