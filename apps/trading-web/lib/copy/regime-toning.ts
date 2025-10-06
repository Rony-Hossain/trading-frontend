/**
 * Regime-Based Copy Toning
 * Automatically adjusts recommendation language based on market regime
 * Phase 6: ML Insights & Regime Hinting
 */

import type { RegimeData, ActionType } from '@/lib/types/contracts'

interface TonedCopy {
  actionVerb: string // e.g., "Consider buying" vs "Buy"
  cautionLevel: 'low' | 'medium' | 'high'
  qualifiers: string[] // Additional phrases to add context
  riskDisclaimer?: string
}

/**
 * Tone down or amp up action verbs based on regime
 */
export function toneActionVerb(
  action: ActionType,
  regime: RegimeData,
  mode: 'beginner' | 'expert' = 'beginner'
): string {
  const tone = regime.recommendation_tone

  if (action === 'BUY') {
    if (tone === 'aggressive') {
      return mode === 'beginner' ? 'Consider buying' : 'Buy'
    } else if (tone === 'moderate') {
      return mode === 'beginner' ? 'You might buy' : 'Consider buy'
    } else {
      // cautious
      return mode === 'beginner' ? 'Watch before buying' : 'Monitor buy opportunity'
    }
  }

  if (action === 'SELL') {
    if (tone === 'aggressive') {
      return mode === 'beginner' ? 'Consider selling' : 'Sell'
    } else if (tone === 'moderate') {
      return mode === 'beginner' ? 'You might sell' : 'Consider sell'
    } else {
      // cautious
      return mode === 'beginner' ? 'Watch before selling' : 'Monitor sell opportunity'
    }
  }

  if (action === 'HOLD') {
    return mode === 'beginner' ? 'Keep holding' : 'Hold'
  }

  if (action === 'AVOID') {
    return mode === 'beginner' ? 'Skip this one' : 'Avoid'
  }

  return action
}

/**
 * Get full toned copy for a recommendation
 */
export function getTonedCopy(
  action: ActionType,
  regime: RegimeData,
  mode: 'beginner' | 'expert' = 'beginner'
): TonedCopy {
  const tone = regime.recommendation_tone
  const qualifiers: string[] = []
  let cautionLevel: 'low' | 'medium' | 'high' = 'low'
  let riskDisclaimer: string | undefined

  // High volatility regime
  if (regime.regime === 'high_volatility') {
    cautionLevel = 'high'
    qualifiers.push('Markets are volatile')
    if (mode === 'beginner') {
      qualifiers.push('Use tight stop-losses')
      riskDisclaimer = 'Larger swings possible - manage risk carefully'
    } else {
      qualifiers.push('Elevated slippage risk')
      riskDisclaimer = 'Wider spreads and gap risk elevated'
    }
  }

  // Bear trending regime
  if (regime.regime === 'bear_trending') {
    cautionLevel = 'high'
    qualifiers.push('Downtrend active')
    if (mode === 'beginner' && action === 'BUY') {
      qualifiers.push('Counter-trend trade')
      riskDisclaimer = 'Buying into a downtrend carries higher risk'
    } else if (mode === 'expert' && action === 'BUY') {
      qualifiers.push('Against primary trend')
      riskDisclaimer = 'Counter-trend positioning, tighter risk management required'
    }
  }

  // Choppy regime
  if (regime.regime === 'choppy') {
    cautionLevel = 'medium'
    qualifiers.push('Sideways market')
    if (mode === 'beginner') {
      riskDisclaimer = 'No clear trend - be patient'
    } else {
      riskDisclaimer = 'Range-bound conditions, trend signals less reliable'
    }
  }

  // Bull trending - more confident
  if (regime.regime === 'bull_trending' && tone === 'aggressive') {
    cautionLevel = 'low'
    qualifiers.push('Strong uptrend')
    if (mode === 'beginner' && action === 'BUY') {
      riskDisclaimer = undefined // No need for extra caution
    }
  }

  // Low volatility
  if (regime.regime === 'low_volatility') {
    cautionLevel = 'low'
    qualifiers.push('Calm markets')
    if (mode === 'expert') {
      qualifiers.push('Tighter ranges')
    }
  }

  // Adjust based on recommendation tone
  if (tone === 'cautious') {
    cautionLevel = 'high'
    if (!qualifiers.includes('Use caution')) {
      qualifiers.unshift('Use caution')
    }
  }

  return {
    actionVerb: toneActionVerb(action, regime, mode),
    cautionLevel,
    qualifiers,
    riskDisclaimer,
  }
}

/**
 * Apply regime toning to a reason string
 * Adds context based on regime if needed
 */
export function toneReasonText(
  reason: string,
  regime: RegimeData,
  mode: 'beginner' | 'expert' = 'beginner'
): string {
  const tonedCopy = getTonedCopy('BUY', regime, mode) // Get general toning info
  let tonedReason = reason

  // Prepend qualifier if high caution
  if (tonedCopy.cautionLevel === 'high' && tonedCopy.qualifiers.length > 0) {
    const qualifier = tonedCopy.qualifiers[0]
    tonedReason = `${qualifier}. ${reason}`
  }

  return tonedReason
}

/**
 * Get a regime-specific safety reminder
 */
export function getRegimeSafetyReminder(
  regime: RegimeData,
  mode: 'beginner' | 'expert' = 'beginner'
): string | null {
  if (regime.regime === 'high_volatility') {
    return mode === 'beginner'
      ? 'Markets are choppy - use tight stop-losses'
      : 'High volatility regime - manage position sizing and slippage'
  }

  if (regime.regime === 'bear_trending' && regime.recommendation_tone === 'cautious') {
    return mode === 'beginner'
      ? 'Downtrend active - wait for confirmation'
      : 'Bear regime - require stronger entry confirmation'
  }

  if (regime.regime === 'choppy') {
    return mode === 'beginner'
      ? 'Sideways market - be patient for clear signals'
      : 'Range-bound regime - reduce position sizing'
  }

  return null
}

/**
 * Determine if a regime requires extra disclaimers
 */
export function requiresExtraDisclaimer(regime: RegimeData): boolean {
  return (
    regime.regime === 'high_volatility' ||
    regime.regime === 'bear_trending' ||
    (regime.regime === 'choppy' && regime.recommendation_tone === 'cautious')
  )
}

/**
 * Get color coding for UI badges based on regime tone
 */
export function getRegimeToneColor(regime: RegimeData): {
  bg: string
  text: string
  border: string
} {
  switch (regime.recommendation_tone) {
    case 'aggressive':
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-800',
      }
    case 'moderate':
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800',
      }
    case 'cautious':
      return {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
      }
  }
}
