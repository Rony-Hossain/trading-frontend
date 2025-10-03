/**
 * useAlertStream Hook
 * WebSocket hook for real-time alert streaming
 */

import { useEffect, useState, useRef } from 'react'
import type { Alert } from '@/lib/types/contracts'

export interface AlertStreamOptions {
  enabled?: boolean
  onAlert?: (alert: Alert) => void
  onError?: (error: Error) => void
}

export function useAlertStream(options: AlertStreamOptions = {}) {
  const { enabled = true, onAlert, onError } = options
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    // Get WebSocket URL from config
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'
    const wsEndpoint = `${wsUrl}/ws/alerts`

    console.log('[AlertStream] Connecting to:', wsEndpoint)

    try {
      const ws = new WebSocket(wsEndpoint)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('[AlertStream] Connected')
        setConnected(true)
      }

      ws.onmessage = (event) => {
        try {
          const alert: Alert = JSON.parse(event.data)
          console.log('[AlertStream] Received alert:', alert)

          setAlerts((prev) => [alert, ...prev])

          if (onAlert) {
            onAlert(alert)
          }
        } catch (err) {
          console.error('[AlertStream] Failed to parse alert:', err)
        }
      }

      ws.onerror = (event) => {
        console.error('[AlertStream] Error:', event)
        const error = new Error('WebSocket error')
        if (onError) {
          onError(error)
        }
      }

      ws.onclose = () => {
        console.log('[AlertStream] Disconnected')
        setConnected(false)
      }

      return () => {
        console.log('[AlertStream] Cleaning up')
        ws.close()
      }
    } catch (err) {
      console.error('[AlertStream] Failed to connect:', err)
      if (onError && err instanceof Error) {
        onError(err)
      }
    }
  }, [enabled, onAlert, onError])

  return {
    alerts,
    connected,
    disconnect: () => wsRef.current?.close(),
  }
}
