/**
 * QuietHoursToggle - Quiet hours configuration
 */

'use client'

import { useState } from 'react'
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Chip,
  IconButton,
} from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import { getCopy } from '@/lib/copy/copy-service'

export interface QuietHoursToggleProps {
  quietHours: string[]
  onUpdate: (hours: string[]) => void
  mode?: 'beginner' | 'expert'
}

export function QuietHoursToggle({ quietHours, onUpdate, mode = 'beginner' }: QuietHoursToggleProps) {
  const [enabled, setEnabled] = useState(quietHours.length > 0)
  const [newRange, setNewRange] = useState({ start: '22:00', end: '07:00' })

  const handleToggle = (checked: boolean) => {
    setEnabled(checked)
    if (!checked) {
      onUpdate([])
    } else if (quietHours.length === 0) {
      // Add default quiet hours
      onUpdate(['22:00-07:00'])
    }
  }

  const handleAdd = () => {
    const range = `${newRange.start}-${newRange.end}`
    if (!quietHours.includes(range)) {
      onUpdate([...quietHours, range])
    }
  }

  const handleDelete = (range: string) => {
    const updated = quietHours.filter((r) => r !== range)
    onUpdate(updated)
    if (updated.length === 0) {
      setEnabled(false)
    }
  }

  return (
    <Box>
      <FormControlLabel
        control={<Switch checked={enabled} onChange={(e) => handleToggle(e.target.checked)} />}
        label={
          <Typography variant="body2" fontWeight={600}>
            {getCopy('alerts.quiet_hours', mode)}
          </Typography>
        }
      />

      {enabled && (
        <Box sx={{ mt: 2, pl: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
            {getCopy('alerts.quiet_hours_description', mode)}
          </Typography>

          {/* Current ranges */}
          {quietHours.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2, mt: 1 }}>
              {quietHours.map((range) => (
                <Chip
                  key={range}
                  label={range}
                  onDelete={() => handleDelete(range)}
                  deleteIcon={<Delete />}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          )}

          {/* Add new range */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
            <TextField
              type="time"
              size="small"
              value={newRange.start}
              onChange={(e) => setNewRange({ ...newRange, start: e.target.value })}
              label={getCopy('alerts.quiet_start', mode)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 120 }}
            />
            <Typography variant="body2">-</Typography>
            <TextField
              type="time"
              size="small"
              value={newRange.end}
              onChange={(e) => setNewRange({ ...newRange, end: e.target.value })}
              label={getCopy('alerts.quiet_end', mode)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 120 }}
            />
            <IconButton size="small" onClick={handleAdd} color="primary">
              <Add />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  )
}
