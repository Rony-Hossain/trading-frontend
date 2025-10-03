/**
 * DeliveryChannelPreferences - Alert delivery channel configuration
 */

'use client'

import { Box, Typography, FormControlLabel, Checkbox, Alert } from '@mui/material'
import { Email, Sms, Smartphone, NotificationsActive } from '@mui/icons-material'
import { getCopy } from '@/lib/copy/copy-service'

export interface ChannelPreferences {
  in_app: boolean
  push: boolean
  email: boolean
  sms: boolean
}

export interface DeliveryChannelPreferencesProps {
  preferences: ChannelPreferences
  onChange: (preferences: ChannelPreferences) => void
  mode?: 'beginner' | 'expert'
}

export function DeliveryChannelPreferences({
  preferences,
  onChange,
  mode = 'beginner',
}: DeliveryChannelPreferencesProps) {
  const handleChange = (channel: keyof ChannelPreferences, checked: boolean) => {
    onChange({
      ...preferences,
      [channel]: checked,
    })
  }

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} gutterBottom>
        {getCopy('alerts.channel_preferences', mode)}
      </Typography>
      <Typography variant="caption" color="text.secondary" gutterBottom display="block" sx={{ mb: 2 }}>
        {mode === 'beginner'
          ? 'Choose how you want to receive notifications'
          : 'Configure alert delivery channels'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={preferences.in_app}
              onChange={(e) => handleChange('in_app', e.target.checked)}
              icon={<NotificationsActive />}
              checkedIcon={<NotificationsActive />}
            />
          }
          label={
            <Box>
              <Typography variant="body2">{getCopy('alerts.channel_in_app', mode)}</Typography>
              <Typography variant="caption" color="text.secondary">
                {mode === 'beginner'
                  ? 'Show notifications while using the app'
                  : 'In-app notifications and drawer'}
              </Typography>
            </Box>
          }
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={preferences.push}
              onChange={(e) => handleChange('push', e.target.checked)}
              icon={<Smartphone />}
              checkedIcon={<Smartphone />}
            />
          }
          label={
            <Box>
              <Typography variant="body2">{getCopy('alerts.channel_push', mode)}</Typography>
              <Typography variant="caption" color="text.secondary">
                {mode === 'beginner'
                  ? 'Send notifications to your device'
                  : 'Browser/mobile push notifications'}
              </Typography>
            </Box>
          }
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={preferences.email}
              onChange={(e) => handleChange('email', e.target.checked)}
              icon={<Email />}
              checkedIcon={<Email />}
            />
          }
          label={
            <Box>
              <Typography variant="body2">{getCopy('alerts.channel_email', mode)}</Typography>
              <Typography variant="caption" color="text.secondary">
                {mode === 'beginner' ? 'Send to your email address' : 'Email notifications'}
              </Typography>
            </Box>
          }
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={preferences.sms}
              onChange={(e) => handleChange('sms', e.target.checked)}
              icon={<Sms />}
              checkedIcon={<Sms />}
            />
          }
          label={
            <Box>
              <Typography variant="body2">{getCopy('alerts.channel_sms', mode)}</Typography>
              <Typography variant="caption" color="text.secondary">
                {mode === 'beginner' ? 'Text message to your phone' : 'SMS text messages'}
              </Typography>
            </Box>
          }
        />
      </Box>

      {!preferences.in_app && !preferences.push && !preferences.email && !preferences.sms && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {mode === 'beginner'
            ? 'You won\'t receive any notifications. Select at least one option.'
            : 'No delivery channels selected'}
        </Alert>
      )}
    </Box>
  )
}
