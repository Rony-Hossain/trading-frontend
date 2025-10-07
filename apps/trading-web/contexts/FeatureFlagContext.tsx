'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useSiteConfig } from '../lib/hooks/useSiteConfig'

type FlagSource = 'config' | 'override'

export interface FeatureFlagState {
  enabled: boolean
  rolloutPercentage: number
  source: FlagSource
  lastUpdated?: string
}

interface FlagOverride {
  enabled?: boolean
  rolloutPercentage?: number
  lastUpdated: string
}

interface FeatureFlagContextValue {
  loading: boolean
  flags: Record<string, FeatureFlagState>
  setOverride: (flag: string, override: Partial<FlagOverride>) => void
  setRollout: (flag: string, percentage: number) => void
  scheduleRollback: (flag: string) => void
  clearOverride: (flag: string) => void
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null)

const STORAGE_KEY = 'feature-flag-overrides'

function readOverrides(): Record<string, FlagOverride> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    const parsed = JSON.parse(stored)
    if (parsed && typeof parsed === 'object') {
      return parsed
    }
    return {}
  } catch {
    return {}
  }
}

function writeOverrides(overrides: Record<string, FlagOverride>) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    // Ignore storage errors
  }
}

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const { config, loading } = useSiteConfig()
  const [overrides, setOverrides] = useState<Record<string, FlagOverride>>(() => readOverrides())

  useEffect(() => {
    setOverrides(readOverrides())
  }, [])

  useEffect(() => {
    writeOverrides(overrides)
  }, [overrides])

  const baseFlags: Record<string, FeatureFlagState> = useMemo(() => {
    if (!config?.features) return {}
    return Object.entries(config.features).reduce<Record<string, FeatureFlagState>>(
      (acc, [flag, enabled]) => {
        acc[flag] = {
          enabled: Boolean(enabled),
          rolloutPercentage: 100,
          source: 'config',
        }
        return acc
      },
      {}
    )
  }, [config])

  const flags = useMemo<Record<string, FeatureFlagState>>(() => {
    const combined: Record<string, FeatureFlagState> = { ...baseFlags }

    Object.entries(overrides).forEach(([flag, override]) => {
      const existing = combined[flag] ?? {
        enabled: false,
        rolloutPercentage: 0,
        source: 'config' as FlagSource,
      }

      combined[flag] = {
        enabled: override.enabled ?? existing.enabled,
        rolloutPercentage: override.rolloutPercentage ?? existing.rolloutPercentage,
        source: 'override',
        lastUpdated: override.lastUpdated ?? existing.lastUpdated,
      }
    })

    return combined
  }, [baseFlags, overrides])

  const setOverride = (flag: string, override: Partial<FlagOverride>) => {
    setOverrides((current) => ({
      ...current,
      [flag]: {
        ...current[flag],
        ...override,
        lastUpdated: new Date().toISOString(),
      },
    }))
  }

  const setRollout = (flag: string, percentage: number) => {
    const bounded = Math.max(0, Math.min(100, Math.round(percentage)))
    setOverride(flag, { rolloutPercentage: bounded })
  }

  const scheduleRollback = (flag: string) => {
    setOverride(flag, { enabled: false, rolloutPercentage: 0 })
  }

  const clearOverride = (flag: string) => {
    setOverrides((current) => {
      if (!(flag in current)) return current
      const { [flag]: _, ...rest } = current
      return rest
    })
  }

  const value = useMemo<FeatureFlagContextValue>(
    () => ({
      loading,
      flags,
      setOverride,
      setRollout,
      scheduleRollback,
      clearOverride,
    }),
    [loading, flags]
  )

  return (
    <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>
  )
}

export function useFeatureFlags(): FeatureFlagContextValue {
  const context = useContext(FeatureFlagContext)
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider')
  }
  return context
}
