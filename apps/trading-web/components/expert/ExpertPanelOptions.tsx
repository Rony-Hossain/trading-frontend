'use client'

/**
 * ExpertPanelOptions - Options trading panel with Greeks and strategy builder
 * Phase 4: Expert Surfaces
 * Lazy-loaded for performance
 */

import { useState } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Info } from 'lucide-react'

interface GreeksData {
  delta: number
  gamma: number
  theta: number
  vega: number
  rho: number
}

interface OptionData {
  strike: number
  type: 'call' | 'put'
  bid: number
  ask: number
  last: number
  volume: number
  openInterest: number
  impliedVolatility: number
  greeks: GreeksData
}

export function ExpertPanelOptions() {
  const [selectedExpiration, setSelectedExpiration] = useState('2025-11-15')
  const [selectedStrike, setSelectedStrike] = useState<number | null>(null)

  // Mock data - would come from API
  const mockOptions: OptionData[] = [
    {
      strike: 150,
      type: 'call',
      bid: 5.20,
      ask: 5.30,
      last: 5.25,
      volume: 1250,
      openInterest: 3450,
      impliedVolatility: 0.28,
      greeks: { delta: 0.65, gamma: 0.035, theta: -0.12, vega: 0.18, rho: 0.08 }
    },
    {
      strike: 150,
      type: 'put',
      bid: 2.80,
      ask: 2.90,
      last: 2.85,
      volume: 980,
      openInterest: 2340,
      impliedVolatility: 0.30,
      greeks: { delta: -0.35, gamma: 0.035, theta: -0.10, vega: 0.18, rho: -0.06 }
    },
    {
      strike: 155,
      type: 'call',
      bid: 3.10,
      ask: 3.20,
      last: 3.15,
      volume: 890,
      openInterest: 1890,
      impliedVolatility: 0.26,
      greeks: { delta: 0.48, gamma: 0.042, theta: -0.14, vega: 0.21, rho: 0.06 }
    },
    {
      strike: 155,
      type: 'put',
      bid: 4.50,
      ask: 4.60,
      last: 4.55,
      volume: 1120,
      openInterest: 2980,
      impliedVolatility: 0.29,
      greeks: { delta: -0.52, gamma: 0.042, theta: -0.12, vega: 0.21, rho: -0.08 }
    },
  ]

  const formatGreek = (value: number, decimals: number = 2) => {
    return value >= 0 ? `+${value.toFixed(decimals)}` : value.toFixed(decimals)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Options Trading
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedExpiration}
            onChange={(e) => setSelectedExpiration(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="2025-11-15">Nov 15, 2025</option>
            <option value="2025-11-22">Nov 22, 2025</option>
            <option value="2025-12-20">Dec 20, 2025</option>
          </select>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-900 dark:text-blue-200">
          Options trading involves significant risk. Greeks help measure option sensitivity to
          various factors. Click any row for detailed analysis.
        </p>
      </div>

      {/* Options Chain */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                  Strike
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                  Bid
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                  Ask
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                  Last
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                  Volume
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                  IV
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                  Delta
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockOptions.map((option, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedStrike(option.strike)}
                  className={`cursor-pointer transition-colors ${
                    selectedStrike === option.strike
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    ${option.strike}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        option.type === 'call'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}
                    >
                      {option.type === 'call' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {option.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                    ${option.bid.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                    ${option.ask.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                    ${option.last.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                    {option.volume.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                    {(option.impliedVolatility * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={
                        option.greeks.delta >= 0 ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {formatGreek(option.greeks.delta)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Greeks Detail */}
      {selectedStrike !== null && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Greeks Analysis - ${selectedStrike} Strike
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {mockOptions
              .filter((opt) => opt.strike === selectedStrike)
              .map((option) =>
                Object.entries(option.greeks).map(([greek, value]) => (
                  <div
                    key={`${option.type}-${greek}`}
                    className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <div className="text-xs text-gray-600 dark:text-gray-400 uppercase mb-1">
                      {greek}
                    </div>
                    <div
                      className={`text-lg font-semibold ${
                        value >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatGreek(value, 3)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {option.type.toUpperCase()}
                    </div>
                  </div>
                ))
              )}
          </div>

          {/* Greeks Explanations */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-xs font-medium text-blue-900 dark:text-blue-200 mb-2">
              Quick Reference
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-800 dark:text-blue-300">
              <div>
                <strong>Delta:</strong> Price change per $1 move in underlying
              </div>
              <div>
                <strong>Gamma:</strong> Delta change per $1 move in underlying
              </div>
              <div>
                <strong>Theta:</strong> Daily time decay
              </div>
              <div>
                <strong>Vega:</strong> Price change per 1% volatility change
              </div>
              <div>
                <strong>Rho:</strong> Price change per 1% interest rate change
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strategy Builder Placeholder */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          Strategy Builder
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          Build multi-leg options strategies with profit/loss scenarios
        </p>
        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Coming Soon
        </button>
      </div>
    </div>
  )
}
