export interface WhatsNewEntry {
  version: string
  date: string
  highlights: string[]
  flagsImpacted?: string[]
}

export const WHATS_NEW_ENTRIES: WhatsNewEntry[] = [
  {
    version: '2025.10.05',
    date: '2025-10-05',
    highlights: [
      'Launch control center for feature flags with instant rollback and rollout sliders.',
      'In-app “What’s new” briefing surfaces hardening updates and experiment controls.',
      'Realtime feedback loops on alerts and ML drivers now capture helpfulness sentiment.',
      'Admin view exposes active modules, tenant overrides, and experimentation cohorts.',
    ],
    flagsImpacted: [
      'expertModeEnabled',
      'optionsTradingEnabled',
      'advancedChartsEnabled',
    ],
  },
]

export const LATEST_WHATS_NEW = WHATS_NEW_ENTRIES[0]
