'use client'

import { useEffect } from 'react'
import { useUserStore } from '../lib/stores/userStore'

const SESSION_KEY = 'device-sync:last-check'
const CURRENT_SCHEMA_VERSION = '2025.10.05'

export function useDeviceSyncAudit() {
  const preferences = useUserStore((state) => state.preferences)
  const updatePreferences = useUserStore((state) => state.updatePreferences)

  useEffect(() => {
    if (preferences.deviceSyncVersion !== CURRENT_SCHEMA_VERSION) {
      updatePreferences({ deviceSyncVersion: CURRENT_SCHEMA_VERSION })
    }

    if (typeof window !== 'undefined') {
      const timestamp = new Date().toISOString()
      window.sessionStorage.setItem(SESSION_KEY, timestamp)
    }
  }, [preferences.deviceSyncVersion, updatePreferences])
}
