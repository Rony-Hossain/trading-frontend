"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { realTimeData, StockPrice } from '../../lib/api'
import { evaluateSignal, PricePoint, EvaluatedSignal } from '../../lib/signals'

interface RealTimeAlertsProps {
  symbols: string[]
  maxAlerts?: number
}

export function RealTimeAlerts({ symbols, maxAlerts = 20 }: RealTimeAlertsProps) {
  const [alerts, setAlerts] = useState<EvaluatedSignal[]>([])
  const buffers = useRef<Map<string, PricePoint[]>>(new Map())

  useEffect(() => {
    const handlers: Array<{symbol: string, fn: (tick: StockPrice)=>void}> = []
    symbols.forEach(symbol => {
      if (!buffers.current.has(symbol)) buffers.current.set(symbol, [])
      const onTick = (tick: StockPrice) => {
        const buf = buffers.current.get(symbol)!
        buf.push({ t: Date.now(), price: tick.price, volume: tick.volume })
        // keep last ~600 points (~10 min if 1s cadence)
        if (buf.length > 600) buf.splice(0, buf.length - 600)

        const evaluated = evaluateSignal(symbol, buf)
        if (evaluated && evaluated.signal !== 'HOLD') {
          setAlerts(prev => {
            const next = [evaluated, ...prev]
            return next.slice(0, maxAlerts)
          })
        }
      }
      realTimeData.subscribe(symbol, onTick)
      handlers.push({ symbol, fn: onTick })
    })

    return () => {
      handlers.forEach(({symbol, fn}) => realTimeData.unsubscribe(symbol, fn))
    }
  }, [symbols, maxAlerts])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No alerts yet. Listening for signals…</div>
        ) : (
          <div className="space-y-3">
            {alerts.map((a, idx) => (
              <div key={idx} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{a.symbol}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.signal === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {a.signal}
                      </span>
                      <span className="text-xs text-gray-500">{a.confidence}%</span>
                    </div>
                    <div className="text-sm text-gray-700 mt-1">{a.reason}</div>
                    {a.target && a.stop && (
                      <div className="text-xs text-gray-600 mt-1">Target: {a.target.toFixed(2)} • Stop: {a.stop.toFixed(2)}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">{a.createdAt.toLocaleTimeString()}</div>
                  </div>
                  <div className="text-right min-w-0 flex-1">
                    <div className="text-xs text-gray-500">Option Suggestion</div>
                    <div className="text-sm font-medium">{a.optionSuggestion.side} {a.optionSuggestion.strategy.replace('_',' ')}</div>
                    
                    {/* Enhanced Greeks Display */}
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Δ: {(a.optionSuggestion.targetDelta ?? 0).toFixed(3)}</span>
                        <span>DTE: {a.optionSuggestion.dte ?? '-'}</span>
                      </div>
                      
                      {a.optionSuggestion.greeks && (
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <span className={`${a.optionSuggestion.greeks.theta < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            Θ: {a.optionSuggestion.greeks.theta.toFixed(3)}
                          </span>
                          <span>ν: {a.optionSuggestion.greeks.vega.toFixed(3)}</span>
                          <span>Γ: {a.optionSuggestion.greeks.gamma.toFixed(3)}</span>
                          <span className={`${(a.optionSuggestion.liquidityScore ?? 0) >= 70 ? 'text-green-600' : (a.optionSuggestion.liquidityScore ?? 0) >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                            Liq: {(a.optionSuggestion.liquidityScore ?? 0).toFixed(0)}
                          </span>
                        </div>
                      )}
                      
                      {/* Risk/Reward Info */}
                      {a.optionSuggestion.maxProfit && a.optionSuggestion.maxLoss && (
                        <div className="mt-1 p-1 bg-gray-100 rounded text-xs">
                          <div>Max P/L: +${a.optionSuggestion.maxProfit.toFixed(0)} / -${a.optionSuggestion.maxLoss.toFixed(0)}</div>
                          {a.optionSuggestion.probabilityProfit && (
                            <div>P(Profit): {(a.optionSuggestion.probabilityProfit * 100).toFixed(0)}%</div>
                          )}
                        </div>
                      )}
                      
                      {/* Strike Prices */}
                      {a.optionSuggestion.strikes && a.optionSuggestion.strikes.length > 0 && (
                        <div className="text-xs text-blue-600">
                          Strikes: {a.optionSuggestion.strikes.join('/')}
                        </div>
                      )}
                    </div>
                    
                    {a.optionSuggestion.notes && (
                      <div className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={a.optionSuggestion.notes}>
                        {a.optionSuggestion.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RealTimeAlerts

