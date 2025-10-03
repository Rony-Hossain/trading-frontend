/**
 * ModeToggle - Switch between Beginner and Expert modes
 */

'use client'

import { ToggleButtonGroup, ToggleButton, Box, Typography, Chip } from '@mui/material'
import { SchoolOutlined, PsychologyOutlined } from '@mui/icons-material'
import { useState } from 'react'
import { getCopy } from '@/lib/copy/copy-service'

export function ModeToggle() {
  const [mode, setMode] = useState<'beginner' | 'expert'>('beginner')

  const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: 'beginner' | 'expert' | null) => {
    if (newMode !== null) {
      setMode(newMode)
      // TODO: Persist to backend/localStorage
      // TODO: Emit telemetry event
    }
  }

  return (
    <Box>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleModeChange}
        aria-label="Trading mode"
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="beginner" aria-label="Beginner mode">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
            <SchoolOutlined />
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Beginner
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Simple, guided
              </Typography>
            </Box>
          </Box>
        </ToggleButton>

        <ToggleButton value="expert" aria-label="Expert mode">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
            <PsychologyOutlined />
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Expert
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Advanced tools
              </Typography>
            </Box>
          </Box>
        </ToggleButton>
      </ToggleButtonGroup>

      {mode === 'beginner' && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Paper trading enforced" size="small" color="info" />
          <Chip label="Stop-loss required" size="small" color="success" />
          <Chip label="Daily loss cap enabled" size="small" color="warning" />
        </Box>
      )}

      {mode === 'expert' && (
        <Typography variant="body2" color="text.secondary">
          Full access to indicators, options, and advanced features
        </Typography>
      )}
    </Box>
  )
}
