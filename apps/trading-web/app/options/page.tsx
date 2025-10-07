"use client"

import React, { useState } from 'react'
import { Box, Container, Typography, TextField, Button, Paper, Chip } from '@mui/material'
import OptionsAnalysis from '../../components/options/OptionsAnalysis'
import ModuleGuard from '@/components/security/ModuleGuard'

export default function OptionsPage() {
  const [symbol, setSymbol] = useState('AAPL')
  const [inputSymbol, setInputSymbol] = useState('AAPL')

  const popularSymbols = ['AAPL', 'TSLA', 'NVDA', 'SPY', 'QQQ', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AMD']

  return (
    <ModuleGuard moduleId="options" mode="expert">
      <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
        <Container maxWidth="xl">
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Options Trading & Greeks Analysis
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Comprehensive options analysis with real-time Greeks calculations, trade suggestions,
              and risk assessment for all trading styles - day trading, swing trading, and long-term positions.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <TextField
                label="Stock Symbol"
                variant="outlined"
                size="small"
                value={inputSymbol}
                onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setSymbol(inputSymbol)
                  }
                }}
                sx={{ minWidth: 150 }}
              />
              <Button variant="contained" onClick={() => setSymbol(inputSymbol)} size="small">
                Analyze
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', mr: 1 }}>
                Popular:
              </Typography>
              {popularSymbols.map((sym) => (
                <Chip
                  key={sym}
                  label={sym}
                  size="small"
                  clickable
                  variant={symbol === sym ? 'filled' : 'outlined'}
                  color={symbol === sym ? 'primary' : 'default'}
                  onClick={() => {
                    setSymbol(sym)
                    setInputSymbol(sym)
                  }}
                />
              ))}
            </Box>
          </Paper>

          <OptionsAnalysis symbol={symbol} tradingType="all" showEducational={true} />
        </Container>
      </Box>
    </ModuleGuard>
  )
}
