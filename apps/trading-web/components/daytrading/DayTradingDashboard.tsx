"use client"

import React, { useEffect, useState } from 'react'
import { Box, Container, Grid, Paper, TextField, Button, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import dynamic from 'next/dynamic'
import RealTimeAlerts from './RealTimeAlerts'
import OptionsGreeks from './OptionsGreeks'
import OptionsAnalysis from '../options/OptionsAnalysis'
// import OptionsTrading from './OptionsTrading'

interface Props { defaultSymbol?: string }

export default function DayTradingDashboard({ defaultSymbol = 'AAPL' }: Props) {
  const [symbol, setSymbol] = useState(defaultSymbol)
  const [input, setInput] = useState(defaultSymbol)
  const [watchlist, setWatchlist] = useState<string[]>(['AAPL','NVDA','SPY','QQQ'])
  const [period, setPeriod] = useState<string>('1d')

  useEffect(() => {
    if (!watchlist.includes(symbol)) setWatchlist([symbol, ...watchlist])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol])

  return (
    <Box sx={{ width: '100%', height: '100vh', bgcolor: 'background.default', overflowY: 'auto', scrollbarGutter: 'stable' }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6">Day Trading</Typography>
          <TextField size="small" value={input} onChange={e => setInput(e.target.value.toUpperCase())} placeholder="Symbol" />
          <Button variant="contained" onClick={() => setSymbol(input)}>Load</Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper variant="outlined" sx={{ p: 1, display: 'inline-flex', alignSelf: 'flex-start' }}>
                <ToggleButtonGroup
                  size="small"
                  color="primary"
                  exclusive
                  value={period}
                  onChange={(_, v) => v && setPeriod(v)}
                >
                  <ToggleButton value="1d">Day</ToggleButton>
                  <ToggleButton value="5d">Week</ToggleButton>
                  <ToggleButton value="1mo">Month</ToggleButton>
                  <ToggleButton value="6mo">6M</ToggleButton>
                  <ToggleButton value="1y">Year</ToggleButton>
                </ToggleButtonGroup>
              </Paper>
              <StockChart symbol={symbol} period={period} height={400} mode="expert" />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <RealTimeAlerts symbols={[symbol, ...watchlist.slice(0,3)]} />
          </Grid>
          
          {/* Enhanced Options Analysis Section */}
          <Grid item xs={12}>
            <OptionsAnalysis symbol={symbol} tradingType="day" showEducational={false} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
const StockChart = dynamic(() => import('../StockChart').then((mod) => mod.StockChart), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full animate-pulse rounded-xl bg-gray-100" />
  ),
})
