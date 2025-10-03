/**
 * PlanReason - Why this trade matters
 */

'use client'

import { Box, Typography, Chip } from '@mui/material'
import { Pick } from '@/lib/types/contracts'
import { getCopy } from '@/lib/copy/copy-service'

interface PlanReasonProps {
  pick: Pick
  mode: 'beginner' | 'expert'
  compact?: boolean
}

export function PlanReason({ pick, mode, compact = false }: PlanReasonProps) {
  // Truncate reason text if compact mode
  const displayReason = compact && pick.reason.length > 150
    ? pick.reason.substring(0, 150) + '...'
    : pick.reason

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
        {getCopy('plan.reason', mode)}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mb: 1,
          lineHeight: 1.6,
        }}
      >
        {displayReason}
      </Typography>

      {/* Reason codes as chips */}
      {mode === 'expert' && pick.reason_codes && pick.reason_codes.length > 0 && (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
          {pick.reason_codes.map((code) => (
            <Chip
              key={code}
              label={getCopy(`reason.${code}`, mode)}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      )}
    </Box>
  )
}
