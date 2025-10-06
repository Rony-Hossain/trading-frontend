/**
 * Indicator Validation Logic
 * Phase 4: Expert Surfaces
 * Validates indicator configurations and dependencies
 */

export interface IndicatorConfig {
  name: string
  params: Record<string, number | string>
}

export interface ValidationRule {
  param: string
  min?: number
  max?: number
  type: 'number' | 'string' | 'boolean'
  required?: boolean
  dependsOn?: string[] // Other indicators this depends on
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface IndicatorPreset {
  name: string
  description: string
  indicators: IndicatorConfig[]
}

// Validation rules for common indicators
const INDICATOR_RULES: Record<string, Record<string, ValidationRule>> = {
  RSI: {
    period: { param: 'period', min: 2, max: 100, type: 'number', required: true },
    overbought: { param: 'overbought', min: 50, max: 100, type: 'number', required: true },
    oversold: { param: 'oversold', min: 0, max: 50, type: 'number', required: true },
  },
  MACD: {
    fast: { param: 'fast', min: 2, max: 50, type: 'number', required: true },
    slow: { param: 'slow', min: 2, max: 100, type: 'number', required: true },
    signal: { param: 'signal', min: 2, max: 50, type: 'number', required: true },
  },
  'Bollinger Bands': {
    period: { param: 'period', min: 2, max: 100, type: 'number', required: true },
    stdDev: { param: 'stdDev', min: 0.5, max: 5, type: 'number', required: true },
  },
  SMA: {
    period: { param: 'period', min: 2, max: 500, type: 'number', required: true },
  },
  EMA: {
    period: { param: 'period', min: 2, max: 500, type: 'number', required: true },
  },
  Stochastic: {
    kPeriod: { param: 'kPeriod', min: 2, max: 100, type: 'number', required: true },
    dPeriod: { param: 'dPeriod', min: 2, max: 50, type: 'number', required: true },
    smooth: { param: 'smooth', min: 1, max: 10, type: 'number', required: true },
  },
  ATR: {
    period: { param: 'period', min: 2, max: 100, type: 'number', required: true },
  },
}

// Indicator dependencies (indicator-on-indicator)
const INDICATOR_DEPENDENCIES: Record<string, string[]> = {
  'RSI Divergence': ['RSI'], // Requires base RSI
  'MACD Histogram': ['MACD'], // Requires base MACD
  'Bollinger %B': ['Bollinger Bands'], // Requires Bollinger Bands
  'Price vs SMA': ['SMA'], // Requires SMA
}

/**
 * Validate a single indicator configuration
 */
export function validateIndicator(config: IndicatorConfig): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const rules = INDICATOR_RULES[config.name]
  if (!rules) {
    warnings.push(`No validation rules defined for ${config.name}`)
    return { isValid: true, errors, warnings }
  }

  // Check required parameters
  for (const [paramName, rule] of Object.entries(rules)) {
    if (rule.required && !(paramName in config.params)) {
      errors.push(`Missing required parameter: ${paramName}`)
      continue
    }

    const value = config.params[paramName]
    if (value === undefined) continue

    // Type validation
    if (rule.type === 'number') {
      const numValue = Number(value)
      if (isNaN(numValue)) {
        errors.push(`${paramName} must be a number`)
        continue
      }

      // Range validation
      if (rule.min !== undefined && numValue < rule.min) {
        errors.push(`${paramName} must be >= ${rule.min}`)
      }
      if (rule.max !== undefined && numValue > rule.max) {
        errors.push(`${paramName} must be <= ${rule.max}`)
      }
    }
  }

  // Specific indicator logic
  if (config.name === 'RSI') {
    const overbought = Number(config.params.overbought)
    const oversold = Number(config.params.oversold)
    if (overbought <= oversold) {
      errors.push('Overbought level must be greater than oversold level')
    }
    if (overbought - oversold < 20) {
      warnings.push('Narrow range between overbought/oversold may generate excessive signals')
    }
  }

  if (config.name === 'MACD') {
    const fast = Number(config.params.fast)
    const slow = Number(config.params.slow)
    if (fast >= slow) {
      errors.push('Fast period must be less than slow period')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate indicator dependencies
 */
export function validateDependencies(
  indicators: IndicatorConfig[]
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const availableIndicators = new Set(indicators.map(ind => ind.name))

  for (const indicator of indicators) {
    const dependencies = INDICATOR_DEPENDENCIES[indicator.name]
    if (!dependencies) continue

    for (const dep of dependencies) {
      if (!availableIndicators.has(dep)) {
        errors.push(`${indicator.name} requires ${dep} to be enabled`)
      }
    }
  }

  // Check for conflicting indicators
  const rsiCount = indicators.filter(ind => ind.name === 'RSI').length
  if (rsiCount > 3) {
    warnings.push('Multiple RSI indicators may clutter the chart')
  }

  const movingAverages = indicators.filter(ind =>
    ind.name === 'SMA' || ind.name === 'EMA'
  ).length
  if (movingAverages > 5) {
    warnings.push('Too many moving averages may reduce chart clarity')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Get sample presets for quick setup
 */
export function getSamplePresets(): IndicatorPreset[] {
  return [
    {
      name: 'Momentum Trader',
      description: 'Fast-moving momentum indicators for day trading',
      indicators: [
        { name: 'RSI', params: { period: 14, overbought: 70, oversold: 30 } },
        { name: 'MACD', params: { fast: 12, slow: 26, signal: 9 } },
        { name: 'EMA', params: { period: 9 } },
      ],
    },
    {
      name: 'Trend Follower',
      description: 'Trend-following indicators for swing trading',
      indicators: [
        { name: 'SMA', params: { period: 50 } },
        { name: 'SMA', params: { period: 200 } },
        { name: 'MACD', params: { fast: 12, slow: 26, signal: 9 } },
        { name: 'ATR', params: { period: 14 } },
      ],
    },
    {
      name: 'Mean Reversion',
      description: 'Identify overbought/oversold conditions',
      indicators: [
        { name: 'Bollinger Bands', params: { period: 20, stdDev: 2 } },
        { name: 'RSI', params: { period: 14, overbought: 70, oversold: 30 } },
        { name: 'Stochastic', params: { kPeriod: 14, dPeriod: 3, smooth: 3 } },
      ],
    },
    {
      name: 'Volatility Tracker',
      description: 'Monitor market volatility and price ranges',
      indicators: [
        { name: 'Bollinger Bands', params: { period: 20, stdDev: 2 } },
        { name: 'ATR', params: { period: 14 } },
        { name: 'EMA', params: { period: 20 } },
      ],
    },
    {
      name: 'Classic Setup',
      description: 'Traditional technical analysis indicators',
      indicators: [
        { name: 'SMA', params: { period: 20 } },
        { name: 'SMA', params: { period: 50 } },
        { name: 'RSI', params: { period: 14, overbought: 70, oversold: 30 } },
        { name: 'Volume', params: { period: 20 } },
      ],
    },
  ]
}

/**
 * Get dependency hints for an indicator
 */
export function getDependencyHints(indicatorName: string): string[] {
  const dependencies = INDICATOR_DEPENDENCIES[indicatorName]
  if (!dependencies || dependencies.length === 0) {
    return []
  }

  return dependencies.map(dep =>
    `Requires ${dep} to be enabled for full functionality`
  )
}

/**
 * Validate entire indicator set
 */
export function validateIndicatorSet(
  indicators: IndicatorConfig[]
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate each indicator individually
  for (const indicator of indicators) {
    const result = validateIndicator(indicator)
    errors.push(...result.errors.map(err => `${indicator.name}: ${err}`))
    warnings.push(...result.warnings.map(warn => `${indicator.name}: ${warn}`))
  }

  // Validate dependencies
  const depResult = validateDependencies(indicators)
  errors.push(...depResult.errors)
  warnings.push(...depResult.warnings)

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
