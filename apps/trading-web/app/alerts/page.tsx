'use client'

/**
 * Alert Management Page
 * Create and manage price alerts, indicator alerts, and notifications
 */
import { useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Add,
  Delete,
  NotificationsActive,
  NotificationsOff,
  TrendingUp,
  ShowChart,
  Newspaper,
  AccountBalance,
} from '@mui/icons-material'
import { useAlertStore, AlertType, AlertCondition } from '@/lib/stores/alertStore'

interface TabPanelProps {
  children?: React.ReactNode
  value: number
  index: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const alertTypeIcons = {
  price: <TrendingUp />,
  indicator: <ShowChart />,
  pattern: <ShowChart />,
  volume: <ShowChart />,
  news: <Newspaper />,
  portfolio: <AccountBalance />,
}

export default function AlertsPage() {
  const {
    alerts,
    notifications,
    addAlert,
    deleteAlert,
    toggleAlert,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getActiveAlerts,
    getUnreadCount,
  } = useAlertStore()

  const [activeTab, setActiveTab] = useState(0)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  // Form state
  const [alertType, setAlertType] = useState<AlertType>('price')
  const [symbol, setSymbol] = useState('AAPL')
  const [condition, setCondition] = useState<AlertCondition>('above')
  const [value, setValue] = useState(0)
  const [alertName, setAlertName] = useState('')
  const [message, setMessage] = useState('')
  const [notifyEmail, setNotifyEmail] = useState(false)
  const [notifyPush, setNotifyPush] = useState(true)
  const [notifySound, setNotifySound] = useState(true)
  const [repeatOnce, setRepeatOnce] = useState(true)

  const activeAlerts = getActiveAlerts()
  const unreadCount = getUnreadCount()

  const handleAddAlert = () => {
    addAlert({
      type: alertType,
      symbol,
      name: alertName || `${symbol} ${condition} ${value}`,
      condition,
      value,
      message: message || `${symbol} has crossed ${value}`,
      notifyEmail,
      notifyPush,
      notifySound,
      repeatOnce,
    })

    setAddDialogOpen(false)
    // Reset form
    setAlertType('price')
    setSymbol('AAPL')
    setCondition('above')
    setValue(0)
    setAlertName('')
    setMessage('')
    setNotifyEmail(false)
    setNotifyPush(true)
    setNotifySound(true)
    setRepeatOnce(true)
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Alerts & Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage price alerts and stay informed about market movements
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddDialogOpen(true)}
        >
          Create Alert
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Active Alerts
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {activeAlerts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Alerts
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {alerts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Triggered Today
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {alerts.filter((a) => a.status === 'triggered').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Unread Notifications
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {unreadCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts & Notifications */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label={`Active Alerts (${activeAlerts.length})`} />
            <Tab label={`All Alerts (${alerts.length})`} />
            <Tab label={`Notifications (${notifications.length})`} />
          </Tabs>
        </Box>

        <CardContent>
          <TabPanel value={activeTab} index={0}>
            <AlertTable
              alerts={activeAlerts}
              onToggle={toggleAlert}
              onDelete={deleteAlert}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <AlertTable
              alerts={alerts}
              onToggle={toggleAlert}
              onDelete={deleteAlert}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button size="small" onClick={markAllAsRead}>
                Mark All as Read
              </Button>
            </Box>

            {notifications.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {notifications.map((notif) => (
                  <Card
                    key={notif.id}
                    variant="outlined"
                    sx={{
                      backgroundColor: notif.read ? 'transparent' : 'action.hover',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {notif.title}
                            </Typography>
                            {!notif.read && (
                              <Chip size="small" label="NEW" color="primary" />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {notif.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {new Date(notif.timestamp).toLocaleString()}
                          </Typography>
                        </Box>

                        <Box>
                          {!notif.read && (
                            <Button
                              size="small"
                              onClick={() => markAsRead(notif.id)}
                            >
                              Mark Read
                            </Button>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => deleteNotification(notif.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                No notifications
              </Typography>
            )}
          </TabPanel>
        </CardContent>
      </Card>

      {/* Add Alert Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Alert</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Alert Type</InputLabel>
                <Select value={alertType} onChange={(e) => setAlertType(e.target.value as AlertType)}>
                  <MenuItem value="price">Price Alert</MenuItem>
                  <MenuItem value="indicator">Indicator Alert</MenuItem>
                  <MenuItem value="volume">Volume Alert</MenuItem>
                  <MenuItem value="news">News Alert</MenuItem>
                  <MenuItem value="portfolio">Portfolio Alert</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select value={condition} onChange={(e) => setCondition(e.target.value as AlertCondition)}>
                  <MenuItem value="above">Above</MenuItem>
                  <MenuItem value="below">Below</MenuItem>
                  <MenuItem value="crosses_above">Crosses Above</MenuItem>
                  <MenuItem value="crosses_below">Crosses Below</MenuItem>
                  <MenuItem value="equals">Equals</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Target Value"
                type="number"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value))}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Alert Name (optional)"
                value={alertName}
                onChange={(e) => setAlertName(e.target.value)}
                helperText="If empty, will be auto-generated"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message (optional)"
                multiline
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Notification Settings
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifyPush}
                    onChange={(e) => setNotifyPush(e.target.checked)}
                  />
                }
                label="Push Notification"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifySound}
                    onChange={(e) => setNotifySound(e.target.checked)}
                  />
                }
                label="Sound Alert"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                  />
                }
                label="Email Notification"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={repeatOnce}
                    onChange={(e) => setRepeatOnce(e.target.checked)}
                  />
                }
                label="Trigger Once Only"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddAlert}>
            Create Alert
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

function AlertTable({
  alerts,
  onToggle,
  onDelete,
}: {
  alerts: any[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  if (alerts.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
        No alerts to display
      </Typography>
    )
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Alert</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>Condition</TableCell>
            <TableCell align="right">Target</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Enabled</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {alertTypeIcons[alert.type as AlertType]}
                  <Typography fontWeight={600}>{alert.name}</Typography>
                </Box>
              </TableCell>
              <TableCell>{alert.symbol}</TableCell>
              <TableCell>
                <Chip size="small" label={alert.condition.replace('_', ' ')} />
              </TableCell>
              <TableCell align="right">${alert.value.toFixed(2)}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={alert.status}
                  color={
                    alert.status === 'active'
                      ? 'success'
                      : alert.status === 'triggered'
                      ? 'warning'
                      : 'default'
                  }
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  onClick={() => onToggle(alert.id)}
                  color={alert.status === 'active' ? 'primary' : 'default'}
                >
                  {alert.status === 'active' ? (
                    <NotificationsActive />
                  ) : (
                    <NotificationsOff />
                  )}
                </IconButton>
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onDelete(alert.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
