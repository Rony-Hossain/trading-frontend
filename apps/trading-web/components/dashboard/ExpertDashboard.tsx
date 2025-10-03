'use client'

/**
 * Expert Dashboard
 * Advanced interface with multi-chart layout, order book, and trading terminal
 */
import { useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  ButtonGroup,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material'
import {
  GridView,
  ViewAgenda,
  ViewModule,
  Apps,
} from '@mui/icons-material'
import { TradingChart } from '../charts/TradingChart'
import { useChartStore, ChartLayout } from '@/lib/stores/chartStore'
import { useMarketStore } from '@/lib/stores/marketStore'

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

export function ExpertDashboard() {
  const { layout, setLayout, charts } = useChartStore()
  const { positions, orders } = useMarketStore()
  const [activeTab, setActiveTab] = useState(0)

  // Order entry state
  const [orderSymbol, setOrderSymbol] = useState('AAPL')
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('limit')
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy')
  const [quantity, setQuantity] = useState(100)
  const [price, setPrice] = useState(0)

  const getGridLayout = (chartLayout: ChartLayout) => {
    switch (chartLayout) {
      case 1:
        return { xs: 12 }
      case 2:
        return { xs: 12, md: 6 }
      case 4:
        return { xs: 12, md: 6, lg: 6 }
      case 6:
        return { xs: 12, md: 6, lg: 4 }
      default:
        return { xs: 12 }
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Expert Dashboard
        </Typography>

        {/* Layout Selector */}
        <ButtonGroup variant="outlined" size="small">
          <IconButton
            color={layout === 1 ? 'primary' : 'default'}
            onClick={() => setLayout(1)}
          >
            <ViewAgenda />
          </IconButton>
          <IconButton
            color={layout === 2 ? 'primary' : 'default'}
            onClick={() => setLayout(2)}
          >
            <ViewModule />
          </IconButton>
          <IconButton
            color={layout === 4 ? 'primary' : 'default'}
            onClick={() => setLayout(4)}
          >
            <GridView />
          </IconButton>
          <IconButton
            color={layout === 6 ? 'primary' : 'default'}
            onClick={() => setLayout(6)}
          >
            <Apps />
          </IconButton>
        </ButtonGroup>
      </Box>

      <Grid container spacing={2}>
        {/* Charts Area */}
        <Grid item xs={12} lg={9}>
          <Grid container spacing={2}>
            {charts.slice(0, layout).map((chart) => (
              <Grid item key={chart.chartId} {...getGridLayout(layout)}>
                <TradingChart chartId={chart.chartId} height={layout === 1 ? 600 : 400} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} lg={3}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Entry
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Symbol</InputLabel>
                <Select
                  value={orderSymbol}
                  onChange={(e) => setOrderSymbol(e.target.value)}
                  size="small"
                >
                  <MenuItem value="AAPL">AAPL</MenuItem>
                  <MenuItem value="MSFT">MSFT</MenuItem>
                  <MenuItem value="GOOGL">GOOGL</MenuItem>
                  <MenuItem value="TSLA">TSLA</MenuItem>
                </Select>
              </FormControl>

              <ButtonGroup fullWidth sx={{ mb: 2 }}>
                <Button
                  variant={orderSide === 'buy' ? 'contained' : 'outlined'}
                  color="success"
                  onClick={() => setOrderSide('buy')}
                >
                  Buy
                </Button>
                <Button
                  variant={orderSide === 'sell' ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => setOrderSide('sell')}
                >
                  Sell
                </Button>
              </ButtonGroup>

              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                size="small"
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Order Type</InputLabel>
                <Select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value as any)}
                  size="small"
                >
                  <MenuItem value="market">Market</MenuItem>
                  <MenuItem value="limit">Limit</MenuItem>
                  <MenuItem value="stop">Stop</MenuItem>
                </Select>
              </FormControl>

              {orderType !== 'market' && (
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  size="small"
                  sx={{ mb: 2 }}
                />
              )}

              <Button
                fullWidth
                variant="contained"
                color={orderSide === 'buy' ? 'success' : 'error'}
                size="large"
              >
                {orderSide === 'buy' ? 'Buy' : 'Sell'} {orderSymbol}
              </Button>
            </CardContent>
          </Card>

          {/* Order Book */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Book
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Price</TableCell>
                      <TableCell align="right">Size</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Mock ask data */}
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={`ask_${i}`}>
                        <TableCell sx={{ color: 'error.main' }}>
                          {(185.5 + i * 0.1).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {Math.floor(Math.random() * 1000)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ fontWeight: 600 }}>
                        ---
                      </TableCell>
                    </TableRow>
                    {/* Mock bid data */}
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={`bid_${i}`}>
                        <TableCell sx={{ color: 'success.main' }}>
                          {(185.4 - i * 0.1).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {Math.floor(Math.random() * 1000)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Positions & Orders */}
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                  <Tab label="Positions" />
                  <Tab label="Orders" />
                </Tabs>
              </Box>

              <TabPanel value={activeTab} index={0}>
                {positions.length > 0 ? (
                  <List dense>
                    {positions.map((position) => (
                      <ListItem key={position.symbol}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" fontWeight={600}>
                                {position.symbol}
                              </Typography>
                              <Chip
                                size="small"
                                label={`${position.unrealizedPnlPercent >= 0 ? '+' : ''}${position.unrealizedPnlPercent.toFixed(2)}%`}
                                color={position.unrealizedPnlPercent >= 0 ? 'success' : 'error'}
                              />
                            </Box>
                          }
                          secondary={`${position.quantity} @ $${position.currentPrice.toFixed(2)}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    No open positions
                  </Typography>
                )}
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                {orders.length > 0 ? (
                  <List dense>
                    {orders.map((order) => (
                      <ListItem key={order.id}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" fontWeight={600}>
                                {order.symbol}
                              </Typography>
                              <Chip
                                size="small"
                                label={order.status}
                                color={
                                  order.status === 'filled'
                                    ? 'success'
                                    : order.status === 'pending'
                                    ? 'warning'
                                    : 'default'
                                }
                              />
                            </Box>
                          }
                          secondary={`${order.side.toUpperCase()} ${order.quantity} @ ${order.type}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    No active orders
                  </Typography>
                )}
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
