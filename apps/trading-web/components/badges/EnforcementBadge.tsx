/**
 * EnforcementBadge - Shows server-enforced safety features
 */

'use client'

import { Chip, Tooltip, Box } from '@mui/material'
import {
  Security as SecurityIcon,
  Block as BlockIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material'
import { getCopy } from '@/lib/copy/copy-service'

export interface EnforcementBadgeProps {
  type: 'stop_loss' | 'daily_cap' | 'paper_trading' | 'position_limit'
  enabled: boolean
  value?: string | number
  mode?: 'beginner' | 'expert'
  size?: 'small' | 'medium'
}

const BADGE_CONFIG = {
  stop_loss: {
    label: 'Stop Loss Required',
    icon: <SecurityIcon />,
    color: 'success' as const,
    tooltipKey: 'badge.stop_loss_tooltip',
  },
  daily_cap: {
    label: 'Daily Loss Cap',
    icon: <BlockIcon />,
    color: 'warning' as const,
    tooltipKey: 'badge.daily_cap_tooltip',
  },
  paper_trading: {
    label: 'Paper Trading',
    icon: <WarningIcon />,
    color: 'info' as const,
    tooltipKey: 'badge.paper_trading_tooltip',
  },
  position_limit: {
    label: 'Position Limit',
    icon: <CheckIcon />,
    color: 'primary' as const,
    tooltipKey: 'badge.position_limit_tooltip',
  },
}

export function EnforcementBadge({
  type,
  enabled,
  value,
  mode = 'beginner',
  size = 'small',
}: EnforcementBadgeProps) {
  if (!enabled) return null

  const config = BADGE_CONFIG[type]
  const label = value ? `${config.label}: ${value}` : config.label
  const tooltip = getCopy(config.tooltipKey, mode)

  return (
    <Tooltip title={tooltip} arrow>
      <Chip
        icon={config.icon}
        label={label}
        color={config.color}
        size={size}
        variant="outlined"
        sx={{
          fontWeight: 600,
          '& .MuiChip-icon': {
            fontSize: size === 'small' ? 16 : 20,
          },
        }}
      />
    </Tooltip>
  )
}

/**
 * EnforcementBadgeGroup - Shows all active enforcement badges
 */
export interface EnforcementBadgeGroupProps {
  defaults: {
    stop_loss_required?: boolean
    daily_loss_cap_enabled?: boolean
    daily_loss_cap_pct?: number
    paper_trading_enabled?: boolean
    max_position_size_pct?: number
  }
  mode?: 'beginner' | 'expert'
  size?: 'small' | 'medium'
}

export function EnforcementBadgeGroup({
  defaults,
  mode = 'beginner',
  size = 'small',
}: EnforcementBadgeGroupProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {defaults.stop_loss_required && (
        <EnforcementBadge type="stop_loss" enabled={true} mode={mode} size={size} />
      )}
      {defaults.daily_loss_cap_enabled && (
        <EnforcementBadge
          type="daily_cap"
          enabled={true}
          value={`${defaults.daily_loss_cap_pct}%`}
          mode={mode}
          size={size}
        />
      )}
      {defaults.paper_trading_enabled && (
        <EnforcementBadge type="paper_trading" enabled={true} mode={mode} size={size} />
      )}
      {defaults.max_position_size_pct && (
        <EnforcementBadge
          type="position_limit"
          enabled={true}
          value={`${defaults.max_position_size_pct}%`}
          mode={mode}
          size={size}
        />
      )}
    </Box>
  )
}
