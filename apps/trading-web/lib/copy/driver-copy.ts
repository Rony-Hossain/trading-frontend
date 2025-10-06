/**
 * Driver Copy Service
 * Maps ML driver codes to beginner-friendly and expert explanations
 * Phase 6: ML Insights & Regime Hinting
 */

interface DriverCopyEntry {
  beginner: string
  expert: string
}

/**
 * Driver copy mappings
 * Keyed by driver name (snake_case)
 */
const DRIVER_COPY: Record<string, DriverCopyEntry> = {
  // Technical drivers
  rsi_oversold: {
    beginner: 'Stock is oversold - price may bounce back up soon',
    expert: 'RSI indicates oversold conditions below 30, potential mean reversion opportunity',
  },
  rsi_overbought: {
    beginner: 'Stock is overbought - price may pull back',
    expert: 'RSI above 70 indicates overbought conditions, increased reversal risk',
  },
  macd_cross_bullish: {
    beginner: 'Momentum indicator just turned positive',
    expert: 'MACD histogram crossed above signal line, bullish momentum shift detected',
  },
  macd_cross_bearish: {
    beginner: 'Momentum indicator just turned negative',
    expert: 'MACD histogram crossed below signal line, bearish momentum shift detected',
  },
  sma_crossover_golden: {
    beginner: 'Short-term average crossed above long-term average - bullish signal',
    expert: 'Golden cross detected (SMA 50 > SMA 200), classic bullish trend confirmation',
  },
  sma_crossover_death: {
    beginner: 'Short-term average fell below long-term average - bearish signal',
    expert: 'Death cross detected (SMA 50 < SMA 200), bearish trend confirmation',
  },
  bollinger_squeeze: {
    beginner: 'Price is in a tight range - a big move may be coming',
    expert: 'Bollinger Bands contracting, volatility compression suggests breakout imminent',
  },
  volume_surge: {
    beginner: 'Trading volume is much higher than usual',
    expert: 'Volume 2-3x above 20-day average, strong conviction behind current move',
  },
  support_bounce: {
    beginner: 'Price bounced off a support level',
    expert: 'Price tested key support and reversed, buyers stepped in at critical level',
  },
  resistance_break: {
    beginner: 'Price broke through a resistance level',
    expert: 'Price cleared key resistance with volume confirmation, potential continuation',
  },

  // Fundamental drivers
  earnings_beat: {
    beginner: 'Company reported better-than-expected earnings',
    expert: 'Quarterly EPS exceeded consensus by >5%, positive earnings surprise',
  },
  revenue_growth: {
    beginner: 'Company is growing sales faster than expected',
    expert: 'YoY revenue growth accelerating above analyst estimates',
  },
  guidance_raise: {
    beginner: 'Company raised its future earnings forecast',
    expert: 'Management upgraded forward guidance above street consensus',
  },
  analyst_upgrade: {
    beginner: 'Analyst upgraded the stock rating',
    expert: 'Multiple analyst upgrades in past 7 days, positive sentiment shift',
  },
  valuation_discount: {
    beginner: 'Stock is trading below its estimated fair value',
    expert: 'P/E ratio 20% below sector average, potential value opportunity',
  },

  // Sentiment drivers
  news_sentiment_positive: {
    beginner: 'Recent news about the company is mostly positive',
    expert: 'News sentiment score >0.7 over past 24h, strong positive coverage',
  },
  news_sentiment_negative: {
    beginner: 'Recent news about the company is mostly negative',
    expert: 'News sentiment score <0.3 over past 24h, negative coverage prevails',
  },
  social_buzz: {
    beginner: 'Stock is getting a lot of attention on social media',
    expert: 'Social media mentions 3x above baseline, elevated retail interest',
  },
  insider_buying: {
    beginner: 'Company executives are buying shares',
    expert: 'Insider cluster buying detected in past 30 days, bullish signal',
  },
  insider_selling: {
    beginner: 'Company executives are selling shares',
    expert: 'Insider selling accelerated, potential caution flag',
  },

  // Options drivers
  iv_rank_high: {
    beginner: 'Options are pricing in larger moves than usual',
    expert: 'IV Rank >80, implied volatility elevated vs historical range',
  },
  iv_rank_low: {
    beginner: 'Options are pricing in smaller moves than usual',
    expert: 'IV Rank <20, implied volatility compressed, potential event catalyst',
  },
  put_call_ratio_bullish: {
    beginner: 'More call options than puts - traders expect upside',
    expert: 'Put/Call ratio <0.7, skew toward bullish options positioning',
  },
  put_call_ratio_bearish: {
    beginner: 'More put options than calls - traders expect downside',
    expert: 'Put/Call ratio >1.3, elevated hedging activity or bearish bets',
  },
  unusual_call_activity: {
    beginner: 'Unusually high call option buying detected',
    expert: 'Call volume 5x above 30-day average, potential informed positioning',
  },
  unusual_put_activity: {
    beginner: 'Unusually high put option buying detected',
    expert: 'Put volume 5x above 30-day average, hedging or bearish positioning',
  },

  // Macro drivers
  sector_rotation: {
    beginner: 'Money is moving into this sector',
    expert: 'Sector outperformance vs S&P 500 past 5 days, rotation trend active',
  },
  market_correlation: {
    beginner: 'Stock is moving with the overall market',
    expert: 'Beta 0.9-1.1 to SPY, high correlation to broad market direction',
  },
  interest_rate_impact: {
    beginner: 'Interest rate changes are affecting this stock',
    expert: 'Duration-adjusted sensitivity to 10Y yield changes detected',
  },
  commodity_correlation: {
    beginner: 'Commodity prices are affecting this stock',
    expert: 'High correlation to WTI crude/gold/copper pricing trends',
  },
}

/**
 * Get driver copy for display
 * Falls back to formatted driver name if not in dictionary
 */
export function getDriverCopy(
  driverName: string,
  mode: 'beginner' | 'expert' = 'beginner'
): string {
  const entry = DRIVER_COPY[driverName]

  if (entry) {
    return mode === 'beginner' ? entry.beginner : entry.expert
  }

  // Fallback: format driver name nicely
  return driverName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Check if driver has a copy entry
 */
export function hasDriverCopy(driverName: string): boolean {
  return driverName in DRIVER_COPY
}

/**
 * Get all driver names that have copy
 */
export function getAllDriverNames(): string[] {
  return Object.keys(DRIVER_COPY)
}
