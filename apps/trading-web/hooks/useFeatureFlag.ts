'use client'

import { useFeatureFlags } from '@/contexts/FeatureFlagContext'

export function useFeatureFlag(flag: string) {
  const { flags } = useFeatureFlags()
  return flags[flag]?.enabled ?? false
}
