"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { realTimeData, StockPrice } from '../../lib/api'
import { evaluateSignal, PricePoint, EvaluatedSignal } from '../../lib/signals'
import { getCopy, type CopyMode } from '../../lib/copy/copy-service'
import { formatCurrency, formatNumber, formatPercent, formatTime } from '../../lib/i18n/format'

interface RealTimeAlertsProps {
  symbols: string[]
  maxAlerts?: number
  mode?: 'beginner' | 'expert'
}

export function RealTimeAlerts({ symbols, maxAlerts = 20, mode = 'expert' }: RealTimeAlertsProps) {
  const [alerts, setAlerts] = useState<EvaluatedSignal[]>([])
  const buffers = useRef<Map<string, PricePoint[]>>(new Map())
  const copyMode: CopyMode = mode

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
      realTimeData.subscribe(symbol, onTick, { mode })
      handlers.push({ symbol, fn: onTick })
    })

    return () => {
      handlers.forEach(({symbol, fn}) => realTimeData.unsubscribe(symbol, fn))
    }
  }, [symbols, maxAlerts, mode])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getCopy('alerts.realtime_title', copyMode)}</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            {getCopy('alerts.realtime_empty', copyMode)}
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((a, idx) => {
              const option = a.optionSuggestion
              const greeks = option?.greeks
              const liquidityScore = option?.liquidityScore ?? null
              const liquidityClass =
                liquidityScore == null
                  ? 'text-gray-500'
                  : liquidityScore >= 70
                    ? 'text-green-600'
                    : liquidityScore >= 40
                      ? 'text-yellow-600'
                      : 'text-red-600'

              const formattedTarget = a.target != null ? formatCurrency(a.target) : null
              const formattedStop = a.stop != null ? formatCurrency(a.stop) : null
              const formattedTimestamp = formatTime(a.createdAt)
              const formattedDelta =
                option?.targetDelta != null
                  ? formatNumber(option.targetDelta, {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    })
                  : '--'
              const dteLabel =
                option?.dte != null
                  ? formatNumber(option.dte, { maximumFractionDigits: 0 })
                  : '--'
              const formattedTheta =
                greeks?.theta != null
                  ? formatNumber(greeks.theta, {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    })
                  : '--'
              const formattedVega =
                greeks?.vega != null
                  ? formatNumber(greeks.vega, {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    })
                  : '--'
              const formattedGamma =
                greeks?.gamma != null
                  ? formatNumber(greeks.gamma, {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    })
                  : '--'
              const formattedLiq =
                liquidityScore != null
                  ? formatNumber(liquidityScore, { maximumFractionDigits: 0 })
                  : '--'
              const formattedMaxProfit =
                option?.maxProfit != null
                  ? `+${formatCurrency(option.maxProfit, 'USD', { maximumFractionDigits: 0 })}`
                  : null
              const formattedMaxLoss =
                option?.maxLoss != null
                  ? `-${formatCurrency(option.maxLoss, 'USD', { maximumFractionDigits: 0 })}`
                  : null
              const formattedProbability =
                option?.probabilityProfit != null
                  ? formatPercent(option.probabilityProfit, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })
                  : null
              const formattedStrikes =
                option?.strikes && option.strikes.length > 0
                  ? option.strikes.join('/')
                  : null
              const strategyLabel = option?.strategy?.replace(/_/g, ' ') ?? ''
              const sideLabel = option?.side ?? ''

              return (
                <div key={idx} className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{a.symbol}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            a.signal === 'BUY'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {a.signal}
                        </span>
                        <span className="text-xs text-gray-500">{a.confidence}%</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-700">{a.reason}</div>
                      {formattedTarget && formattedStop && (
                        <div className="mt-1 text-xs text-gray-600">
                          {getCopy('alerts.option_target', copyMode)}: {formattedTarget} •{' '}
                          {getCopy('alerts.option_stop', copyMode)}: {formattedStop}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-gray-500">{formattedTimestamp}</div>
                    </div>
                    <div className="min-w-0 flex-1 text-right">
                      <div className="text-xs text-gray-500">
                        {getCopy('alerts.option_suggestion', copyMode)}
                      </div>
                      <div className="text-sm font-medium">
                        {sideLabel} {strategyLabel}
                      </div>

                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Δ: {formattedDelta}</span>
                          <span>DTE: {dteLabel}</span>
                        </div>

                        {greeks && (
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <span className={greeks.theta < 0 ? 'text-red-600' : 'text-green-600'}>
                              Θ: {formattedTheta}
                            </span>
                            <span>ν: {formattedVega}</span>
                            <span>Γ: {formattedGamma}</span>
                            <span className={liquidityClass}>Liq: {formattedLiq}</span>
                          </div>
                        )}

                        {formattedMaxProfit && formattedMaxLoss && (
                          <div className="mt-1 rounded bg-gray-100 p-1 text-xs">
                            <div>
                              {getCopy('alerts.option_max_pl', copyMode)}: {formattedMaxProfit} / {formattedMaxLoss}
                            </div>
                            {formattedProbability && (
                              <div>
                                {getCopy('alerts.option_probability', copyMode)}: {formattedProbability}
                              </div>
                            )}
                          </div>
                        )}

                        {formattedStrikes && (
                          <div className="text-xs text-blue-600">
                            {getCopy('alerts.option_strikes', copyMode)}: {formattedStrikes}
                          </div>
                        )}
                      </div>

                      {option?.notes && (
                        <div
                          className="mt-1 max-w-xs truncate text-xs text-gray-500"
                          title={option.notes}
                        >
                          {option.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RealTimeAlerts
