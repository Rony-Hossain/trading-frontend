/**
 * RiskAppetiteSelector - Select risk tolerance level
 */

'use client'

import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
} from '@mui/material'
import { useState } from 'react'

type RiskLevel = 'conservative' | 'moderate' | 'aggressive'

export function RiskAppetiteSelector() {
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('conservative')

  const riskLevels: Array<{
    value: RiskLevel
    label: string
    description: string
    maxPositionSize: string
  }> = [
    {
      value: 'conservative',
      label: 'Conservative',
      description: 'Minimize risk, focus on capital preservation',
      maxPositionSize: '5% per position',
    },
    {
      value: 'moderate',
      label: 'Moderate',
      description: 'Balanced approach to risk and reward',
      maxPositionSize: '10% per position',
    },
    {
      value: 'aggressive',
      label: 'Aggressive',
      description: 'Higher risk tolerance for potential gains',
      maxPositionSize: '20% per position',
    },
  ]

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Risk Appetite</FormLabel>
      <RadioGroup
        value={riskLevel}
        onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
        sx={{ mt: 2 }}
      >
        {riskLevels.map((level) => (
          <FormControlLabel
            key={level.value}
            value={level.value}
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {level.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {level.description}
                </Typography>
                <Typography variant="caption" color="primary.main">
                  Max: {level.maxPositionSize}
                </Typography>
              </Box>
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
