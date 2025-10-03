/**
 * Alerts Page V2 - Phase 2 Implementation
 * Real-time alerts with streaming, quiet hours, and adaptive frequency
 */

'use client'

import { useState } from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
import { Notifications } from '@mui/icons-material'
import { AlertsBell } from '@/components/alerts/AlertsBell'
import { AlertsDrawer } from '@/components/alerts/AlertsDrawer'
import { useAlertsQuery } from '@/lib/hooks/useAlertsQuery'
import { useAlertStream } from '@/lib/hooks/useAlertStream'
import { useAlertsUiStore, useFilteredAlerts } from '@/lib/stores/useAlertsUiStore'
import { updateAlertPreferences, takeAlertAction } from '@/lib/api/alerts'
import { trackEvent } from '@/lib/telemetry/taxonomy'
import { getCopy } from '@/lib/copy/copy-service'

export default function AlertsPageV2() {
  const { data, isLoading, refetch } = useAlertsQuery()
  const drawerOpen = useAlertsUiStore((state) => state.drawerOpen)
  const setDrawerOpen = useAlertsUiStore((state) => state.setDrawerOpen)
  const markAsSeen = useAlertsUiStore((state) => state.markAsSeen)
  const addCooldown = useAlertsUiStore((state) => state.addCooldown)

  const [armed, setArmed] = useState(data?.armed ?? true)
  const [quietHours, setQuietHours] = useState<string[]>(data?.quiet_hours ?? [])

  const mode = 'beginner' // TODO: Get from user settings

  // WebSocket stream for real-time alerts
  const { alerts: streamAlerts } = useAlertStream({
    enabled: armed,
    onAlert: (alert) => {
      console.log('[Alerts] New alert received:', alert)
      trackEvent({
        category: 'Alerts',
        action: 'alert_received',
        label: alert.type,
        metadata: {
          alert_id: alert.id,
          symbol: alert.symbol,
        },
      })
    },
  })

  // Combine API alerts with stream alerts
  const allAlerts = [...(data?.alerts ?? []), ...streamAlerts]
  const filteredAlerts = useFilteredAlerts(allAlerts)

  const handleToggleArmed = async (newArmed: boolean) => {
    setArmed(newArmed)

    try {
      await updateAlertPreferences({
        opportunity: newArmed,
        protect: newArmed,
        quiet_hours: quietHours,
      })

      trackEvent({
        category: 'Alerts',
        action: newArmed ? 'alerts_armed' : 'alerts_muted',
        label: mode,
      })

      refetch()
    } catch (error) {
      console.error('Failed to update alert preferences:', error)
    }
  }

  const handleUpdateQuietHours = async (hours: string[]) => {
    setQuietHours(hours)

    try {
      await updateAlertPreferences({
        opportunity: armed,
        protect: armed,
        quiet_hours: hours,
      })

      trackEvent({
        category: 'Alerts',
        action: 'quiet_hours_updated',
        label: mode,
        metadata: {
          hours,
        },
      })

      refetch()
    } catch (error) {
      console.error('Failed to update quiet hours:', error)
    }
  }

  const handleAlertAction = async (alertId: string, action: string) => {
    try {
      await takeAlertAction(alertId, action)

      // Mark as seen and add cooldown
      markAsSeen(alertId)
      const alert = allAlerts.find((a) => a.id === alertId)
      if (alert) {
        addCooldown(alert.throttle.dedupe_key, alert.throttle.cooldown_sec)
      }

      trackEvent({
        category: 'Alerts',
        action: 'alert_action_taken',
        label: action,
        metadata: {
          alert_id: alertId,
          action,
        },
      })

      refetch()
    } catch (error) {
      console.error('Failed to take alert action:', error)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
            {getCopy('alerts.drawer_title', mode)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getCopy('alerts.empty_armed_subtitle', mode)}
          </Typography>
        </Box>

        <AlertsBell
          count={filteredAlerts.length}
          armed={armed}
          onClick={() => setDrawerOpen(true)}
          mode={mode}
        />
      </Box>

      {/* Summary stats */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            flex: 1,
          }}
        >
          <Typography variant="h3" fontWeight={600} color="primary">
            {filteredAlerts.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active Alerts
          </Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            flex: 1,
          }}
        >
          <Typography variant="h3" fontWeight={600} color={armed ? 'success.main' : 'text.disabled'}>
            {armed ? 'ON' : 'OFF'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {armed ? getCopy('alerts.armed', mode) : getCopy('alerts.muted', mode)}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            flex: 1,
          }}
        >
          <Typography variant="h3" fontWeight={600}>
            {quietHours.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getCopy('alerts.quiet_hours', mode)}
          </Typography>
        </Box>
      </Box>

      {/* Open drawer button */}
      <Button
        variant="contained"
        size="large"
        startIcon={<Notifications />}
        onClick={() => setDrawerOpen(true)}
        fullWidth
      >
        View All Alerts
      </Button>

      {/* Alerts Drawer */}
      <AlertsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        alerts={filteredAlerts}
        armed={armed}
        quietHours={quietHours}
        onToggleArmed={handleToggleArmed}
        onUpdateQuietHours={handleUpdateQuietHours}
        onAlertAction={handleAlertAction}
        mode={mode}
      />
    </Container>
  )
}
