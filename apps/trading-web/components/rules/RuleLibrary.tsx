'use client'

/**
 * RuleLibrary - Manage saved rules and templates
 * Phase 5: Rules Engine & Advanced Alerts
 */

import { useState, useMemo } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as DuplicateIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Shield as ShieldIcon,
  Bolt as BoltIcon,
  Star as StarIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material'
import type { Rule, RuleTemplate } from '@/lib/types/contracts'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'

interface RuleLibraryProps {
  rules: Rule[]
  templates: RuleTemplate[]
  onCreateRule: () => void
  onEditRule: (rule: Rule) => void
  onDeleteRule: (ruleId: string) => void
  onToggleRule: (ruleId: string, enabled: boolean) => void
  onDuplicateRule: (rule: Rule) => void
  onUseTemplate: (template: RuleTemplate) => void
  mode: 'beginner' | 'expert'
}

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  momentum: <TrendingUpIcon />,
  reversal: <BoltIcon />,
  breakout: <BoltIcon />,
  risk_management: <ShieldIcon />,
  custom: <StarIcon />,
}

export function RuleLibrary({
  rules,
  templates,
  onCreateRule,
  onEditRule,
  onDeleteRule,
  onToggleRule,
  onDuplicateRule,
  onUseTemplate,
  mode,
}: RuleLibraryProps) {
  const [activeTab, setActiveTab] = useState<'my_rules' | 'templates'>('my_rules')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<Rule | null>(null)

  // Filter rules by search
  const filteredRules = useMemo(() => {
    if (!searchQuery) return rules

    const query = searchQuery.toLowerCase()
    return rules.filter(
      (rule) =>
        rule.name.toLowerCase().includes(query) ||
        rule.description.toLowerCase().includes(query) ||
        rule.symbol?.toLowerCase().includes(query)
    )
  }, [rules, searchQuery])

  // Filter templates by search
  const filteredTemplates = useMemo(() => {
    if (!searchQuery) return templates

    const query = searchQuery.toLowerCase()
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
    )
  }, [templates, searchQuery])

  // Handle delete confirmation
  const handleDeleteClick = (rule: Rule) => {
    setRuleToDelete(rule)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (ruleToDelete) {
      onDeleteRule(ruleToDelete.id)
      trackEvent({
        category: TelemetryCategory.RULES,
        action: 'rule_deleted',
        rule_id: ruleToDelete.id,
      })
    }
    setDeleteDialogOpen(false)
    setRuleToDelete(null)
  }

  // Handle template use
  const handleUseTemplate = (template: RuleTemplate) => {
    trackEvent({
      category: TelemetryCategory.RULES,
      action: 'template_used',
      template_id: template.id,
      template_category: template.category,
    })
    onUseTemplate(template)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Rule Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your custom rules and explore pre-built templates
          </Typography>
        </div>
        <Button startIcon={<AddIcon />} onClick={onCreateRule} variant="contained" size="large">
          Create New Rule
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search rules and templates..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab label={`My Rules (${rules.length})`} value="my_rules" />
          <Tab label={`Templates (${templates.length})`} value="templates" />
        </Tabs>
      </Box>

      {/* My Rules Tab */}
      {activeTab === 'my_rules' && (
        <Box>
          {filteredRules.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchQuery ? 'No rules found' : 'No rules yet'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchQuery
                  ? 'Try a different search term'
                  : 'Create your first rule or start from a template'}
              </Typography>
              {!searchQuery && (
                <Button startIcon={<AddIcon />} onClick={onCreateRule} variant="contained">
                  Create Your First Rule
                </Button>
              )}
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredRules.map((rule) => (
                <Paper key={rule.id} sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6">{rule.name}</Typography>
                        {rule.symbol && (
                          <Chip label={rule.symbol} size="small" color="primary" />
                        )}
                        {!rule.enabled && <Chip label="Disabled" size="small" />}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {rule.description}
                      </Typography>

                      {/* Stats */}
                      <Box sx={{ display: 'flex', gap: 3 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Triggers
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {rule.trigger_count}
                          </Typography>
                        </Box>
                        {rule.last_triggered && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Last Triggered
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {new Date(rule.last_triggered).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                        {rule.backtest_result && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Win Rate
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color={rule.backtest_result.win_rate > 0.5 ? 'success.main' : 'inherit'}
                            >
                              {(rule.backtest_result.win_rate * 100).toFixed(1)}%
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={rule.enabled}
                            onChange={(e) => {
                              onToggleRule(rule.id, e.target.checked)
                              trackEvent({
                                category: TelemetryCategory.RULES,
                                action: 'rule_toggled',
                                rule_id: rule.id,
                                enabled: e.target.checked,
                              })
                            }}
                          />
                        }
                        label="Enabled"
                      />
                      <Tooltip title="Edit rule">
                        <IconButton onClick={() => onEditRule(rule)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplicate rule">
                        <IconButton
                          onClick={() => {
                            onDuplicateRule(rule)
                            trackEvent({
                              category: TelemetryCategory.RULES,
                              action: 'rule_duplicated',
                              rule_id: rule.id,
                            })
                          }}
                        >
                          <DuplicateIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete rule">
                        <IconButton onClick={() => handleDeleteClick(rule)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <Box>
          {mode === 'beginner' && (
            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
              <strong>Template Library:</strong> These are pre-built rules created by experts. Click
              "Use Template" to customize one for your portfolio.
            </Alert>
          )}

          {filteredTemplates.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No templates found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try a different search term
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 3 }}>
              {filteredTemplates.map((template) => (
                <Card key={template.id} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {CATEGORY_ICONS[template.category]}
                      <Typography variant="h6">{template.name}</Typography>
                    </Box>
                    <Chip
                      label={template.category.replace('_', ' ')}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 2, textTransform: 'capitalize' }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {template.description}
                    </Typography>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Popularity
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {template.popularity}%
                        </Typography>
                      </Box>
                      {template.avg_win_rate !== undefined && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Avg Win Rate
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color={template.avg_win_rate > 0.5 ? 'success.main' : 'inherit'}
                          >
                            {(template.avg_win_rate * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleUseTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Rule?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{ruleToDelete?.name}"? This action cannot be undone.
          </Typography>
          {ruleToDelete?.trigger_count && ruleToDelete.trigger_count > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This rule has triggered {ruleToDelete.trigger_count} time(s). All trigger history will
              be lost.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
