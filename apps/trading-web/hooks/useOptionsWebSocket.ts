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
  const maxReconnectAttempts = 5

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      const base = process.env.NEXT_PUBLIC_MARKET_DATA_API || 'http://localhost:8002'
      const wsBase = base.startsWith('https') ? base.replace('https', 'wss') : base.replace('http', 'ws')
      const url = `${wsBase}/ws/options/${encodeURIComponent(symbol)}`
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        console.log(`Connected to options WebSocket for ${symbol}`)
        setConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
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
        
        // Attempt to reconnect if not intentionally closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000)
          console.log(`Attempting to reconnect in ${delay}ms...`)
          
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
      setError('Failed to create connection')
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
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
