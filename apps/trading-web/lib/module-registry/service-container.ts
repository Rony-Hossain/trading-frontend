/**
 * Service Container
 * Dependency injection container for services
 */

import type { IServiceContainer, ServiceDefinition } from './types'

class ServiceContainer implements IServiceContainer {
  private services = new Map<string, ServiceDefinition>()

  /**
   * Register a service
   */
  register<T>(key: string, factory: () => T, singleton: boolean = true): void {
    if (this.services.has(key)) {
      console.warn(`[ServiceContainer] Service "${key}" is already registered`)
      return
    }

    this.services.set(key, {
      factory,
      instance: null,
      singleton,
    })

    console.debug(`[ServiceContainer] Service "${key}" registered`)
  }

  /**
   * Get a service instance
   */
  get<T>(key: string): T {
    const service = this.services.get(key)

    if (!service) {
      throw new Error(`[ServiceContainer] Service "${key}" not found`)
    }

    // Return existing instance for singletons
    if (service.singleton && service.instance !== null) {
      return service.instance as T
    }

    // Create new instance
    try {
      const instance = service.factory() as T

      // Store singleton instance
      if (service.singleton) {
        service.instance = instance
      }

      return instance
    } catch (error) {
      throw new Error(
        `[ServiceContainer] Error creating service "${key}": ${error}`
      )
    }
  }

  /**
   * Check if service exists
   */
  has(key: string): boolean {
    return this.services.has(key)
  }

  /**
   * Remove a service
   */
  remove(key: string): void {
    const service = this.services.get(key)

    if (service?.instance && typeof (service.instance as any).dispose === 'function') {
      // Call dispose if available
      ;(service.instance as any).dispose()
    }

    this.services.delete(key)
    console.debug(`[ServiceContainer] Service "${key}" removed`)
  }

  /**
   * Clear all services
   */
  clear(): void {
    // Dispose all services that have dispose method
    for (const [key, service] of this.services) {
      if (service.instance && typeof (service.instance as any).dispose === 'function') {
        try {
          ;(service.instance as any).dispose()
        } catch (error) {
          console.error(`[ServiceContainer] Error disposing service "${key}":`, error)
        }
      }
    }

    this.services.clear()
    console.debug('[ServiceContainer] All services cleared')
  }

  /**
   * Get all registered service keys
   */
  getKeys(): string[] {
    return Array.from(this.services.keys())
  }

  /**
   * Get service count
   */
  getCount(): number {
    return this.services.size
  }
}

// Export singleton instance
export const container = new ServiceContainer()

/**
 * React hook for using services
 */
export function useService<T>(key: string): T {
  return container.get<T>(key)
}
