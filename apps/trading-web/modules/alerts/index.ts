/**
 * @modules/alerts - Module Entry Point
 * Exports all public APIs for the Alerts module
 */

// Configuration
export { alertsModuleConfig, alertsModuleDependencies } from './module.config'

// Components
export { default as AlertsPageV2 } from '@/app/alerts-v2/page'
export { AlertsBell } from '@/components/alerts/AlertsBell'
export { AlertsDrawer } from '@/components/alerts/AlertsDrawer'
export { AlertTriggerItem } from '@/components/alerts/AlertTriggerItem'
export { AlertEmptyState } from '@/components/alerts/AlertEmptyState'
export { QuietHoursToggle } from '@/components/alerts/QuietHoursToggle'
export { MuteAllSwitch } from '@/components/alerts/MuteAllSwitch'
export { AlertRuleRow } from '@/components/alerts/AlertRuleRow'
export { DeliveryChannelPreferences } from '@/components/alerts/DeliveryChannelPreferences'
export { AdaptiveFrequencyToggle } from '@/components/alerts/AdaptiveFrequencyToggle'

// Hooks
export { useAlertsQuery } from '@/lib/hooks/useAlertsQuery'
export { useAlertStream } from '@/lib/hooks/useAlertStream'

// Stores
export { useAlertsUiStore, useFilteredAlerts } from '@/lib/stores/useAlertsUiStore'

// API
export { fetchAlerts, updateAlertPreferences, takeAlertAction } from '@/lib/api/alerts'

// Types
export type {
  Alert,
  AlertType,
  AlertAction,
  AlertsResponse,
  AlertArmRequest,
  AlertThrottle,
  AlertSafety,
} from '@/lib/types/contracts'
