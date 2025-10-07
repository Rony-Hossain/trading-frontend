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
import { TelemetryCategory, trackEvent } from '@/lib/telemetry/taxonomy'
import { useAlertsUiStore } from '@/lib/stores/useAlertsUiStore'
import type { Alert, AlertType } from '@/lib/types/contracts'
import { launchKpiTracker } from '@/lib/analytics/launch-kpi-tracker'
import { experimentEngine, type ExperimentDefinition } from '@/lib/experiments/experiment-engine'
import { useExperiment } from '@/hooks/useExperiment'

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

const ALERT_TONE_EXPERIMENT: ExperimentDefinition = {
  id: 'alert-tone',
  rolloutPercentage: 20,
  stopRule: {
    metric: 'follow_through_rate',
    threshold: 0.3,
    comparator: 'lt',
    sampleSize: 50,
  },
}

export function AlertTriggerItem({ alert, onAction, mode = 'beginner' }: AlertTriggerItemProps) {
  const { cohort: alertCohort, refresh: refreshAlertCohort } = useExperiment(ALERT_TONE_EXPERIMENT)
  const [expanded, setExpanded] = useState(false)
  const [actionTaken, setActionTaken] = useState<string | null>(null)
  const [feedbackGiven, setFeedbackGiven] = useState(false)
  const setFeedback = useAlertsUiStore((state) => state.setFeedback)

  const config = ALERT_TYPE_CONFIG[alert.type]
  const expiresIn = Math.max(0, new Date(alert.expires_at).getTime() - Date.now())
  const expiresInMin = Math.floor(expiresIn / 60000)
  const isExpiringSoon = expiresInMin < 5
  const isSuppressed = alert.throttle.suppressed
  const alertMessage =
    alertCohort === 'canary'
      ? `${alert.message} ${getCopy('alerts.canary_prompt', mode)}`
      : alert.message

  const handleAction = (action: string) => {
    setActionTaken(action)
    onAction(action)

    if (action === 'buy_now' || action === 'sell_now' || action === 'snooze') {
      launchKpiTracker.recordAlertAction(action as 'buy_now' | 'sell_now' | 'snooze')
    }
    if (action === 'buy_now' || action === 'sell_now') {
      launchKpiTracker.recordAlertFollowThrough(alert.analytics?.expected_pnl_usd)
    }

    const timeSinceReceivedSec = Math.max(
      0,
      Math.round((Date.now() - new Date(alert.created_at).getTime()) / 1000)
    )

    trackEvent({
      category: TelemetryCategory.ALERTS,
      action: 'alert_action_taken',
      alert_id: alert.id,
      chosen_action: action as 'buy_now' | 'sell_now' | 'snooze',
      time_to_action_sec: timeSinceReceivedSec,
    })

    if (alertCohort === 'canary' || alertCohort === 'control') {
      const followThroughValue = action === 'buy_now' || action === 'sell_now' ? 1 : 0
      experimentEngine.recordMetric(ALERT_TONE_EXPERIMENT.id, 'follow_through_rate', followThroughValue)
      if (alertCohort === 'canary' && experimentEngine.shouldStop(ALERT_TONE_EXPERIMENT.id)) {
        console.warn('[Experiment] Stop rule triggered for alert-tone canary cohort. Rolling back to control.')
        experimentEngine.clearAssignment(ALERT_TONE_EXPERIMENT.id)
        refreshAlertCohort()
      }
    }
  }

  const handleExpand = () => {
    setExpanded(!expanded)

    if (!expanded) {
      const timeSinceReceivedSec = Math.max(
        0,
        Math.round((Date.now() - new Date(alert.created_at).getTime()) / 1000)
      )
      trackEvent({
        category: TelemetryCategory.ALERTS,
        action: 'alert_clicked',
        alert_id: alert.id,
        alert_type: alert.type,
        time_since_received_sec: timeSinceReceivedSec,
      })
    }
  }

  const handleFeedback = (helpful: boolean) => {
    setFeedbackGiven(true)
    setFeedback(alert.id, helpful)
    launchKpiTracker.recordAlertFeedback(helpful)

    trackEvent({
      category: TelemetryCategory.ALERTS,
      action: 'alert_feedback',
      alert_id: alert.id,
      helpful,
    })

    experimentEngine.recordMetric(ALERT_TONE_EXPERIMENT.id, 'helpfulness_pct', helpful ? 1 : 0)
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
              {alertMessage}
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
                  {getCopy('feedback.prompt', mode)}
                </Typography>
                <ButtonGroup size="small" sx={{ mt: 1 }}>
                  <Button startIcon={<ThumbUp />} onClick={() => handleFeedback(true)}>
                    {getCopy('feedback.yes', mode)}
                  </Button>
                  <Button startIcon={<ThumbDown />} onClick={() => handleFeedback(false)}>
                    {getCopy('feedback.no', mode)}
                  </Button>
                </ButtonGroup>
              </Box>
            )}

            {feedbackGiven && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {getCopy('feedback.thanks', mode)}
                </Typography>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}
