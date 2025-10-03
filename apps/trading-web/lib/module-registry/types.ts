/**
 * Module Registry Types
 * Type definitions for the module system
 */

import { ComponentType, LazyExoticComponent } from 'react'

// =============================================================================
// MODULE CONFIGURATION
// =============================================================================

export type UserMode = 'beginner' | 'expert' | 'both'

export interface RouteConfig {
  path: string
  component: () => Promise<{ default: ComponentType<any> }>
  guard?: 'authenticated' | 'guest' | 'admin'
  exact?: boolean
  meta?: {
    title?: string
    description?: string
  }
}

export interface ExtensionPoint {
  component: () => Promise<{ default: ComponentType<any> }>
  priority: number
  condition?: (context: any) => boolean
}

export interface ModuleConfig {
  id: string
  name: string
  version: string
  mode: UserMode

  // Routing
  routes: RouteConfig[]

  // Permissions
  permissions: string[]

  // Dependencies (other module IDs)
  dependencies: string[]

  // Telemetry namespace
  telemetryNamespace: string

  // Feature flags
  featureFlags: string[]

  // Site configuration keys this module reads
  siteConfigKeys?: string[]

  // Extension points this module provides
  extensionPoints?: Record<string, ExtensionPoint[]>
}

// =============================================================================
// MODULE MANIFEST
// =============================================================================

export interface ModuleManifest {
  modules: ModuleConfig[]
  version: string
  updated_at: string
}

// =============================================================================
// EXTENSION SLOT
// =============================================================================

export interface ExtensionSlotProps {
  name: string
  context?: any
  fallback?: React.ReactNode
}

// =============================================================================
// FEATURE GATE
// =============================================================================

export interface FeatureGateProps {
  feature: string | string[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

// =============================================================================
// SERVICE CONTAINER
// =============================================================================

export interface ServiceDefinition<T = any> {
  factory: () => T
  instance: T | null
  singleton: boolean
}

export interface IServiceContainer {
  register<T>(key: string, factory: () => T, singleton?: boolean): void
  get<T>(key: string): T
  has(key: string): boolean
  remove(key: string): void
  clear(): void
}

// =============================================================================
// MODULE REGISTRY INTERFACE
// =============================================================================

export interface IModuleRegistry {
  register(config: ModuleConfig): void
  unregister(moduleId: string): void
  isEnabled(moduleId: string): boolean
  getModule(moduleId: string): ModuleConfig | undefined
  getAllModules(): ModuleConfig[]
  getEnabledModules(): ModuleConfig[]
  getRoutes(): RouteConfig[]
  getExtensions(slotName: string): ExtensionPoint[]
}

// =============================================================================
// EVENT BUS
// =============================================================================

export type EventHandler<T = any> = (event: T) => void

export interface IEventBus {
  on<T = any>(event: string, handler: EventHandler<T>): () => void
  emit<T = any>(event: string, data: T): void
  off<T = any>(event: string, handler: EventHandler<T>): void
  clear(): void
}

// =============================================================================
// MODULE EVENTS
// =============================================================================

export interface ModuleEvent {
  type: 'registered' | 'unregistered' | 'loaded' | 'error'
  moduleId: string
  timestamp: string
  data?: any
}

export interface TradeExecutedEvent {
  symbol: string
  action: 'BUY' | 'SELL'
  shares: number
  price: number
  timestamp: string
}

export interface SettingsChangedEvent {
  key: string
  oldValue: any
  newValue: any
  timestamp: string
}

export interface PlanRefreshedEvent {
  picksCount: number
  timestamp: string
}
