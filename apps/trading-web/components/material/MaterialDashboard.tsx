"use client"

import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card as MUICard,
  CardHeader as MUICardHeader,
  CardContent as MUICardContent,
  Button,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Menu,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material'
import { TrendingUp, Star, User, ChevronDown, BarChart3, LineChart, Zap } from 'lucide-react'
import { StockPrice } from '../StockPrice'
import dynamic from 'next/dynamic'
import { TechnicalIndicators } from '../TechnicalIndicators'
import { TechnicalAnalysis } from '../TechnicalAnalysis'
import { Portfolio } from '../Portfolio'
import { AlertsNotifications } from '../AlertsNotifications'
import { TradingSignals } from '../TradingSignals'
import { MLForecast } from '../MLForecast'
import RealTimeAlerts from '../daytrading/RealTimeAlerts'
import DayTradingDashboard from '../daytrading/DayTradingDashboard'
import { marketDataAPI } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'
import { UserProfile } from '../auth/UserProfile'

type TabKey = 'overview' | 'technical' | 'analysis' | 'portfolio' | 'alerts' | 'signals' | 'daytrading' | 'profile'

function MaterialDashboardImpl({ defaultSymbol = 'AAPL' }: { defaultSymbol?: string }) {
  const { user, logout } = useAuth()
  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol)
  const [searchQuery, setSearchQuery] = useState('')
  const [watchlist, setWatchlist] = useState(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'])
  const [chartPeriod, setChartPeriod] = useState('1y')
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  const handleSymbolChange = (symbol: string) => {
    setSelectedSymbol(symbol)
    setSearchQuery('')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) handleSymbolChange(searchQuery.toUpperCase())
  }

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) setWatchlist([...watchlist, symbol])
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(s => s !== symbol))
  }

  useEffect(() => {
    const load = async () => {
      try {
        const data = await marketDataAPI.getHistoricalData(selectedSymbol, chartPeriod)
        setHistoricalData(data)
      } catch {
        setHistoricalData([])
      }
    }
    load()
  }, [selectedSymbol, chartPeriod])

  return (
    <Box sx={{ width: '100%', height: '100vh', bgcolor: 'background.default', overflowY: 'auto', scrollbarGutter: 'stable' }}>
      <AppBar position="sticky" color="default">
        <Toolbar sx={{ gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp className="h-6 w-6" />
            <Typography variant="h6">Trading Platform</Typography>
          </Box>

          <Box component="form" onSubmit={handleSearch} sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search symbol (e.g., AAPL)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="contained">Search</Button>
          </Box>

          <Box>
            <Button
              variant="outlined"
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              startIcon={<User className="h-4 w-4" />}
              endIcon={<ChevronDown className="h-4 w-4" />}
            >
              {user?.firstName || 'User'}
            </Button>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
              <MenuItem onClick={() => { setActiveTab('profile'); setMenuAnchor(null) }}>Profile Settings</MenuItem>
              <MenuItem onClick={() => { logout(); setMenuAnchor(null) }} sx={{ color: 'error.main' }}>Sign Out</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Tab bar under header */}
        <Paper variant="outlined" sx={{ p: 1, mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            onClick={() => setActiveTab('overview')}
            variant={activeTab === 'overview' ? 'contained' : 'text'}
            startIcon={<BarChart3 className="h-4 w-4" />}
          >
            Overview
          </Button>
          <Button
            onClick={() => setActiveTab('daytrading')}
            variant={activeTab === 'daytrading' ? 'contained' : 'text'}
            startIcon={<Zap className="h-4 w-4" />}
          >
            Day Trading
          </Button>
          <Button
            onClick={() => setActiveTab('technical')}
            variant={activeTab === 'technical' ? 'contained' : 'text'}
            startIcon={<LineChart className="h-4 w-4" />}
          >
            Technical Analysis
          </Button>
          <Button onClick={() => setActiveTab('analysis')} variant={activeTab === 'analysis' ? 'contained' : 'text'}>
            Analysis
          </Button>
          <Button onClick={() => setActiveTab('portfolio')} variant={activeTab === 'portfolio' ? 'contained' : 'text'}>
            Portfolio
          </Button>
          <Button onClick={() => setActiveTab('alerts')} variant={activeTab === 'alerts' ? 'contained' : 'text'}>
            Alerts
          </Button>
          <Button onClick={() => setActiveTab('signals')} variant={activeTab === 'signals' ? 'contained' : 'text'}>
            Signals
          </Button>
          <Button onClick={() => setActiveTab('profile')} variant={activeTab === 'profile' ? 'contained' : 'text'}>
            Profile
          </Button>
        </Paper>

        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} md="auto" sx={{ flexBasis: { md: 250 }, maxWidth: { md: 250 } }}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 16 }, height: { md: 'calc(100vh - 80px)' }, width: { md: 250 } }}>
              <MUICard>
              <MUICardHeader title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star className="h-4 w-4" />
                  <Typography variant="subtitle1">Watchlist</Typography>
                </Box>
              }/>
              <MUICardContent>
                <List dense>
                  {watchlist.map((symbol) => (
                    <ListItem
                      key={symbol}
                      divider
                      secondaryAction={
                        <Button color="error" size="small" onClick={(e) => { e.stopPropagation(); removeFromWatchlist(symbol) }}>
                          Remove
                        </Button>
                      }
                      onClick={() => handleSymbolChange(symbol)}
                      sx={{ cursor: 'pointer', bgcolor: selectedSymbol === symbol ? 'action.selected' : 'transparent', borderRadius: 1 }}
                    >
                      <ListItemText primaryTypographyProps={{ fontWeight: 600 }} primary={symbol} />
                    </ListItem>
                  ))}
                </List>
                {selectedSymbol && !watchlist.includes(selectedSymbol) && (
                  <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => addToWatchlist(selectedSymbol)}>
                    + Add {selectedSymbol} to Watchlist
                  </Button>
                )}
              </MUICardContent>
            </MUICard>

            <Box sx={{ mt: 3 }}>
              <StockPrice symbol={selectedSymbol} />
            </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md sx={{ flexBasis: { md: 'calc(100% - 280px)' }, maxWidth: { md: 'calc(100% - 250px)' } }}>

            {activeTab === 'overview' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Paper variant="outlined" sx={{ p: 1, display: 'inline-flex', alignSelf: 'flex-start' }}>
                  <ToggleButtonGroup
                    size="small"
                    color="primary"
                    exclusive
                    value={chartPeriod}
                    onChange={(_, v) => v && setChartPeriod(v)}
                  >
                    <ToggleButton value="1d">Day</ToggleButton>
                    <ToggleButton value="5d">Week</ToggleButton>
                    <ToggleButton value="1mo">Month</ToggleButton>
                    <ToggleButton value="6mo">6M</ToggleButton>
                    <ToggleButton value="1y">Year</ToggleButton>
                  </ToggleButtonGroup>
                </Paper>
                <StockChart
                  symbol={selectedSymbol}
                  period={chartPeriod}
                  onPeriodChange={setChartPeriod}
                  mode="expert"
                />
                <TradingSignals watchlist={watchlist} onSymbolSelect={handleSymbolChange} />
              </Box>
            )}

            {activeTab === 'technical' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TechnicalIndicators symbol={selectedSymbol} data={historicalData} />
              </Box>
            )}

            {activeTab === 'analysis' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TechnicalAnalysis symbol={selectedSymbol} />
              </Box>
            )}

            {activeTab === 'portfolio' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Portfolio
                  watchlist={watchlist}
                  onSymbolSelect={handleSymbolChange}
                  onAddToWatchlist={addToWatchlist}
                  onRemoveFromWatchlist={removeFromWatchlist}
                />
              </Box>
            )}

            {activeTab === 'alerts' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <AlertsNotifications watchlist={watchlist} selectedSymbol={selectedSymbol} />
              </Box>
            )}

            {activeTab === 'signals' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <RealTimeAlerts symbols={[selectedSymbol, ...watchlist.slice(0, 4)]} />
                <MLForecast symbol={selectedSymbol} />
              </Box>
            )}

            {activeTab === 'daytrading' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <DayTradingDashboard defaultSymbol={selectedSymbol} />
              </Box>
            )}

            {activeTab === 'profile' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <UserProfile />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export const MaterialDashboard = React.memo(MaterialDashboardImpl)
export default MaterialDashboard
const StockChart = dynamic(() => import('../StockChart').then((mod) => mod.StockChart), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full animate-pulse rounded-xl bg-gray-100" />
  ),
})
