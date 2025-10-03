/**
 * PlanConfidencePill - Confidence level indicator
 */

'use client'

import { Chip } from '@mui/material'
import { ConfidenceLevel } from '@/lib/types/contracts'
import { getCopy } from '@/lib/copy/copy-service'

interface PlanConfidencePillProps {
  confidence: ConfidenceLevel
  mode: 'beginner' | 'expert'
}

export function PlanConfidencePill({ confidence, mode }: PlanConfidencePillProps) {
  const getColor = () => {
    switch (confidence) {
      case 'high':
        return 'success'
      case 'medium':
        return 'warning'
      case 'low':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Chip
      label={getCopy(`plan.confidence.${confidence}`, mode)}
      color={getColor() as any}
      size="small"
      variant="outlined"
    />
  )
}
