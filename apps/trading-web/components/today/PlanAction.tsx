/**
 * PlanAction - Execute trade action button
 */

'use client'

import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box, Typography } from '@mui/material'
import { TrendingUpOutlined, TrendingDownOutlined } from '@mui/icons-material'
import { useState } from 'react'
import { Pick } from '@/lib/types/contracts'
import { getCopy } from '@/lib/copy/copy-service'

interface PlanActionProps {
  pick: Pick
  mode: 'beginner' | 'expert'
}

export function PlanAction({ pick, mode }: PlanActionProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleExecute = () => {
    // TODO: Execute trade
    // TODO: Emit telemetry event
    setConfirmOpen(false)
  }

  if (pick.action === 'HOLD' || pick.action === 'AVOID') {
    return null
  }

  const isBuy = pick.action === 'BUY'

  return (
    <>
      <Button
        variant="contained"
        color={isBuy ? 'success' : 'error'}
        fullWidth
        startIcon={isBuy ? <TrendingUpOutlined /> : <TrendingDownOutlined />}
        onClick={() => setConfirmOpen(true)}
        size="large"
      >
        {getCopy(`plan.action.${pick.action.toLowerCase()}`, mode)} {pick.shares} shares @ ${pick.entry_hint.toFixed(2)}
      </Button>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="trade-confirm-dialog"
      >
        <DialogTitle id="trade-confirm-dialog">
          Confirm {isBuy ? 'Buy' : 'Sell'} Order
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {pick.symbol}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isBuy ? 'Buy' : 'Sell'} {pick.shares} shares @ ${pick.entry_hint.toFixed(2)}
            </Typography>
          </Box>

          <DialogContentText>
            <strong>Total cost:</strong> ${(pick.entry_hint * pick.shares).toFixed(2)}
          </DialogContentText>
          <DialogContentText>
            <strong>Stop-loss:</strong> ${pick.safety_line.toFixed(2)}
          </DialogContentText>
          <DialogContentText>
            <strong>Max risk:</strong> ${pick.max_risk_usd.toFixed(2)}
          </DialogContentText>

          {pick.compliance.paper_trade_only && (
            <DialogContentText sx={{ mt: 2, fontWeight: 600, color: 'info.main' }}>
              ⚠️ {getCopy('compliance.paper_only', mode)}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleExecute}
            variant="contained"
            color={isBuy ? 'success' : 'error'}
            autoFocus
          >
            {getCopy('action.confirm', mode)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
