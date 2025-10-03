/**
 * AlertEmptyState - Empty state for alerts drawer
 */

'use client'

import { Box, Typography } from '@mui/material'
import { NotificationsNone, NotificationsOff } from '@mui/icons-material'
import { getCopy } from '@/lib/copy/copy-service'

export interface AlertEmptyStateProps {
  armed: boolean
  mode?: 'beginner' | 'expert'
}

export function AlertEmptyState({ armed, mode = 'beginner' }: AlertEmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center',
      }}
    >
      {armed ? (
        <NotificationsNone sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      ) : (
        <NotificationsOff sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
      )}

      <Typography variant="h6" color="text.secondary" gutterBottom>
        {getCopy(armed ? 'alerts.empty_armed' : 'alerts.empty_muted', mode)}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
        {getCopy(armed ? 'alerts.empty_armed_subtitle' : 'alerts.empty_muted_subtitle', mode)}
      </Typography>
    </Box>
  )
}
