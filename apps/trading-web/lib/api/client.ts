/**
 * API Client - Base client for all API requests
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws'

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Base API client with authentication
 */
export class APIClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  setToken(token: string | null) {
    this.token = token
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return headers
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers = this.getHeaders()

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new APIError(
        error.message || 'API request failed',
        response.status,
        error
      )
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

/**
 * WebSocket client for real-time data
 */
export class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private messageHandlers: Map<string, Set<(data: any) => void>> = new Map()

  constructor(url: string = WS_BASE_URL) {
    this.url = url
  }

  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = token ? `${this.url}?token=${token}` : this.url

      try {
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('WebSocket closed')
          this.attemptReconnect(token)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private attemptReconnect(token?: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      )

      setTimeout(() => {
        this.connect(token).catch((error) => {
          console.error('Reconnection failed:', error)
        })
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  subscribe(channel: string, handler: (data: any) => void) {
    if (!this.messageHandlers.has(channel)) {
      this.messageHandlers.set(channel, new Set())
    }
    this.messageHandlers.get(channel)!.add(handler)

    // Send subscription message
    this.send({
      type: 'subscribe',
      channel,
    })
  }

  unsubscribe(channel: string, handler: (data: any) => void) {
    const handlers = this.messageHandlers.get(channel)
    if (handlers) {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.messageHandlers.delete(channel)
        // Send unsubscription message
        this.send({
          type: 'unsubscribe',
          channel,
        })
      }
    }
  }

  private handleMessage(message: any) {
    const { channel, data } = message
    const handlers = this.messageHandlers.get(channel)
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

// Singleton instances
export const apiClient = new APIClient()
export const wsClient = new WebSocketClient()
