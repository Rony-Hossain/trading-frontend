/**
 * LossCapPercentInput - Daily loss cap configuration
 */

'use client'

import { Box, Typography, Slider, TextField, InputAdornment, Alert } from '@mui/material'
import { useState } from 'react'

export function LossCapPercentInput() {
  const [lossCap, setLossCap] = useState(2.0) // 2% default for beginners

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setLossCap(newValue as number)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? 0 : Number(event.target.value)
    setLossCap(value)
  }

  const getCapColor = () => {
    if (lossCap <= 2) return 'success'
    if (lossCap <= 5) return 'warning'
    return 'error'
  }

  return (
    <Box>
      <Typography variant="body2" gutterBottom>
        Daily Loss Cap
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
        Trading will be paused if you lose more than this percentage in a day
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <Slider
          value={lossCap}
          onChange={handleSliderChange}
          min={0.5}
          max={10}
          step={0.5}
          marks={[
            { value: 1, label: '1%' },
            { value: 2, label: '2%' },
            { value: 5, label: '5%' },
            { value: 10, label: '10%' },
          ]}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}%`}
          sx={{ flexGrow: 1 }}
          color={getCapColor()}
        />

        <TextField
          value={lossCap}
          onChange={handleInputChange}
          type="number"
          inputProps={{
            min: 0.5,
            max: 10,
            step: 0.5,
            'aria-label': 'Daily loss cap percentage',
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          sx={{ width: 100 }}
        />
      </Box>

      {lossCap > 5 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          High loss caps increase risk. Consider starting with 2-3% until you're more experienced.
        </Alert>
      )}

      {lossCap <= 2 && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Recommended for beginners. This protects your capital while you learn.
        </Alert>
      )}
    </Box>
  )
}
