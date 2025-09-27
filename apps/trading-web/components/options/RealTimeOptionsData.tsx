"use client"

import React from 'react'
import { 
  Paper, Typography, Box, Grid, Chip, Alert, IconButton,
  LinearProgress, Tooltip
} from '@mui/material'
import { 
  Refresh, Wifi, WifiOff, TrendingUp, TrendingDown, 
  ShowChart, Timeline, Speed
} from '@mui/icons-material'
import { useOptionsWebSocket } from '../../hooks/useOptionsWebSocket'

interface Props {
  symbol: string
}

export default function RealTimeOptionsData({ symbol }: Props) {
  const { data, connected, error, reconnect } = useOptionsWebSocket(symbol)

  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`
    return volume.toString()
  }

  const getIVRankColor = (ivRank: number) => {
    if (ivRank < 20) return 'success'
    if (ivRank < 50) return 'warning'
    return 'error'
  }

  const getVolumeRatioColor = (ratio: number) => {
    if (ratio > 1.5) return 'success' // Call heavy
    if (ratio < 0.67) return 'error'  // Put heavy
    return 'warning' // Balanced
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Speed />
          Real-Time Options Data - {symbol}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={connected ? <Wifi /> : <WifiOff />}
            label={connected ? 'Connected' : 'Disconnected'}
            color={connected ? 'success' : 'error'}
            size="small"
          />
          <Tooltip title="Reconnect">
            <IconButton onClick={reconnect} size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!data ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <LinearProgress sx={{ width: '100%', mb: 2 }} />
          <Typography color="text.secondary">
            Connecting to real-time options data...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Underlying Price */}
          <Grid item xs={12} md={6} lg={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {formatPrice(data.underlying_price)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Underlying Price
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last updated: {new Date(data.timestamp).toLocaleTimeString()}
              </Typography>
            </Box>
          </Grid>

          {/* Options Chain Info */}
          {data.type === 'options_chain' && (
            <>
              <Grid item xs={6} md={3} lg={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    {data.calls}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Call Contracts
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3} lg={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" color="error.main">
                    {data.puts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Put Contracts
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} lg={5}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Available Expiries:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {data.expiries?.map((expiry, index) => (
                    <Chip 
                      key={index}
                      label={new Date(expiry).toLocaleDateString()}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
            </>
          )}

          {/* Real-time Options Metrics */}
          {data.type === 'options_update' && (
            <>
              {/* IV Rank */}
              <Grid item xs={6} md={3} lg={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip
                    label={`${data.iv_rank?.toFixed(1)}%`}
                    color={getIVRankColor(data.iv_rank || 0) as any}
                    sx={{ fontSize: '1.1rem', fontWeight: 'bold', minWidth: 80 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    IV Rank
                  </Typography>
                </Box>
              </Grid>

              {/* ATM Call IV */}
              <Grid item xs={6} md={3} lg={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {formatPercent(data.atm_call_iv || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ATM Call IV
                  </Typography>
                </Box>
              </Grid>

              {/* ATM Put IV */}
              <Grid item xs={6} md={3} lg={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color="error.main">
                    {formatPercent(data.atm_put_iv || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ATM Put IV
                  </Typography>
                </Box>
              </Grid>

              {/* Volume Ratio */}
              <Grid item xs={6} md={3} lg={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip
                    icon={data.volume_ratio && data.volume_ratio > 1 ? <TrendingUp /> : <TrendingDown />}
                    label={data.volume_ratio?.toFixed(2)}
                    color={getVolumeRatioColor(data.volume_ratio || 1) as any}
                    sx={{ fontSize: '1rem', fontWeight: 'bold' }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Call/Put Ratio
                  </Typography>
                </Box>
              </Grid>

              {/* Total Volume */}
              <Grid item xs={12} md={6} lg={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    {formatVolume(data.total_volume || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Options Volume
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                    <Timeline fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      Top 5 strikes combined
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      )}

      {/* Connection Status Bar */}
      <Box sx={{ 
        mt: 2, 
        p: 1, 
        backgroundColor: connected ? 'success.light' : 'error.light',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        {connected ? <Wifi fontSize="small" /> : <WifiOff fontSize="small" />}
        <Typography variant="caption">
          {connected 
            ? `Real-time data streaming for ${symbol} options` 
            : 'Real-time data disconnected - Click refresh to reconnect'
          }
        </Typography>
      </Box>
    </Paper>
  )
}