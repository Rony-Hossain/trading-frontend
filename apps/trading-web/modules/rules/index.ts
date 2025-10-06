/**
 * Rules Module - Public API
 * Phase 5: Rules Engine & Advanced Alerts
 */

// Components
export { RuleBuilder } from '@/components/rules/RuleBuilder'
export { RuleLibrary } from '@/components/rules/RuleLibrary'
export { RulePreview } from '@/components/rules/RulePreview'

// API
export {
  fetchRules,
  createRule,
  updateRule,
  deleteRule,
  previewRule,
  fetchRuleTemplates,
  MOCK_RULES,
  MOCK_RULE_TEMPLATES,
} from '@/lib/api/rules'

// Configuration
export {
  defaultRulesConfig,
  mergeRulesConfig,
  type RulesModuleConfig,
} from './module.config'

// Types (re-export from contracts)
export type {
  Rule,
  RuleGroup,
  RuleCondition,
  RuleAction,
  RuleTemplate,
  RulesResponse,
  CreateRuleRequest,
  UpdateRuleRequest,
  RulePreviewRequest,
  RulePreviewResponse,
  RuleConditionType,
  RuleOperator,
  RuleLogicOperator,
  RuleActionType,
} from '@/lib/types/contracts'
