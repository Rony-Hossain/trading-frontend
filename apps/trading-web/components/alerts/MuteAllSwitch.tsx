/**
 * MuteAllSwitch - Toggle to mute/unmute all alerts
 */

'use client'

import { FormControlLabel, Switch, Typography, Box } from '@mui/material'
import { VolumeOff, VolumeUp } from '@mui/icons-material'
import { getCopy } from '@/lib/copy/copy-service'

export interface MuteAllSwitchProps {
  armed: boolean
  onToggle: (armed: boolean) => void
  mode?: 'beginner' | 'expert'
}

export function MuteAllSwitch({ armed, onToggle, mode = 'beginner' }: MuteAllSwitchProps) {
  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={armed}
            onChange={(e) => onToggle(e.target.checked)}
            color="primary"
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {armed ? <VolumeUp fontSize="small" /> : <VolumeOff fontSize="small" />}
            <Typography variant="body2" fontWeight={600}>
              {getCopy(armed ? 'alerts.armed' : 'alerts.muted', mode)}
            </Typography>
          </Box>
        }
      />
      <Typography variant="caption" color="text.secondary" display="block" sx={{ pl: 4 }}>
        {getCopy(armed ? 'alerts.armed_description' : 'alerts.muted_description', mode)}
      </Typography>
    </Box>
  )
}
