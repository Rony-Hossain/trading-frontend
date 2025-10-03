/**
 * AlertTriggerItem - Individual alert card with actions
 */

'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Collapse,
  Alert as MuiAlert,
  ButtonGroup,
} from '@mui/material'
import {
  TrendingUp,
  Shield,
  ExpandMore,
  ExpandLess,
  Schedule,
  ScienceOutlined,
  ThumbUp,
  ThumbDown,
} from '@mui/icons-material'
import { getCopy } from '@/lib/copy/copy-service'
import { trackEvent } from '@/lib/telemetry/taxonomy'
import { useAlertsUiStore } from '@/lib/stores/useAlertsUiStore'
import type { Alert, AlertType } from '@/lib/types/contracts'

export interface AlertTriggerItemProps {
  alert: Alert
  onAction: (action: string) => void
  mode?: 'beginner' | 'expert'
}

const ALERT_TYPE_CONFIG: Record<
  AlertType,
  { icon: React.ReactNode; color: 'success' | 'error'; bgColor: string }
> = {
  opportunity: {
    icon: <TrendingUp />,
    color: 'success',
    bgColor: 'success.light',
  },
  protect: {
    icon: <Shield />,
    color: 'error',
    bgColor: 'error.light',
  },
}

export function AlertTriggerItem({ alert, onAction, mode = 'beginner' }: AlertTriggerItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [actionTaken, setActionTaken] = useState<string | null>(null)
  const [feedbackGiven, setFeedbackGiven] = useState(false)
  const setFeedback = useAlertsUiStore((state) => state.setFeedback)

  const config = ALERT_TYPE_CONFIG[alert.type]
  const expiresIn = Math.max(0, new Date(alert.expires_at).getTime() - Date.now())
  const expiresInMin = Math.floor(expiresIn / 60000)
  const isExpiringSoon = expiresInMin < 5
  const isSuppressed = alert.throttle.suppressed

  const handleAction = (action: string) => {
    setActionTaken(action)
    onAction(action)

    trackEvent({
      category: 'Alerts',
      action: 'alert_action',
      label: action,
      metadata: {
        alert_id: alert.id,
        alert_type: alert.type,
        symbol: alert.symbol,
        action,
      },
    })
  }

  const handleExpand = () => {
    setExpanded(!expanded)

    if (!expanded) {
      trackEvent({
        category: 'Alerts',
        action: 'alert_expand',
        label: alert.type,
        metadata: {
          alert_id: alert.id,
          symbol: alert.symbol,
        },
      })
    }
  }

  const handleFeedback = (helpful: boolean) => {
    setFeedbackGiven(true)
    setFeedback(alert.id, helpful)

    trackEvent({
      category: 'Alerts',
      action: 'alert_feedback',
      label: helpful ? 'helpful' : 'not_helpful',
      metadata: {
        alert_id: alert.id,
        alert_type: alert.type,
        symbol: alert.symbol,
        helpful,
      },
    })
  }

  return (
    <Card
      variant="outlined"
      sx={{
        borderLeft: 4,
        borderLeftColor: config.bgColor,
        opacity: actionTaken || isSuppressed ? 0.6 : 1,
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              backgroundColor: config.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {config.icon}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h6" fontWeight={600}>
                {alert.symbol}
              </Typography>
              <Chip
                label={getCopy(`alerts.type_${alert.type}`, mode)}
                color={config.color}
                size="small"
              />
            </Box>

            <Typography variant="body2" color="text.secondary">
              {alert.message}
            </Typography>
          </Box>

          <IconButton size="small" onClick={handleExpand} aria-label="Show details">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* Badges */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {alert.paper_trade_only && (
            <Chip
              icon={<ScienceOutlined />}
              label={getCopy('alerts.paper_only', mode)}
              size="small"
              variant="outlined"
            />
          )}
          {isExpiringSoon && (
            <Chip
              icon={<Schedule />}
              label={getCopy('alerts.expiring_soon', mode).replace('{min}', expiresInMin.toString())}
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
        </Box>

        {/* Suppressed warning */}
        {isSuppressed && (
          <MuiAlert severity="info" sx={{ mb: 2 }}>
            {alert.throttle.suppressed_reason || getCopy('alerts.suppressed', mode)}
          </MuiAlert>
        )}

        {/* Action taken feedback */}
        {actionTaken && (
          <MuiAlert severity="success" sx={{ mb: 2 }}>
            {getCopy(`alerts.action_${actionTaken}_taken`, mode)}
          </MuiAlert>
        )}

        {/* Actions */}
        {!actionTaken && !isSuppressed && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {alert.actions.map((action) => (
              <Button
                key={action}
                variant={action === 'snooze' ? 'outlined' : 'contained'}
                color={action === 'snooze' ? 'inherit' : config.color}
                size="small"
                onClick={() => handleAction(action)}
              >
                {getCopy(`alerts.action_${action}`, mode)}
              </Button>
            ))}
          </Box>
        )}

        {/* Expanded Details */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" fontWeight={600} gutterBottom display="block">
              {getCopy('alerts.safety_details', mode)}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {getCopy('alerts.max_loss', mode)}: ${alert.safety.max_loss_usd.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getCopy('alerts.slippage', mode)}: {alert.safety.estimated_slippage_bps} bps
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getCopy('alerts.confidence', mode)}:{' '}
                {(alert.safety.execution_confidence * 100).toFixed(0)}%
              </Typography>
            </Box>

            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {getCopy('alerts.expires', mode)}:{' '}
                {new Date(alert.expires_at).toLocaleTimeString()}
              </Typography>
            </Box>

            {/* Feedback buttons */}
            {!feedbackGiven && (
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="caption" gutterBottom display="block">
                  {mode === 'beginner' ? 'Was this notification helpful?' : 'Alert feedback'}
                </Typography>
                <ButtonGroup size="small" sx={{ mt: 1 }}>
                  <Button
                    startIcon={<ThumbUp />}
                    onClick={() => handleFeedback(true)}
                  >
                    {mode === 'beginner' ? 'Yes' : 'Helpful'}
                  </Button>
                  <Button
                    startIcon={<ThumbDown />}
                    onClick={() => handleFeedback(false)}
                  >
                    {mode === 'beginner' ? 'No' : 'Not Helpful'}
                  </Button>
                </ButtonGroup>
              </Box>
            )}

            {feedbackGiven && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {mode === 'beginner'
                    ? 'Thanks for your feedback!'
                    : 'Feedback recorded'}
                </Typography>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}
