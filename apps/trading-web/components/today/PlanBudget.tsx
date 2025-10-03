/**
 * PlanBudget - Budget impact information
 */

'use client'

import { Box, Typography } from '@mui/material'
import { AccountBalanceWalletOutlined } from '@mui/icons-material'
import { Pick } from '@/lib/types/contracts'

interface PlanBudgetProps {
  pick: Pick
  mode: 'beginner' | 'expert'
}

export function PlanBudget({ pick, mode }: PlanBudgetProps) {
  const estimatedCost = pick.entry_hint * pick.shares

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <AccountBalanceWalletOutlined fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary">
          Budget Impact
        </Typography>
      </Box>

      <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            Estimated cost:
          </Typography>
          <Typography variant="caption" fontWeight={600}>
            ${estimatedCost.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            {mode === 'beginner' ? 'Cash left after:' : 'Remaining cash:'}
          </Typography>
          <Typography variant="caption" fontWeight={600} color="success.main">
            ${pick.budget_impact.cash_left.toFixed(2)}
          </Typography>
        </Box>

        {pick.constraints.max_position_value_usd && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              Max position limit:
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              ${pick.constraints.max_position_value_usd.toFixed(2)}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
