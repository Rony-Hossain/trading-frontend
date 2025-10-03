/**
 * State & Error Vocabulary
 * Centralized state management patterns and banner configurations
 * Last updated: 2025-10-03
 */

import { getCopy, type CopyMode } from '../copy/copy-service'

// =============================================================================
// STATE TYPES
// =============================================================================

export enum ViewState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
  EMPTY = 'empty',
  STALE = 'stale',
  SLOW = 'slow',
  RATE_LIMITED = 'rate_limited',
  OFFLINE = 'offline',
  DEGRADED = 'degraded',
}

// =============================================================================
// ERROR CODES
// =============================================================================

export enum ErrorCode {
  // Network Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  OFFLINE = 'OFFLINE',

  // API Errors
  UPSTREAM_TIMEOUT = 'UPSTREAM_TIMEOUT',
  UPSTREAM_ERROR = 'UPSTREAM_ERROR',
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Authentication Errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Validation Errors
  INVALID_REQUEST = 'INVALID_REQUEST',
  VALIDATION_FAILED = 'VALIDATION_FAILED',

  // Business Logic Errors
  DAILY_CAP_HIT = 'DAILY_CAP_HIT',
  COMPLIANCE_VIOLATION = 'COMPLIANCE_VIOLATION',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',

  // System Errors
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// =============================================================================
// BANNER TYPES
// =============================================================================

export enum BannerType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  DEGRADED = 'degraded',
}

export enum BannerPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
}

// =============================================================================
// STATE CONFIGURATIONS
// =============================================================================

export interface StateConfig {
  state: ViewState
  title: string
  message: string
  action?: {
    label: string
    handler: () => void
  }
  icon?: string
  showSpinner?: boolean
}

export interface BannerConfig {
  type: BannerType
  priority: BannerPriority
  message: string
  dismissible: boolean
  autoHideDuration?: number // milliseconds
  action?: {
    label: string
    handler: () => void
  }
}

// =============================================================================
// STATE HELPERS
// =============================================================================

/**
 * Get loading state configuration
 */
export function getLoadingState(
  context: 'plan' | 'portfolio' | 'alerts',
  mode: CopyMode = 'beginner'
): StateConfig {
  return {
    state: ViewState.LOADING,
    title: '',
    message: getCopy(`loading.${context}`, mode),
    showSpinner: true,
  }
}

/**
 * Get empty state configuration
 */
export function getEmptyState(
  context: 'plan' | 'portfolio' | 'alerts' | 'journal',
  mode: CopyMode = 'beginner'
): StateConfig {
  return {
    state: ViewState.EMPTY,
    title: '',
    message: getCopy(`empty.${context}`, mode),
    icon: 'inbox',
  }
}

/**
 * Get error state configuration
 */
export function getErrorState(
  errorCode: ErrorCode,
  mode: CopyMode = 'beginner',
  retryHandler?: () => void
): StateConfig {
  const errorMessages: Record<ErrorCode, { beginner: string; expert: string }> = {
    [ErrorCode.NETWORK_ERROR]: {
      beginner: "Can't connect right now. Check your internet.",
      expert: 'Network error. Check connection.',
    },
    [ErrorCode.TIMEOUT]: {
      beginner: 'Taking too long. Please try again.',
      expert: 'Request timeout. Retry.',
    },
    [ErrorCode.OFFLINE]: {
      beginner: "You're offline. Check your connection.",
      expert: 'Offline. Reconnect to continue.',
    },
    [ErrorCode.UPSTREAM_TIMEOUT]: {
      beginner: 'Data source is slow. Try again in a moment.',
      expert: 'Upstream timeout. Retry shortly.',
    },
    [ErrorCode.UPSTREAM_ERROR]: {
      beginner: 'Trouble getting data. Try refreshing.',
      expert: 'Upstream error. Refresh to retry.',
    },
    [ErrorCode.INSUFFICIENT_DATA]: {
      beginner: 'Not enough data to show recommendations.',
      expert: 'Insufficient data for signal generation.',
    },
    [ErrorCode.RATE_LIMIT_EXCEEDED]: {
      beginner: 'Too many requests. Wait a moment and try again.',
      expert: 'Rate limit exceeded. Retry after cooldown.',
    },
    [ErrorCode.UNAUTHORIZED]: {
      beginner: 'Please log in to continue.',
      expert: 'Unauthorized. Login required.',
    },
    [ErrorCode.FORBIDDEN]: {
      beginner: "You don't have access to this.",
      expert: 'Access forbidden.',
    },
    [ErrorCode.SESSION_EXPIRED]: {
      beginner: 'Your session expired. Please log in again.',
      expert: 'Session expired. Re-authenticate.',
    },
    [ErrorCode.INVALID_REQUEST]: {
      beginner: 'Something went wrong. Try again.',
      expert: 'Invalid request. Check parameters.',
    },
    [ErrorCode.VALIDATION_FAILED]: {
      beginner: 'Please check your input and try again.',
      expert: 'Validation failed. Review input.',
    },
    [ErrorCode.DAILY_CAP_HIT]: {
      beginner: 'Daily loss limit reached. Trading paused until tomorrow.',
      expert: 'Daily cap hit. Trading halted until reset.',
    },
    [ErrorCode.COMPLIANCE_VIOLATION]: {
      beginner: 'This action is not allowed for your account.',
      expert: 'Compliance violation. Action blocked.',
    },
    [ErrorCode.INSUFFICIENT_FUNDS]: {
      beginner: 'Not enough cash for this trade.',
      expert: 'Insufficient funds.',
    },
    [ErrorCode.SERVER_ERROR]: {
      beginner: 'Server issue. Try refreshing.',
      expert: 'Server error. Retry.',
    },
    [ErrorCode.UNKNOWN_ERROR]: {
      beginner: 'Something went wrong. Please try again.',
      expert: 'Unknown error. Retry.',
    },
  }

  return {
    state: ViewState.ERROR,
    title: mode === 'beginner' ? 'Oops!' : 'Error',
    message: errorMessages[errorCode][mode],
    action: retryHandler
      ? {
          label: getCopy('action.refresh', mode),
          handler: retryHandler,
        }
      : undefined,
    icon: 'alert-circle',
  }
}

// =============================================================================
// BANNER HELPERS
// =============================================================================

/**
 * Create stale data banner
 */
export function createStaleBanner(
  refreshHandler: () => void,
  mode: CopyMode = 'beginner'
): BannerConfig {
  return {
    type: BannerType.WARNING,
    priority: BannerPriority.MEDIUM,
    message: getCopy('banner.stale_data', mode),
    dismissible: true,
    action: {
      label: getCopy('action.refresh', mode),
      handler: refreshHandler,
    },
  }
}

/**
 * Create degraded service banner
 */
export function createDegradedBanner(mode: CopyMode = 'beginner'): BannerConfig {
  return {
    type: BannerType.DEGRADED,
    priority: BannerPriority.HIGH,
    message: getCopy('banner.degraded', mode),
    dismissible: true,
  }
}

/**
 * Create offline banner
 */
export function createOfflineBanner(mode: CopyMode = 'beginner'): BannerConfig {
  return {
    type: BannerType.ERROR,
    priority: BannerPriority.CRITICAL,
    message: getCopy('banner.offline', mode),
    dismissible: false,
  }
}

/**
 * Create rate limit banner
 */
export function createRateLimitBanner(
  retryAfterSeconds: number,
  mode: CopyMode = 'beginner'
): BannerConfig {
  const retryMessage =
    mode === 'beginner'
      ? `Too many requests. Please wait ${retryAfterSeconds} seconds.`
      : `Rate limited. Retry in ${retryAfterSeconds}s.`

  return {
    type: BannerType.WARNING,
    priority: BannerPriority.HIGH,
    message: retryMessage,
    dismissible: false,
    autoHideDuration: retryAfterSeconds * 1000,
  }
}

/**
 * Create daily cap warning banner
 */
export function createDailyCapWarningBanner(mode: CopyMode = 'beginner'): BannerConfig {
  return {
    type: BannerType.WARNING,
    priority: BannerPriority.HIGH,
    message: getCopy('compliance.daily_cap_warning', mode),
    dismissible: true,
  }
}

/**
 * Create daily cap hit banner
 */
export function createDailyCapHitBanner(
  resetTime: Date,
  mode: CopyMode = 'beginner'
): BannerConfig {
  const resetMessage =
    mode === 'beginner'
      ? `Daily loss limit reached. Trading resumes at ${resetTime.toLocaleTimeString()}.`
      : `Daily cap hit. Reset at ${resetTime.toLocaleTimeString()}.`

  return {
    type: BannerType.ERROR,
    priority: BannerPriority.CRITICAL,
    message: resetMessage,
    dismissible: false,
  }
}

/**
 * Create paper trading mode banner
 */
export function createPaperTradingBanner(mode: CopyMode = 'beginner'): BannerConfig {
  return {
    type: BannerType.INFO,
    priority: BannerPriority.LOW,
    message: getCopy('compliance.paper_only', mode),
    dismissible: true,
    autoHideDuration: 5000,
  }
}

// =============================================================================
// BANNER QUEUE MANAGER
// =============================================================================

export class BannerQueue {
  private banners: Map<string, BannerConfig> = new Map()

  /**
   * Add banner to queue
   */
  add(id: string, config: BannerConfig): void {
    this.banners.set(id, config)
  }

  /**
   * Remove banner from queue
   */
  remove(id: string): void {
    this.banners.delete(id)
  }

  /**
   * Get highest priority banner
   */
  getActive(): BannerConfig | null {
    if (this.banners.size === 0) return null

    const sorted = Array.from(this.banners.values()).sort(
      (a, b) => b.priority - a.priority
    )

    return sorted[0]
  }

  /**
   * Clear all banners
   */
  clear(): void {
    this.banners.clear()
  }

  /**
   * Get all banners sorted by priority
   */
  getAll(): BannerConfig[] {
    return Array.from(this.banners.values()).sort((a, b) => b.priority - a.priority)
  }
}

// =============================================================================
// STATE MATRIX
// =============================================================================

/**
 * State matrix for all major views
 * Documents all possible states per surface
 */
export const STATE_MATRIX = {
  plan: {
    states: [
      ViewState.IDLE,
      ViewState.LOADING,
      ViewState.SUCCESS,
      ViewState.ERROR,
      ViewState.EMPTY,
      ViewState.STALE,
      ViewState.DEGRADED,
    ],
    errorCodes: [
      ErrorCode.NETWORK_ERROR,
      ErrorCode.TIMEOUT,
      ErrorCode.UPSTREAM_TIMEOUT,
      ErrorCode.INSUFFICIENT_DATA,
      ErrorCode.RATE_LIMIT_EXCEEDED,
    ],
  },
  portfolio: {
    states: [
      ViewState.IDLE,
      ViewState.LOADING,
      ViewState.SUCCESS,
      ViewState.ERROR,
      ViewState.EMPTY,
      ViewState.STALE,
    ],
    errorCodes: [
      ErrorCode.NETWORK_ERROR,
      ErrorCode.TIMEOUT,
      ErrorCode.UNAUTHORIZED,
    ],
  },
  alerts: {
    states: [
      ViewState.IDLE,
      ViewState.LOADING,
      ViewState.SUCCESS,
      ViewState.ERROR,
      ViewState.EMPTY,
      ViewState.OFFLINE,
    ],
    errorCodes: [
      ErrorCode.NETWORK_ERROR,
      ErrorCode.TIMEOUT,
      ErrorCode.RATE_LIMIT_EXCEEDED,
    ],
  },
  journal: {
    states: [
      ViewState.IDLE,
      ViewState.LOADING,
      ViewState.SUCCESS,
      ViewState.ERROR,
      ViewState.EMPTY,
    ],
    errorCodes: [ErrorCode.NETWORK_ERROR, ErrorCode.TIMEOUT],
  },
  settings: {
    states: [ViewState.IDLE, ViewState.LOADING, ViewState.SUCCESS, ViewState.ERROR],
    errorCodes: [
      ErrorCode.NETWORK_ERROR,
      ErrorCode.VALIDATION_FAILED,
      ErrorCode.COMPLIANCE_VIOLATION,
    ],
  },
} as const

// =============================================================================
// SLOW LOADING THRESHOLD
// =============================================================================

export const SLOW_LOADING_THRESHOLD_MS = 3000 // 3 seconds

/**
 * Check if loading is slow
 */
export function isLoadingSlow(startTime: number): boolean {
  return Date.now() - startTime > SLOW_LOADING_THRESHOLD_MS
}

/**
 * Create slow loading banner
 */
export function createSlowLoadingBanner(mode: CopyMode = 'beginner'): BannerConfig {
  const message =
    mode === 'beginner'
      ? 'Taking longer than usual. Please wait...'
      : 'Slow response. Loading...'

  return {
    type: BannerType.INFO,
    priority: BannerPriority.LOW,
    message,
    dismissible: false,
  }
}
