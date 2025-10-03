/**
 * useAlertsUiStore - Zustand store for alerts UI state
 * Handles cooldown, dedupe, and drawer state
 */

import { create } from 'zustand'
import type { Alert } from '@/lib/types/contracts'

interface AlertCooldown {
  dedupeKey: string
  expiresAt: number
}

interface AlertsUiState {
  // Drawer state
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void

  // Cooldown tracking
  cooldowns: Map<string, AlertCooldown>
  addCooldown: (dedupeKey: string, cooldownSec: number) => void
  isCoolingDown: (dedupeKey: string) => boolean
  clearExpiredCooldowns: () => void

  // Deduplication
  seenAlertIds: Set<string>
  isDuplicate: (alertId: string) => boolean
  markAsSeen: (alertId: string) => void
  clearSeenAlerts: () => void

  // Alert feedback tracking
  feedback: Map<string, 'helpful' | 'not_helpful'>
  setFeedback: (alertId: string, helpful: boolean) => void
  getNotHelpfulCount: () => number

  // Last notification time
  lastNotificationTime: number
  updateLastNotificationTime: () => void
  canNotify: (minIntervalMs: number) => boolean
}

export const useAlertsUiStore = create<AlertsUiState>((set, get) => ({
  // Drawer state
  drawerOpen: false,
  setDrawerOpen: (open) => set({ drawerOpen: open }),

  // Cooldown tracking
  cooldowns: new Map(),
  addCooldown: (dedupeKey, cooldownSec) => {
    const cooldowns = new Map(get().cooldowns)
    cooldowns.set(dedupeKey, {
      dedupeKey,
      expiresAt: Date.now() + cooldownSec * 1000,
    })
    set({ cooldowns })
  },
  isCoolingDown: (dedupeKey) => {
    const cooldown = get().cooldowns.get(dedupeKey)
    if (!cooldown) return false
    return cooldown.expiresAt > Date.now()
  },
  clearExpiredCooldowns: () => {
    const cooldowns = new Map(get().cooldowns)
    const now = Date.now()
    for (const [key, value] of cooldowns.entries()) {
      if (value.expiresAt <= now) {
        cooldowns.delete(key)
      }
    }
    set({ cooldowns })
  },

  // Deduplication
  seenAlertIds: new Set(),
  isDuplicate: (alertId) => get().seenAlertIds.has(alertId),
  markAsSeen: (alertId) => {
    const seenAlertIds = new Set(get().seenAlertIds)
    seenAlertIds.add(alertId)
    set({ seenAlertIds })
  },
  clearSeenAlerts: () => set({ seenAlertIds: new Set() }),

  // Alert feedback tracking
  feedback: new Map(),
  setFeedback: (alertId, helpful) => {
    const feedback = new Map(get().feedback)
    feedback.set(alertId, helpful ? 'helpful' : 'not_helpful')
    set({ feedback })
  },
  getNotHelpfulCount: () => {
    const feedback = get().feedback
    let count = 0
    for (const value of feedback.values()) {
      if (value === 'not_helpful') count++
    }
    return count
  },

  // Last notification time
  lastNotificationTime: 0,
  updateLastNotificationTime: () => set({ lastNotificationTime: Date.now() }),
  canNotify: (minIntervalMs) => {
    const lastTime = get().lastNotificationTime
    return Date.now() - lastTime >= minIntervalMs
  },
}))

/**
 * Helper hook to filter alerts with cooldown and dedupe
 */
export function useFilteredAlerts(alerts: Alert[]): Alert[] {
  const store = useAlertsUiStore()

  // Clear expired cooldowns periodically
  store.clearExpiredCooldowns()

  return alerts.filter((alert) => {
    // Skip if already seen (dedupe)
    if (store.isDuplicate(alert.id)) {
      return false
    }

    // Skip if in cooldown
    if (store.isCoolingDown(alert.throttle.dedupe_key)) {
      return false
    }

    // Skip if suppressed by backend
    if (alert.throttle.suppressed) {
      return false
    }

    // Skip if expired
    if (new Date(alert.expires_at) <= new Date()) {
      return false
    }

    return true
  })
}
