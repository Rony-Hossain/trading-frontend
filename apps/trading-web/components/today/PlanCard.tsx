/**
 * PlanCard - Individual trading pick card
 */

'use client'

import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Button,
  Collapse,
  IconButton,
  Divider,
} from '@mui/material'
import {
  TrendingUpOutlined,
  TrendingDownOutlined,
  ExpandMoreOutlined,
  InfoOutlined,
} from '@mui/icons-material'
import { useState } from 'react'
import { Pick } from '@/lib/types/contracts'
import { getCopy } from '@/lib/copy/copy-service'
import { PlanAction } from './PlanAction'
import { PlanSafety } from './PlanSafety'
import { PlanReason } from './PlanReason'
import { PlanBudget } from './PlanBudget'
import { PlanConfidencePill } from './PlanConfidencePill'
import { PlanBadges } from './PlanBadges'
import { ExplainChip } from './ExplainChip'

interface PlanCardProps {
  pick: Pick
  mode: 'beginner' | 'expert'
}

export function PlanCard({ pick, mode }: PlanCardProps) {
  const [expanded, setExpanded] = useState(false)

  const getActionIcon = () => {
    if (pick.action === 'BUY') return <TrendingUpOutlined color="success" />
    if (pick.action === 'SELL') return <TrendingDownOutlined color="error" />
    return null
  }

  const getActionColor = () => {
    if (pick.action === 'BUY') return 'success'
    if (pick.action === 'SELL') return 'error'
    return 'default'
  }

  return (
    <Card
      sx={{
        border: 1,
        borderColor: 'divider',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {getActionIcon()}
              <Typography variant="h6" component="h3" fontWeight={600}>
                {pick.symbol}
              </Typography>
              <Chip
                label={getCopy(`plan.action.${pick.action.toLowerCase()}`, mode)}
                color={getActionColor() as any}
                size="small"
              />
              <PlanConfidencePill confidence={pick.confidence} mode={mode} />
            </Box>

            {/* Badges */}
            <PlanBadges pick={pick} mode={mode} />
          </Box>

          <IconButton
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="Show more details"
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          >
            <ExpandMoreOutlined />
          </IconButton>
        </Box>

        {/* Quick info */}
        <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              {getCopy('plan.entry_hint', mode)}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              ${pick.entry_hint.toFixed(2)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              {getCopy('plan.safety_line', mode)}
              <ExplainChip term="stop_loss" mode={mode} />
            </Typography>
            <Typography variant="body1" fontWeight={600} color="error.main">
              ${pick.safety_line.toFixed(2)}
            </Typography>
          </Box>

          {pick.target && (
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {getCopy('plan.target', mode)}
              </Typography>
              <Typography variant="body1" fontWeight={600} color="success.main">
                ${pick.target.toFixed(2)}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              {getCopy('plan.max_risk', mode)}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              ${pick.max_risk_usd.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {/* Reason (always visible) */}
        <PlanReason pick={pick} mode={mode} compact={!expanded} />

        {/* Expanded details */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <PlanSafety pick={pick} mode={mode} />
            <PlanBudget pick={pick} mode={mode} />

            {/* Expert mode: drivers */}
            {mode === 'expert' && pick.drivers && pick.drivers.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Top Drivers
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {pick.drivers.slice(0, 3).map((driver) => (
                    <Chip
                      key={driver.name}
                      label={`${driver.name} (${(driver.contribution * 100).toFixed(0)}%)`}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Action button */}
            <PlanAction pick={pick} mode={mode} />
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}
