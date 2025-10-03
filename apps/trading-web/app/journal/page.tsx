'use client'

/**
 * Trade Journal Page
 * Comprehensive trade tracking and performance analysis
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
  Tabs,
  Tab,
} from '@mui/material'
import {
  Add,
  TrendingUp,
  TrendingDown,
  Edit,
  Delete,
  FilterList,
} from '@mui/icons-material'
import { useJournalStore } from '@/lib/stores/journalStore'

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

export default function JournalPage() {
  const {
    trades,
    getStats,
    getOpenTrades,
    getClosedTrades,
    addTrade,
    closeTrade,
    deleteTrade,
  } = useJournalStore()

  const [activeTab, setActiveTab] = useState(0)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  // Form state
  const [symbol, setSymbol] = useState('AAPL')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [quantity, setQuantity] = useState(100)
  const [entryPrice, setEntryPrice] = useState(0)
  const [strategy, setStrategy] = useState('')
  const [notes, setNotes] = useState('')

  const stats = getStats()
  const openTrades = getOpenTrades()
  const closedTrades = getClosedTrades()

  const handleAddTrade = () => {
    addTrade({
      symbol,
      side,
      quantity,
      entryPrice,
      entryDate: Date.now(),
      fees: 0,
      status: 'open',
      strategy,
      notes,
    })

    setAddDialogOpen(false)
    // Reset form
    setSymbol('AAPL')
    setSide('buy')
    setQuantity(100)
    setEntryPrice(0)
    setStrategy('')
    setNotes('')
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Trade Journal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and analyze your trading performance
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Trade
        </Button>
      </Box>

      {/* Performance Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total P&L
              </Typography>
              <Typography
                variant="h4"
                fontWeight={600}
                color={stats.totalPnl >= 0 ? 'success.main' : 'error.main'}
              >
                ${stats.totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Win Rate
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {stats.winRate.toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.winningTrades}W / {stats.losingTrades}L
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Profit Factor
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Avg Win: ${stats.averageWin.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Trades
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {stats.totalTrades}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {openTrades.length} open
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Trades Table */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label={`All Trades (${trades.length})`} />
            <Tab label={`Open (${openTrades.length})`} />
            <Tab label={`Closed (${closedTrades.length})`} />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        <CardContent>
          <TabPanel value={activeTab} index={0}>
            <TradeTable trades={trades} onDelete={deleteTrade} />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <TradeTable trades={openTrades} onDelete={deleteTrade} />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <TradeTable trades={closedTrades} onDelete={deleteTrade} />
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <MetricRow label="Average Win" value={`$${stats.averageWin.toFixed(2)}`} />
                  <MetricRow label="Average Loss" value={`$${stats.averageLoss.toFixed(2)}`} />
                  <MetricRow label="Largest Win" value={`$${stats.largestWin.toFixed(2)}`} />
                  <MetricRow label="Largest Loss" value={`$${stats.largestLoss.toFixed(2)}`} />
                  <MetricRow
                    label="Avg Holding Time"
                    value={`${Math.floor(stats.averageHoldingTime / 60)}h ${Math.floor(stats.averageHoldingTime % 60)}m`}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Best & Worst Days
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Best Day
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        ${stats.bestDay.pnl.toFixed(2)}
                      </Typography>
                      <Typography variant="caption">
                        {stats.bestDay.date || 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Worst Day
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        ${stats.worstDay.pnl.toFixed(2)}
                      </Typography>
                      <Typography variant="caption">
                        {stats.worstDay.date || 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Add Trade Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Trade</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
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
                <InputLabel>Side</InputLabel>
                <Select value={side} onChange={(e) => setSide(e.target.value as any)}>
                  <MenuItem value="buy">Buy</MenuItem>
                  <MenuItem value="sell">Sell</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Entry Price"
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(parseFloat(e.target.value))}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Strategy (optional)"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes (optional)"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddTrade}>
            Add Trade
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

function TradeTable({
  trades,
  onDelete,
}: {
  trades: any[]
  onDelete: (id: string) => void
}) {
  if (trades.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
        No trades to display
      </Typography>
    )
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Side</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Entry</TableCell>
            <TableCell align="right">Exit</TableCell>
            <TableCell align="right">P&L</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell>
                <Typography fontWeight={600}>{trade.symbol}</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={trade.side.toUpperCase()}
                  color={trade.side === 'buy' ? 'success' : 'error'}
                />
              </TableCell>
              <TableCell align="right">{trade.quantity}</TableCell>
              <TableCell align="right">${trade.entryPrice.toFixed(2)}</TableCell>
              <TableCell align="right">
                {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-'}
              </TableCell>
              <TableCell align="right">
                {trade.pnl !== undefined ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                    {trade.pnl >= 0 ? (
                      <TrendingUp fontSize="small" color="success" />
                    ) : (
                      <TrendingDown fontSize="small" color="error" />
                    )}
                    <Typography
                      color={trade.pnl >= 0 ? 'success.main' : 'error.main'}
                      fontWeight={600}
                    >
                      ${Math.abs(trade.pnl).toFixed(2)}
                    </Typography>
                  </Box>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={trade.status}
                  color={trade.status === 'open' ? 'warning' : 'default'}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onDelete(trade.id)}>
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

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  )
}
