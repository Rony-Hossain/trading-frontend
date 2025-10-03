/**
 * Site Configuration
 * Reads configuration from environment or remote JSON
 */

export interface SiteConfig {
  // Mode defaults
  defaultMode: 'beginner' | 'expert'
  allowModeSwitch: boolean

  // Risk defaults
  defaultRiskAppetite: 'conservative' | 'moderate' | 'aggressive'
  defaultDailyLossCap: number
  defaultMaxPositionSize: number

  // Feature flags
  features: {
    paperTradingEnabled: boolean
    expertModeEnabled: boolean
    newsIntegrationEnabled: boolean
    advancedChartsEnabled: boolean
    optionsTradingEnabled: boolean
  }

  // Compliance
  defaultRegion: 'US' | 'EU' | 'UK' | 'APAC'
  enforcementLevel: 'strict' | 'advisory'

  // UI preferences
  defaultTheme: 'light' | 'dark' | 'auto'
  showBeginnerHints: boolean

  // Performance
  apiBaseUrl: string
  wsBaseUrl: string
  cacheTTL: number

  // Observability
  sentryDsn?: string
  posthogKey?: string
  vercelAnalytics: boolean
}

/**
 * Default configuration (fallback if remote config fails)
 */
export const DEFAULT_SITE_CONFIG: SiteConfig = {
  // Mode defaults
  defaultMode: 'beginner',
  allowModeSwitch: true,

  // Risk defaults
  defaultRiskAppetite: 'conservative',
  defaultDailyLossCap: 2.0,
  defaultMaxPositionSize: 5.0,

  // Feature flags
  features: {
    paperTradingEnabled: true,
    expertModeEnabled: true,
    newsIntegrationEnabled: false,
    advancedChartsEnabled: false,
    optionsTradingEnabled: false,
  },

  // Compliance
  defaultRegion: 'US',
  enforcementLevel: 'strict',

  // UI preferences
  defaultTheme: 'auto',
  showBeginnerHints: true,

  // Performance
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  wsBaseUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000',
  cacheTTL: 5 * 60 * 1000, // 5 minutes

  // Observability
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  vercelAnalytics: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === 'true',
}

/**
 * Load configuration from environment variables
 */
function loadConfigFromEnv(): Partial<SiteConfig> {
  return {
    defaultMode: (process.env.NEXT_PUBLIC_DEFAULT_MODE as 'beginner' | 'expert') || DEFAULT_SITE_CONFIG.defaultMode,
    allowModeSwitch: process.env.NEXT_PUBLIC_ALLOW_MODE_SWITCH !== 'false',

    defaultRiskAppetite:
      (process.env.NEXT_PUBLIC_DEFAULT_RISK_APPETITE as 'conservative' | 'moderate' | 'aggressive') ||
      DEFAULT_SITE_CONFIG.defaultRiskAppetite,
    defaultDailyLossCap: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_DAILY_LOSS_CAP || '2.0'),
    defaultMaxPositionSize: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_MAX_POSITION_SIZE || '5.0'),

    features: {
      paperTradingEnabled: process.env.NEXT_PUBLIC_PAPER_TRADING_ENABLED !== 'false',
      expertModeEnabled: process.env.NEXT_PUBLIC_EXPERT_MODE_ENABLED !== 'false',
      newsIntegrationEnabled: process.env.NEXT_PUBLIC_NEWS_INTEGRATION_ENABLED === 'true',
      advancedChartsEnabled: process.env.NEXT_PUBLIC_ADVANCED_CHARTS_ENABLED === 'true',
      optionsTradingEnabled: process.env.NEXT_PUBLIC_OPTIONS_TRADING_ENABLED === 'true',
    },

    defaultRegion: (process.env.NEXT_PUBLIC_DEFAULT_REGION as 'US' | 'EU' | 'UK' | 'APAC') || DEFAULT_SITE_CONFIG.defaultRegion,
    enforcementLevel: (process.env.NEXT_PUBLIC_ENFORCEMENT_LEVEL as 'strict' | 'advisory') || DEFAULT_SITE_CONFIG.enforcementLevel,

    defaultTheme: (process.env.NEXT_PUBLIC_DEFAULT_THEME as 'light' | 'dark' | 'auto') || DEFAULT_SITE_CONFIG.defaultTheme,
    showBeginnerHints: process.env.NEXT_PUBLIC_SHOW_BEGINNER_HINTS !== 'false',

    apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || DEFAULT_SITE_CONFIG.apiBaseUrl,
    wsBaseUrl: process.env.NEXT_PUBLIC_WS_URL || DEFAULT_SITE_CONFIG.wsBaseUrl,
    cacheTTL: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || '300000'),

    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    vercelAnalytics: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === 'true',
  }
}

/**
 * Load configuration from remote JSON endpoint
 */
async function loadConfigFromRemote(url: string): Promise<Partial<SiteConfig>> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch remote config: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[SiteConfig] Failed to load remote config:', error)
    return {}
  }
}

/**
 * Merge configuration sources with priority: Remote > Env > Default
 */
function mergeConfigs(...configs: Partial<SiteConfig>[]): SiteConfig {
  return configs.reduce(
    (merged, config) => ({
      ...merged,
      ...config,
      features: {
        ...merged.features,
        ...(config.features || {}),
      },
    }),
    DEFAULT_SITE_CONFIG
  ) as SiteConfig
}

/**
 * Load site configuration
 * Priority: Remote JSON > Environment Variables > Defaults
 */
export async function loadSiteConfig(): Promise<SiteConfig> {
  const envConfig = loadConfigFromEnv()

  // Check if remote config URL is provided
  const remoteConfigUrl = process.env.NEXT_PUBLIC_REMOTE_CONFIG_URL

  if (remoteConfigUrl) {
    console.log('[SiteConfig] Loading remote configuration from:', remoteConfigUrl)
    const remoteConfig = await loadConfigFromRemote(remoteConfigUrl)
    return mergeConfigs(DEFAULT_SITE_CONFIG, envConfig, remoteConfig)
  }

  // No remote config, merge env with defaults
  return mergeConfigs(DEFAULT_SITE_CONFIG, envConfig)
}

/**
 * Cached site configuration instance
 */
let cachedConfig: SiteConfig | null = null
let configLoadPromise: Promise<SiteConfig> | null = null

/**
 * Get site configuration (cached)
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  if (cachedConfig) {
    return cachedConfig
  }

  if (!configLoadPromise) {
    configLoadPromise = loadSiteConfig()
  }

  cachedConfig = await configLoadPromise
  return cachedConfig
}

/**
 * Reset cached configuration (useful for testing)
 */
export function resetSiteConfig() {
  cachedConfig = null
  configLoadPromise = null
}
