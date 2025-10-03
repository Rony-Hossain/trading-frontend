'use client'

/**
 * Beginner Dashboard
 * Simplified interface with AI recommendations and one-click actions
 */
import { Box, Grid, Card, CardContent, Typography, Button, Chip, List, ListItem, ListItemText, LinearProgress } from '@mui/material'
import { TrendingUp, TrendingDown, AccessTime, CheckCircle } from '@mui/icons-material'
import { useMarketStore } from '@/lib/stores/marketStore'

interface AIRecommendation {
  symbol: string
  action: 'buy' | 'sell' | 'hold'
  confidence: number
  reason: string
  targetPrice: number
}

const mockRecommendations: AIRecommendation[] = [
  {
    symbol: 'AAPL',
    action: 'buy',
    confidence: 85,
    reason: 'Strong momentum with bullish technical indicators',
    targetPrice: 195.50,
  },
  {
    symbol: 'TSLA',
    action: 'sell',
    confidence: 72,
    reason: 'Overbought conditions, potential short-term pullback',
    targetPrice: 238.00,
  },
  {
    symbol: 'MSFT',
    action: 'hold',
    confidence: 68,
    reason: 'Consolidating near resistance, wait for breakout',
    targetPrice: 385.00,
  },
]

export function BeginnerDashboard() {
  const { watchlist, quotes, positions } = useMarketStore()

  const totalValue = positions.reduce((sum, p) => sum + p.marketValue, 0)
  const totalPnL = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0)
  const pnlPercent = totalValue > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Welcome Back!
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Here's what's happening with your investments today
      </Typography>

      <Grid container spacing={3}>
        {/* Portfolio Summary */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Overview
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Value
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Today's P&L
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {totalPnL >= 0 ? (
                      <TrendingUp color="success" />
                    ) : (
                      <TrendingDown color="error" />
                    )}
                    <Typography
                      variant="h6"
                      color={totalPnL >= 0 ? 'success.main' : 'error.main'}
                      fontWeight={600}
                    >
                      ${Math.abs(totalPnL).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      ({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Positions */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Your Holdings
                </Typography>
                {positions.length > 0 ? (
                  <List>
                    {positions.map((position) => (
                      <ListItem
                        key={position.symbol}
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 2,
                          mb: 1,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography fontWeight={600}>{position.symbol}</Typography>
                              <Chip
                                size="small"
                                label={`${position.unrealizedPnlPercent >= 0 ? '+' : ''}${position.unrealizedPnlPercent.toFixed(2)}%`}
                                color={position.unrealizedPnlPercent >= 0 ? 'success' : 'error'}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Typography variant="caption">
                                {position.quantity} shares @ ${position.currentPrice.toFixed(2)}
                              </Typography>
                              <Typography variant="caption" fontWeight={600}>
                                ${position.marketValue.toLocaleString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No open positions. Start trading to see your holdings here!
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Recommendations */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Recommendations
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Based on market analysis
              </Typography>

              <Box sx={{ mt: 3 }}>
                {mockRecommendations.map((rec) => (
                  <Box
                    key={rec.symbol}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography fontWeight={600}>{rec.symbol}</Typography>
                      <Chip
                        size="small"
                        label={rec.action.toUpperCase()}
                        color={
                          rec.action === 'buy'
                            ? 'success'
                            : rec.action === 'sell'
                            ? 'error'
                            : 'default'
                        }
                      />
                    </Box>

                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      {rec.reason}
                    </Typography>

                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">Confidence</Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {rec.confidence}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={rec.confidence}
                        color={rec.confidence >= 75 ? 'success' : 'warning'}
                      />
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      disabled={rec.action === 'hold'}
                    >
                      {rec.action === 'buy' ? 'Buy Now' : rec.action === 'sell' ? 'Sell Now' : 'Monitor'}
                    </Button>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Watchlist */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Watchlist
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                {watchlist.map((symbol) => {
                  const quote = quotes[symbol]
                  return (
                    <Grid item xs={6} sm={4} md={2} key={symbol}>
                      <Box
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 2,
                          p: 2,
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          {symbol}
                        </Typography>
                        <Typography variant="h6">
                          ${quote?.price.toFixed(2) || '--'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {quote && quote.change >= 0 ? (
                            <TrendingUp fontSize="small" color="success" />
                          ) : (
                            <TrendingDown fontSize="small" color="error" />
                          )}
                          <Typography
                            variant="caption"
                            color={
                              quote && quote.change >= 0 ? 'success.main' : 'error.main'
                            }
                          >
                            {quote?.changePercent.toFixed(2)}%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<TrendingUp />}
                  >
                    Buy Stock
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<TrendingDown />}
                  >
                    Sell Stock
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<AccessTime />}
                  >
                    View History
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<CheckCircle />}
                  >
                    View Signals
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
