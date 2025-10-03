/**
 * @modules/today - Module Entry Point
 * Exports all public APIs for the Today module
 */

// Configuration
export { todayModuleConfig, todayModuleDependencies } from './module.config'

// Components
export { default as TodayPage } from '@/app/today/page'
export { PlanList } from '@/components/today/PlanList'
export { PlanCard } from '@/components/today/PlanCard'
export { PlanConfidencePill } from '@/components/today/PlanConfidencePill'
export { PlanBadges } from '@/components/today/PlanBadges'
export { PlanReason } from '@/components/today/PlanReason'
export { PlanSafety } from '@/components/today/PlanSafety'
export { PlanBudget } from '@/components/today/PlanBudget'
export { PlanAction } from '@/components/today/PlanAction'
export { ExplainChip } from '@/components/today/ExplainChip'
export { ExplainPopover } from '@/components/today/ExplainPopover'

// Hooks
export { usePlanQuery } from '@/lib/hooks/usePlanQuery'
export { useExplainEntry } from '@/lib/hooks/useExplainEntry'

// Types
export type {
  Pick,
  PlanResponse,
  ActionType,
  ConfidenceLevel,
} from '@/lib/types/contracts'
