/**
 * Telemetry Taxonomy
 * Centralized event tracking schema for analytics and observability
 * Last updated: 2025-10-03
 */

// =============================================================================
// EVENT CATEGORIES
// =============================================================================

export enum TelemetryCategory {
  PLAN = 'plan',
  ALERTS = 'alerts',
  PORTFOLIO = 'portfolio',
  JOURNAL = 'journal',
  SETTINGS = 'settings',
  NAVIGATION = 'navigation',
  PERFORMANCE = 'performance',
  ERROR = 'error',
  USER_FEEDBACK = 'user_feedback',
}

// =============================================================================
// PLAN EVENTS
// =============================================================================

export interface PlanViewedEvent {
  category: TelemetryCategory.PLAN
  action: 'plan_viewed'
  mode: 'beginner' | 'expert'
  picks_count: number
  daily_cap_status: 'ok' | 'warning' | 'hit'
  load_time_ms: number
  has_degraded_fields: boolean
}

export interface PlanRefreshedEvent {
  category: TelemetryCategory.PLAN
  action: 'plan_refreshed'
  trigger: 'manual' | 'auto' | 'stale_banner'
  previous_picks_count: number
  new_picks_count: number
}

export interface PickExpandedEvent {
  category: TelemetryCategory.PLAN
  action: 'pick_expanded'
  symbol: string
  action_type: 'BUY' | 'SELL' | 'HOLD' | 'AVOID'
  confidence: 'low' | 'medium' | 'high'
}

export interface PickExecutedEvent {
  category: TelemetryCategory.PLAN
  action: 'pick_executed'
  symbol: string
  shares: number
  action_type: 'BUY' | 'SELL'
  source: 'plan_card' | 'alert' | 'portfolio'
  paper_trade: boolean
}

export interface ExplainChipClickedEvent {
  category: TelemetryCategory.PLAN
  action: 'explain_chip_clicked'
  term: string
  context: 'plan_card' | 'portfolio' | 'settings'
  mode: 'beginner' | 'expert'
}

// =============================================================================
// ALERTS EVENTS
// =============================================================================

export interface AlertReceivedEvent {
  category: TelemetryCategory.ALERTS
  action: 'alert_received'
  alert_type: 'opportunity' | 'protect'
  symbol: string
  was_throttled: boolean
  delivery_channel: 'in_app' | 'push' | 'email' | 'sms'
}

export interface AlertClickedEvent {
  category: TelemetryCategory.ALERTS
  action: 'alert_clicked'
  alert_id: string
  alert_type: 'opportunity' | 'protect'
  time_since_received_sec: number
}

export interface AlertActionTakenEvent {
  category: TelemetryCategory.ALERTS
  action: 'alert_action_taken'
  alert_id: string
  chosen_action: 'buy_now' | 'sell_now' | 'snooze'
  time_to_action_sec: number
}

export interface AlertDismissedEvent {
  category: TelemetryCategory.ALERTS
  action: 'alert_dismissed'
  alert_id: string
  time_active_sec: number
}

export interface AlertFeedbackEvent {
  category: TelemetryCategory.ALERTS
  action: 'alert_feedback'
  alert_id: string
  helpful: boolean
  reason?: string
}

export interface QuietHoursToggledEvent {
  category: TelemetryCategory.ALERTS
  action: 'quiet_hours_toggled'
  enabled: boolean
  hours: string[] // ["22:00-07:00"]
}

// =============================================================================
// PORTFOLIO EVENTS
// =============================================================================

export interface PortfolioViewedEvent {
  category: TelemetryCategory.PORTFOLIO
  action: 'portfolio_viewed'
  positions_count: number
  total_pnl_usd: number
  mode: 'beginner' | 'expert'
}

export interface PositionDetailedEvent {
  category: TelemetryCategory.PORTFOLIO
  action: 'position_detailed'
  symbol: string
  pnl_pct: number
  days_held: number
}

export interface SafetyAdjustedEvent {
  category: TelemetryCategory.PORTFOLIO
  action: 'safety_adjusted'
  symbol: string
  old_stop_loss: number
  new_stop_loss: number
  reason: 'manual' | 'alert_triggered'
}

export interface PositionClosedEvent {
  category: TelemetryCategory.PORTFOLIO
  action: 'position_closed'
  symbol: string
  shares: number
  entry_price: number
  exit_price: number
  pnl_usd: number
  pnl_pct: number
  days_held: number
  trigger: 'manual' | 'stop_loss' | 'alert'
}

// =============================================================================
// JOURNAL EVENTS
// =============================================================================

export interface JournalViewedEvent {
  category: TelemetryCategory.JOURNAL
  action: 'journal_viewed'
  entries_count: number
  filter_applied?: string
}

export interface JournalEntryCreatedEvent {
  category: TelemetryCategory.JOURNAL
  action: 'journal_entry_created'
  entry_type: 'trade' | 'note' | 'lesson'
  has_tags: boolean
  char_length: number
}

export interface JournalExportedEvent {
  category: TelemetryCategory.JOURNAL
  action: 'journal_exported'
  format: 'csv' | 'pdf' | 'json'
  entries_count: number
  date_range_days: number
}

// =============================================================================
// SETTINGS EVENTS
// =============================================================================

export interface ModeToggledEvent {
  category: TelemetryCategory.SETTINGS
  action: 'mode_toggled'
  from_mode: 'beginner' | 'expert'
  to_mode: 'beginner' | 'expert'
  trigger: 'settings_page' | 'quick_toggle'
}

export interface RiskAppetiteChangedEvent {
  category: TelemetryCategory.SETTINGS
  action: 'risk_appetite_changed'
  from_level: 'conservative' | 'moderate' | 'aggressive'
  to_level: 'conservative' | 'moderate' | 'aggressive'
}

export interface LossCapChangedEvent {
  category: TelemetryCategory.SETTINGS
  action: 'loss_cap_changed'
  from_pct: number
  to_pct: number
}

export interface PaperTradingToggledEvent {
  category: TelemetryCategory.SETTINGS
  action: 'paper_trading_toggled'
  enabled: boolean
  mode: 'beginner' | 'expert'
}

export interface SettingChangedEvent {
  category: TelemetryCategory.SETTINGS
  action: 'setting_changed'
  setting_key: string
  old_value: unknown
  new_value: unknown
}

// =============================================================================
// NAVIGATION EVENTS
// =============================================================================

export interface PageViewedEvent {
  category: TelemetryCategory.NAVIGATION
  action: 'page_viewed'
  page: '/today' | '/portfolio' | '/alerts' | '/explore' | '/settings' | '/learn' | '/journal'
  referrer?: string
  load_time_ms: number
}

export interface NavItemClickedEvent {
  category: TelemetryCategory.NAVIGATION
  action: 'nav_item_clicked'
  from_page: string
  to_page: string
  nav_type: 'main_nav' | 'breadcrumb' | 'link'
}

// =============================================================================
// PERFORMANCE EVENTS
// =============================================================================

export interface PerformanceMetricEvent {
  category: TelemetryCategory.PERFORMANCE
  action: 'performance_metric'
  metric: 'lcp' | 'fid' | 'cls' | 'ttfb' | 'inp'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  page: string
}

export interface RealtimeThrottledEvent {
  category: TelemetryCategory.PERFORMANCE
  action: 'realtime_throttled'
  max_points_exceeded: boolean
  update_rate_ms: number
  dropped_updates: number
}

export interface BundleSizeEvent {
  category: TelemetryCategory.PERFORMANCE
  action: 'bundle_size'
  route: string
  size_kb: number
  load_time_ms: number
}

// =============================================================================
// ERROR EVENTS
// =============================================================================

export interface ErrorOccurredEvent {
  category: TelemetryCategory.ERROR
  action: 'error_occurred'
  error_code: string
  error_message: string
  context: string
  retry_available: boolean
  degraded_fields?: string[]
}

export interface RateLimitHitEvent {
  category: TelemetryCategory.ERROR
  action: 'rate_limit_hit'
  endpoint: string
  retry_after_sec: number
}

export interface NetworkErrorEvent {
  category: TelemetryCategory.ERROR
  action: 'network_error'
  endpoint: string
  status_code?: number
  timeout: boolean
}

// =============================================================================
// USER FEEDBACK EVENTS
// =============================================================================

export interface TooltipOpenedEvent {
  category: TelemetryCategory.USER_FEEDBACK
  action: 'tooltip_opened'
  term: string
  context: 'plan' | 'portfolio' | 'alerts' | 'settings'
  mode: 'beginner' | 'expert'
}

export interface FeedbackSubmittedEvent {
  category: TelemetryCategory.USER_FEEDBACK
  action: 'feedback_submitted'
  feature: string
  helpful: boolean
  comment?: string
}

export interface HelpfulnessRatedEvent {
  category: TelemetryCategory.USER_FEEDBACK
  action: 'helpfulness_rated'
  item_type: 'alert' | 'driver_chip' | 'explanation'
  item_id: string
  rating: 1 | 2 | 3 | 4 | 5
}

// =============================================================================
// UNION TYPE OF ALL EVENTS
// =============================================================================

export type TelemetryEvent =
  | PlanViewedEvent
  | PlanRefreshedEvent
  | PickExpandedEvent
  | PickExecutedEvent
  | ExplainChipClickedEvent
  | AlertReceivedEvent
  | AlertClickedEvent
  | AlertActionTakenEvent
  | AlertDismissedEvent
  | AlertFeedbackEvent
  | QuietHoursToggledEvent
  | PortfolioViewedEvent
  | PositionDetailedEvent
  | SafetyAdjustedEvent
  | PositionClosedEvent
  | JournalViewedEvent
  | JournalEntryCreatedEvent
  | JournalExportedEvent
  | ModeToggledEvent
  | RiskAppetiteChangedEvent
  | LossCapChangedEvent
  | PaperTradingToggledEvent
  | SettingChangedEvent
  | PageViewedEvent
  | NavItemClickedEvent
  | PerformanceMetricEvent
  | RealtimeThrottledEvent
  | BundleSizeEvent
  | ErrorOccurredEvent
  | RateLimitHitEvent
  | NetworkErrorEvent
  | TooltipOpenedEvent
  | FeedbackSubmittedEvent
  | HelpfulnessRatedEvent

// =============================================================================
// TELEMETRY SERVICE
// =============================================================================

export interface TelemetryService {
  track(event: TelemetryEvent): void
  setUser(userId: string, traits?: Record<string, unknown>): void
  flush(): Promise<void>
}

/**
 * Track telemetry event
 * Implementation will integrate with chosen observability stack
 */
export function trackEvent(event: TelemetryEvent): void {
  // TODO: Integrate with observability stack (PostHog, Mixpanel, etc.)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Telemetry]', event.category, event.action, event)
  }
}

/**
 * Track page view with performance metrics
 */
export function trackPageView(
  page: string,
  loadTimeMs: number,
  referrer?: string
): void {
  trackEvent({
    category: TelemetryCategory.NAVIGATION,
    action: 'page_viewed',
    page: page as PageViewedEvent['page'],
    load_time_ms: loadTimeMs,
    referrer,
  })
}

/**
 * Track performance metric (Web Vitals)
 */
export function trackPerformance(
  metric: PerformanceMetricEvent['metric'],
  value: number,
  page: string
): void {
  const rating: PerformanceMetricEvent['rating'] =
    value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor'

  trackEvent({
    category: TelemetryCategory.PERFORMANCE,
    action: 'performance_metric',
    metric,
    value,
    rating,
    page,
  })
}

/**
 * Track error with context
 */
export function trackError(
  code: string,
  message: string,
  context: string,
  retryAvailable: boolean = false,
  degradedFields?: string[]
): void {
  trackEvent({
    category: TelemetryCategory.ERROR,
    action: 'error_occurred',
    error_code: code,
    error_message: message,
    context,
    retry_available: retryAvailable,
    degraded_fields: degradedFields,
  })
}
