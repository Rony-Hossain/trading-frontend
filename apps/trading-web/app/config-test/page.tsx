/**
 * Config Test Page
 * Demonstrates site configuration read path
 */

'use client'

import { Container, Typography, Box, Card, CardContent, Chip, CircularProgress, Alert } from '@mui/material'
import { CheckCircle, Cancel, Settings } from '@mui/icons-material'
import { useSiteConfig } from '@/lib/hooks/useSiteConfig'

export default function ConfigTestPage() {
  const { config, loading, error } = useSiteConfig()

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading site configuration...</Typography>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography variant="h6">Configuration Load Error</Typography>
          <Typography variant="body2">{error.message}</Typography>
        </Alert>
      </Container>
    )
  }

  if (!config) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">No configuration loaded</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
          Site Configuration Test
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Demonstrating configuration read path from environment and remote JSON
        </Typography>
      </Box>

      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600}>
          Configuration loaded successfully!
        </Typography>
        <Typography variant="body2">
          Priority: Remote JSON {'>'} Environment Variables {'>'} Defaults
        </Typography>
      </Alert>

      {/* Mode Defaults */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Mode Defaults
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 200 }}>
                Default Mode:
              </Typography>
              <Chip
                label={config.defaultMode}
                color={config.defaultMode === 'beginner' ? 'success' : 'primary'}
                size="small"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 200 }}>
                Allow Mode Switch:
              </Typography>
              {config.allowModeSwitch ? (
                <CheckCircle color="success" fontSize="small" />
              ) : (
                <Cancel color="error" fontSize="small" />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Risk Defaults */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Risk Defaults
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 200 }}>
                Risk Appetite:
              </Typography>
              <Chip label={config.defaultRiskAppetite} color="primary" size="small" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 200 }}>
                Daily Loss Cap:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {config.defaultDailyLossCap}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 200 }}>
                Max Position Size:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {config.defaultMaxPositionSize}%
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Feature Flags
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Object.entries(config.features).map(([key, value]) => (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ minWidth: 200 }}>
                  {key}:
                </Typography>
                {value ? (
                  <CheckCircle color="success" fontSize="small" />
                ) : (
                  <Cancel color="error" fontSize="small" />
                )}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Compliance */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Compliance
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 200 }}>
                Default Region:
              </Typography>
              <Chip label={config.defaultRegion} size="small" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 200 }}>
                Enforcement Level:
              </Typography>
              <Chip
                label={config.enforcementLevel}
                color={config.enforcementLevel === 'strict' ? 'error' : 'warning'}
                size="small"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            API Configuration
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                API Base URL:
              </Typography>
              <Typography variant="body2" fontFamily="monospace">
                {config.apiBaseUrl}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                WebSocket URL:
              </Typography>
              <Typography variant="body2" fontFamily="monospace">
                {config.wsBaseUrl}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Cache TTL:
              </Typography>
              <Typography variant="body2" fontFamily="monospace">
                {config.cacheTTL}ms ({(config.cacheTTL / 1000).toFixed(0)}s)
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Observability */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Observability
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 200 }}>
                Sentry DSN:
              </Typography>
              {config.sentryDsn ? (
                <CheckCircle color="success" fontSize="small" />
              ) : (
                <Cancel color="disabled" fontSize="small" />
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 200 }}>
                PostHog Key:
              </Typography>
              {config.posthogKey ? (
                <CheckCircle color="success" fontSize="small" />
              ) : (
                <Cancel color="disabled" fontSize="small" />
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 200 }}>
                Vercel Analytics:
              </Typography>
              {config.vercelAnalytics ? (
                <CheckCircle color="success" fontSize="small" />
              ) : (
                <Cancel color="disabled" fontSize="small" />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* UI Preferences */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            UI Preferences
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 200 }}>
                Default Theme:
              </Typography>
              <Chip label={config.defaultTheme} size="small" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 200 }}>
                Show Beginner Hints:
              </Typography>
              {config.showBeginnerHints ? (
                <CheckCircle color="success" fontSize="small" />
              ) : (
                <Cancel color="error" fontSize="small" />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
