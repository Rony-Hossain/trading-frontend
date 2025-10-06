'use client'

/**
 * RuleBuilder - Visual IF/AND/OR rule builder
 * Phase 5: Rules Engine & Advanced Alerts
 */

import { useState, useCallback, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as TestIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material'
import type {
  RuleGroup,
  RuleCondition,
  RuleConditionType,
  RuleOperator,
  RuleLogicOperator,
  RuleAction,
  RuleActionType,
} from '@/lib/types/contracts'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'
import {
  validateRuleGroup,
  countConditions,
} from '@/lib/validation/rule-validation'
import type { ValidationResult } from '@/lib/validation/rule-validation'

interface RuleBuilderProps {
  initialGroup?: RuleGroup
  onSave: (group: RuleGroup, actions: RuleAction[]) => void
  onPreview: (group: RuleGroup) => void
  mode: 'beginner' | 'expert'
}

// Available condition types and their fields
const CONDITION_FIELDS: Record<RuleConditionType, { label: string; fields: string[] }> = {
  indicator: {
    label: 'Technical Indicator',
    fields: ['RSI', 'MACD', 'SMA_20', 'SMA_50', 'SMA_200', 'EMA_12', 'Bollinger_Upper', 'Bollinger_Lower', 'ATR', 'Volume_SMA'],
  },
  price: {
    label: 'Price',
    fields: ['current_price', 'open', 'high', 'low', 'close', 'previous_close'],
  },
  volume: {
    label: 'Volume',
    fields: ['volume', 'volume_avg', 'volume_ratio'],
  },
  news: {
    label: 'News Sentiment',
    fields: ['sentiment_score', 'news_count', 'importance'],
  },
  options: {
    label: 'Options Data',
    fields: ['iv_rank', 'put_call_ratio', 'max_pain', 'delta', 'gamma'],
  },
  time: {
    label: 'Time',
    fields: ['time_of_day', 'day_of_week', 'days_since_earnings'],
  },
}

const OPERATORS: { value: RuleOperator; label: string; requiresValue2: boolean }[] = [
  { value: 'greater_than', label: 'is greater than', requiresValue2: false },
  { value: 'less_than', label: 'is less than', requiresValue2: false },
  { value: 'equals', label: 'equals', requiresValue2: false },
  { value: 'crosses_above', label: 'crosses above', requiresValue2: false },
  { value: 'crosses_below', label: 'crosses below', requiresValue2: false },
  { value: 'between', label: 'is between', requiresValue2: true },
]

const ACTION_TYPES: { value: RuleActionType; label: string; description: string }[] = [
  { value: 'alert', label: 'Send Alert', description: 'Notify me when this rule triggers' },
  { value: 'buy', label: 'Buy Shares', description: 'Automatically buy shares (paper trade)' },
  { value: 'sell', label: 'Sell Shares', description: 'Automatically sell shares (paper trade)' },
  { value: 'notify', label: 'Email/SMS', description: 'Send notification via email or SMS' },
]

const MAX_NESTING_DEPTH = 3

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function getGroupDepth(group: RuleGroup, targetId: string, currentDepth = 0): number {
  if (group.id === targetId) {
    return currentDepth
  }
  if (group.groups) {
    for (const nestedGroup of group.groups) {
      const depth = getGroupDepth(nestedGroup, targetId, currentDepth + 1)
      if (depth >= 0) return depth
    }
  }
  return -1
}

export function RuleBuilder({ initialGroup, onSave, onPreview, mode }: RuleBuilderProps) {
  const [rootGroup, setRootGroup] = useState<RuleGroup>(
    initialGroup || {
      id: generateId(),
      logic: 'AND',
      conditions: [],
      groups: [],
    }
  )
  const [actions, setActions] = useState<RuleAction[]>([])
  const [buildStartTime] = useState(Date.now())
  const [validation, setValidation] = useState<ValidationResult>({
    valid: true,
    errors: [],
    warnings: [],
    conflicts: [],
  })
  const [draggedCondition, setDraggedCondition] = useState<{
    conditionId: string
    groupId: string
    index: number
  } | null>(null)

  // Drag and drop handlers
  const handleDragStart = useCallback(
    (e: React.DragEvent, conditionId: string, groupId: string, index: number) => {
      setDraggedCondition({ conditionId, groupId, index })
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/html', e.currentTarget.innerHTML)
    },
    []
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, targetGroupId: string, targetIndex: number) => {
      e.preventDefault()
      if (!draggedCondition) return

      const { conditionId, groupId: sourceGroupId, index: sourceIndex } = draggedCondition

      // Reorder conditions within the same group or move between groups
      const reorderConditions = (group: RuleGroup): RuleGroup => {
        if (group.id === sourceGroupId && group.id === targetGroupId) {
          // Reorder within same group
          const newConditions = [...group.conditions]
          const [removed] = newConditions.splice(sourceIndex, 1)
          newConditions.splice(targetIndex, 0, removed)
          return { ...group, conditions: newConditions }
        } else if (group.id === sourceGroupId) {
          // Remove from source group
          return {
            ...group,
            conditions: group.conditions.filter((c) => c.id !== conditionId),
          }
        } else if (group.id === targetGroupId) {
          // Add to target group
          const conditionToMove = findConditionInGroup(rootGroup, conditionId)
          if (conditionToMove) {
            const newConditions = [...group.conditions]
            newConditions.splice(targetIndex, 0, conditionToMove)
            return { ...group, conditions: newConditions }
          }
        }

        // Recursively update nested groups
        if (group.groups) {
          return {
            ...group,
            groups: group.groups.map(reorderConditions),
          }
        }

        return group
      }

      setRootGroup(reorderConditions(rootGroup))
      setDraggedCondition(null)

      trackEvent({
        category: TelemetryCategory.RULES,
        action: 'condition_reordered',
        from_group: sourceGroupId,
        to_group: targetGroupId,
      })
    },
    [draggedCondition, rootGroup]
  )

  const handleDragEnd = useCallback(() => {
    setDraggedCondition(null)
  }, [])

  // Helper to find a condition in the group tree
  const findConditionInGroup = (group: RuleGroup, conditionId: string): RuleCondition | null => {
    const found = group.conditions.find((c) => c.id === conditionId)
    if (found) return found

    if (group.groups) {
      for (const nestedGroup of group.groups) {
        const result = findConditionInGroup(nestedGroup, conditionId)
        if (result) return result
      }
    }

    return null
  }

  // Add new condition to a group
  const addCondition = useCallback((groupId: string) => {
    const newCondition: RuleCondition = {
      id: generateId(),
      type: 'indicator',
      field: 'RSI',
      operator: 'greater_than',
      value: 70,
    }

    const updateGroup = (group: RuleGroup): RuleGroup => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: [...group.conditions, newCondition],
        }
      }
      if (group.groups) {
        return {
          ...group,
          groups: group.groups.map(updateGroup),
        }
      }
      return group
    }

    setRootGroup(updateGroup(rootGroup))
    trackEvent({
      category: TelemetryCategory.RULES,
      action: 'condition_added',
      condition_type: newCondition.type,
    })
  }, [rootGroup])

  // Add nested group
  const addGroup = useCallback((parentGroupId: string) => {
    // Check depth before adding
    const parentDepth = getGroupDepth(rootGroup, parentGroupId)
    if (parentDepth >= MAX_NESTING_DEPTH - 1) {
      // Would exceed max depth
      return
    }

    const newGroup: RuleGroup = {
      id: generateId(),
      logic: 'AND',
      conditions: [],
      groups: [],
    }

    const updateGroup = (group: RuleGroup): RuleGroup => {
      if (group.id === parentGroupId) {
        return {
          ...group,
          groups: [...(group.groups || []), newGroup],
        }
      }
      if (group.groups) {
        return {
          ...group,
          groups: group.groups.map(updateGroup),
        }
      }
      return group
    }

    setRootGroup(updateGroup(rootGroup))
    trackEvent({
      category: TelemetryCategory.RULES,
      action: 'group_added',
    })
  }, [rootGroup])

  // Update condition
  const updateCondition = useCallback(
    (conditionId: string, updates: Partial<RuleCondition>) => {
      const updateGroup = (group: RuleGroup): RuleGroup => {
        return {
          ...group,
          conditions: group.conditions.map((c) =>
            c.id === conditionId ? { ...c, ...updates } : c
          ),
          groups: group.groups?.map(updateGroup),
        }
      }

      setRootGroup(updateGroup(rootGroup))
    },
    [rootGroup]
  )

  // Delete condition
  const deleteCondition = useCallback(
    (conditionId: string) => {
      const updateGroup = (group: RuleGroup): RuleGroup => {
        return {
          ...group,
          conditions: group.conditions.filter((c) => c.id !== conditionId),
          groups: group.groups?.map(updateGroup),
        }
      }

      setRootGroup(updateGroup(rootGroup))
      trackEvent({
        category: TelemetryCategory.RULES,
        action: 'condition_deleted',
      })
    },
    [rootGroup]
  )

  // Delete group
  const deleteGroup = useCallback(
    (groupId: string) => {
      const updateGroup = (group: RuleGroup): RuleGroup => {
        return {
          ...group,
          groups: group.groups?.filter((g) => g.id !== groupId).map(updateGroup),
        }
      }

      setRootGroup(updateGroup(rootGroup))
      trackEvent({
        category: TelemetryCategory.RULES,
        action: 'group_deleted',
      })
    },
    [rootGroup]
  )

  // Update group logic
  const updateGroupLogic = useCallback(
    (groupId: string, logic: RuleLogicOperator) => {
      const updateGroup = (group: RuleGroup): RuleGroup => {
        if (group.id === groupId) {
          return { ...group, logic }
        }
        return {
          ...group,
          groups: group.groups?.map(updateGroup),
        }
      }

      setRootGroup(updateGroup(rootGroup))
    },
    [rootGroup]
  )

  // Add action
  const addAction = useCallback(() => {
    const newAction: RuleAction = {
      type: 'alert',
      message: 'Rule triggered',
    }
    setActions([...actions, newAction])
  }, [actions])

  // Update action
  const updateAction = useCallback(
    (index: number, updates: Partial<RuleAction>) => {
      setActions(actions.map((a, i) => (i === index ? { ...a, ...updates } : a)))
    },
    [actions]
  )

  // Delete action
  const deleteAction = useCallback(
    (index: number) => {
      setActions(actions.filter((_, i) => i !== index))
    },
    [actions]
  )

  // Real-time validation
  useEffect(() => {
    const result = validateRuleGroup(rootGroup, MAX_NESTING_DEPTH)
    setValidation(result)
  }, [rootGroup])

  // Handle save
  const handleSave = useCallback(() => {
    const duration = Date.now() - buildStartTime
    trackEvent({
      category: TelemetryCategory.RULES,
      action: 'rule_saved',
      build_duration_sec: Math.floor(duration / 1000),
      condition_count: countConditions(rootGroup),
      action_count: actions.length,
    })
    onSave(rootGroup, actions)
  }, [rootGroup, actions, buildStartTime, onSave])

  // Handle preview
  const handlePreview = useCallback(() => {
    trackEvent({
      category: TelemetryCategory.RULES,
      action: 'rule_previewed',
      condition_count: countConditions(rootGroup),
    })
    onPreview(rootGroup)
  }, [rootGroup, onPreview])

  // Render condition row
  const renderCondition = (condition: RuleCondition, groupId: string, index: number) => {
    const conditionType = CONDITION_FIELDS[condition.type]
    const operator = OPERATORS.find((op) => op.value === condition.operator)
    const isDragging = draggedCondition?.conditionId === condition.id

    return (
      <Box
        key={condition.id}
        draggable
        onDragStart={(e) => handleDragStart(e, condition.id, groupId, index)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, groupId, index)}
        onDragEnd={handleDragEnd}
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          p: 2,
          bgcolor: isDragging ? 'action.hover' : 'background.default',
          borderRadius: 1,
          border: '1px solid',
          borderColor: isDragging ? 'primary.main' : 'divider',
          opacity: isDragging ? 0.5 : 1,
          cursor: 'grab',
          '&:active': {
            cursor: 'grabbing',
          },
        }}
      >
        {/* Drag Handle */}
        <DragIcon sx={{ color: 'text.secondary', cursor: 'grab' }} />

        {/* Condition Type */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={condition.type}
            label="Type"
            onChange={(e) =>
              updateCondition(condition.id, {
                type: e.target.value as RuleConditionType,
                field: CONDITION_FIELDS[e.target.value as RuleConditionType].fields[0],
              })
            }
          >
            {Object.entries(CONDITION_FIELDS).map(([type, config]) => (
              <MenuItem key={type} value={type}>
                {config.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Field */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Field</InputLabel>
          <Select
            value={condition.field}
            label="Field"
            onChange={(e) => updateCondition(condition.id, { field: e.target.value })}
          >
            {conditionType.fields.map((field) => (
              <MenuItem key={field} value={field}>
                {field}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Operator */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Operator</InputLabel>
          <Select
            value={condition.operator}
            label="Operator"
            onChange={(e) =>
              updateCondition(condition.id, { operator: e.target.value as RuleOperator })
            }
          >
            {OPERATORS.map((op) => (
              <MenuItem key={op.value} value={op.value}>
                {op.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Value */}
        <TextField
          size="small"
          label="Value"
          type="number"
          value={condition.value}
          onChange={(e) => updateCondition(condition.id, { value: parseFloat(e.target.value) })}
          sx={{ width: 120 }}
        />

        {/* Value 2 (for between) */}
        {operator?.requiresValue2 && (
          <TextField
            size="small"
            label="Value 2"
            type="number"
            value={condition.value2 || 0}
            onChange={(e) =>
              updateCondition(condition.id, { value2: parseFloat(e.target.value) })
            }
            sx={{ width: 120 }}
          />
        )}

        {/* Timeframe (for indicators) */}
        {condition.type === 'indicator' && (
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={condition.timeframe || '1d'}
              label="Timeframe"
              onChange={(e) => updateCondition(condition.id, { timeframe: e.target.value })}
            >
              <MenuItem value="5m">5 min</MenuItem>
              <MenuItem value="15m">15 min</MenuItem>
              <MenuItem value="1h">1 hour</MenuItem>
              <MenuItem value="1d">1 day</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Delete */}
        <Tooltip title="Delete condition">
          <IconButton size="small" onClick={() => deleteCondition(condition.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }

  // Render group (recursive)
  const renderGroup = (group: RuleGroup, depth = 0): JSX.Element => {
    const isRoot = depth === 0

    return (
      <Paper
        key={group.id}
        sx={{
          p: 2,
          ml: depth * 4,
          bgcolor: depth % 2 === 0 ? 'background.paper' : 'grey.50',
          border: '2px solid',
          borderColor: depth === 0 ? 'primary.main' : 'divider',
        }}
      >
        {/* Group Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip
            label={group.logic}
            color={group.logic === 'AND' ? 'primary' : 'secondary'}
            onClick={() => updateGroupLogic(group.id, group.logic === 'AND' ? 'OR' : 'AND')}
            sx={{ cursor: 'pointer', fontWeight: 600 }}
          />
          <Typography variant="body2" color="text.secondary">
            {group.logic === 'AND' ? 'All conditions must match' : 'Any condition can match'}
          </Typography>
          {!isRoot && (
            <IconButton size="small" onClick={() => deleteGroup(group.id)} color="error">
              <DeleteIcon />
            </IconButton>
          )}
        </Box>

        {/* Conditions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          {group.conditions.map((condition, index) => renderCondition(condition, group.id, index))}
        </Box>

        {/* Nested Groups */}
        {group.groups?.map((nestedGroup) => (
          <Box key={nestedGroup.id} sx={{ mb: 2 }}>
            {renderGroup(nestedGroup, depth + 1)}
          </Box>
        ))}

        {/* Add Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => addCondition(group.id)}
            variant="outlined"
          >
            Add Condition
          </Button>
          {mode === 'expert' && depth < MAX_NESTING_DEPTH - 1 && (
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => addGroup(group.id)}
              variant="outlined"
              color="secondary"
            >
              Add Group
            </Button>
          )}
          {mode === 'expert' && depth >= MAX_NESTING_DEPTH - 1 && (
            <Tooltip title={`Maximum nesting depth (${MAX_NESTING_DEPTH} levels) reached`}>
              <span>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  variant="outlined"
                  color="secondary"
                  disabled
                >
                  Add Group
                </Button>
              </span>
            </Tooltip>
          )}
        </Box>
      </Paper>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Rule Builder
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create custom alerts and automated actions based on market conditions
        </Typography>
      </Box>

      {/* Beginner Mode Info */}
      {mode === 'beginner' && (
        <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
          <strong>How it works:</strong> Add conditions that must be met (e.g., "RSI is greater
          than 70"). You can combine multiple conditions with AND/OR logic. When all conditions
          match, your chosen actions will trigger.
        </Alert>
      )}

      {/* Validation Errors */}
      {validation.errors.length > 0 && (
        <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3 }}>
          <strong>Rule has errors:</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
            {validation.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Validation Conflicts */}
      {validation.conflicts.length > 0 && (
        <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3 }}>
          <strong>Conflicting conditions detected:</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
            {validation.conflicts.map((conflict, i) => (
              <li key={i}>{conflict}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Validation Warnings */}
      {validation.warnings.length > 0 && (
        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
          <strong>Warnings:</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
            {validation.warnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Rule Conditions */}
      <Box sx={{ mb: 3 }}>{renderGroup(rootGroup)}</Box>

      {/* Actions Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Then Do These Actions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          What should happen when your rule triggers?
        </Typography>

        {/* Action List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          {actions.map((action, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Action</InputLabel>
                <Select
                  value={action.type}
                  label="Action"
                  onChange={(e) => updateAction(index, { type: e.target.value as RuleActionType })}
                >
                  {ACTION_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Message"
                value={action.message || ''}
                onChange={(e) => updateAction(index, { message: e.target.value })}
                sx={{ flex: 1 }}
                placeholder="Custom message..."
              />

              {(action.type === 'buy' || action.type === 'sell') && (
                <TextField
                  size="small"
                  label="Shares"
                  type="number"
                  value={action.shares || 0}
                  onChange={(e) => updateAction(index, { shares: parseInt(e.target.value) })}
                  sx={{ width: 100 }}
                />
              )}

              <IconButton size="small" onClick={() => deleteAction(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Button size="small" startIcon={<AddIcon />} onClick={addAction} variant="outlined">
          Add Action
        </Button>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button startIcon={<TestIcon />} onClick={handlePreview} variant="outlined">
          Test & Preview
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          size="large"
          disabled={!validation.valid || validation.conflicts.length > 0}
        >
          {validation.valid && validation.conflicts.length === 0 ? 'Save Rule' : 'Fix Errors to Save'}
        </Button>
      </Box>
    </Box>
  )
}
