/**
 * Alerts API Client
 * Fetches alerts and manages alert preferences
 */

import type { AlertsResponse, AlertArmRequest } from '@/lib/types/contracts'

/**
 * Fetch current alerts
 */
export async function fetchAlerts(): Promise<AlertsResponse> {
  const response = await fetch('/api/alerts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch alerts')
  }

  return response.json()
}

/**
 * Update alert preferences (arm/disarm, quiet hours)
 */
export async function updateAlertPreferences(request: AlertArmRequest): Promise<void> {
  const response = await fetch('/api/alerts/preferences', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to update alert preferences')
  }
}

/**
 * Take action on an alert (buy_now, sell_now, snooze)
 */
export async function takeAlertAction(alertId: string, action: string): Promise<void> {
  const response = await fetch(`/api/alerts/${alertId}/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action }),
  })

  if (!response.ok) {
    throw new Error('Failed to take alert action')
  }
}

/**
 * Mock data for development
 */
export const MOCK_ALERTS_RESPONSE: AlertsResponse = {
  metadata: {
    generated_at: new Date().toISOString(),
    version: '1.0.0',
    request_id: 'mock-request-id',
  },
  alerts: [
    {
      id: 'alert-001',
      type: 'opportunity',
      symbol: 'AAPL',
      message: 'Strong buy signal detected. Price approaching support level.',
      actions: ['buy_now', 'snooze'],
      safety: {
        max_loss_usd: 50.0,
        estimated_slippage_bps: 5,
        execution_confidence: 0.85,
      },
      throttle: {
        cooldown_sec: 900,
        dedupe_key: 'AAPL-buy-support',
        suppressed: false,
      },
      paper_trade_only: true,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: 'alert-002',
      type: 'protect',
      symbol: 'TSLA',
      message: 'Your safety line was hit. Consider selling to protect your gains.',
      actions: ['sell_now', 'snooze'],
      safety: {
        max_loss_usd: 100.0,
        estimated_slippage_bps: 10,
        execution_confidence: 0.9,
      },
      throttle: {
        cooldown_sec: 900,
        dedupe_key: 'TSLA-safety-line',
        suppressed: false,
      },
      paper_trade_only: true,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
  ],
  armed: true,
  quiet_hours: ['22:00-07:00'],
}
