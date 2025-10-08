"use client"

import { useState, useEffect, useRef } from 'react'

interface OptionsUpdate {
  type: 'options_chain' | 'options_update'
  symbol: string
  underlying_price: number
  timestamp: string
  calls?: number
  puts?: number
  expiries?: string[]
  iv_rank?: number
  atm_call_iv?: number
  atm_put_iv?: number
  volume_ratio?: number
  total_volume?: number
}

interface UseOptionsWebSocketReturn {
  data: OptionsUpdate | null
  connected: boolean
  error: string | null
  reconnect: () => void
}

export function useOptionsWebSocket(symbol: string): UseOptionsWebSocketReturn {
  const [data, setData] = useState<OptionsUpdate | null>(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const maxReconnectAttempts = 5
  const pingIntervalMs = 15_000

  const clearPing = () => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current)
      pingIntervalRef.current = null
    }
  }

  const clearReconnectTimeout = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }

  const resolveBaseUrl = () => {
    const explicit = process.env.NEXT_PUBLIC_OPTIONS_WS_URL
    if (explicit) return explicit

    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = process.env.NEXT_PUBLIC_OPTIONS_WS_HOST ?? window.location.hostname
      const port = process.env.NEXT_PUBLIC_OPTIONS_WS_PORT ?? '8002'
      const path = (process.env.NEXT_PUBLIC_OPTIONS_WS_PATH ?? '/ws/options').replace(/\/+$/, '')
      const portSegment = port ? `:${port}` : ''
      return `${protocol}//${host}${portSegment}${path}`
    }

    return 'ws://localhost:8002/ws/options'
  }

  const buildWebSocketUrl = (targetSymbol: string): string => {
    const base = resolveBaseUrl()

    if (base.includes('{symbol}') || base.includes('%s')) {
      return base.replace('{symbol}', encodeURIComponent(targetSymbol)).replace('%s', encodeURIComponent(targetSymbol))
    }

    try {
      const url = new URL(base)
      url.searchParams.set('symbol', targetSymbol)
      const finalUrl = url.toString()
      if (finalUrl.includes('://localhost:3002')) {
        throw new Error('Options WebSocket URL points to localhost:3002')
      }
      return finalUrl
    } catch (error) {
      const fallback = `${base.replace(/\/+$/, '')}/${encodeURIComponent(targetSymbol)}`
      if (fallback.includes('://localhost:3002')) {
        throw new Error('Options WebSocket URL points to localhost:3002')
      }
      return fallback
    }
  }

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      const url = buildWebSocketUrl(symbol)
      if (url.includes('://localhost:3002')) {
        throw new Error('Options WebSocket URL points to localhost:3002')
      }
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        console.log(`Connected to options WebSocket for ${symbol}`)
        setConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
        clearPing()
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send('ping')
          }
        }, pingIntervalMs)
      }

      ws.onmessage = (event) => {
        try {
          const update: OptionsUpdate = JSON.parse(event.data)
          setData(update)
        } catch (err) {
          console.error('Error parsing options WebSocket message:', err)
          setError('Error parsing message')
        }
      }

      ws.onclose = (event) => {
        console.log(`Options WebSocket connection closed for ${symbol}:`, event.code, event.reason)
        setConnected(false)
        clearPing()

        // Attempt to reconnect if not intentionally closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000)
          console.log(`Attempting to reconnect in ${delay}ms...`)

          clearReconnectTimeout()
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++
            connect()
          }, delay)
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError('Maximum reconnection attempts reached')
        }
      }

      ws.onerror = (event) => {
        console.error('Options WebSocket error:', event)
        setError('Connection error')
      }

    } catch (err) {
      console.error('Error creating options WebSocket connection:', err)
      const message =
        err instanceof Error && err.message.includes('localhost:3002')
          ? 'Bad WebSocket URL (points to localhost:3002)'
          : 'Failed to create connection'
      setError(message)
      setConnected(false)
    }
  }

  const disconnect = () => {
    clearReconnectTimeout()
    clearPing()
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Component unmounting')
      wsRef.current = null
    }
    
    setConnected(false)
    setData(null)
  }

  const reconnect = () => {
    disconnect()
    reconnectAttemptsRef.current = 0
    setError(null)
    connect()
  }

  useEffect(() => {
    if (symbol) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [symbol])

  return {
    data,
    connected,
    error,
    reconnect
  }
}
