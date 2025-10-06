'use client'

/**
 * WhyNowPanel - Displays top drivers for a trade recommendation
 * Phase 6: ML Insights & Regime Hinting
 * Shows top 3 ML drivers with beginner-friendly explanations
 */

import { useState } from 'react'
import { Lightbulb, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react'
import type { MLDriver } from '@/lib/types/contracts'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'
import { getDriverCopy } from '@/lib/copy/driver-copy'

interface WhyNowPanelProps {
  symbol: string
  drivers: MLDriver[]
  mode?: 'beginner' | 'expert'
  showAllDrivers?: boolean
}

export function WhyNowPanel({
  symbol,
  drivers,
  mode = 'beginner',
  showAllDrivers = false,
}: WhyNowPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const topDrivers = showAllDrivers ? drivers : drivers.slice(0, 3)

  const handleExpand = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      trackEvent({
        category: TelemetryCategory.ML_INSIGHTS,
        action: 'why_now_panel_viewed',
        symbol,
        num_drivers: topDrivers.length,
      })
    }
  }

  const handleDriverClick = (driver: MLDriver) => {
    trackEvent({
      category: TelemetryCategory.ML_INSIGHTS,
      action: 'driver_clicked',
      driver_name: driver.name,
      driver_category: driver.category,
      contribution: driver.contribution,
    })
  }

  const handleDriverFeedback = (helpful: boolean) => {
    setFeedbackSubmitted(true)
    trackEvent({
      category: TelemetryCategory.ML_INSIGHTS,
      action: helpful ? 'insight_helpful' : 'insight_confusing',
      insight_type: 'driver',
    })
  }

  const getDriverIcon = (driver: MLDriver) => {
    if (driver.trend_direction === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    }
    if (driver.trend_direction === 'down') {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return <Lightbulb className="h-4 w-4 text-blue-600" />
  }

  const getStrengthColor = (strength: MLDriver['strength']) => {
    switch (strength) {
      case 'strong':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'weak':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const getCategoryColor = (category: MLDriver['category']) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'fundamental':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      case 'sentiment':
        return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
      case 'options':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
      case 'macro':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    }
  }

  if (topDrivers.length === 0) return null

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
      <button
        onClick={handleExpand}
        className="flex items-center justify-between w-full text-left group"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Why Now?
          </span>
          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
            {topDrivers.length} {topDrivers.length === 1 ? 'driver' : 'drivers'}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {topDrivers.map((driver, idx) => (
            <div
              key={idx}
              onClick={() => handleDriverClick(driver)}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-start gap-2">
                {getDriverIcon(driver)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {mode === 'beginner'
                        ? driver.name.replace(/_/g, ' ')
                        : driver.name}
                    </h4>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full whitespace-nowrap">
                      {(driver.contribution * 100).toFixed(0)}% impact
                    </span>
                  </div>

                  {/* Driver explanation */}
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {getDriverCopy(driver.name, mode)}
                  </p>

                  {/* Metadata badges */}
                  <div className="flex flex-wrap gap-1">
                    {mode === 'expert' && (
                      <>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(driver.category)}`}>
                          {driver.category}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStrengthColor(driver.strength)}`}>
                          {driver.strength}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                          {driver.timeframe}-term
                        </span>
                      </>
                    )}
                    {driver.value !== undefined && mode === 'expert' && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                        value: {driver.value.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2">
                    <div
                      className="h-1 rounded-full bg-blue-600"
                      style={{ width: `${driver.contribution * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {drivers.length > 3 && !showAllDrivers && mode === 'expert' && (
            <p className="text-xs text-gray-500 text-center">
              Showing top 3 of {drivers.length} drivers
            </p>
          )}

          {/* Driver Feedback */}
          {!feedbackSubmitted ? (
            <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Were these drivers helpful?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDriverFeedback(true)}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
                >
                  Yes, helpful
                </button>
                <button
                  onClick={() => handleDriverFeedback(false)}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                >
                  Confusing
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                Thank you for your feedback!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
