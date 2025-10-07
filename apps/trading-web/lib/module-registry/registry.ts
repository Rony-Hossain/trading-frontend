/**
 * Module Registry
 * Central registry for managing application modules
 */

import type {
  IModuleRegistry,
  ModuleConfig,
  RouteConfig,
  ExtensionPoint,
} from './types'
import { eventBus } from './event-bus'

class ModuleRegistry implements IModuleRegistry {
  private modules = new Map<string, ModuleConfig>()
  private enabledModules = new Set<string>()

  private buildDisabledModules = new Set(
    (process.env.NEXT_PUBLIC_DISABLED_MODULES || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  )

  /**
   * Register a module
   */
  register(config: ModuleConfig): void {
    // Validate dependencies
    this.validateDependencies(config)

    // Check permissions
    if (!this.hasPermissions(config.permissions)) {
      console.warn(
        `[ModuleRegistry] Insufficient permissions for module ${config.id}`
      )
      return
    }

    // Register module
    this.modules.set(config.id, config)

    // Mark as enabled if passes checks
    if (this.shouldEnable(config)) {
      this.enabledModules.add(config.id)
    }

    // Emit registration event
    eventBus.emit('module:registered', {
      type: 'registered',
      moduleId: config.id,
      timestamp: new Date().toISOString(),
      data: config,
    })

    console.info(
      `[ModuleRegistry] Module ${config.id} v${config.version} registered`
    )
  }

  /**
   * Unregister a module
   */
  unregister(moduleId: string): void {
    const config = this.modules.get(moduleId)
    if (!config) {
      console.warn(`[ModuleRegistry] Module ${moduleId} not found`)
      return
    }

    // Remove from enabled set
    this.enabledModules.delete(moduleId)

    // Remove from registry
    this.modules.delete(moduleId)

    // Emit unregistration event
    eventBus.emit('module:unregistered', {
      type: 'unregistered',
      moduleId,
      timestamp: new Date().toISOString(),
    })

    console.info(`[ModuleRegistry] Module ${moduleId} unregistered`)
  }

  /**
   * Check if module is enabled
   */
  isEnabled(moduleId: string): boolean {
    return this.enabledModules.has(moduleId)
  }

  /**
   * Get module config
   */
  getModule(moduleId: string): ModuleConfig | undefined {
    return this.modules.get(moduleId)
  }

  /**
   * Get all registered modules
   */
  getAllModules(): ModuleConfig[] {
    return Array.from(this.modules.values())
  }

  /**
   * Get enabled modules
   */
  getEnabledModules(): ModuleConfig[] {
    return Array.from(this.enabledModules)
      .map((id) => this.modules.get(id))
      .filter((config): config is ModuleConfig => config !== undefined)
  }

  /**
   * Get all routes from enabled modules
   */
  getRoutes(): RouteConfig[] {
    return this.getEnabledModules().flatMap((module) => module.routes)
  }

  /**
   * Get extensions for a given slot
   */
  getExtensions(slotName: string): ExtensionPoint[] {
    const extensions: ExtensionPoint[] = []

    for (const module of this.getEnabledModules()) {
      if (module.extensionPoints?.[slotName]) {
        extensions.push(...module.extensionPoints[slotName])
      }
    }

    // Sort by priority (higher priority first)
    return extensions.sort((a, b) => b.priority - a.priority)
  }

  /**
   * Validate module dependencies
   */
  private validateDependencies(config: ModuleConfig): void {
    for (const dep of config.dependencies) {
      // Core modules are always available
      if (dep.startsWith('@core/')) {
        continue
      }

      // Check if dependency is registered
      if (!this.modules.has(dep)) {
        throw new Error(
          `[ModuleRegistry] Missing dependency: ${dep} for module ${config.id}`
        )
      }

      // Check if dependency is enabled
      if (!this.enabledModules.has(dep)) {
        console.warn(
          `[ModuleRegistry] Dependency ${dep} is not enabled for module ${config.id}`
        )
      }
    }
  }

  /**
   * Check if user has required permissions
   */
  private hasPermissions(permissions: string[]): boolean {
    // TODO: Implement actual permission check against user context
    // For now, assume all permissions are granted
    return true
  }

  /**
   * Determine if module should be enabled
   */
  private shouldEnable(config: ModuleConfig): boolean {
    // Check feature flags
    for (const flag of config.featureFlags) {
      if (!this.isFeatureEnabled(flag)) {
        console.info(
          `[ModuleRegistry] Feature flag ${flag} is disabled for module ${config.id}`
        )
        return false
      }
    }

    // Check site configuration
    const siteConfig = this.getSiteConfig()
    if (siteConfig) {
      // Explicitly disabled
      if (siteConfig.modules?.disabled?.includes(config.id)) {
        return false
      }

      // Not in enabled list (if allowlist exists)
      if (
        siteConfig.modules?.enabled &&
        !siteConfig.modules.enabled.includes(config.id)
      ) {
        return false
      }
    }

    if (this.buildDisabledModules.has(config.id)) {
      return false
    }

    return true
  }

  /**
   * Check if feature flag is enabled
   */
  private isFeatureEnabled(flag: string): boolean {
    // TODO: Integrate with feature flag service
    // For now, check environment variable
    const envFlag = process.env[`NEXT_PUBLIC_FEATURE_${flag.toUpperCase()}`]
    return envFlag === 'true' || envFlag === '1'
  }

  /**
   * Get site configuration
   */
  private getSiteConfig(): any {
    // TODO: Implement site config loader
    // For now, return from window global if available
    if (typeof window !== 'undefined') {
      return (window as any).__SITE_CONFIG__
    }
    return null
  }
}

// Export singleton instance
export const moduleRegistry = new ModuleRegistry()
