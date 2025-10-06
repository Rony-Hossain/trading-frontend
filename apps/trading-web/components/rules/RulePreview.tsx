'use client'

/**
 * RulePreview - Backtest and validate rules before saving
 * Phase 5: Rules Engine & Advanced Alerts
 */

import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material'
import type { RuleGroup, RulePreviewResponse } from '@/lib/types/contracts'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'

interface RulePreviewProps {
  symbol: string
  ruleGroup: RuleGroup
  onClose: () => void
  mode: 'beginner' | 'expert'
}

export function RulePreview({ symbol, ruleGroup, onClose, mode }: RulePreviewProps) {
  const [loading, setLoading] = useState(true)
  const [previewData, setPreviewData] = useState<RulePreviewResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch preview data on mount
  useEffect(() => {
    const fetchPreview = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/rules/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symbol,
            root_group: ruleGroup,
            lookback_days: 30,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch preview')
        }

        const data: RulePreviewResponse = await response.json()
        setPreviewData(data)

        trackEvent({
          category: TelemetryCategory.RULES,
          action: 'rule_preview_loaded',
          symbol,
          total_triggers: data.total_triggers,
          win_rate: data.backtest_stats.win_rate,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        trackEvent({
          category: TelemetryCategory.RULES,
          action: 'rule_preview_error',
          symbol,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
  }, [symbol, ruleGroup])

  if (loading) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Running backtest...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Analyzing {symbol} over the last 30 days
        </Typography>
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <strong>Preview Failed:</strong> {error}
        </Alert>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </Paper>
    )
  }

  if (!previewData) {
    return null
  }

  const { backtest_stats, sample_triggers, validation_warnings, conflicts } = previewData
  const hasIssues = validation_warnings.length > 0 || conflicts.length > 0
  const performanceColor =
    backtest_stats.win_rate > 0.6
      ? 'success.main'
      : backtest_stats.win_rate > 0.4
      ? 'warning.main'
      : 'error.main'

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Rule Preview: {symbol}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Backtest results over the last 30 days
        </Typography>
      </Box>

      {/* Validation Warnings */}
      {hasIssues && (
        <Box sx={{ mb: 3 }}>
          {conflicts.length > 0 && (
            <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
              <strong>Conflicts Detected:</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                {conflicts.map((conflict, i) => (
                  <li key={i}>{conflict}</li>
                ))}
              </ul>
            </Alert>
          )}

          {validation_warnings.length > 0 && (
            <Alert severity="warning" icon={<WarningIcon />}>
              <strong>Warnings:</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                {validation_warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </Alert>
          )}
        </Box>
      )}

      {/* Performance Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance Summary
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 3 }}>
          {/* Total Triggers */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Total Triggers
            </Typography>
            <Typography variant="h4" fontWeight={600}>
              {backtest_stats.total_triggers}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              over 30 days
            </Typography>
          </Box>

          {/* Win Rate */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Win Rate
            </Typography>
            <Typography variant="h4" fontWeight={600} sx={{ color: performanceColor }}>
              {(backtest_stats.win_rate * 100).toFixed(1)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {backtest_stats.profitable_triggers} of {backtest_stats.total_triggers} profitable
            </Typography>
          </Box>

          {/* Avg Profit */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Avg Profit/Loss
            </Typography>
            <Typography
              variant="h4"
              fontWeight={600}
              sx={{
                color: backtest_stats.avg_profit_pct > 0 ? 'success.main' : 'error.main',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {backtest_stats.avg_profit_pct > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              {backtest_stats.avg_profit_pct.toFixed(2)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              per trigger
            </Typography>
          </Box>

          {/* Max Profit */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Best Trade
            </Typography>
            <Typography variant="h4" fontWeight={600} color="success.main">
              +{backtest_stats.max_profit_pct.toFixed(2)}%
            </Typography>
          </Box>

          {/* Max Loss */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Worst Trade
            </Typography>
            <Typography variant="h4" fontWeight={600} color="error.main">
              {backtest_stats.max_loss_pct.toFixed(2)}%
            </Typography>
          </Box>
        </Box>

        {/* Win Rate Progress Bar */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Win Rate Distribution</Typography>
            <Typography variant="body2" fontWeight={600}>
              {(backtest_stats.win_rate * 100).toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={backtest_stats.win_rate * 100}
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: performanceColor,
              },
            }}
          />
        </Box>
      </Paper>

      {/* Sample Triggers */}
      {sample_triggers.length > 0 && (
        <Accordion defaultExpanded={mode === 'expert'}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Sample Triggers ({sample_triggers.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Conditions Met</TableCell>
                    <TableCell>Executed?</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sample_triggers.slice(0, 10).map((trigger, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(trigger.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${trigger.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {Object.entries(trigger.condition_values).map(([key, value]) => (
                            <Chip
                              key={key}
                              label={`${key}: ${typeof value === 'number' ? value.toFixed(2) : value}`}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {trigger.would_execute ? (
                          <CheckIcon fontSize="small" color="success" />
                        ) : (
                          <span>—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {sample_triggers.length > 10 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Showing first 10 of {sample_triggers.length} triggers
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      )}

      {/* Beginner Mode Guidance */}
      {mode === 'beginner' && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <strong>What do these numbers mean?</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
            <li>
              <strong>Win Rate:</strong> How often this rule made profitable trades. Above 50% is
              good.
            </li>
            <li>
              <strong>Avg Profit/Loss:</strong> Average gain or loss per trade. Positive is good.
            </li>
            <li>
              <strong>Best/Worst Trade:</strong> Your biggest gains and losses with this rule.
            </li>
          </ul>
          Remember: Past performance doesn't guarantee future results. Always start with paper
          trading.
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Close Preview
        </Button>
        <Button
          variant="contained"
          disabled={conflicts.length > 0}
          onClick={() => {
            trackEvent({
              category: TelemetryCategory.RULES,
              action: 'rule_accepted_from_preview',
              symbol,
              win_rate: backtest_stats.win_rate,
            })
            onClose()
          }}
        >
          {conflicts.length > 0 ? 'Fix Conflicts First' : 'Looks Good, Save Rule'}
        </Button>
      </Box>
    </Box>
  )
}
