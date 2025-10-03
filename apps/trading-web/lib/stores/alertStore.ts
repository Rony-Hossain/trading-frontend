/**
 * Alert Store - Manages price alerts and notifications
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AlertType = 'price' | 'indicator' | 'pattern' | 'volume' | 'news' | 'portfolio'
export type AlertCondition = 'above' | 'below' | 'crosses_above' | 'crosses_below' | 'equals'
export type AlertStatus = 'active' | 'triggered' | 'disabled'

export interface Alert {
  id: string
  type: AlertType
  symbol: string
  name: string
  condition: AlertCondition
  value: number
  currentValue?: number
  status: AlertStatus
  message: string
  createdAt: number
  triggeredAt?: number
  notifyEmail: boolean
  notifyPush: boolean
  notifySound: boolean
  repeatOnce: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: number
  read: boolean
  alertId?: string
}

interface AlertState {
  // Alerts
  alerts: Alert[]
  notifications: Notification[]

  // Actions - Alerts
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => void
  updateAlert: (id: string, updates: Partial<Alert>) => void
  deleteAlert: (id: string) => void
  toggleAlert: (id: string) => void
  triggerAlert: (id: string, currentValue: number) => void

  // Actions - Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearNotifications: () => void

  // Getters
  getActiveAlerts: () => Alert[]
  getUnreadCount: () => number
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set, get) => ({
      // Initial state
      alerts: [],
      notifications: [],

      // Alert actions
      addAlert: (alertData) => {
        const alert: Alert = {
          ...alertData,
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          status: 'active',
        }
        set((state) => ({
          alerts: [...state.alerts, alert],
        }))
      },

      updateAlert: (id, updates) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, ...updates } : alert
          ),
        }))
      },

      deleteAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id),
        }))
      },

      toggleAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id
              ? {
                  ...alert,
                  status: alert.status === 'active' ? 'disabled' : 'active',
                }
              : alert
          ),
        }))
      },

      triggerAlert: (id, currentValue) => {
        const alert = get().alerts.find((a) => a.id === id)
        if (!alert) return

        // Update alert status
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: 'triggered' as AlertStatus,
                  triggeredAt: Date.now(),
                  currentValue,
                }
              : a
          ),
        }))

        // Create notification
        get().addNotification({
          title: `Alert: ${alert.name}`,
          message: alert.message,
          type: 'warning',
          read: false,
          alertId: id,
        })

        // Play sound if enabled
        if (alert.notifySound) {
          // TODO: Play alert sound
        }

        // If repeat once, disable the alert
        if (alert.repeatOnce) {
          setTimeout(() => {
            get().updateAlert(id, { status: 'disabled' })
          }, 1000)
        }
      },

      // Notification actions
      addNotification: (notifData) => {
        const notification: Notification = {
          ...notifData,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        }
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }))
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({
            ...notif,
            read: true,
          })),
        }))
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((notif) => notif.id !== id),
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      // Getters
      getActiveAlerts: () => {
        return get().alerts.filter((alert) => alert.status === 'active')
      },

      getUnreadCount: () => {
        return get().notifications.filter((notif) => !notif.read).length
      },
    }),
    {
      name: 'alert-storage',
      partialize: (state) => ({
        alerts: state.alerts,
      }),
    }
  )
)
