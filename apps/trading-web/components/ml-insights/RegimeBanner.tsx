'use client'

/**
 * RegimeBanner - Market regime indicator banner
 * Phase 6: ML Insights & Regime Hinting
 * Shows current market regime with context and auto-adjusts recommendation tone
 */

import { useState } from 'react'
import { X, Info, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react'
import type { RegimeData } from '@/lib/types/contracts'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'

interface RegimeBannerProps {
  regime: RegimeData
  mode?: 'beginner' | 'expert'
  onDismiss?: () => void
}

export function RegimeBanner({ regime, mode = 'beginner', onDismiss }: RegimeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
    trackEvent({
      category: TelemetryCategory.ML_INSIGHTS,
      action: 'regime_banner_dismissed',
      regime: regime.regime,
    })
  }

  const handleFeedback = (helpful: boolean) => {
    setFeedbackSubmitted(true)
    trackEvent({
      category: TelemetryCategory.ML_INSIGHTS,
      action: helpful ? 'insight_helpful' : 'insight_confusing',
      insight_type: 'regime',
    })
  }

  if (isDismissed) return null

  const getRegimeConfig = () => {
    switch (regime.regime) {
      case 'bull_trending':
        return {
          icon: <TrendingUp className="h-5 w-5" />,
          color: 'green',
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-900 dark:text-green-100',
          accentText: 'text-green-700 dark:text-green-300',
          beginnerLabel: 'Uptrend Detected',
          expertLabel: 'Bull Trending Regime',
          beginnerDescription:
            'Markets are moving higher with strong momentum. Opportunities may be more favorable.',
          expertDescription:
            'Strong uptrend with high momentum. Favorable conditions for long positions.',
        }
      case 'bear_trending':
        return {
          icon: <TrendingDown className="h-5 w-5" />,
          color: 'red',
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-900 dark:text-red-100',
          accentText: 'text-red-700 dark:text-red-300',
          beginnerLabel: 'Downtrend Active',
          expertLabel: 'Bear Trending Regime',
          beginnerDescription:
            'Markets are moving lower. Consider being more cautious with new positions.',
          expertDescription:
            'Strong downtrend detected. Risk of further drawdowns elevated.',
        }
      case 'choppy':
        return {
          icon: <Activity className="h-5 w-5" />,
          color: 'gray',
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-800',
          text: 'text-gray-900 dark:text-gray-100',
          accentText: 'text-gray-700 dark:text-gray-300',
          beginnerLabel: 'Sideways Market',
          expertLabel: 'Choppy Regime',
          beginnerDescription:
            'Markets are moving sideways without clear direction. Trends may be harder to identify.',
          expertDescription:
            'Low momentum, range-bound conditions. Trend-following strategies may underperform.',
        }
      case 'high_volatility':
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          color: 'amber',
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-900 dark:text-amber-100',
          accentText: 'text-amber-700 dark:text-amber-300',
          beginnerLabel: 'High Volatility',
          expertLabel: 'High Volatility Regime',
          beginnerDescription:
            'Markets are experiencing larger swings. Use extra caution and tighter stop-losses.',
          expertDescription:
            'Elevated volatility and wider spreads. Increased risk of gap moves and slippage.',
        }
      case 'low_volatility':
        return {
          icon: <Activity className="h-5 w-5" />,
          color: 'blue',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-900 dark:text-blue-100',
          accentText: 'text-blue-700 dark:text-blue-300',
          beginnerLabel: 'Calm Markets',
          expertLabel: 'Low Volatility Regime',
          beginnerDescription: 'Markets are calm with smaller price moves. Conditions are stable.',
          expertDescription:
            'Low volatility environment. Tighter ranges, lower risk but also lower reward potential.',
        }
      default:
        return {
          icon: <Info className="h-5 w-5" />,
          color: 'gray',
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-800',
          text: 'text-gray-900 dark:text-gray-100',
          accentText: 'text-gray-700 dark:text-gray-300',
          beginnerLabel: 'Analyzing Market',
          expertLabel: 'Regime Unknown',
          beginnerDescription: 'Gathering more data to identify market conditions.',
          expertDescription: 'Insufficient data for regime classification.',
        }
    }
  }

  const config = getRegimeConfig()

  const getToneLabel = () => {
    switch (regime.recommendation_tone) {
      case 'aggressive':
        return mode === 'beginner' ? 'Favorable conditions' : 'Aggressive positioning'
      case 'moderate':
        return mode === 'beginner' ? 'Normal conditions' : 'Moderate positioning'
      case 'cautious':
        return mode === 'beginner' ? 'Use caution' : 'Cautious positioning'
    }
  }

  // Track banner view
  useState(() => {
    trackEvent({
      category: TelemetryCategory.ML_INSIGHTS,
      action: 'regime_banner_viewed',
      regime: regime.regime,
      confidence: regime.confidence,
      recommendation_tone: regime.recommendation_tone,
    })
  })

  return (
    <div
      className={`rounded-lg border p-4 ${config.bg} ${config.border}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={config.accentText}>{config.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-sm font-semibold ${config.text}`}>
                {mode === 'beginner' ? config.beginnerLabel : config.expertLabel}
              </h3>
              {regime.confidence >= 0.7 && (
                <span className="text-xs px-2 py-0.5 bg-white/50 dark:bg-black/20 rounded-full">
                  {(regime.confidence * 100).toFixed(0)}% confidence
                </span>
              )}
            </div>
            <p className={`text-sm ${config.accentText} mb-2`}>
              {mode === 'beginner' ? config.beginnerDescription : config.expertDescription}
            </p>

            {/* Characteristics (Expert mode only) */}
            {mode === 'expert' && regime.characteristics.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {regime.characteristics.map((char, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 bg-white/60 dark:bg-black/30 rounded-full"
                  >
                    {char.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Recommendation Tone */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-600 dark:text-gray-400">Our approach:</span>
              <span className={`font-medium ${config.accentText}`}>{getToneLabel()}</span>
            </div>

            {/* Duration */}
            {mode === 'expert' && regime.duration_minutes > 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Active for {regime.duration_minutes} minutes
              </p>
            )}

            {/* Feedback */}
            {!feedbackSubmitted ? (
              <div className="mt-3 pt-3 border-t border-current/20">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Is this regime insight helpful?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFeedback(true)}
                    className="px-3 py-1 text-xs font-medium bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 rounded transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    className="px-3 py-1 text-xs font-medium bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 rounded transition-colors"
                  >
                    Confusing
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-current/20">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Thank you for your feedback!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dismiss button */}
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className={`flex-shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${config.accentText}`}
            aria-label="Dismiss regime banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
