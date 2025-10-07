'use client'

import { useEffect, useSyncExternalStore } from 'react'
import {
  ensureNetworkListeners,
  getNetworkStatusSnapshot,
  subscribeNetworkStatus,
  type NetworkStatusState,
} from '../lib/network/status'

export function useNetworkStatus(): NetworkStatusState {
  useEffect(() => {
    ensureNetworkListeners()
  }, [])

  return useSyncExternalStore(
    subscribeNetworkStatus,
    getNetworkStatusSnapshot,
    getNetworkStatusSnapshot
  )
}
