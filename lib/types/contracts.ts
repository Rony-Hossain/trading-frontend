/**
 * Backend-aligned TypeScript contracts used across the trading frontend.
 * These interfaces mirror `services/signal-service/app/core/contracts.py`
 * and related service responses so TanStack Query hooks, service adapters,
 * and UI components share a single source of truth.
 */

export type Mode = "beginner" | "expert"

export interface SourceModel {
  name: string
  version: string
  sha: string
  confidence?: number
}

export interface ResponseMetadata {
  requestId: string
  generatedAt: string // ISO timestamp
  version: string
  latencyMs: number
  sourceModels: SourceModel[]
}

export type ReasonCode =
  | "support_bounce"
  | "buyer_pressure"
  | "news_sentiment"
  | "momentum_shift"
  | "volatility_spike"
  | "earnings_surprise"
  | "technical_breakout"
  | "oversold_rsi"
  | "volume_surge"
  | "trend_reversal"

export interface Constraints {
  stopLoss: number
  maxPositionValueUsd: number
  minHoldingPeriodSec: number
}

export interface LimitsApplied {
  volatilityBrake?: boolean
  earningsWindow?: boolean
  capHit?: boolean
  driftDowngrade?: boolean
}

export interface Compliance {
  leverageOk: boolean
  optionsAllowed: boolean
  shortAllowed: boolean
  paperTradeOnly: boolean
}

export interface Driver {
  name: string
  contribution: number
  value?: number
}

export interface Pick {
  symbol: string
  action: "BUY" | "SELL" | "HOLD" | "AVOID"
  shares: number
  entryHint: number
  safetyLine: number
  target?: number
  confidence: "low" | "medium" | "high"
  reason: string
  reasonCodes: ReasonCode[]
  maxRiskUsd: number
  budgetImpact: Record<string, number>
  constraints: Constraints
  limitsApplied: LimitsApplied
  compliance: Compliance
  decisionPath: string
  drivers?: Driver[]
  reasonScore: number
}

export interface DailyCap {
  maxLossUsd: number
  usedUsd: number
  status: "ok" | "warning" | "hit"
  resetAt: string
  reason?: string
}

export type IndicatorSignalValue = "bullish" | "bearish" | "neutral" | "oversold" | "overbought"

export interface IndicatorSignal {
  value: number
  signal: IndicatorSignalValue
  color: "green" | "red" | "yellow"
}

export interface ExpertPanels {
  indicators: Record<string, IndicatorSignal>
  options: Record<string, number>
  diagnostics: Record<string, unknown>
  explainTokens: string[]
}

export interface ErrorResponse {
  code: string
  message: string
  retryAfterSeconds?: number
  degradedFields?: string[]
}

export interface PlanResponse {
  metadata: ResponseMetadata
  mode: Mode
  dailyCap: DailyCap
  picks: Pick[]
  expertPanels?: ExpertPanels
  error?: ErrorResponse
  uiHints?: Record<string, unknown>
}

export interface AlertThrottle {
  cooldownSec: number
  dedupeKey: string
  suppressed?: boolean
  suppressedReason?: string
}

export interface AlertSafety {
  maxLossUsd: number
  estimatedSlippageBps: number
  executionConfidence: number
}

export interface Alert {
  id: string
  type: "opportunity" | "protect"
  symbol: string
  message: string
  actions: Array<"buy_now" | "sell_now" | "snooze">
  safety: AlertSafety
  throttle: AlertThrottle
  paperTradeOnly: boolean
  expiresAt: string
  createdAt: string
}

export interface AlertsResponse {
  metadata: ResponseMetadata
  alerts: Alert[]
  armed: boolean
  quietHours: string[]
}

export interface AlertArmRequest {
  opportunity: boolean
  protect: boolean
  quietHours: string[]
}

export interface ExplainMath {
  formula: string
  example: string
}

export interface ExplainResponse {
  symbol: string
  plainEnglish: string
  glossary: Array<{ term: string; definition: string }>
  decisionTree: string[]
  confidenceBreakdown: Record<string, number>
  riskFactors: Array<{ label: string; severity: "low" | "medium" | "high"; detail?: string }>
  math?: ExplainMath
}

export interface Position {
  symbol: string
  shares: number
  entryPrice: number
  currentPrice: number
  pnlUsd: number
  pnlPct: number
  safetyLine: number
  maxPlannedLossUsd: number
  message: string
}

export interface PositionsResponse {
  metadata: ResponseMetadata
  positions: Position[]
  totalValue: number
  cashAvailable: number
  totalPnlUsd: number
  totalPnlPct: number
}

export interface ActionResponse {
  actionId: string
  status: "pending" | "executed" | "failed"
  symbol: string
  shares: number
  estimatedCost: number
  idempotencyKey: string
  result?: Record<string, unknown>
}

export interface BuyRequest {
  symbol: string
  shares: number
  limitPrice?: number
  alertId?: string
}

export interface SellRequest {
  symbol: string
  shares: number
  limitPrice?: number
  alertId?: string
}

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy"
  service: string
  version: string
  uptimeSeconds: number
  dependencies: Record<string, string>
}

export interface SLOStatus {
  availability: Record<string, number>
  latencyP95Ms: Record<string, number>
  errorBudgetPct: number
  totalRequests: number
  failedRequests: number
}

export interface NewsItem {
  id: string
  symbols: string[]
  headline: string
  summary: string
  source: string
  url: string
  publishedAt: string
  sentiment: "positive" | "neutral" | "negative"
  importance: "low" | "medium" | "high"
  eventType: string
}

export interface NewsFeedParams {
  symbols?: string[]
  lookbackHours?: number
  maxItems?: number
  sources?: string[]
  language?: string
}

export type CopyMode = "plain" | "how_we_use_it" | "math"

export interface CopyEntry {
  id: string
  mode: Mode
  variant: CopyMode
  text: string
  lastReviewed?: string
}

export interface RegionGuardrails {
  leverage: boolean
  options: boolean
  shorting: boolean
  liveTrading: boolean
  disclosures: string[]
}

