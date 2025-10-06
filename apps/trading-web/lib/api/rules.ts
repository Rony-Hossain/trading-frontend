/**
 * Rules API Client
 * Manages custom alert rules and templates
 * Phase 5: Rules Engine & Advanced Alerts
 */

import type {
  RulesResponse,
  CreateRuleRequest,
  UpdateRuleRequest,
  RulePreviewRequest,
  RulePreviewResponse,
  Rule,
  RuleTemplate,
} from '@/lib/types/contracts'

/**
 * Fetch all rules for the current user
 */
export async function fetchRules(): Promise<RulesResponse> {
  const response = await fetch('/api/rules', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch rules')
  }

  return response.json()
}

/**
 * Create a new rule
 */
export async function createRule(request: CreateRuleRequest): Promise<Rule> {
  const response = await fetch('/api/rules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to create rule')
  }

  return response.json()
}

/**
 * Update an existing rule
 */
export async function updateRule(ruleId: string, request: UpdateRuleRequest): Promise<Rule> {
  const response = await fetch(`/api/rules/${ruleId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to update rule')
  }

  return response.json()
}

/**
 * Delete a rule
 */
export async function deleteRule(ruleId: string): Promise<void> {
  const response = await fetch(`/api/rules/${ruleId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete rule')
  }
}

/**
 * Preview a rule with backtest
 */
export async function previewRule(request: RulePreviewRequest): Promise<RulePreviewResponse> {
  const response = await fetch('/api/rules/preview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to preview rule')
  }

  return response.json()
}

/**
 * Fetch available rule templates
 */
export async function fetchRuleTemplates(): Promise<RuleTemplate[]> {
  const response = await fetch('/api/rules/templates', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch templates')
  }

  const data = await response.json()
  return data.templates
}

/**
 * Mock rule templates for development
 */
export const MOCK_RULE_TEMPLATES: RuleTemplate[] = [
  {
    id: 'template-001',
    name: 'RSI Oversold Bounce',
    category: 'reversal',
    description: 'Buy when RSI drops below 30 and starts to recover. Classic mean reversion strategy.',
    root_group: {
      id: 'group-1',
      logic: 'AND',
      conditions: [
        {
          id: 'cond-1',
          type: 'indicator',
          field: 'RSI',
          operator: 'less_than',
          value: 30,
          timeframe: '1d',
        },
        {
          id: 'cond-2',
          type: 'indicator',
          field: 'RSI',
          operator: 'crosses_above',
          value: 30,
          timeframe: '1d',
        },
      ],
      groups: [],
    },
    actions: [
      {
        type: 'alert',
        alert_type: 'opportunity',
        message: 'RSI oversold bounce detected - potential buying opportunity',
      },
    ],
    popularity: 85,
    avg_win_rate: 0.62,
  },
  {
    id: 'template-002',
    name: 'Momentum Breakout',
    category: 'breakout',
    description: 'Alert when price breaks above resistance with high volume. Trend-following strategy.',
    root_group: {
      id: 'group-1',
      logic: 'AND',
      conditions: [
        {
          id: 'cond-1',
          type: 'price',
          field: 'current_price',
          operator: 'crosses_above',
          value: 0, // Will be customized
          timeframe: '1d',
        },
        {
          id: 'cond-2',
          type: 'volume',
          field: 'volume_ratio',
          operator: 'greater_than',
          value: 1.5,
        },
        {
          id: 'cond-3',
          type: 'indicator',
          field: 'RSI',
          operator: 'greater_than',
          value: 50,
          timeframe: '1d',
        },
      ],
      groups: [],
    },
    actions: [
      {
        type: 'alert',
        alert_type: 'opportunity',
        message: 'Breakout detected with strong volume',
      },
    ],
    popularity: 78,
    avg_win_rate: 0.58,
  },
  {
    id: 'template-003',
    name: 'Stop Loss Trigger',
    category: 'risk_management',
    description: 'Automatically sell when price drops below your safety line. Essential risk management.',
    root_group: {
      id: 'group-1',
      logic: 'AND',
      conditions: [
        {
          id: 'cond-1',
          type: 'price',
          field: 'current_price',
          operator: 'less_than',
          value: 0, // Will be customized to safety line
        },
      ],
      groups: [],
    },
    actions: [
      {
        type: 'alert',
        alert_type: 'protect',
        message: 'Safety line breached - consider selling',
      },
      {
        type: 'sell',
        message: 'Auto-sell triggered by safety line',
        shares: 0, // Will be customized
      },
    ],
    popularity: 92,
    avg_win_rate: 0.71,
  },
  {
    id: 'template-004',
    name: 'MACD Golden Cross',
    category: 'momentum',
    description: 'Buy signal when MACD line crosses above signal line. Strong momentum indicator.',
    root_group: {
      id: 'group-1',
      logic: 'AND',
      conditions: [
        {
          id: 'cond-1',
          type: 'indicator',
          field: 'MACD',
          operator: 'crosses_above',
          value: 0,
          timeframe: '1d',
        },
        {
          id: 'cond-2',
          type: 'volume',
          field: 'volume_ratio',
          operator: 'greater_than',
          value: 1.0,
        },
      ],
      groups: [],
    },
    actions: [
      {
        type: 'alert',
        alert_type: 'opportunity',
        message: 'MACD bullish crossover - strong buy signal',
      },
    ],
    popularity: 73,
    avg_win_rate: 0.56,
  },
  {
    id: 'template-005',
    name: 'Bollinger Band Squeeze',
    category: 'breakout',
    description: 'Alert when price breaks out of narrow Bollinger Bands. Volatility expansion play.',
    root_group: {
      id: 'group-1',
      logic: 'OR',
      conditions: [],
      groups: [
        {
          id: 'group-2',
          logic: 'AND',
          conditions: [
            {
              id: 'cond-1',
              type: 'indicator',
              field: 'Bollinger_Upper',
              operator: 'crosses_above',
              value: 0, // Price crosses above upper band
              timeframe: '1d',
            },
            {
              id: 'cond-2',
              type: 'volume',
              field: 'volume_ratio',
              operator: 'greater_than',
              value: 1.3,
            },
          ],
          groups: [],
        },
        {
          id: 'group-3',
          logic: 'AND',
          conditions: [
            {
              id: 'cond-3',
              type: 'indicator',
              field: 'Bollinger_Lower',
              operator: 'crosses_below',
              value: 0, // Price crosses below lower band
              timeframe: '1d',
            },
            {
              id: 'cond-4',
              type: 'volume',
              field: 'volume_ratio',
              operator: 'greater_than',
              value: 1.3,
            },
          ],
          groups: [],
        },
      ],
    },
    actions: [
      {
        type: 'alert',
        alert_type: 'opportunity',
        message: 'Bollinger Band breakout - volatility expansion',
      },
    ],
    popularity: 65,
    avg_win_rate: 0.54,
  },
  {
    id: 'template-006',
    name: 'Moving Average Crossover',
    category: 'momentum',
    description: 'Classic golden cross: 50-day SMA crosses above 200-day SMA. Long-term bullish signal.',
    root_group: {
      id: 'group-1',
      logic: 'AND',
      conditions: [
        {
          id: 'cond-1',
          type: 'indicator',
          field: 'SMA_50',
          operator: 'crosses_above',
          value: 0, // Will compare to SMA_200
          timeframe: '1d',
        },
      ],
      groups: [],
    },
    actions: [
      {
        type: 'alert',
        alert_type: 'opportunity',
        message: 'Golden Cross detected - long-term bullish trend',
      },
    ],
    popularity: 88,
    avg_win_rate: 0.67,
  },
  {
    id: 'template-007',
    name: 'High Volume Breakout',
    category: 'breakout',
    description: 'Price breakout confirmed by exceptional volume. Institutional activity indicator.',
    root_group: {
      id: 'group-1',
      logic: 'AND',
      conditions: [
        {
          id: 'cond-1',
          type: 'volume',
          field: 'volume_ratio',
          operator: 'greater_than',
          value: 2.0,
        },
        {
          id: 'cond-2',
          type: 'price',
          field: 'current_price',
          operator: 'greater_than',
          value: 0, // Recent high
        },
        {
          id: 'cond-3',
          type: 'indicator',
          field: 'ATR',
          operator: 'greater_than',
          value: 0, // Above average ATR
          timeframe: '1d',
        },
      ],
      groups: [],
    },
    actions: [
      {
        type: 'alert',
        alert_type: 'opportunity',
        message: 'High volume breakout - strong institutional interest',
      },
    ],
    popularity: 70,
    avg_win_rate: 0.59,
  },
  {
    id: 'template-008',
    name: 'Take Profit at Target',
    category: 'risk_management',
    description: 'Automatically sell when your profit target is reached. Lock in gains.',
    root_group: {
      id: 'group-1',
      logic: 'AND',
      conditions: [
        {
          id: 'cond-1',
          type: 'price',
          field: 'current_price',
          operator: 'greater_than',
          value: 0, // Target price
        },
      ],
      groups: [],
    },
    actions: [
      {
        type: 'alert',
        alert_type: 'opportunity',
        message: 'Profit target reached - consider taking profits',
      },
      {
        type: 'sell',
        message: 'Auto-sell at profit target',
        shares: 0, // Will be customized
      },
    ],
    popularity: 81,
    avg_win_rate: 0.75,
  },
]

/**
 * Mock rules for development
 */
export const MOCK_RULES: Rule[] = [
  {
    id: 'rule-001',
    name: 'AAPL RSI Oversold Alert',
    description: 'Alert me when Apple RSI drops below 30',
    enabled: true,
    symbol: 'AAPL',
    root_group: {
      id: 'group-1',
      logic: 'AND',
      conditions: [
        {
          id: 'cond-1',
          type: 'indicator',
          field: 'RSI',
          operator: 'less_than',
          value: 30,
          timeframe: '1d',
        },
      ],
      groups: [],
    },
    actions: [
      {
        type: 'alert',
        alert_type: 'opportunity',
        message: 'AAPL oversold - RSI below 30',
      },
    ],
    created_at: '2025-09-15T10:00:00Z',
    updated_at: '2025-09-15T10:00:00Z',
    created_by: 'user-001',
    last_triggered: '2025-10-01T14:30:00Z',
    trigger_count: 3,
    backtest_result: {
      win_rate: 0.67,
      avg_profit_pct: 4.2,
      total_triggers: 12,
      period_days: 90,
    },
  },
]
