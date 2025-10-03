/**
 * ResetToDefaultsButton - Reset all settings to defaults
 */

'use client'

import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { RestartAltOutlined } from '@mui/icons-material'
import { useState } from 'react'

export function ResetToDefaultsButton() {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleReset = () => {
    // TODO: Reset settings to defaults
    // TODO: Emit telemetry event
    setConfirmOpen(false)
  }

  return (
    <>
      <Button
        variant="outlined"
        color="warning"
        startIcon={<RestartAltOutlined />}
        onClick={() => setConfirmOpen(true)}
      >
        Reset to Defaults
      </Button>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="reset-dialog-title"
      >
        <DialogTitle id="reset-dialog-title">Reset All Settings?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will reset all your preferences to the default beginner-friendly settings:
          </DialogContentText>
          <DialogContentText component="ul" sx={{ pl: 2, mt: 1 }}>
            <li>Mode: Beginner</li>
            <li>Risk Appetite: Conservative</li>
            <li>Daily Loss Cap: 2%</li>
            <li>Paper Trading: Enabled</li>
            <li>Stop-Loss: Required</li>
            <li>Alerts: Enabled (in-app only)</li>
          </DialogContentText>
          <DialogContentText sx={{ mt: 2 }}>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleReset} color="warning" variant="contained" autoFocus>
            Reset Settings
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
