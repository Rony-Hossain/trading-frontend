'use client'

/**
 * Settings Page
 * Comprehensive settings management with 6 categories
 */
import { useState } from 'react'
import {
  Box,
  Container,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Divider,
  Alert,
  Grid,
} from '@mui/material'
import {
  Settings as GeneralIcon,
  ShowChart as TradingIcon,
  Palette as AppearanceIcon,
  Notifications as NotificationsIcon,
  Storage as DataIcon,
  TuneRounded as AdvancedIcon,
} from '@mui/icons-material'
import { useUserStore, THEME_PRESETS } from '@/lib/stores/userStore'
import { ExpertModuleToggles } from '@/components/settings/ExpertModuleToggles'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'
import { useEffect, useState as useReactState } from 'react'

interface TabPanelProps {
  children?: React.ReactNode
  value: number
  index: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export default function SettingsPage() {
  const { preferences, updatePreferences } = useUserStore()
  const [activeTab, setActiveTab] = useState(0)
  const [saved, setSaved] = useState(false)
  const [expertModules, setExpertModules] = useReactState<Record<string, boolean>>({
    indicators: false,
    options: false,
    diagnostics: false,
  })

  // Load expert module states from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('expertModules')
    if (stored) {
      try {
        setExpertModules(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse expert modules state:', e)
      }
    }
  }, [])

  const handleModuleToggle = (moduleId: string, enabled: boolean) => {
    const newModules = { ...expertModules, [moduleId]: enabled }
    setExpertModules(newModules)
    localStorage.setItem('expertModules', JSON.stringify(newModules))

    trackEvent({
      category: TelemetryCategory.SETTINGS,
      action: 'setting_changed',
      setting_key: `expert_module_${moduleId}`,
      old_value: expertModules[moduleId],
      new_value: enabled,
    })
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Customize your trading platform experience
        </Typography>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<GeneralIcon />} label="General" />
            <Tab icon={<TradingIcon />} label="Trading" />
            <Tab icon={<AppearanceIcon />} label="Appearance" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<DataIcon />} label="Data" />
            <Tab icon={<AdvancedIcon />} label="Advanced" />
          </Tabs>
        </Box>

        <CardContent>
          {/* General Settings */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Dashboard Mode</InputLabel>
                  <Select
                    value={preferences.dashboardMode}
                    onChange={(e) =>
                      updatePreferences({
                        dashboardMode: e.target.value as 'beginner' | 'expert',
                      })
                    }
                  >
                    <MenuItem value="beginner">Beginner Mode</MenuItem>
                    <MenuItem value="expert">Expert Mode</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Default Symbol"
                  value={preferences.defaultSymbol}
                  onChange={(e) =>
                    updatePreferences({ defaultSymbol: e.target.value })
                  }
                  helperText="The symbol to display when you open the platform"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.autoRefresh}
                      onChange={(e) =>
                        updatePreferences({ autoRefresh: e.target.checked })
                      }
                    />
                  }
                  label="Auto-refresh data"
                />
              </Grid>

              {preferences.autoRefresh && (
                <Grid item xs={12}>
                  <Typography gutterBottom>
                    Refresh Interval: {preferences.refreshInterval} seconds
                  </Typography>
                  <Slider
                    value={preferences.refreshInterval}
                    onChange={(_, value) =>
                      updatePreferences({ refreshInterval: value as number })
                    }
                    min={1}
                    max={60}
                    marks={[
                      { value: 1, label: '1s' },
                      { value: 30, label: '30s' },
                      { value: 60, label: '60s' },
                    ]}
                  />
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {/* Trading Settings */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Default Order Type</InputLabel>
                  <Select
                    value={preferences.defaultOrderType}
                    onChange={(e) =>
                      updatePreferences({
                        defaultOrderType: e.target.value as any,
                      })
                    }
                  >
                    <MenuItem value="market">Market Order</MenuItem>
                    <MenuItem value="limit">Limit Order</MenuItem>
                    <MenuItem value="stop">Stop Order</MenuItem>
                    <MenuItem value="stop-limit">Stop-Limit Order</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.confirmOrders}
                      onChange={(e) =>
                        updatePreferences({ confirmOrders: e.target.checked })
                      }
                    />
                  }
                  label="Require order confirmation"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Default Quantity"
                  value={preferences.defaultQuantity}
                  onChange={(e) =>
                    updatePreferences({
                      defaultQuantity: parseInt(e.target.value),
                    })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>
                  Risk per Trade: {preferences.riskPerTrade}%
                </Typography>
                <Slider
                  value={preferences.riskPerTrade}
                  onChange={(_, value) =>
                    updatePreferences({ riskPerTrade: value as number })
                  }
                  min={0.5}
                  max={10}
                  step={0.5}
                  marks={[
                    { value: 1, label: '1%' },
                    { value: 5, label: '5%' },
                    { value: 10, label: '10%' },
                  ]}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Appearance Settings */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Theme Mode</InputLabel>
                  <Select
                    value={preferences.themeMode}
                    onChange={(e) =>
                      updatePreferences({
                        themeMode: e.target.value as 'light' | 'dark' | 'auto',
                      })
                    }
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="auto">Auto (System)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Theme Preset</InputLabel>
                  <Select
                    value={preferences.themePreset}
                    onChange={(e) =>
                      updatePreferences({ themePreset: e.target.value })
                    }
                  >
                    {Object.entries(THEME_PRESETS).map(([key, preset]) => (
                      <MenuItem key={key} value={key}>
                        {preset.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>
                  Font Size: {preferences.fontSize}px
                </Typography>
                <Slider
                  value={preferences.fontSize}
                  onChange={(_, value) =>
                    updatePreferences({ fontSize: value as number })
                  }
                  min={12}
                  max={18}
                  marks={[
                    { value: 12, label: '12px' },
                    { value: 14, label: '14px' },
                    { value: 16, label: '16px' },
                    { value: 18, label: '18px' },
                  ]}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.compactMode}
                      onChange={(e) =>
                        updatePreferences({ compactMode: e.target.checked })
                      }
                    />
                  }
                  label="Compact Mode (reduce spacing)"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notifications Settings */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.enableDesktopNotifications}
                      onChange={(e) =>
                        updatePreferences({
                          enableDesktopNotifications: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Enable Desktop Notifications"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.enableSoundAlerts}
                      onChange={(e) =>
                        updatePreferences({
                          enableSoundAlerts: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Enable Sound Alerts"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Notification Types
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifyOnSignals}
                      onChange={(e) =>
                        updatePreferences({ notifyOnSignals: e.target.checked })
                      }
                    />
                  }
                  label="Trading Signals"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifyOnFills}
                      onChange={(e) =>
                        updatePreferences({ notifyOnFills: e.target.checked })
                      }
                    />
                  }
                  label="Order Fills"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifyOnPriceAlerts}
                      onChange={(e) =>
                        updatePreferences({
                          notifyOnPriceAlerts: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Price Alerts"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Data Settings */}
          <TabPanel value={activeTab} index={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Data Provider"
                  value={preferences.dataProvider}
                  onChange={(e) =>
                    updatePreferences({ dataProvider: e.target.value })
                  }
                  helperText="Primary data source for market data"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.showExtendedHours}
                      onChange={(e) =>
                        updatePreferences({
                          showExtendedHours: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Show Extended Hours Trading"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.showVolume}
                      onChange={(e) =>
                        updatePreferences({ showVolume: e.target.checked })
                      }
                    />
                  }
                  label="Show Volume on Charts"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Advanced Settings */}
          <TabPanel value={activeTab} index={5}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.enableHotkeys}
                      onChange={(e) =>
                        updatePreferences({ enableHotkeys: e.target.checked })
                      }
                    />
                  }
                  label="Enable Keyboard Shortcuts"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.enableTradingTerminal}
                      onChange={(e) =>
                        updatePreferences({
                          enableTradingTerminal: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Enable Trading Terminal (Expert Mode)"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max WebSocket Connections"
                  value={preferences.maxWebSocketConnections}
                  onChange={(e) =>
                    updatePreferences({
                      maxWebSocketConnections: parseInt(e.target.value),
                    })
                  }
                  helperText="Maximum number of concurrent real-time data streams"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                  Expert Modules
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Enable advanced features for expert trading mode
                </Typography>
                <ExpertModuleToggles
                  mode={preferences.dashboardMode}
                  enabledModules={expertModules}
                  onModuleToggle={handleModuleToggle}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Save Button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" size="large" onClick={handleSave}>
              Save Settings
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
