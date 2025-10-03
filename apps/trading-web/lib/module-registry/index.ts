/**
 * Module Registry
 * Public API exports
 */

// Core
export { moduleRegistry } from './registry'
export { eventBus } from './event-bus'
export { container, useService } from './service-container'

// Components
export { ExtensionSlot } from './components/ExtensionSlot'
export { FeatureGate, useFeatureFlag, useFeatureFlags } from './components/FeatureGate'

// Types
export type {
  ModuleConfig,
  RouteConfig,
  ExtensionPoint,
  ModuleManifest,
  ExtensionSlotProps,
  FeatureGateProps,
  IModuleRegistry,
  IServiceContainer,
  IEventBus,
  ModuleEvent,
  TradeExecutedEvent,
  SettingsChangedEvent,
  PlanRefreshedEvent,
} from './types'
