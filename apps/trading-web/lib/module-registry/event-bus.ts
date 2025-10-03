/**
 * Event Bus
 * Simple event bus for inter-module communication
 */

import type { IEventBus, EventHandler } from './types'

class EventBus implements IEventBus {
  private handlers = new Map<string, Set<EventHandler>>()

  /**
   * Subscribe to an event
   * Returns unsubscribe function
   */
  on<T = any>(event: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }

    this.handlers.get(event)!.add(handler)

    // Return unsubscribe function
    return () => this.off(event, handler)
  }

  /**
   * Emit an event
   */
  emit<T = any>(event: string, data: T): void {
    const handlers = this.handlers.get(event)

    if (!handlers || handlers.size === 0) {
      return
    }

    // Call all handlers
    handlers.forEach((handler) => {
      try {
        handler(data)
      } catch (error) {
        console.error(`[EventBus] Error in handler for event "${event}":`, error)
      }
    })
  }

  /**
   * Unsubscribe from an event
   */
  off<T = any>(event: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(event)

    if (handlers) {
      handlers.delete(handler)

      // Clean up empty handler sets
      if (handlers.size === 0) {
        this.handlers.delete(event)
      }
    }
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.handlers.clear()
  }

  /**
   * Get event names
   */
  getEvents(): string[] {
    return Array.from(this.handlers.keys())
  }

  /**
   * Get handler count for event
   */
  getHandlerCount(event: string): number {
    return this.handlers.get(event)?.size || 0
  }
}

// Export singleton instance
export const eventBus = new EventBus()
