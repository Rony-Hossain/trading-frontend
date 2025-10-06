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
  entryPrice: number
  currentPrice: number
  pnlUsd: number
  pnlPct: number
  safetyLine: number
  maxPlannedLossUsd: number
  message: string // "You're up $12 (3.2%)"
  target?: number // Optional target price
}

export interface PositionsResponse {
  metadata: ResponseMetadata
  positions: Position[]
  totalValue: number
  cashAvailable: number
  totalPnlUsd: number
  totalPnlPct: number
  costBasis?: number
  dividendsYTD?: number
  realizedPnl?: number
  unrealizedPnl?: number
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

// =============================================================================
// JOURNAL ENDPOINT
// =============================================================================

export type JournalEventType =
  | 'trade_executed'
  | 'alert_triggered'
  | 'safety_adjusted'
  | 'target_set'
  | 'manual_note'
  | 'position_opened'
  | 'position_closed'

export interface JournalEntry {
  id: string
  timestamp: string // ISO 8601
  event_type: JournalEventType
  symbol?: string
  title: string
  description: string
  tags: string[]
  metadata?: {
    action?: 'BUY' | 'SELL' | 'HOLD'
    shares?: number
    price?: number
    pnl?: number
    pnl_pct?: number
    reason?: string
    alert_id?: string
  }
  notes?: string[] // Append-only notes for immutability
  created_by: 'system' | 'user'
  is_editable: boolean
}

export interface JournalFilterParams {
  event_types?: JournalEventType[]
  symbols?: string[]
  tags?: string[]
  start_date?: string // ISO 8601
  end_date?: string // ISO 8601
  search?: string
  limit?: number
  offset?: number
}

export interface JournalResponse {
  metadata: ResponseMetadata
  entries: JournalEntry[]
  total_count: number
  coverage_percentage: number // % of trades with journal entries
}

// =============================================================================
// RULES ENGINE ENDPOINT (Phase 5)
// =============================================================================

export type RuleConditionType = 'indicator' | 'price' | 'news' | 'options' | 'volume' | 'time'
export type RuleOperator = 'greater_than' | 'less_than' | 'equals' | 'crosses_above' | 'crosses_below' | 'between'
export type RuleLogicOperator = 'AND' | 'OR'
export type RuleActionType = 'alert' | 'buy' | 'sell' | 'notify'

export interface RuleCondition {
  id: string
  type: RuleConditionType
  field: string // 'RSI', 'price', 'volume', etc.
  operator: RuleOperator
  value: number | string
  value2?: number // For 'between' operator
  timeframe?: string // '5m', '1h', '1d'
}

export interface RuleGroup {
  id: string
  logic: RuleLogicOperator // AND/OR
  conditions: RuleCondition[]
  groups?: RuleGroup[] // Nested groups for complex logic
}

export interface RuleAction {
  type: RuleActionType
  alert_type?: AlertType
  message?: string
  shares?: number
  limit_price?: number
}

export interface Rule {
  id: string
  name: string
  description: string
  enabled: boolean
  symbol?: string // Null for global rules
  root_group: RuleGroup
  actions: RuleAction[]
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
  created_by: string // User ID
  last_triggered?: string // ISO 8601
  trigger_count: number
  backtest_result?: {
    win_rate: number
    avg_profit_pct: number
    total_triggers: number
    period_days: number
  }
}

export interface RulesResponse {
  metadata: ResponseMetadata
  rules: Rule[]
  total_count: number
}

export interface CreateRuleRequest {
  name: string
  description: string
  symbol?: string
  root_group: RuleGroup
  actions: RuleAction[]
  enabled?: boolean
}

export interface UpdateRuleRequest {
  name?: string
  description?: string
  enabled?: boolean
  root_group?: RuleGroup
  actions?: RuleAction[]
}

export interface RulePreviewRequest {
  symbol: string
  root_group: RuleGroup
  lookback_days?: number // Default 30
}

export interface RulePreviewResponse {
  metadata: ResponseMetadata
  total_triggers: number
  sample_triggers: Array<{
    timestamp: string
    price: number
    condition_values: Record<string, number>
    would_execute: boolean
  }>
  backtest_stats: {
    win_rate: number
    avg_profit_pct: number
    max_profit_pct: number
    max_loss_pct: number
    total_triggers: number
    profitable_triggers: number
  }
  validation_warnings: string[] // e.g., "RSI condition never triggered"
  conflicts: string[] // e.g., "Condition 1 and 2 are mutually exclusive"
}

export interface RuleTemplate {
  id: string
  name: string
  category: 'momentum' | 'reversal' | 'breakout' | 'risk_management' | 'custom'
  description: string
  root_group: RuleGroup
  actions: RuleAction[]
  popularity: number // 0-100
  avg_win_rate?: number
}

// =============================================================================
// ML INSIGHTS & REGIME HINTING (Phase 6)
// =============================================================================

/**
 * Market regime classification
 */
export type RegimeType =
  | 'bull_trending' // Strong uptrend, high momentum
  | 'bear_trending' // Strong downtrend, high momentum
  | 'choppy' // Sideways, low momentum
  | 'high_volatility' // High volatility, uncertain direction
  | 'low_volatility' // Low volatility, stable
  | 'unknown' // Insufficient data

/**
 * Regime data with confidence and metadata
 */
export interface RegimeData {
  regime: RegimeType
  confidence: number // 0.0-1.0
  detected_at: string // ISO 8601
  duration_minutes: number // How long we've been in this regime
  characteristics: string[] // e.g., ["high_volume", "wide_spreads", "news_driven"]
  recommendation_tone: 'aggressive' | 'moderate' | 'cautious' // Auto-adjust copy tone
}

/**
 * Driver with enhanced metadata for ML insights
 */
export interface MLDriver extends Driver {
  category: 'technical' | 'fundamental' | 'sentiment' | 'options' | 'macro'
  trend_direction?: 'up' | 'down' | 'neutral'
  strength: 'weak' | 'moderate' | 'strong'
  timeframe: 'short' | 'medium' | 'long' // Relevant timeframe
}

/**
 * Confidence stability tracking over time
 */
export interface ConfidenceStability {
  current: number // Current confidence 0.0-1.0
  previous: number[] // Last N confidence values
  trend: 'rising' | 'stable' | 'falling'
  volatility: number // Standard deviation of recent confidence
  last_updated: string // ISO 8601
  time_window_minutes: number // e.g., 15
}

/**
 * Diagnostics summary for inline display
 */
export interface DiagnosticsSummary {
  model_confidence: number // 0.0-1.0
  drift_status: 'green' | 'yellow' | 'red'
  top_drivers: MLDriver[] // Top 3 drivers
  regime: RegimeData
  confidence_stability: ConfidenceStability
  last_updated: string // ISO 8601
}

/**
 * User feedback on insights
 */
export interface InsightFeedback {
  insight_id: string // Which insight (driver chip, regime banner, etc.)
  helpful: boolean
  reason?: 'too_technical' | 'confusing' | 'incorrect' | 'very_helpful' | 'somewhat_helpful'
  comment?: string
  submitted_at: string // ISO 8601
}

/**
 * ML Insights API response
 */
export interface MLInsightsResponse {
  metadata: ResponseMetadata
  diagnostics: DiagnosticsSummary
  regime: RegimeData
  drivers: MLDriver[]
  confidence_history: ConfidenceStability
  error?: ErrorResponse
}

// =============================================================================
// LEARN HUB & EDUCATION (Phase 7)
// =============================================================================

/**
 * Lesson difficulty level
 */
export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced'

/**
 * Lesson category
 */
export type LessonCategory =
  | 'basics' // Market fundamentals
  | 'technical' // Technical analysis
  | 'fundamental' // Fundamental analysis
  | 'risk' // Risk management
  | 'psychology' // Trading psychology
  | 'platform' // Platform features
  | 'strategy' // Trading strategies

/**
 * Lesson content block type
 */
export type ContentBlockType =
  | 'text' // Markdown text
  | 'image' // Image with caption
  | 'video' // Video embed
  | 'quiz' // Interactive quiz
  | 'interactive' // Interactive demo
  | 'code' // Code example

/**
 * Lesson content block
 */
export interface ContentBlock {
  type: ContentBlockType
  content: string // Markdown, URL, or JSON for interactive content
  caption?: string
  metadata?: Record<string, unknown> // Block-specific metadata
}

/**
 * Quiz question
 */
export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number // Index of correct option
  explanation: string
}

/**
 * Lesson
 */
export interface Lesson {
  id: string
  slug: string
  title: string
  description: string
  category: LessonCategory
  difficulty: LessonDifficulty
  estimatedMinutes: number
  prerequisites: string[] // Lesson IDs
  blocks: ContentBlock[]
  quiz?: QuizQuestion[]
  tags: string[]
  author: string
  publishedAt: string // ISO 8601
  updatedAt: string // ISO 8601
  version: number
}

/**
 * User lesson progress
 */
export interface LessonProgress {
  lessonId: string
  userId: string
  status: 'not_started' | 'in_progress' | 'completed'
  currentBlockIndex: number
  quizScore?: number // 0-100
  startedAt?: string // ISO 8601
  completedAt?: string // ISO 8601
  timeSpentSeconds: number
}

/**
 * Glossary entry with versioning
 */
export interface GlossaryEntry {
  term: string
  category: string
  difficulty: LessonDifficulty
  definition: string // Plain English (<60 words)
  howWeUse: string // How we use it (<60 words)
  example?: string
  relatedTerms: string[]
  relatedLessons: string[] // Lesson IDs
  lastReviewed: string // YYYY-MM-DD
  version: number
  freshnessStatus: 'current' | 'review_soon' | 'outdated' // Based on lastReviewed
}

/**
 * Learning path (curated lesson sequence)
 */
export interface LearningPath {
  id: string
  slug: string
  title: string
  description: string
  lessons: string[] // Lesson IDs in order
  difficulty: LessonDifficulty
  estimatedHours: number
  tags: string[]
}

/**
 * Recommended lesson
 */
export interface RecommendedLesson {
  lesson: Lesson
  reason: string // Why recommended
  relevanceScore: number // 0-1
}

/**
 * Learn Hub API response
 */
export interface LearnHubResponse {
  metadata: ResponseMetadata
  lessons: Lesson[]
  paths: LearningPath[]
  userProgress: LessonProgress[]
  recommended: RecommendedLesson[]
  continueLesson?: LessonProgress // Resume where left off
  error?: ErrorResponse
}

/**
 * Glossary search response
 */
export interface GlossarySearchResponse {
  metadata: ResponseMetadata
  entries: GlossaryEntry[]
  totalCount: number
  query: string
  error?: ErrorResponse
}
