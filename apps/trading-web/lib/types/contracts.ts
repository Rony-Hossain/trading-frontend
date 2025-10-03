/**
 * Domain Types & Integration Contracts
 * Maps to services/signal-service/app/core/contracts.py
 * Last updated: 2025-10-03
 */

// =============================================================================
// SHARED METADATA
// =============================================================================

export interface SourceModel {
  name: string
  version: string
  sha: string
  confidence?: number
}

export interface ResponseMetadata {
  request_id: string // ULID for tracing
  generated_at: string // ISO 8601
  version: string // e.g., "plan.v1"
  latency_ms: number
  source_models: SourceModel[]
}

export interface ErrorResponse {
  code: string // UPSTREAM_TIMEOUT, INSUFFICIENT_DATA, etc.
  message: string
  retry_after_seconds?: number
  degraded_fields?: string[] // ["sentiment", "target"]
}

// =============================================================================
// PLAN ENDPOINT
// =============================================================================

export type ReasonCode =
  | 'support_bounce'
  | 'buyer_pressure'
  | 'news_sentiment'
  | 'momentum_shift'
  | 'volatility_spike'
  | 'earnings_surprise'
  | 'technical_breakout'
  | 'oversold_rsi'
  | 'volume_surge'
  | 'trend_reversal'

export interface Constraints {
  stop_loss: number
  max_position_value_usd: number
  min_holding_period_sec: number // 300 = 5min min hold for beginners
}

export interface LimitsApplied {
  volatility_brake: boolean
  earnings_window: boolean
  cap_hit: boolean
  drift_downgrade: boolean
}

export interface Compliance {
  leverage_ok: boolean
  options_allowed: boolean
  short_allowed: boolean
  paper_trade_only: boolean
}

export interface Driver {
  name: string
  contribution: number // 0.0-1.0
  value?: number // Actual value if numeric
}

export type ActionType = 'BUY' | 'SELL' | 'HOLD' | 'AVOID'
export type ConfidenceLevel = 'low' | 'medium' | 'high'

export interface Pick {
  symbol: string
  action: ActionType
  shares: number
  entry_hint: number
  safety_line: number
  target?: number // None if forecast unavailable
  confidence: ConfidenceLevel
  reason: string // Plain English
  reason_codes: ReasonCode[]
  max_risk_usd: number
  budget_impact: { cash_left: number }
  constraints: Constraints
  limits_applied: LimitsApplied
  compliance: Compliance
  decision_path: string // "ALPHA>THRESH>RISK_OK>SENTIMENT_OK"
  drivers?: Driver[] // Expert mode only
  reason_score: number // Quality score 0-1
}

export type DailyCapStatus = 'ok' | 'warning' | 'hit'

export interface DailyCap {
  max_loss_usd: number
  used_usd: number
  status: DailyCapStatus
  reset_at: string // ISO 8601
  reason?: string // Reason when status != ok
}

export type IndicatorSignalType = 'bullish' | 'bearish' | 'neutral' | 'oversold' | 'overbought'
export type IndicatorColor = 'green' | 'red' | 'yellow'

export interface IndicatorSignal {
  value: number
  signal: IndicatorSignalType
  color: IndicatorColor
}

export interface ExpertPanels {
  indicators: Record<string, IndicatorSignal> // {"rsi": {...}, "macd": {...}}
  options: Record<string, number> // {"iv_rank": 65, "max_pain": 185}
  diagnostics: Record<string, unknown> // {"drift_status": "green", "top_drivers": [...]}
  explain_tokens: string[] // Preload hints for tooltips
}

export type UserMode = 'beginner' | 'expert'

export interface PlanResponse {
  metadata: ResponseMetadata
  mode: UserMode
  daily_cap: DailyCap
  picks: Pick[]
  expert_panels?: ExpertPanels
  error?: ErrorResponse
  ui_hints?: Record<string, string> // {"show_banner": "degraded_sentiment"}
}

// =============================================================================
// ALERTS ENDPOINT
// =============================================================================

export interface AlertThrottle {
  cooldown_sec: number // 900 = 15min default
  dedupe_key: string
  suppressed: boolean
  suppressed_reason?: string
}

export interface AlertSafety {
  max_loss_usd: number
  estimated_slippage_bps: number
  execution_confidence: number
}

export type AlertType = 'opportunity' | 'protect'
export type AlertAction = 'buy_now' | 'sell_now' | 'snooze'

export interface Alert {
  id: string // ULID
  type: AlertType
  symbol: string
  message: string
  actions: AlertAction[]
  safety: AlertSafety
  throttle: AlertThrottle
  paper_trade_only: boolean
  expires_at: string // ISO 8601
  created_at: string // ISO 8601
}

export interface AlertsResponse {
  metadata: ResponseMetadata
  alerts: Alert[]
  armed: boolean // Whether alerts are enabled
  quiet_hours: string[] // ["22:00-07:00"]
}

export interface AlertArmRequest {
  opportunity: boolean
  protect: boolean
  quiet_hours: string[] // ["22:00-07:00"]
}

// =============================================================================
// EXPLAIN ENDPOINT
// =============================================================================

export interface ExplainMath {
  formula: string
  example: string
}

export interface ExplainResponse {
  term: string
  plain: string // Plain English (<=60 words)
  how_we_use: string // How we use it (<=60 words)
  math: ExplainMath
  last_reviewed: string // YYYY-MM-DD
  related_terms: string[]
}

// =============================================================================
// ACTIONS ENDPOINT
// =============================================================================

export interface BuyRequest {
  symbol: string
  shares: number
  limit_price?: number
  alert_id?: string // If triggered by alert
}

export interface SellRequest {
  symbol: string
  shares: number
  limit_price?: number
  alert_id?: string
}

export type ActionStatus = 'pending' | 'executed' | 'failed'

export interface ActionResponse {
  action_id: string
  status: ActionStatus
  symbol: string
  shares: number
  estimated_cost: number
  idempotency_key: string
  result?: Record<string, unknown>
}

// =============================================================================
// POSITIONS ENDPOINT
// =============================================================================

export interface Position {
  symbol: string
  shares: number
  entry_price: number
  current_price: number
  pnl_usd: number
  pnl_pct: number
  safety_line: number
  max_planned_loss_usd: number
  message: string // "You're up $12 (3.2%)"
}

export interface PositionsResponse {
  metadata: ResponseMetadata
  positions: Position[]
  total_value: number
  cash_available: number
  total_pnl_usd: number
  total_pnl_pct: number
}

// =============================================================================
// NEWS CONTRACTS (Phase 0 Extension)
// =============================================================================

export type NewsSentiment = 'positive' | 'negative' | 'neutral'
export type NewsEventType = 'earnings' | 'analyst' | 'regulatory' | 'market' | 'general'
export type NewsImportance = 'low' | 'medium' | 'high' | 'critical'

export interface NewsItem {
  id: string
  symbols: string[]
  headline: string
  summary: string
  source: string
  url: string
  published_at: string // ISO 8601
  sentiment: NewsSentiment
  importance: NewsImportance
  event_type: NewsEventType
}

export interface NewsFeedParams {
  symbols?: string[]
  lookback_hours?: number
  max_items?: number
  sources?: string[]
  language?: string
}

export interface NewsFeedResponse {
  metadata: ResponseMetadata
  items: NewsItem[]
  total_count: number
}
