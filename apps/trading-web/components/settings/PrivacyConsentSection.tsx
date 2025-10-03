/**
 * PrivacyConsentSection - Privacy and data consent controls
 */

'use client'

import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Link,
  Divider,
} from '@mui/material'
import { useState } from 'react'

export function PrivacyConsentSection() {
  const [consent, setConsent] = useState({
    necessary: true, // Always true
    analytics: false,
    performance: false,
    sessionRecording: false,
  })

  const handleToggle = (key: keyof typeof consent) => {
    if (key === 'necessary') return // Can't disable necessary
    setConsent((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Control how we collect and use your data. See our{' '}
        <Link href="/privacy" underline="hover">
          Privacy Policy
        </Link>{' '}
        for details.
      </Typography>

      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={consent.necessary}
              onChange={() => handleToggle('necessary')}
              disabled
            />
          }
          label={
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Necessary
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Required for the platform to function (authentication, settings, etc.)
              </Typography>
            </Box>
          }
        />

        <Divider sx={{ my: 1 }} />

        <FormControlLabel
          control={
            <Switch
              checked={consent.analytics}
              onChange={() => handleToggle('analytics')}
            />
          }
          label={
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Analytics
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Help us improve by tracking feature usage (anonymized)
              </Typography>
            </Box>
          }
        />

        <FormControlLabel
          control={
            <Switch
              checked={consent.performance}
              onChange={() => handleToggle('performance')}
            />
          }
          label={
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Performance Monitoring
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Monitor page load times and errors to improve platform speed
              </Typography>
            </Box>
          }
        />

        <FormControlLabel
          control={
            <Switch
              checked={consent.sessionRecording}
              onChange={() => handleToggle('sessionRecording')}
            />
          }
          label={
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Session Recording
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Record anonymous sessions to understand user experience (PII is masked)
              </Typography>
            </Box>
          }
        />
      </FormGroup>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        Your data is never sold to third parties. All sensitive information (passwords, API keys,
        PII) is automatically redacted from logs and analytics.
      </Typography>
    </Box>
  )
}
