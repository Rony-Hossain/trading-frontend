/**
 * Backend Defaults API
 * Fetches server-enforced beginner mode defaults
 */

export interface BeginnerDefaults {
  stop_loss_required: boolean
  daily_loss_cap_enabled: boolean
  daily_loss_cap_pct: number
  paper_trading_enabled: boolean
  max_position_size_pct: number
  max_daily_trades: number
  allowed_order_types: string[]
  region_compliance_mode: string
}

export interface DefaultsResponse {
  mode: 'beginner' | 'expert'
  defaults: BeginnerDefaults
  overrides_allowed: boolean
  enforcement_level: 'strict' | 'advisory'
}

/**
 * Fetch server-enforced defaults for the user
 */
export async function fetchBeginnerDefaults(): Promise<DefaultsResponse> {
  // TODO: Replace with actual API endpoint
  // For now, return mock data matching backend enforcement

  const response = await fetch('/api/user/defaults', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch beginner defaults')
  }

  return response.json()
}

/**
 * Mock data for development (matches backend enforcement rules)
 */
export const MOCK_BEGINNER_DEFAULTS: DefaultsResponse = {
  mode: 'beginner',
  defaults: {
    stop_loss_required: true,
    daily_loss_cap_enabled: true,
    daily_loss_cap_pct: 2.0,
    paper_trading_enabled: true,
    max_position_size_pct: 5.0,
    max_daily_trades: 3,
    allowed_order_types: ['market', 'limit'],
    region_compliance_mode: 'US',
  },
  overrides_allowed: false,
  enforcement_level: 'strict',
}
