"use client"

import React, { useState, useEffect } from 'react'
import { Paper, Typography, Box, Grid, Chip, CircularProgress, Button, Divider } from '@mui/material'

interface GreeksData {
  delta: number
  gamma: number
  theta: number
  vega: number
  rho: number
}

interface OptionContract {
  symbol: string
  strike: number
  expiry: string
  option_type: 'call' | 'put'
  bid: number
  ask: number
  mid_price: number
  volume: number
  open_interest: number
  implied_volatility: number
  greeks: GreeksData
  liquidity_score: number
}

interface Props {
  symbol: string
}

export default function OptionsGreeks({ symbol }: Props) {
  const [loading, setLoading] = useState(false)
  const [optionsData, setOptionsData] = useState<OptionContract[]>([])
  const [error, setError] = useState('')

  const fetchGreeksData = async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        sentiment: 'bullish',
        target_delta: '0.3',
        max_dte: '7',
      })
      const response = await fetch(
        `/api/options/${encodeURIComponent(symbol)}/suggestions?${params.toString()}`,
        { cache: 'no-store' }
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      if (data.suggestions && data.suggestions.length > 0) {
        // Get the first suggestion's contracts for display
        setOptionsData(data.suggestions[0].contracts || [])
      }
    } catch (err) {
      setError(`Failed to fetch Greeks data: ${err.message}`)
      console.error('Greeks data error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (symbol) {
      fetchGreeksData()
    }
  }, [symbol])

  const formatGreek = (value: number | undefined, decimals: number = 4) => {
    return value?.toFixed(decimals) || '0.0000'
  }

  const formatPrice = (value: number | undefined, decimals: number = 2) => {
    return value?.toFixed(decimals) || '0.00'
  }

  const getGreekColor = (greek: string, value: number) => {
    switch (greek) {
      case 'delta':
        return value > 0 ? 'success' : 'error'
      case 'theta':
        return value < 0 ? 'error' : 'success'
      case 'gamma':
        return 'info'
      case 'vega':
        return 'warning'
      case 'rho':
        return 'secondary'
      default:
        return 'default'
    }
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Options Greeks - {symbol}
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={fetchGreeksData}
          disabled={loading}
        >
          {loading ? <CircularProgress size={16} /> : 'Refresh'}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        The "Greeks" measure an option's sensitivity to various factors and are essential for understanding options risk.
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : optionsData.length > 0 ? (
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Sample Options Contract Analysis
          </Typography>
          
          {optionsData.slice(0, 2).map((contract, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    {contract.option_type.toUpperCase()} ${contract.strike}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(contract.expiry).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    Price: ${formatPrice(contract.mid_price)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    IV: {formatPrice((contract.implied_volatility || 0) * 100, 1)}%
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" sx={{ mb: 1 }}>Primary Greeks:</Typography>
              
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={6} sm={2.4}>
                  <Chip
                    label={`Δ ${formatGreek(contract.greeks?.delta, 3)}`}
                    color={getGreekColor('delta', contract.greeks?.delta || 0)}
                    variant="outlined"
                    size="small"
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    Price sensitivity
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={2.4}>
                  <Chip
                    label={`Γ ${formatGreek(contract.greeks?.gamma, 4)}`}
                    color={getGreekColor('gamma', contract.greeks?.gamma || 0)}
                    variant="outlined"
                    size="small"
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    Delta acceleration
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={2.4}>
                  <Chip
                    label={`Θ ${formatGreek(contract.greeks?.theta, 3)}`}
                    color={getGreekColor('theta', contract.greeks?.theta || 0)}
                    variant="outlined"
                    size="small"
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    Time decay
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={2.4}>
                  <Chip
                    label={`ν ${formatGreek(contract.greeks?.vega, 3)}`}
                    color={getGreekColor('vega', contract.greeks?.vega || 0)}
                    variant="outlined"
                    size="small"
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    Volatility sensitivity
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={2.4}>
                  <Chip
                    label={`ρ ${formatGreek(contract.greeks?.rho, 4)}`}
                    color={getGreekColor('rho', contract.greeks?.rho || 0)}
                    variant="outlined"
                    size="small"
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    Interest rate sensitivity
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Chip 
                  label={`Volume: ${(contract.volume || 0).toLocaleString()}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`OI: ${(contract.open_interest || 0).toLocaleString()}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Liquidity: ${(contract.liquidity_score || 0).toFixed(0)}/100`} 
                  size="small" 
                  variant="outlined" 
                  color={(contract.liquidity_score || 0) > 70 ? 'success' : (contract.liquidity_score || 0) > 40 ? 'warning' : 'error'}
                />
              </Box>
            </Box>
          ))}

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Greeks Quick Reference:</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Delta (Δ):</strong> Price change per $1 stock move
                </Typography>
                <Typography variant="body2">
                  <strong>Gamma (Γ):</strong> Rate of change of Delta
                </Typography>
                <Typography variant="body2">
                  <strong>Theta (Θ):</strong> Daily time decay
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Vega (ν):</strong> Sensitivity to volatility changes
                </Typography>
                <Typography variant="body2">
                  <strong>Rho (ρ):</strong> Sensitivity to interest rate changes
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      ) : (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No options data available. Click Refresh to load Greeks data.
        </Typography>
      )}
    </Paper>
  )
}
