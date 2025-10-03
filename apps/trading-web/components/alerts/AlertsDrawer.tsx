/**
 * AlertsDrawer - Slide-out drawer for alerts
 */

'use client'

import { Drawer, Box, Typography, IconButton, Divider, Alert as MuiAlert } from '@mui/material'
import { Close } from '@mui/icons-material'
import { AlertTriggerItem } from './AlertTriggerItem'
import { AlertEmptyState } from './AlertEmptyState'
import { QuietHoursToggle } from './QuietHoursToggle'
import { MuteAllSwitch } from './MuteAllSwitch'
import { getCopy } from '@/lib/copy/copy-service'
import type { Alert } from '@/lib/types/contracts'

export interface AlertsDrawerProps {
  open: boolean
  onClose: () => void
  alerts: Alert[]
  armed: boolean
  quietHours: string[]
  onToggleArmed: (armed: boolean) => void
  onUpdateQuietHours: (hours: string[]) => void
  onAlertAction: (alertId: string, action: string) => void
  mode?: 'beginner' | 'expert'
}

export function AlertsDrawer({
  open,
  onClose,
  alerts,
  armed,
  quietHours,
  onToggleArmed,
  onUpdateQuietHours,
  onAlertAction,
  mode = 'beginner',
}: AlertsDrawerProps) {
  const hasAlerts = alerts.length > 0
  const activeAlerts = alerts.filter((alert) => new Date(alert.expires_at) > new Date())

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100%',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {getCopy('alerts.drawer_title', mode)}
          </Typography>
          <IconButton onClick={onClose} aria-label={getCopy('action.close', mode)}>
            <Close />
          </IconButton>
        </Box>

        {/* Controls */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <MuteAllSwitch armed={armed} onToggle={onToggleArmed} mode={mode} />
          <Box sx={{ mt: 2 }}>
            <QuietHoursToggle
              quietHours={quietHours}
              onUpdate={onUpdateQuietHours}
              mode={mode}
            />
          </Box>
        </Box>

        {/* Alerts List */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
          }}
          role="region"
          aria-live="polite"
          aria-label={getCopy('alerts.list_aria', mode)}
        >
          {!armed && (
            <MuiAlert severity="info" sx={{ mb: 2 }}>
              {getCopy('alerts.muted_notice', mode)}
            </MuiAlert>
          )}

          {hasAlerts ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {activeAlerts.map((alert) => (
                <AlertTriggerItem
                  key={alert.id}
                  alert={alert}
                  onAction={(action) => onAlertAction(alert.id, action)}
                  mode={mode}
                />
              ))}
              {activeAlerts.length === 0 && alerts.length > 0 && (
                <MuiAlert severity="warning">
                  {getCopy('alerts.all_expired', mode)}
                </MuiAlert>
              )}
            </Box>
          ) : (
            <AlertEmptyState armed={armed} mode={mode} />
          )}
        </Box>

        <Divider />

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" align="center" display="block">
            {getCopy('alerts.footer_note', mode)}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  )
}
