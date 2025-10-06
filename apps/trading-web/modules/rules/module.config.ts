/**
 * Rules Module Configuration
 * Phase 5: Rules Engine & Advanced Alerts
 */

export interface RulesModuleConfig {
  enabled: boolean
  maxRulesPerUser: number
  maxConditionsPerRule: number
  maxNestedGroups: number
  backtestLookbackDays: number
  allowedConditionTypes: string[]
  allowedActionTypes: string[]
  requireApprovalForAutoTrade: boolean
}

export const defaultRulesConfig: RulesModuleConfig = {
  enabled: true,
  maxRulesPerUser: 50,
  maxConditionsPerRule: 20,
  maxNestedGroups: 3,
  backtestLookbackDays: 30,
  allowedConditionTypes: ['indicator', 'price', 'volume', 'news', 'options', 'time'],
  allowedActionTypes: ['alert', 'notify', 'buy', 'sell'],
  requireApprovalForAutoTrade: true, // Always require approval for auto-buy/sell in production
}

export function mergeRulesConfig(
  overrides: Partial<RulesModuleConfig>
): RulesModuleConfig {
  return {
    ...defaultRulesConfig,
    ...overrides,
  }
}
