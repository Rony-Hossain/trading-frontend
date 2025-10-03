/**
 * AlertsStyleSelector - Configure alert delivery preferences
 */

'use client'

import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Chip,
  Divider,
  TextField,
} from '@mui/material'
import { useState } from 'react'

export function AlertsStyleSelector() {
  const [alertSettings, setAlertSettings] = useState({
    opportunity: true,
    protect: true,
    inApp: true,
    push: false,
    email: false,
    sms: false,
    quietHours: '',
  })

  const handleToggle = (key: keyof typeof alertSettings) => {
    setAlertSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <Box>
      <Typography variant="body2" gutterBottom fontWeight={600}>
        Alert Types
      </Typography>
      <FormGroup sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={alertSettings.opportunity}
              onChange={() => handleToggle('opportunity')}
            />
          }
          label={
            <Box>
              <Typography variant="body2">Opportunity Alerts</Typography>
              <Typography variant="caption" color="text.secondary">
                New trading opportunities based on your strategy
              </Typography>
            </Box>
          }
        />
        <FormControlLabel
          control={
            <Switch
              checked={alertSettings.protect}
              onChange={() => handleToggle('protect')}
            />
          }
          label={
            <Box>
              <Typography variant="body2">Protection Alerts</Typography>
              <Typography variant="caption" color="text.secondary">
                Warnings when positions approach stop-loss
              </Typography>
            </Box>
          }
        />
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" gutterBottom fontWeight={600}>
        Delivery Channels
      </Typography>
      <FormGroup sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={alertSettings.inApp}
              onChange={() => handleToggle('inApp')}
              disabled // Always enabled
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">In-App Notifications</Typography>
              <Chip label="Required" size="small" color="primary" />
            </Box>
          }
        />
        <FormControlLabel
          control={
            <Switch
              checked={alertSettings.push}
              onChange={() => handleToggle('push')}
            />
          }
          label="Push Notifications"
        />
        <FormControlLabel
          control={
            <Switch
              checked={alertSettings.email}
              onChange={() => handleToggle('email')}
            />
          }
          label="Email Notifications"
        />
        <FormControlLabel
          control={
            <Switch
              checked={alertSettings.sms}
              onChange={() => handleToggle('sms')}
              disabled // Coming soon
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">SMS Notifications</Typography>
              <Chip label="Coming soon" size="small" variant="outlined" />
            </Box>
          }
        />
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" gutterBottom fontWeight={600}>
        Quiet Hours
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
        Don't send alerts during these hours (24-hour format, e.g., "22:00-07:00")
      </Typography>
      <TextField
        fullWidth
        value={alertSettings.quietHours}
        onChange={(e) =>
          setAlertSettings((prev) => ({ ...prev, quietHours: e.target.value }))
        }
        placeholder="22:00-07:00"
        helperText="Leave empty to receive alerts 24/7"
      />
    </Box>
  )
}
