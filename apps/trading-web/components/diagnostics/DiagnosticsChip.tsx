'use client'

/**
 * DiagnosticsChip - Compact diagnostic indicators for PlanCard
 * Phase 6: ML Insights & Regime Hinting
 * Shows model confidence, drift status, top drivers, and confidence stability
 */

import { useState } from 'react'
import { Activity, AlertTriangle, TrendingUp, ChevronDown, Info, TrendingDown, Minus } from 'lucide-react'
import type { DiagnosticsSummary, MLDriver } from '@/lib/types/contracts'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'

interface DiagnosticsChipProps {
  diagnostics: DiagnosticsSummary
  mode?: 'beginner' | 'expert'
  onFeedback?: (helpful: boolean) => void
}

export function DiagnosticsChip({
  diagnostics,
  mode = 'beginner',
  onFeedback,
}: DiagnosticsChipProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const { model_confidence, drift_status, top_drivers, confidence_stability } = diagnostics
  const driftDetected = drift_status === 'yellow' || drift_status === 'red'

  const handleExpand = () => {
    setIsExpanded(!isExpanded)
    trackEvent({
      category: TelemetryCategory.ML_INSIGHTS,
      action: isExpanded ? 'diagnostics_collapsed' : 'diagnostics_expanded',
      confidence: model_confidence,
      drift_status: drift_status,
    })
  }

  const handleFeedback = (helpful: boolean) => {
    setFeedbackSubmitted(true)
    onFeedback?.(helpful)

    // Track diagnostics-specific feedback
    trackEvent({
      category: TelemetryCategory.ML_INSIGHTS,
      action: 'diagnostics_feedback',
      helpful,
    })

    // Track general insight helpfulness
    trackEvent({
      category: TelemetryCategory.ML_INSIGHTS,
      action: helpful ? 'insight_helpful' : 'insight_confusing',
      insight_type: 'diagnostics',
    })
  }

  const getConfidenceColor = () => {
    if (model_confidence >= 0.8) return 'text-green-600'
    if (model_confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBg = () => {
    if (model_confidence >= 0.8) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
    if (model_confidence >= 0.6) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
  }

  const getConfidenceLabel = () => {
    if (mode === 'beginner') {
      if (model_confidence >= 0.8) return 'Strong'
      if (model_confidence >= 0.6) return 'Moderate'
      return 'Weak'
    }
    return `${(model_confidence * 100).toFixed(0)}%`
  }

  const getStabilityIcon = () => {
    switch (confidence_stability.trend) {
      case 'rising':
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'falling':
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <Minus className="h-3 w-3 text-gray-400" />
    }
  }

  const getStabilityLabel = () => {
    if (mode === 'beginner') {
      switch (confidence_stability.trend) {
        case 'rising':
          return 'Improving'
        case 'falling':
          return 'Declining'
        default:
          return 'Stable'
      }
    }
    return confidence_stability.trend
  }

  return (
    <div className="inline-block">
      {/* Compact Chip */}
      <button
        onClick={handleExpand}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${getConfidenceBg()} ${getConfidenceColor()}`}
        aria-expanded={isExpanded}
        aria-label={`Model diagnostics: ${getConfidenceLabel()} confidence, ${getStabilityLabel()} trend`}
      >
        <Activity className="h-3 w-3" />
        <span>{getConfidenceLabel()} confidence</span>
        {getStabilityIcon()}
        {driftDetected && (
          <AlertTriangle className="h-3 w-3 text-amber-600" />
        )}
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="space-y-3">
            {/* Confidence Detail */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Model Confidence
                </span>
                <span className={`text-sm font-semibold ${getConfidenceColor()}`}>
                  {(model_confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    model_confidence >= 0.8
                      ? 'bg-green-600'
                      : model_confidence >= 0.6
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${model_confidence * 100}%` }}
                />
              </div>
              {mode === 'beginner' && (
                <p className="text-xs text-gray-500 mt-1">
                  {model_confidence >= 0.8
                    ? 'High reliability prediction'
                    : model_confidence >= 0.6
                    ? 'Moderate reliability'
                    : 'Lower reliability - use caution'}
                </p>
              )}
            </div>

            {/* Confidence Stability */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Confidence Trend (last {confidence_stability.time_window_minutes}m)
                </span>
                <div className="flex items-center gap-1">
                  {getStabilityIcon()}
                  <span className="text-xs font-medium">
                    {getStabilityLabel()}
                  </span>
                </div>
              </div>
              {mode === 'beginner' && (
                <p className="text-xs text-gray-500">
                  {confidence_stability.trend === 'rising'
                    ? 'Model is getting more confident over time'
                    : confidence_stability.trend === 'falling'
                    ? 'Model confidence has decreased recently'
                    : 'Model confidence is holding steady'}
                </p>
              )}
            </div>

            {/* Drift Status */}
            {driftDetected && (
              <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-900 dark:text-amber-200">
                    Model Drift Detected
                  </p>
                  {mode === 'beginner' ? (
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                      Market conditions have changed. Predictions may be less accurate.
                    </p>
                  ) : (
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                      Statistical drift detected - model retraining recommended
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Top Drivers */}
            {top_drivers && top_drivers.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Top Drivers
                  </span>
                </div>
                <div className="space-y-2">
                  {top_drivers.slice(0, 3).map((driver, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {mode === 'beginner'
                            ? driver.name.replace(/_/g, ' ')
                            : driver.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                            {(driver.contribution * 100).toFixed(0)}%
                          </span>
                          {mode === 'expert' && (
                            <span className="text-xs text-gray-500">
                              {driver.strength}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                        <div
                          className="h-1 rounded-full bg-blue-600"
                          style={{ width: `${driver.contribution * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Link */}
            {mode === 'expert' && (
              <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors">
                <Info className="h-3 w-3" />
                View full diagnostics
              </button>
            )}

            {/* Feedback */}
            {!feedbackSubmitted ? (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Was this helpful?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFeedback(true)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  Thank you for your feedback!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
