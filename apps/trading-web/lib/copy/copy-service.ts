/**
 * CopyService - Centralized UI Copy Management
 * Provides beginner-friendly and expert terminology variants
 * Last updated: 2025-10-03
 */

export type CopyMode = 'beginner' | 'expert'

interface CopyVariant {
  beginner: string
  expert: string
}

/**
 * UI Copy Map
 * Each key provides plain language for beginners and technical terms for experts
 */
export const COPY_MAP: Record<string, CopyVariant> = {
  // PLAN / TODAY VIEW
  'plan.title': {
    beginner: "Today's Plan",
    expert: 'Trading Signals',
  },
  'plan.empty': {
    beginner: 'No opportunities right now. Check back soon!',
    expert: 'No signals meet entry criteria at current market conditions.',
  },
  'plan.loading': {
    beginner: 'Finding opportunities...',
    expert: 'Loading alpha signals...',
  },
  'plan.action.buy': {
    beginner: 'Consider Buying',
    expert: 'Long Entry',
  },
  'plan.action.sell': {
    beginner: 'Consider Selling',
    expert: 'Short Entry',
  },
  'plan.action.hold': {
    beginner: 'Keep Holding',
    expert: 'Maintain Position',
  },
  'plan.action.avoid': {
    beginner: 'Skip This One',
    expert: 'No Position',
  },
  'plan.confidence.low': {
    beginner: 'Lower Confidence',
    expert: 'Low Conviction (CI < 60%)',
  },
  'plan.confidence.medium': {
    beginner: 'Moderate Confidence',
    expert: 'Medium Conviction (CI 60-80%)',
  },
  'plan.confidence.high': {
    beginner: 'Higher Confidence',
    expert: 'High Conviction (CI > 80%)',
  },
  'plan.safety_line': {
    beginner: 'Safety Line',
    expert: 'Stop Loss',
  },
  'plan.entry_hint': {
    beginner: 'Good Price',
    expert: 'Entry Level',
  },
  'plan.target': {
    beginner: 'Potential Gain',
    expert: 'Target Price',
  },
  'plan.max_risk': {
    beginner: 'Max You Could Lose',
    expert: 'Max Risk (USD)',
  },
  'plan.reason': {
    beginner: 'Why This Matters',
    expert: 'Signal Drivers',
  },

  // REASON CODES
  'reason.support_bounce': {
    beginner: 'Price bounced off support level',
    expert: 'Support bounce confirmed',
  },
  'reason.buyer_pressure': {
    beginner: 'Strong buying activity detected',
    expert: 'Buyer pressure increasing',
  },
  'reason.news_sentiment': {
    beginner: 'Positive news about this stock',
    expert: 'News sentiment catalyst',
  },
  'reason.momentum_shift': {
    beginner: 'Price momentum changing direction',
    expert: 'Momentum shift detected',
  },
  'reason.volatility_spike': {
    beginner: 'Price moving more than usual',
    expert: 'Volatility expansion',
  },
  'reason.earnings_surprise': {
    beginner: 'Better-than-expected earnings',
    expert: 'Earnings beat consensus',
  },
  'reason.technical_breakout': {
    beginner: 'Breaking above resistance',
    expert: 'Technical breakout confirmed',
  },
  'reason.oversold_rsi': {
    beginner: 'Price dropped too far, likely to bounce',
    expert: 'RSI oversold (< 30)',
  },
  'reason.volume_surge': {
    beginner: 'Much higher trading activity',
    expert: 'Volume surge (> 2σ)',
  },
  'reason.trend_reversal': {
    beginner: 'Trend may be changing',
    expert: 'Trend reversal signal',
  },

  // ALERTS
  'alerts.title': {
    beginner: 'Your Alerts',
    expert: 'Active Alerts',
  },
  'alerts.armed': {
    beginner: 'Alerts are ON',
    expert: 'Armed',
  },
  'alerts.disarmed': {
    beginner: 'Alerts are OFF',
    expert: 'Disarmed',
  },
  'alerts.quiet_hours': {
    beginner: 'Do Not Disturb',
    expert: 'Quiet Hours',
  },
  'alerts.type.opportunity': {
    beginner: 'New Opportunity',
    expert: 'Entry Signal',
  },
  'alerts.type.protect': {
    beginner: 'Protect Your Position',
    expert: 'Risk Alert',
  },
  'alerts.action.buy_now': {
    beginner: 'Buy Now',
    expert: 'Execute Long',
  },
  'alerts.action.sell_now': {
    beginner: 'Sell Now',
    expert: 'Execute Exit',
  },
  'alerts.action.snooze': {
    beginner: 'Remind Me Later',
    expert: 'Snooze',
  },

  // PORTFOLIO
  'portfolio.title': {
    beginner: 'Your Stocks',
    expert: 'Portfolio',
  },
  'portfolio.total_value': {
    beginner: 'Total Value',
    expert: 'AUM',
  },
  'portfolio.cash': {
    beginner: 'Cash Available',
    expert: 'Buying Power',
  },
  'portfolio.pnl': {
    beginner: 'Total Profit/Loss',
    expert: 'P&L',
  },
  'portfolio.unrealized': {
    beginner: 'Current Gain/Loss',
    expert: 'Unrealized P&L',
  },
  'portfolio.realized': {
    beginner: 'Locked-In Profit/Loss',
    expert: 'Realized P&L',
  },

  // BADGES
  'badge.stop_loss_tooltip': {
    beginner: 'Every trade must have a stop-loss for your protection',
    expert: 'Stop-loss enforcement active per risk policy',
  },
  'badge.daily_cap_tooltip': {
    beginner: 'Trading pauses automatically if you lose more than this in one day',
    expert: 'Daily loss cap enforced - trading halts on breach',
  },
  'badge.paper_trading_tooltip': {
    beginner: 'You are practicing with fake money - no real trades',
    expert: 'Paper trading mode - simulated execution only',
  },
  'badge.position_limit_tooltip': {
    beginner: 'Each stock can only use this much of your money',
    expert: 'Maximum position size per symbol enforced',
  },

  // JOURNAL
  'journal.title': {
    beginner: 'Your Trading History',
    expert: 'Trade Journal',
  },
  'journal.entry': {
    beginner: 'Trade Note',
    expert: 'Journal Entry',
  },
  'journal.tags': {
    beginner: 'Labels',
    expert: 'Tags',
  },

  // ALERTS
  'alerts.bell_tooltip': {
    beginner: 'See your notifications',
    expert: 'Alerts',
  },
  'alerts.bell_muted_tooltip': {
    beginner: 'Notifications are off',
    expert: 'Alerts muted',
  },
  'alerts.bell_aria': {
    beginner: 'Open notifications',
    expert: 'Open alerts',
  },
  'alerts.drawer_title': {
    beginner: 'Your Notifications',
    expert: 'Alerts',
  },
  'alerts.list_aria': {
    beginner: 'List of notifications',
    expert: 'Alert list',
  },
  'alerts.muted_notice': {
    beginner: 'Notifications are turned off. Turn them on to get updates.',
    expert: 'Alerts muted. Enable to receive notifications.',
  },
  'alerts.all_expired': {
    beginner: 'All notifications have expired.',
    expert: 'All alerts expired.',
  },
  'alerts.footer_note': {
    beginner: 'We only send important updates',
    expert: 'Critical alerts only',
  },
  'alerts.type_opportunity': {
    beginner: 'Buy Opportunity',
    expert: 'Opportunity',
  },
  'alerts.type_protect': {
    beginner: 'Safety Alert',
    expert: 'Protection',
  },
  'alerts.paper_only': {
    beginner: 'Practice Only',
    expert: 'Paper Trading',
  },
  'alerts.expiring_soon': {
    beginner: 'Expires in {min} min',
    expert: '{min}m left',
  },
  'alerts.suppressed': {
    beginner: 'This notification was limited to avoid too many alerts',
    expert: 'Alert throttled',
  },
  'alerts.action_buy_now_taken': {
    beginner: 'Got it! Your buy order is being placed.',
    expert: 'Buy order submitted',
  },
  'alerts.action_sell_now_taken': {
    beginner: 'Got it! Your sell order is being placed.',
    expert: 'Sell order submitted',
  },
  'alerts.action_snooze_taken': {
    beginner: 'OK, we will remind you later',
    expert: 'Alert snoozed',
  },
  'alerts.action_buy_now': {
    beginner: 'Buy Now',
    expert: 'Buy',
  },
  'alerts.action_sell_now': {
    beginner: 'Sell Now',
    expert: 'Sell',
  },
  'alerts.action_snooze': {
    beginner: 'Remind Me Later',
    expert: 'Snooze',
  },
  'alerts.safety_details': {
    beginner: 'Safety Information',
    expert: 'Risk Details',
  },
  'alerts.max_loss': {
    beginner: 'Maximum you could lose',
    expert: 'Max Loss',
  },
  'alerts.slippage': {
    beginner: 'Price difference estimate',
    expert: 'Est. Slippage',
  },
  'alerts.confidence': {
    beginner: 'Confidence',
    expert: 'Exec Confidence',
  },
  'alerts.expires': {
    beginner: 'Valid until',
    expert: 'Expires',
  },
  'alerts.empty_armed': {
    beginner: 'No new notifications',
    expert: 'No alerts',
  },
  'alerts.empty_armed_subtitle': {
    beginner: 'We will notify you when there are trading opportunities or important updates',
    expert: 'You will be notified of opportunities and protection events',
  },
  'alerts.empty_muted': {
    beginner: 'Notifications are off',
    expert: 'Alerts muted',
  },
  'alerts.empty_muted_subtitle': {
    beginner: 'Turn on notifications above to get important trading updates',
    expert: 'Enable alerts to receive notifications',
  },
  'alerts.quiet_hours': {
    beginner: 'Quiet Hours (Do Not Disturb)',
    expert: 'Quiet Hours',
  },
  'alerts.quiet_hours_description': {
    beginner: 'Block notifications during these times',
    expert: 'Suppress alerts during specified times',
  },
  'alerts.quiet_start': {
    beginner: 'Start',
    expert: 'From',
  },
  'alerts.quiet_end': {
    beginner: 'End',
    expert: 'To',
  },
  'alerts.armed': {
    beginner: 'Notifications On',
    expert: 'Armed',
  },
  'alerts.muted': {
    beginner: 'Notifications Off',
    expert: 'Muted',
  },
  'alerts.armed_description': {
    beginner: 'You will receive notifications for important updates',
    expert: 'Alert notifications enabled',
  },
  'alerts.muted_description': {
    beginner: 'You will not receive any notifications',
    expert: 'Alert notifications disabled',
  },
  'alerts.conditions': {
    beginner: 'conditions',
    expert: 'rules',
  },
  'alerts.channel_preferences': {
    beginner: 'How to Notify Me',
    expert: 'Delivery Channels',
  },
  'alerts.channel_in_app': {
    beginner: 'In App',
    expert: 'In-App',
  },
  'alerts.channel_push': {
    beginner: 'Push Notifications',
    expert: 'Push',
  },
  'alerts.channel_email': {
    beginner: 'Email',
    expert: 'Email',
  },
  'alerts.channel_sms': {
    beginner: 'Text Message',
    expert: 'SMS',
  },
  'alerts.adaptive_frequency': {
    beginner: 'Smart Frequency',
    expert: 'Adaptive Throttle',
  },
  'alerts.adaptive_frequency_description': {
    beginner: 'Automatically reduce alerts if you mark them as not helpful',
    expert: 'Auto-throttle based on feedback',
  },

  // SETTINGS
  'settings.mode': {
    beginner: 'Experience Level',
    expert: 'Mode',
  },
  'settings.mode.beginner': {
    beginner: 'Beginner (Simple)',
    expert: 'Beginner Mode',
  },
  'settings.mode.expert': {
    beginner: 'Expert (Advanced)',
    expert: 'Expert Mode',
  },
  'settings.risk_appetite': {
    beginner: 'How Much Risk?',
    expert: 'Risk Tolerance',
  },
  'settings.loss_cap': {
    beginner: 'Daily Loss Limit',
    expert: 'Max Daily Drawdown',
  },
  'settings.paper_trading': {
    beginner: 'Practice Mode (No Real Money)',
    expert: 'Paper Trading',
  },
  'settings.live_trading': {
    beginner: 'Real Money Mode',
    expert: 'Live Trading',
  },

  // INDICATORS (EXPERT)
  'indicator.rsi': {
    beginner: 'Momentum Strength',
    expert: 'RSI',
  },
  'indicator.macd': {
    beginner: 'Trend Direction',
    expert: 'MACD',
  },
  'indicator.bollinger': {
    beginner: 'Price Range',
    expert: 'Bollinger Bands',
  },
  'indicator.sma': {
    beginner: 'Average Price',
    expert: 'SMA',
  },
  'indicator.volume': {
    beginner: 'Trading Activity',
    expert: 'Volume',
  },

  // ERROR STATES
  'error.network': {
    beginner: "Can't connect right now. Check your internet.",
    expert: 'Network error. Check connection.',
  },
  'error.timeout': {
    beginner: 'Taking too long. Please try again.',
    expert: 'Request timeout. Retry.',
  },
  'error.rate_limit': {
    beginner: 'Too many requests. Wait a moment.',
    expert: 'Rate limit exceeded. Retry after cooldown.',
  },
  'error.server': {
    beginner: 'Something went wrong. Try refreshing.',
    expert: 'Server error. Retry or contact support.',
  },
  'error.insufficient_data': {
    beginner: 'Not enough data to make a recommendation.',
    expert: 'Insufficient data for signal generation.',
  },

  // LOADING STATES
  'loading.plan': {
    beginner: 'Looking for opportunities...',
    expert: 'Loading signals...',
  },
  'loading.portfolio': {
    beginner: 'Getting your stocks...',
    expert: 'Loading positions...',
  },
  'loading.alerts': {
    beginner: 'Checking alerts...',
    expert: 'Loading alerts...',
  },

  // EMPTY STATES
  'empty.plan': {
    beginner: 'No opportunities right now. Market conditions are not ideal.',
    expert: 'No signals meet current entry criteria.',
  },
  'empty.portfolio': {
    beginner: "You don't own any stocks yet.",
    expert: 'No positions.',
  },
  'empty.alerts': {
    beginner: 'No new alerts.',
    expert: 'Alert queue empty.',
  },
  'empty.journal': {
    beginner: 'No trades yet. Your history will appear here.',
    expert: 'Journal empty.',
  },

  // COMPLIANCE & GUARDRAILS
  'compliance.paper_only': {
    beginner: 'Practice Mode Only (No Real Money)',
    expert: 'Paper Trading Enforced',
  },
  'compliance.no_options': {
    beginner: 'Options Trading Not Available',
    expert: 'Options Restricted',
  },
  'compliance.no_leverage': {
    beginner: 'Margin Trading Not Available',
    expert: 'Leverage Disabled',
  },
  'compliance.daily_cap_warning': {
    beginner: 'Getting close to your daily loss limit',
    expert: 'Approaching daily drawdown cap',
  },
  'compliance.daily_cap_hit': {
    beginner: 'Daily loss limit reached. Trading paused until tomorrow.',
    expert: 'Daily cap hit. Trading halted until reset.',
  },

  // BANNER MESSAGES
  'banner.stale_data': {
    beginner: 'This information is a bit old. Refresh for the latest.',
    expert: 'Data stale. Refresh recommended.',
  },
  'banner.degraded': {
    beginner: 'Some features may be limited right now.',
    expert: 'Service degraded. Some features unavailable.',
  },
  'banner.offline': {
    beginner: "You're offline. Reconnect to trade.",
    expert: 'Offline. Reconnect to resume.',
  },

  // ACTIONS
  'action.refresh': {
    beginner: 'Refresh',
    expert: 'Reload',
  },
  'action.details': {
    beginner: 'See Details',
    expert: 'View Details',
  },
  'action.execute': {
    beginner: 'Do This Trade',
    expert: 'Execute',
  },
  'action.cancel': {
    beginner: 'Cancel',
    expert: 'Cancel',
  },
  'action.confirm': {
    beginner: 'Confirm',
    expert: 'Confirm',
  },
}

/**
 * Get copy text based on current mode
 */
export function getCopy(key: string, mode: CopyMode = 'beginner'): string {
  const variant = COPY_MAP[key]
  if (!variant) {
    console.warn(`CopyService: Missing key "${key}"`)
    return key
  }
  return variant[mode]
}

/**
 * Get all copy keys for autocomplete/validation
 */
export function getCopyKeys(): string[] {
  return Object.keys(COPY_MAP)
}

/**
 * Validate that all required copy keys exist
 */
export function validateCopyKeys(requiredKeys: string[]): string[] {
  return requiredKeys.filter((key) => !COPY_MAP[key])
}
