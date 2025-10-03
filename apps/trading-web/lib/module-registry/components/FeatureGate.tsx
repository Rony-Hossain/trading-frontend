/**
 * Feature Gate Component
 * Conditionally renders children based on feature flag state
 */

'use client'

import type { FeatureGateProps } from '../types'

export function FeatureGate({
  feature,
  fallback = null,
  children,
}: FeatureGateProps) {
  const features = Array.isArray(feature) ? feature : [feature]

  // Check if all features are enabled
  const allEnabled = features.every((f) => isFeatureEnabled(f))

  if (!allEnabled) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Check if feature flag is enabled
 */
function isFeatureEnabled(flag: string): boolean {
  // Check environment variable
  const envFlag = process.env[`NEXT_PUBLIC_FEATURE_${flag.toUpperCase()}`]
  if (envFlag === 'true' || envFlag === '1') {
    return true
  }

  // Check site config
  if (typeof window !== 'undefined') {
    const siteConfig = (window as any).__SITE_CONFIG__
    if (siteConfig?.features?.[flag] === true) {
      return true
    }
  }

  return false
}

/**
 * Hook to check feature flag
 */
export function useFeatureFlag(flag: string): boolean {
  return isFeatureEnabled(flag)
}

/**
 * Hook to check multiple feature flags
 */
export function useFeatureFlags(flags: string[]): Record<string, boolean> {
  return flags.reduce(
    (acc, flag) => {
      acc[flag] = isFeatureEnabled(flag)
      return acc
    },
    {} as Record<string, boolean>
  )
}
