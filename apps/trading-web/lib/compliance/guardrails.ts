/**
 * Compliance Guardrails
 * Feature gating and compliance rules by region and mode
 * Last updated: 2025-10-03
 */

// =============================================================================
// REGION & JURISDICTION
// =============================================================================

export enum Region {
  US = 'US',
  EU = 'EU',
  UK = 'UK',
  APAC = 'APAC',
  OTHER = 'OTHER',
}

export enum Jurisdiction {
  SEC = 'SEC', // US Securities and Exchange Commission
  FCA = 'FCA', // UK Financial Conduct Authority
  ESMA = 'ESMA', // EU Securities and Markets Authority
  MAS = 'MAS', // Singapore Monetary Authority
  NONE = 'NONE',
}

// =============================================================================
// COMPLIANCE RULES
// =============================================================================

export interface ComplianceRules {
  // Trading Features
  options_trading: boolean
  margin_trading: boolean
  short_selling: boolean
  crypto_trading: boolean
  forex_trading: boolean

  // Leverage Limits
  max_leverage_ratio: number // 1.0 = no leverage

  // Risk Controls
  require_stop_loss: boolean
  require_daily_loss_cap: boolean
  max_daily_loss_pct: number
  max_position_size_pct: number // % of portfolio

  // Disclosures & Warnings
  show_risk_disclaimer: boolean
  require_appropriateness_test: boolean
  show_cfd_warning: boolean // Contract for Difference warning

  // Data & Privacy
  data_residency_required: boolean
  gdpr_compliance: boolean

  // Paper Trading
  force_paper_trading: boolean
  allow_paper_to_live_switch: boolean
}

// =============================================================================
// MODE-SPECIFIC RULES
// =============================================================================

export interface ModeGuardrails {
  beginner: ComplianceRules
  expert: ComplianceRules
}

// =============================================================================
// REGION-SPECIFIC GUARDRAILS
// =============================================================================

const US_GUARDRAILS: ModeGuardrails = {
  beginner: {
    options_trading: false,
    margin_trading: false,
    short_selling: false,
    crypto_trading: false,
    forex_trading: false,
    max_leverage_ratio: 1.0,
    require_stop_loss: true,
    require_daily_loss_cap: true,
    max_daily_loss_pct: 2.0,
    max_position_size_pct: 10.0,
    show_risk_disclaimer: true,
    require_appropriateness_test: false,
    show_cfd_warning: false,
    data_residency_required: false,
    gdpr_compliance: false,
    force_paper_trading: true, // Beginners start in paper mode
    allow_paper_to_live_switch: true,
  },
  expert: {
    options_trading: true,
    margin_trading: true,
    short_selling: true,
    crypto_trading: false,
    forex_trading: false,
    max_leverage_ratio: 4.0, // Reg T limit
    require_stop_loss: false,
    require_daily_loss_cap: false,
    max_daily_loss_pct: 10.0,
    max_position_size_pct: 25.0,
    show_risk_disclaimer: true,
    require_appropriateness_test: true,
    show_cfd_warning: false,
    data_residency_required: false,
    gdpr_compliance: false,
    force_paper_trading: false,
    allow_paper_to_live_switch: true,
  },
}

const EU_GUARDRAILS: ModeGuardrails = {
  beginner: {
    options_trading: false,
    margin_trading: false,
    short_selling: false,
    crypto_trading: false,
    forex_trading: false,
    max_leverage_ratio: 1.0,
    require_stop_loss: true,
    require_daily_loss_cap: true,
    max_daily_loss_pct: 2.0,
    max_position_size_pct: 10.0,
    show_risk_disclaimer: true,
    require_appropriateness_test: true, // ESMA requirement
    show_cfd_warning: true, // EU CFD retail trading warning
    data_residency_required: true, // GDPR
    gdpr_compliance: true,
    force_paper_trading: true,
    allow_paper_to_live_switch: true,
  },
  expert: {
    options_trading: true,
    margin_trading: true,
    short_selling: true,
    crypto_trading: true, // MiCA framework
    forex_trading: true,
    max_leverage_ratio: 30.0, // ESMA retail limit for major forex pairs
    require_stop_loss: false,
    require_daily_loss_cap: false,
    max_daily_loss_pct: 10.0,
    max_position_size_pct: 25.0,
    show_risk_disclaimer: true,
    require_appropriateness_test: true,
    show_cfd_warning: true,
    data_residency_required: true,
    gdpr_compliance: true,
    force_paper_trading: false,
    allow_paper_to_live_switch: true,
  },
}

const UK_GUARDRAILS: ModeGuardrails = {
  beginner: {
    options_trading: false,
    margin_trading: false,
    short_selling: false,
    crypto_trading: false,
    forex_trading: false,
    max_leverage_ratio: 1.0,
    require_stop_loss: true,
    require_daily_loss_cap: true,
    max_daily_loss_pct: 2.0,
    max_position_size_pct: 10.0,
    show_risk_disclaimer: true,
    require_appropriateness_test: true, // FCA requirement
    show_cfd_warning: true,
    data_residency_required: false, // UK GDPR similar to EU
    gdpr_compliance: true,
    force_paper_trading: true,
    allow_paper_to_live_switch: true,
  },
  expert: {
    options_trading: true,
    margin_trading: true,
    short_selling: true,
    crypto_trading: false, // FCA restrictions on crypto derivatives
    forex_trading: true,
    max_leverage_ratio: 30.0, // FCA retail limit
    require_stop_loss: false,
    require_daily_loss_cap: false,
    max_daily_loss_pct: 10.0,
    max_position_size_pct: 25.0,
    show_risk_disclaimer: true,
    require_appropriateness_test: true,
    show_cfd_warning: true,
    data_residency_required: false,
    gdpr_compliance: true,
    force_paper_trading: false,
    allow_paper_to_live_switch: true,
  },
}

const APAC_GUARDRAILS: ModeGuardrails = {
  beginner: {
    options_trading: false,
    margin_trading: false,
    short_selling: false,
    crypto_trading: false,
    forex_trading: false,
    max_leverage_ratio: 1.0,
    require_stop_loss: true,
    require_daily_loss_cap: true,
    max_daily_loss_pct: 2.0,
    max_position_size_pct: 10.0,
    show_risk_disclaimer: true,
    require_appropriateness_test: false,
    show_cfd_warning: false,
    data_residency_required: false,
    gdpr_compliance: false,
    force_paper_trading: true,
    allow_paper_to_live_switch: true,
  },
  expert: {
    options_trading: true,
    margin_trading: true,
    short_selling: true,
    crypto_trading: true,
    forex_trading: true,
    max_leverage_ratio: 20.0, // Varies by jurisdiction
    require_stop_loss: false,
    require_daily_loss_cap: false,
    max_daily_loss_pct: 10.0,
    max_position_size_pct: 25.0,
    show_risk_disclaimer: true,
    require_appropriateness_test: false,
    show_cfd_warning: false,
    data_residency_required: false,
    gdpr_compliance: false,
    force_paper_trading: false,
    allow_paper_to_live_switch: true,
  },
}

const DEFAULT_GUARDRAILS: ModeGuardrails = {
  beginner: {
    options_trading: false,
    margin_trading: false,
    short_selling: false,
    crypto_trading: false,
    forex_trading: false,
    max_leverage_ratio: 1.0,
    require_stop_loss: true,
    require_daily_loss_cap: true,
    max_daily_loss_pct: 2.0,
    max_position_size_pct: 10.0,
    show_risk_disclaimer: true,
    require_appropriateness_test: false,
    show_cfd_warning: false,
    data_residency_required: false,
    gdpr_compliance: false,
    force_paper_trading: true,
    allow_paper_to_live_switch: false, // Most conservative
  },
  expert: {
    options_trading: false, // Conservative default
    margin_trading: false,
    short_selling: false,
    crypto_trading: false,
    forex_trading: false,
    max_leverage_ratio: 1.0,
    require_stop_loss: true,
    require_daily_loss_cap: true,
    max_daily_loss_pct: 5.0,
    max_position_size_pct: 20.0,
    show_risk_disclaimer: true,
    require_appropriateness_test: true,
    show_cfd_warning: false,
    data_residency_required: false,
    gdpr_compliance: false,
    force_paper_trading: false,
    allow_paper_to_live_switch: true,
  },
}

// =============================================================================
// GUARDRAIL REGISTRY
// =============================================================================

export const GUARDRAILS_BY_REGION: Record<Region, ModeGuardrails> = {
  [Region.US]: US_GUARDRAILS,
  [Region.EU]: EU_GUARDRAILS,
  [Region.UK]: UK_GUARDRAILS,
  [Region.APAC]: APAC_GUARDRAILS,
  [Region.OTHER]: DEFAULT_GUARDRAILS,
}

// =============================================================================
// GUARDRAIL SERVICE
// =============================================================================

/**
 * Get compliance rules for region and mode
 */
export function getGuardrails(
  region: Region,
  mode: 'beginner' | 'expert'
): ComplianceRules {
  return GUARDRAILS_BY_REGION[region][mode]
}

/**
 * Check if feature is allowed
 */
export function isFeatureAllowed(
  feature: keyof ComplianceRules,
  region: Region,
  mode: 'beginner' | 'expert'
): boolean {
  const rules = getGuardrails(region, mode)
  const value = rules[feature]
  return typeof value === 'boolean' ? value : true
}

/**
 * Get feature visibility (for UI rendering)
 */
export function getFeatureVisibility(region: Region, mode: 'beginner' | 'expert') {
  const rules = getGuardrails(region, mode)

  return {
    showOptions: rules.options_trading,
    showMargin: rules.margin_trading,
    showShortSelling: rules.short_selling,
    showCrypto: rules.crypto_trading,
    showForex: rules.forex_trading,
    showLeverageControls: rules.max_leverage_ratio > 1.0,
    showStopLossRequired: rules.require_stop_loss,
    showDailyCapRequired: rules.require_daily_loss_cap,
  }
}

/**
 * Get required disclaimers for region
 */
export function getRequiredDisclaimers(region: Region, mode: 'beginner' | 'expert'): string[] {
  const rules = getGuardrails(region, mode)
  const disclaimers: string[] = []

  if (rules.show_risk_disclaimer) {
    disclaimers.push('risk_disclaimer')
  }

  if (rules.show_cfd_warning) {
    disclaimers.push('cfd_warning')
  }

  if (rules.force_paper_trading) {
    disclaimers.push('paper_trading_only')
  }

  if (rules.gdpr_compliance) {
    disclaimers.push('gdpr_notice')
  }

  return disclaimers
}

/**
 * Validate trade parameters against compliance rules
 */
export function validateTradeCompliance(
  params: {
    position_size_pct: number
    has_stop_loss: boolean
    daily_loss_pct: number
    leverage_ratio: number
    trade_type: 'stock' | 'option' | 'crypto' | 'forex'
  },
  region: Region,
  mode: 'beginner' | 'expert'
): { valid: boolean; violations: string[] } {
  const rules = getGuardrails(region, mode)
  const violations: string[] = []

  // Position size check
  if (params.position_size_pct > rules.max_position_size_pct) {
    violations.push(`Position size exceeds ${rules.max_position_size_pct}% limit`)
  }

  // Stop loss check
  if (rules.require_stop_loss && !params.has_stop_loss) {
    violations.push('Stop loss is required')
  }

  // Daily loss check
  if (rules.require_daily_loss_cap && params.daily_loss_pct > rules.max_daily_loss_pct) {
    violations.push(`Daily loss exceeds ${rules.max_daily_loss_pct}% cap`)
  }

  // Leverage check
  if (params.leverage_ratio > rules.max_leverage_ratio) {
    violations.push(`Leverage exceeds ${rules.max_leverage_ratio}x limit`)
  }

  // Trade type checks
  if (params.trade_type === 'option' && !rules.options_trading) {
    violations.push('Options trading not allowed')
  }

  if (params.trade_type === 'crypto' && !rules.crypto_trading) {
    violations.push('Crypto trading not allowed')
  }

  if (params.trade_type === 'forex' && !rules.forex_trading) {
    violations.push('Forex trading not allowed')
  }

  return {
    valid: violations.length === 0,
    violations,
  }
}
