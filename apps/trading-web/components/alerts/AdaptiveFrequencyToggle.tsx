/**
 * AdaptiveFrequencyToggle - Auto-throttle alerts based on feedback
 */

'use client'

import { Box, Typography, Switch, FormControlLabel, Alert, LinearProgress } from '@mui/material'
import { AutoFixHigh } from '@mui/icons-material'
import { getCopy } from '@/lib/copy/copy-service'
import { useAlertsUiStore } from '@/lib/stores/useAlertsUiStore'

export interface AdaptiveFrequencyToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  mode?: 'beginner' | 'expert'
}

const NOT_HELPFUL_THRESHOLD = 3 // After 3 "not helpful" marks, suggest adaptive mode
const THROTTLE_THRESHOLD = 5 // At 5 "not helpful", auto-throttle kicks in

export function AdaptiveFrequencyToggle({
  enabled,
  onToggle,
  mode = 'beginner',
}: AdaptiveFrequencyToggleProps) {
  const notHelpfulCount = useAlertsUiStore((state) => state.getNotHelpfulCount())
  const shouldSuggest = notHelpfulCount >= NOT_HELPFUL_THRESHOLD && !enabled
  const throttleActive = notHelpfulCount >= THROTTLE_THRESHOLD && enabled

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            icon={<AutoFixHigh />}
            checkedIcon={<AutoFixHigh />}
          />
        }
        label={
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {getCopy('alerts.adaptive_frequency', mode)}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {getCopy('alerts.adaptive_frequency_description', mode)}
            </Typography>
          </Box>
        }
      />

      {shouldSuggest && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            {mode === 'beginner' ? 'Getting too many alerts?' : 'Enable adaptive throttle?'}
          </Typography>
          <Typography variant="caption">
            {mode === 'beginner'
              ? 'You\'ve marked several alerts as not helpful. Turn on Smart Frequency to reduce unnecessary notifications.'
              : `${notHelpfulCount} alerts marked unhelpful. Enable adaptive throttle to reduce frequency.`}
          </Typography>
        </Alert>
      )}

      {enabled && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {mode === 'beginner' ? 'Feedback Score' : 'Throttle Level'}
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {notHelpfulCount} / {THROTTLE_THRESHOLD}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={(notHelpfulCount / THROTTLE_THRESHOLD) * 100}
            color={throttleActive ? 'warning' : 'primary'}
            sx={{ borderRadius: 1, height: 6 }}
          />

          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            {throttleActive
              ? mode === 'beginner'
                ? 'Alerts are being reduced based on your feedback'
                : 'Adaptive throttle active - frequency reduced'
              : mode === 'beginner'
              ? 'We\'re learning from your feedback'
              : 'Monitoring feedback for throttle activation'}
          </Typography>
        </Box>
      )}
    </Box>
  )
}
