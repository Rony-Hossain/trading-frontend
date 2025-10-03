'use client'

/**
 * Indicator Selector Component
 * Browse and add technical indicators to charts
 */
import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  Typography,
  Divider,
  IconButton,
  Grid,
} from '@mui/material'
import {
  TrendingUp,
  Speed,
  BarChart,
  ShowChart,
  Add,
  Close,
} from '@mui/icons-material'
import { useChartStore } from '@/lib/stores/chartStore'

interface IndicatorSelectorProps {
  open: boolean
  onClose: () => void
  chartId: string
}

interface TabPanelProps {
  children?: React.ReactNode
  value: number
  index: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  )
}

const categoryIcons = {
  trend: <TrendingUp />,
  momentum: <Speed />,
  volume: <BarChart />,
  volatility: <ShowChart />,
}

export function IndicatorSelector({ open, onClose, chartId }: IndicatorSelectorProps) {
  const { availableIndicators, addIndicator, getChart } = useChartStore()
  const chartConfig = getChart(chartId)

  const [activeTab, setActiveTab] = useState(0)
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null)
  const [params, setParams] = useState<Record<string, any>>({})

  const categories = ['trend', 'momentum', 'volume', 'volatility'] as const

  const handleIndicatorSelect = (indicatorId: string) => {
    const indicator = availableIndicators.find((ind) => ind.id === indicatorId)
    if (!indicator) return

    setSelectedIndicator(indicatorId)

    // Initialize params with defaults
    const defaultParams: Record<string, any> = {}
    indicator.params.forEach((param) => {
      defaultParams[param.name] = param.default
    })
    setParams(defaultParams)
  }

  const handleAddIndicator = () => {
    if (!selectedIndicator) return

    const indicator = availableIndicators.find((ind) => ind.id === selectedIndicator)
    if (!indicator) return

    addIndicator(chartId, {
      name: indicator.name,
      type: selectedIndicator,
      params,
    })

    onClose()
    setSelectedIndicator(null)
    setParams({})
  }

  const handleParamChange = (paramName: string, value: any) => {
    setParams((prev) => ({
      ...prev,
      [paramName]: value,
    }))
  }

  const getIndicatorsByCategory = (category: string) => {
    return availableIndicators.filter((ind) => ind.category === category)
  }

  const selectedIndicatorData = availableIndicators.find(
    (ind) => ind.id === selectedIndicator
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Add Indicator</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Category tabs */}
          <Grid item xs={12}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="fullWidth">
              <Tab icon={<TrendingUp />} label="Trend" />
              <Tab icon={<Speed />} label="Momentum" />
              <Tab icon={<BarChart />} label="Volume" />
              <Tab icon={<ShowChart />} label="Volatility" />
            </Tabs>
          </Grid>

          {/* Indicator list */}
          <Grid item xs={12} md={6}>
            {categories.map((category, index) => (
              <TabPanel key={category} value={activeTab} index={index}>
                <List>
                  {getIndicatorsByCategory(category).map((indicator) => {
                    const isActive = chartConfig?.indicators.some(
                      (ind) => ind.type === indicator.id
                    )

                    return (
                      <ListItem key={indicator.id} disablePadding>
                        <ListItemButton
                          selected={selectedIndicator === indicator.id}
                          onClick={() => handleIndicatorSelect(indicator.id)}
                        >
                          <ListItemIcon>{categoryIcons[category]}</ListItemIcon>
                          <ListItemText
                            primary={indicator.name}
                            secondary={isActive ? 'Already added' : ''}
                          />
                          {isActive && <Chip size="small" label="Active" color="primary" />}
                        </ListItemButton>
                      </ListItem>
                    )
                  })}
                </List>
              </TabPanel>
            ))}
          </Grid>

          {/* Indicator configuration */}
          <Grid item xs={12} md={6}>
            {selectedIndicatorData ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedIndicatorData.name}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Configure Parameters
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  {selectedIndicatorData.params.map((param) => {
                    if (param.type === 'number') {
                      return (
                        <TextField
                          key={param.name}
                          label={param.name}
                          type="number"
                          value={params[param.name] || param.default}
                          onChange={(e) =>
                            handleParamChange(param.name, parseFloat(e.target.value))
                          }
                          size="small"
                          fullWidth
                        />
                      )
                    }

                    if (param.type === 'color') {
                      return (
                        <Box key={param.name}>
                          <Typography variant="caption" gutterBottom>
                            {param.name}
                          </Typography>
                          <TextField
                            type="color"
                            value={params[param.name] || param.default}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            size="small"
                            fullWidth
                          />
                        </Box>
                      )
                    }

                    return null
                  })}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography>Select an indicator to configure</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleAddIndicator}
          disabled={!selectedIndicator}
          startIcon={<Add />}
        >
          Add Indicator
        </Button>
      </DialogActions>
    </Dialog>
  )
}
