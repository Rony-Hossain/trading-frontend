/**
 * AlertsBell - Notification bell icon with badge
 */

'use client'

import { IconButton, Badge, Tooltip } from '@mui/material'
import { Notifications, NotificationsOff } from '@mui/icons-material'
import { getCopy } from '@/lib/copy/copy-service'

export interface AlertsBellProps {
  count: number
  armed: boolean
  onClick: () => void
  mode?: 'beginner' | 'expert'
}

export function AlertsBell({ count, armed, onClick, mode = 'beginner' }: AlertsBellProps) {
  const hasAlerts = count > 0
  const tooltipKey = armed ? 'alerts.bell_tooltip' : 'alerts.bell_muted_tooltip'

  return (
    <Tooltip title={getCopy(tooltipKey, mode)} arrow>
      <IconButton
        onClick={onClick}
        color={hasAlerts ? 'error' : 'default'}
        sx={{
          position: 'relative',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        aria-label={getCopy('alerts.bell_aria', mode)}
        aria-live="polite"
        aria-atomic="true"
      >
        <Badge
          badgeContent={count}
          color="error"
          max={9}
          invisible={!hasAlerts}
          sx={{
            '& .MuiBadge-badge': {
              animation: hasAlerts ? 'pulse 2s infinite' : 'none',
            },
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)' },
            },
          }}
        >
          {armed ? <Notifications /> : <NotificationsOff />}
        </Badge>
      </IconButton>
    </Tooltip>
  )
}
