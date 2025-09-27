"use client"

import React, { useState, useEffect } from 'react'
import { 
  Paper, Typography, Box, Grid, Chip, CircularProgress, Button, 
  Divider, Card, CardContent, Tab, Tabs, Alert, Switch, FormControlLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material'
import { TrendingUp, TrendingDown, Timeline, AccountBalance, CallSplit } from '@mui/icons-material'
import RealTimeOptionsData from './RealTimeOptionsData'

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
  last: number
  mid_price: number
  volume: number
  open_interest: number
  implied_volatility: number
  bid_ask_spread: number
  dte: number
  greeks: GreeksData
  intrinsic_value: number
  extrinsic_value: number
  break_even: number
  liquidity_score: number
}

interface TradeSuggestion {
  strategy: string
  sentiment: string
  max_profit: number | string
  max_loss: number
  break_evens: number[]
  probability_profit: number
  capital_required: number
  roi_potential: number
  liquidity_score: number
  strategy_type?: string
  complexity?: string
  time_decay_impact?: string
  volatility_impact?: string
  position_greeks: {
    net_delta: number
    net_theta: number
    net_vega: number
    net_gamma: number
  }
  contracts: OptionContract[]
}

interface Props {
  symbol: string
  tradingType?: 'day' | 'swing' | 'long' | 'all'
  showEducational?: boolean
}

export default function OptionsAnalysis({ symbol, tradingType = 'all', showEducational = true }: Props) {
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [optionsChain, setOptionsChain] = useState<OptionContract[]>([])
  const [suggestions, setSuggestions] = useState<TradeSuggestion[]>([])
  const [advancedStrategies, setAdvancedStrategies] = useState<TradeSuggestion[]>([])
  const [sentiment, setSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('bullish')
  const [maxDTE, setMaxDTE] = useState(tradingType === 'day' ? 7 : tradingType === 'swing' ? 30 : 90)
  const [targetDelta, setTargetDelta] = useState(0.3)
  const [error, setError] = useState('')
  const [showAllGreeks, setShowAllGreeks] = useState(false)
  const [strategyComplexity, setStrategyComplexity] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')

  const fetchOptionsData = async () => {
    setLoading(true)
    setError('')
    try {
      // Fetch suggestions based on trading type
      const suggestionsResponse = await fetch(
        `http://localhost:8002/options/${symbol}/suggestions?sentiment=${sentiment}&target_delta=${targetDelta}&max_dte=${maxDTE}`
      )
      if (suggestionsResponse.ok) {
        const suggestionsData = await suggestionsResponse.json()
        setSuggestions(suggestionsData.suggestions || [])
      }

      // Fetch full options chain
      const chainResponse = await fetch(`http://localhost:8002/options/${symbol}/chain`)
      if (chainResponse.ok) {
        const chainData = await chainResponse.json()
        setOptionsChain([...chainData.calls, ...chainData.puts] || [])
      }

      // Fetch advanced strategies
      const strategiesResponse = await fetch(
        `http://localhost:8002/options/${symbol}/strategies?sentiment=${sentiment}&complexity=${strategyComplexity}`
      )
      if (strategiesResponse.ok) {
        const strategiesData = await strategiesResponse.json()
        setAdvancedStrategies(strategiesData.strategies || [])
      }
    } catch (err) {
      setError(`Failed to fetch options data: ${err.message}`)
      console.error('Options data error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (symbol) {
      fetchOptionsData()
    }
  }, [symbol, sentiment, maxDTE, targetDelta, strategyComplexity])

  const formatGreek = (value: number | undefined, decimals: number = 4) => {
    return value?.toFixed(decimals) || '0.0000'
  }

  const formatPrice = (value: number | undefined, decimals: number = 2) => {
    return value?.toFixed(decimals) || '0.00'
  }

  const formatPercent = (value: number | undefined, decimals: number = 1) => {
    return `${((value || 0) * 100).toFixed(decimals)}%`
  }

  const getGreekColor = (greek: string, value: number) => {
    switch (greek) {
      case 'delta':
        return value > 0 ? 'success' : 'error'
      case 'theta':
        return value < 0 ? 'error' : 'success'
      case 'gamma':
        return value > 0.05 ? 'warning' : 'info'
      case 'vega':
        return value > 0.2 ? 'warning' : 'info'
      case 'rho':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getLiquidityColor = (score: number) => {
    if (score >= 70) return 'success'
    if (score >= 40) return 'warning'
    return 'error'
  }

  const getMoneyness = (contract: OptionContract, underlyingPrice: number = 150) => {
    const diff = contract.option_type === 'call' 
      ? underlyingPrice - contract.strike
      : contract.strike - underlyingPrice
    
    if (Math.abs(diff) <= 2.5) return 'ATM'
    return diff > 0 ? 'ITM' : 'OTM'
  }

  const primaryGreeks = [
    {
      name: 'Delta (Δ)',
      description: 'Price sensitivity to $1 stock move',
      detail: 'Measures how much the option price changes for every $1 change in the underlying stock price. Also represents approximate probability of finishing in-the-money.',
      range: 'Calls: 0 to +1.00, Puts: 0 to -1.00',
      interpretation: 'Higher absolute delta = more sensitive to stock price movements'
    },
    {
      name: 'Gamma (Γ)',
      description: 'Rate of change of Delta',
      detail: 'Shows how much Delta will change as the stock price moves. Highest for at-the-money options, acts as an "accelerator" for option price movements.',
      range: '0 to ~0.1 (varies by time to expiration)',
      interpretation: 'Higher gamma = Delta changes more rapidly with stock price'
    },
    {
      name: 'Theta (Θ)',
      description: 'Time decay per day',
      detail: 'The amount the option loses in value each day due to time passing (all else equal). Accelerates as expiration approaches.',
      range: 'Usually negative for long positions',
      interpretation: 'More negative theta = faster time decay (bad for buyers, good for sellers)'
    },
    {
      name: 'Vega (ν)',
      description: 'Volatility sensitivity',
      detail: 'How much the option price changes for each 1% change in implied volatility. Higher for longer-dated and at-the-money options.',
      range: '0 to several dollars',
      interpretation: 'Higher vega = more sensitive to volatility changes'
    },
    {
      name: 'Rho (ρ)',
      description: 'Interest rate sensitivity',
      detail: 'Change in option price for 1% change in risk-free interest rate. Generally less important for short-term trades.',
      range: 'Small values, varies by time to expiration',
      interpretation: 'Higher rho = more sensitive to interest rate changes'
    }
  ]

  return (
    <Box sx={{ width: '100%' }}>
      {/* Real-time Options Data */}
      <Box sx={{ mb: 3 }}>
        <RealTimeOptionsData symbol={symbol} />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Options Analysis - {symbol}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Sentiment</InputLabel>
              <Select
                value={sentiment}
                label="Sentiment"
                onChange={(e) => setSentiment(e.target.value as any)}
              >
                <MenuItem value="bullish">Bullish</MenuItem>
                <MenuItem value="bearish">Bearish</MenuItem>
                <MenuItem value="neutral">Neutral</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Max DTE</InputLabel>
              <Select
                value={maxDTE}
                label="Max DTE"
                onChange={(e) => setMaxDTE(Number(e.target.value))}
              >
                <MenuItem value={7}>7 Days</MenuItem>
                <MenuItem value={14}>2 Weeks</MenuItem>
                <MenuItem value={30}>1 Month</MenuItem>
                <MenuItem value={60}>2 Months</MenuItem>
                <MenuItem value={90}>3 Months</MenuItem>
              </Select>
            </FormControl>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={fetchOptionsData}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Trading Type: <strong>{tradingType.toUpperCase()}</strong> • 
          Target Delta: <strong>{targetDelta}</strong> • 
          Max Days to Expiration: <strong>{maxDTE}</strong>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label="Trade Suggestions" icon={<TrendingUp />} />
          <Tab label="Advanced Strategies" icon={<CallSplit />} />
          <Tab label="Options Chain" icon={<Timeline />} />
          <Tab label="Greeks Education" icon={<AccountBalance />} />
          <Tab label="Risk Analysis" icon={<TrendingDown />} />
        </Tabs>

        {/* Trade Suggestions Tab */}
        {activeTab === 0 && (
          <Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : suggestions.length > 0 ? (
              <Grid container spacing={3}>
                {suggestions.map((suggestion, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined" sx={{ 
                      borderLeft: 4, 
                      borderColor: suggestion.sentiment === 'bullish' ? 'success.main' : 
                                  suggestion.sentiment === 'bearish' ? 'error.main' : 'warning.main'
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">{suggestion.strategy}</Typography>
                          <Chip 
                            label={`${suggestion.sentiment.toUpperCase()} • ROI: ${suggestion.roi_potential.toFixed(0)}%`}
                            color={suggestion.sentiment === 'bullish' ? 'success' : 
                                  suggestion.sentiment === 'bearish' ? 'error' : 'warning'}
                            variant="outlined"
                          />
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">Max Profit</Typography>
                            <Typography variant="h6" color="success.main">
                              ${formatPrice(suggestion.max_profit)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">Max Loss</Typography>
                            <Typography variant="h6" color="error.main">
                              ${formatPrice(suggestion.max_loss)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">Capital Required</Typography>
                            <Typography variant="h6">
                              ${formatPrice(suggestion.capital_required)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">Win Probability</Typography>
                            <Typography variant="h6" color="info.main">
                              {formatPercent(suggestion.probability_profit)}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Divider sx={{ mb: 2 }} />

                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Position Greeks:</Typography>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6} sm={3}>
                            <Chip
                              size="small"
                              label={`Δ ${formatGreek(suggestion.position_greeks.net_delta, 3)}`}
                              color={getGreekColor('delta', suggestion.position_greeks.net_delta)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Chip
                              size="small"
                              label={`Θ ${formatGreek(suggestion.position_greeks.net_theta, 3)}`}
                              color={getGreekColor('theta', suggestion.position_greeks.net_theta)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Chip
                              size="small"
                              label={`ν ${formatGreek(suggestion.position_greeks.net_vega, 3)}`}
                              color={getGreekColor('vega', suggestion.position_greeks.net_vega)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Chip
                              size="small"
                              label={`Γ ${formatGreek(suggestion.position_greeks.net_gamma, 4)}`}
                              color={getGreekColor('gamma', suggestion.position_greeks.net_gamma)}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>

                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Contracts:</Typography>
                        {suggestion.contracts.map((contract, contractIndex) => (
                          <Box key={contractIndex} sx={{ 
                            p: 2, 
                            mb: 1, 
                            border: 1, 
                            borderColor: 'divider', 
                            borderRadius: 1,
                            bgcolor: contractIndex === 0 ? 'success.50' : 'error.50'
                          }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2">
                                  {contractIndex === 0 ? 'BUY' : 'SELL'} {contract.option_type.toUpperCase()} ${contract.strike}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Exp: {new Date(contract.expiry).toLocaleDateString()} ({contract.dte}DTE)
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2">
                                  Price: ${formatPrice(contract.mid_price)} • 
                                  IV: {formatPercent(contract.implied_volatility)} • 
                                  Liquidity: {(contract.liquidity_score || 0).toFixed(0)}/100
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                No trade suggestions available for the current criteria. Try adjusting the sentiment or time parameters.
              </Alert>
            )}
          </Box>
        )}

        {/* Options Chain Tab */}
        {/* Advanced Strategies Tab */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Complexity</InputLabel>
                <Select
                  value={strategyComplexity}
                  label="Complexity"
                  onChange={(e) => setStrategyComplexity(e.target.value as any)}
                >
                  <MenuItem value="all">All Levels</MenuItem>
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {advancedStrategies.map((strategy, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Typography variant="h6" component="div">
                            {strategy.strategy}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                              label={strategy.sentiment} 
                              color={strategy.sentiment === 'bullish' ? 'success' : strategy.sentiment === 'bearish' ? 'error' : 'default'}
                              size="small"
                            />
                            <Chip 
                              label={strategy.complexity || 'N/A'} 
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Max Profit:</Typography>
                            <Typography variant="body1" fontWeight="bold" color={strategy.max_profit === "Unlimited" ? "success.main" : "text.primary"}>
                              {strategy.max_profit === "Unlimited" ? "Unlimited" : `$${strategy.max_profit}`}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Max Loss:</Typography>
                            <Typography variant="body1" fontWeight="bold" color="error.main">
                              ${strategy.max_loss}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Win Probability:</Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {(strategy.probability_profit * 100).toFixed(1)}%
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">ROI Potential:</Typography>
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              {strategy.roi_potential.toFixed(1)}%
                            </Typography>
                          </Grid>
                        </Grid>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Strategy Type & Impact:</Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label={`Type: ${strategy.strategy_type || 'N/A'}`} size="small" variant="outlined" />
                            <Chip 
                              label={`Time: ${strategy.time_decay_impact || 'N/A'}`} 
                              size="small" 
                              color={strategy.time_decay_impact === 'positive' ? 'success' : strategy.time_decay_impact === 'negative' ? 'error' : 'default'}
                              variant="outlined"
                            />
                            <Chip 
                              label={`Vol: ${strategy.volatility_impact || 'N/A'}`} 
                              size="small" 
                              color={strategy.volatility_impact === 'positive' ? 'success' : strategy.volatility_impact === 'negative' ? 'error' : 'default'}
                              variant="outlined"
                            />
                          </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Position Greeks:</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                          {strategy.position_greeks && (
                            <>
                              <Chip label={`Δ: ${formatGreek(strategy.position_greeks.net_delta)}`} size="small" />
                              <Chip label={`Θ: ${formatGreek(strategy.position_greeks.net_theta)}`} size="small" />
                              <Chip label={`V: ${formatGreek(strategy.position_greeks.net_vega)}`} size="small" />
                              <Chip label={`Γ: ${formatGreek(strategy.position_greeks.net_gamma)}`} size="small" />
                            </>
                          )}
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Break-even Points:</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {strategy.break_evens.map(be => `$${be.toFixed(2)}`).join(', ')}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Capital Required: ${strategy.capital_required}</Typography>
                        <Typography variant="body2" color="text.secondary">Liquidity Score: {strategy.liquidity_score}/100</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Options Chain Tab */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Options Chain Analysis</Typography>
              <FormControlLabel
                control={
                  <Switch 
                    checked={showAllGreeks} 
                    onChange={(e) => setShowAllGreeks(e.target.checked)}
                  />
                }
                label="Show All Greeks"
              />
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Strike</TableCell>
                    <TableCell>Exp</TableCell>
                    <TableCell>DTE</TableCell>
                    <TableCell>Bid/Ask</TableCell>
                    <TableCell>IV</TableCell>
                    <TableCell>Delta</TableCell>
                    {showAllGreeks && <TableCell>Gamma</TableCell>}
                    <TableCell>Theta</TableCell>
                    {showAllGreeks && <TableCell>Vega</TableCell>}
                    {showAllGreeks && <TableCell>Rho</TableCell>}
                    <TableCell>Volume</TableCell>
                    <TableCell>OI</TableCell>
                    <TableCell>Liquidity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {optionsChain.slice(0, 20).map((contract, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        bgcolor: getMoneyness(contract) === 'ATM' ? 'warning.50' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <TableCell>
                        <Chip 
                          label={contract.option_type.toUpperCase()} 
                          size="small"
                          color={contract.option_type === 'call' ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>${contract.strike}</TableCell>
                      <TableCell>{new Date(contract.expiry).toLocaleDateString()}</TableCell>
                      <TableCell>{contract.dte}</TableCell>
                      <TableCell>${formatPrice(contract.bid)} / ${formatPrice(contract.ask)}</TableCell>
                      <TableCell>{formatPercent(contract.implied_volatility)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={formatGreek(contract.greeks?.delta, 3)}
                          size="small"
                          color={getGreekColor('delta', contract.greeks?.delta || 0)}
                          variant="outlined"
                        />
                      </TableCell>
                      {showAllGreeks && (
                        <TableCell>{formatGreek(contract.greeks?.gamma, 4)}</TableCell>
                      )}
                      <TableCell>
                        <Chip 
                          label={formatGreek(contract.greeks?.theta, 3)}
                          size="small"
                          color={getGreekColor('theta', contract.greeks?.theta || 0)}
                          variant="outlined"
                        />
                      </TableCell>
                      {showAllGreeks && (
                        <TableCell>{formatGreek(contract.greeks?.vega, 3)}</TableCell>
                      )}
                      {showAllGreeks && (
                        <TableCell>{formatGreek(contract.greeks?.rho, 4)}</TableCell>
                      )}
                      <TableCell>{(contract.volume || 0).toLocaleString()}</TableCell>
                      <TableCell>{(contract.open_interest || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`${(contract.liquidity_score || 0).toFixed(0)}/100`}
                          size="small"
                          color={getLiquidityColor(contract.liquidity_score || 0)}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Greeks Education Tab */}
        {activeTab === 3 && showEducational && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Understanding Options Greeks - Complete Guide
            </Typography>
            
            <Grid container spacing={3}>
              {primaryGreeks.map((greek, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {greek.name}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {greek.description}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {greek.detail}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Range:</strong> {greek.range}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Key Point:</strong> {greek.interpretation}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Trading Strategy by Greeks:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="success.main">Day Trading (0-7 DTE):</Typography>
                  <Typography variant="body2">• Focus on high Delta (0.5+) for directional plays</Typography>
                  <Typography variant="body2">• Watch Theta decay - time is against you</Typography>
                  <Typography variant="body2">• High Gamma can amplify profits/losses</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="info.main">Swing Trading (1-4 weeks):</Typography>
                  <Typography variant="body2">• Moderate Delta (0.3-0.7) for balanced exposure</Typography>
                  <Typography variant="body2">• Consider Vega for volatility plays</Typography>
                  <Typography variant="body2">• Theta still important but less urgent</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="warning.main">Long Term (1-3 months):</Typography>
                  <Typography variant="body2">• Lower Delta (0.2-0.5) for time to work</Typography>
                  <Typography variant="body2">• Vega becomes more significant</Typography>
                  <Typography variant="body2">• Theta decay slower but still present</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="secondary.main">Risk Management:</Typography>
                  <Typography variant="body2">• Higher liquidity (70+ score) preferred</Typography>
                  <Typography variant="body2">• Monitor position Greeks daily</Typography>
                  <Typography variant="body2">• Adjust or close before major decay</Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}

        {/* Risk Analysis Tab */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Risk Analysis & Portfolio Greeks
            </Typography>
            
            {suggestions.length > 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Portfolio Risk Metrics</Typography>
                      {suggestions.map((suggestion, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Typography variant="subtitle2">{suggestion.strategy}</Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body2">Max Risk: ${formatPrice(suggestion.max_loss)}</Typography>
                              <Typography variant="body2">Capital: ${formatPrice(suggestion.capital_required)}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2">Win Rate: {formatPercent(suggestion.probability_profit)}</Typography>
                              <Typography variant="body2">ROI: {suggestion.roi_potential.toFixed(0)}%</Typography>
                            </Grid>
                          </Grid>
                          <Divider sx={{ mt: 1 }} />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Greeks Heat Map</Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Risk exposure by Greek category
                      </Typography>
                      {suggestions.map((suggestion, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Typography variant="subtitle2">{suggestion.strategy}</Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                            <Chip 
                              size="small"
                              label={`Δ ${formatGreek(suggestion.position_greeks.net_delta, 2)}`}
                              color={Math.abs(suggestion.position_greeks.net_delta) > 0.5 ? 'error' : 'success'}
                            />
                            <Chip 
                              size="small"
                              label={`Θ ${formatGreek(suggestion.position_greeks.net_theta, 2)}`}
                              color={suggestion.position_greeks.net_theta < -10 ? 'error' : 'warning'}
                            />
                            <Chip 
                              size="small"
                              label={`ν ${formatGreek(suggestion.position_greeks.net_vega, 2)}`}
                              color={Math.abs(suggestion.position_greeks.net_vega) > 20 ? 'warning' : 'info'}
                            />
                            <Chip 
                              size="small"
                              label={`Γ ${formatGreek(suggestion.position_greeks.net_gamma, 3)}`}
                              color={Math.abs(suggestion.position_greeks.net_gamma) > 0.05 ? 'warning' : 'info'}
                            />
                          </Box>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
            
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Risk Management Guidelines:</Typography>
              <Typography variant="body2">
                • Never risk more than 2-5% of portfolio on single trade
                • Monitor Greeks daily, especially Theta and Delta
                • High Gamma positions require close monitoring
                • Consider liquidity scores when entering/exiting positions
                • Have exit strategy before entering trade
              </Typography>
            </Alert>
          </Box>
        )}
      </Paper>
    </Box>
  )
}