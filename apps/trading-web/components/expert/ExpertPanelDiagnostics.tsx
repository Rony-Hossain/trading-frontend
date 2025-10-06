'use client'

/**
 * ExpertPanelDiagnostics - Model diagnostics with confidence, drift, and drivers
 * Phase 4: Expert Surfaces
 * Lazy-loaded for performance
 */

import { useState } from 'react'
import { Activity, AlertTriangle, TrendingUp, ChevronDown, Info } from 'lucide-react'

interface DiagnosticsData {
  modelConfidence: number
  confidenceStability: 'stable' | 'declining' | 'volatile'
  driftDetected: boolean
  driftSeverity?: 'low' | 'medium' | 'high'
  topDrivers: Array<{
    name: string
    contribution: number
    direction: 'positive' | 'negative'
    description: string
  }>
  regimeHint: {
    current: string
    confidence: number
    characteristics: string[]
  }
}

export function ExpertPanelDiagnostics() {
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null)

  // Mock data - would come from API
  const diagnostics: DiagnosticsData = {
    modelConfidence: 0.87,
    confidenceStability: 'stable',
    driftDetected: false,
    topDrivers: [
      {
        name: 'RSI_Momentum',
        contribution: 0.42,
        direction: 'positive',
        description: 'Strong momentum signal from RSI crossing above 50'
      },
      {
        name: 'Volume_Surge',
        contribution: 0.28,
        direction: 'positive',
        description: 'Above-average volume indicates institutional interest'
      },
      {
        name: 'News_Sentiment',
        contribution: 0.18,
        direction: 'positive',
        description: 'Positive analyst coverage and earnings beat'
      },
    ],
    regimeHint: {
      current: 'Low Volatility Trending',
      confidence: 0.82,
      characteristics: [
        'VIX below 20',
        'Steady uptrend',
        'Low overnight gaps',
        'Predictable intraday patterns'
      ]
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 dark:bg-green-900/30'
    if (confidence >= 0.6) return 'bg-yellow-100 dark:bg-yellow-900/30'
    return 'bg-red-100 dark:bg-red-900/30'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Model Diagnostics
        </h2>
      </div>

      {/* Confidence Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Model Confidence
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Current prediction reliability
            </p>
          </div>
          <div className={`text-3xl font-bold ${getConfidenceColor(diagnostics.modelConfidence)}`}>
            {(diagnostics.modelConfidence * 100).toFixed(0)}%
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full transition-all ${
              diagnostics.modelConfidence >= 0.8
                ? 'bg-green-600'
                : diagnostics.modelConfidence >= 0.6
                ? 'bg-yellow-600'
                : 'bg-red-600'
            }`}
            style={{ width: `${diagnostics.modelConfidence * 100}%` }}
          />
        </div>

        {/* Stability Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Stability:</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              diagnostics.confidenceStability === 'stable'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : diagnostics.confidenceStability === 'declining'
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            }`}
          >
            {diagnostics.confidenceStability}
          </span>
          <span className="text-xs text-gray-500">(last 15 minutes)</span>
        </div>
      </div>

      {/* Drift Detection */}
      <div
        className={`rounded-lg border p-4 ${
          diagnostics.driftDetected
            ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'
            : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
        }`}
      >
        <div className="flex items-start gap-3">
          {diagnostics.driftDetected ? (
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          ) : (
            <Activity className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {diagnostics.driftDetected ? 'Model Drift Detected' : 'No Model Drift'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {diagnostics.driftDetected
                ? `${diagnostics.driftSeverity?.toUpperCase()} severity - Model predictions may be less accurate due to market regime changes`
                : 'Model performance is consistent with training data. No significant drift detected.'}
            </p>
          </div>
        </div>
      </div>

      {/* Top Drivers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Top Signal Drivers
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Most influential factors in current recommendation
            </p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded">
            <Info className="h-3 w-3 text-blue-600" />
            <span className="text-xs text-blue-900 dark:text-blue-200">
              Top {diagnostics.topDrivers.length}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {diagnostics.topDrivers.map((driver, idx) => {
            const isExpanded = expandedDriver === driver.name

            return (
              <div
                key={driver.name}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div
                  onClick={() =>
                    setExpandedDriver(isExpanded ? null : driver.name)
                  }
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400">
                      #{idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {driver.name.replace(/_/g, ' ')}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            driver.direction === 'positive'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          }`}
                        >
                          {driver.direction === 'positive' ? '+' : '-'}
                          {(driver.contribution * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            driver.direction === 'positive'
                              ? 'bg-green-600'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${driver.contribution * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-600 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {isExpanded && (
                  <div className="px-3 pb-3 pt-0 bg-gray-50 dark:bg-gray-900">
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      {driver.description}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Regime Hint */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Market Regime
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Current market environment classification
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full ${getConfidenceBgColor(
              diagnostics.regimeHint.confidence
            )}`}
          >
            <span
              className={`text-xs font-medium ${getConfidenceColor(
                diagnostics.regimeHint.confidence
              )}`}
            >
              {(diagnostics.regimeHint.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
              {diagnostics.regimeHint.current}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Characteristics:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {diagnostics.regimeHint.characteristics.map((char) => (
              <div
                key={char}
                className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                {char}
              </div>
            ))}
          </div>
        </div>

        {/* Regime Guidance */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-900 dark:text-blue-200">
            <strong>Trading Guidance:</strong> Low volatility regimes favor trend-following
            strategies. Consider tighter stops and smaller position sizes during regime transitions.
          </p>
        </div>
      </div>
    </div>
  )
}
