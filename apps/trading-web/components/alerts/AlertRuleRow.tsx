/**
 * AlertRuleRow - Display configured alert rule
 * For Phase 5 - Rules Engine integration
 */

'use client'

import { Card, CardContent, Typography, Box, Chip, IconButton, Switch } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { getCopy } from '@/lib/copy/copy-service'

export interface AlertRule {
  id: string
  name: string
  description: string
  enabled: boolean
  conditions: string[]
  alertTypes: ('opportunity' | 'protect')[]
}

export interface AlertRuleRowProps {
  rule: AlertRule
  onToggle: (ruleId: string, enabled: boolean) => void
  onEdit: (ruleId: string) => void
  onDelete: (ruleId: string) => void
  mode?: 'beginner' | 'expert'
}

export function AlertRuleRow({ rule, onToggle, onEdit, onDelete, mode = 'beginner' }: AlertRuleRowProps) {
  return (
    <Card variant="outlined" sx={{ opacity: rule.enabled ? 1 : 0.6 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Toggle */}
          <Switch
            checked={rule.enabled}
            onChange={(e) => onToggle(rule.id, e.target.checked)}
            color="primary"
          />

          {/* Content */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight={600} gutterBottom>
              {rule.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {rule.description}
            </Typography>

            {/* Alert types */}
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {rule.alertTypes.map((type) => (
                <Chip
                  key={type}
                  label={getCopy(`alerts.type_${type}`, mode)}
                  color={type === 'opportunity' ? 'success' : 'error'}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>

            {/* Conditions preview */}
            {rule.conditions.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {rule.conditions.length} {getCopy('alerts.conditions', mode)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={() => onEdit(rule.id)} aria-label="Edit rule">
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(rule.id)}
              aria-label="Delete rule"
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
