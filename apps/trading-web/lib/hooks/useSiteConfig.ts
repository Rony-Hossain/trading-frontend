/**
 * useSiteConfig Hook
 * React hook for accessing site configuration
 */

import { useEffect, useState } from 'react'
import { getSiteConfig, type SiteConfig } from '@/lib/config/site-config'

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    getSiteConfig()
      .then((loadedConfig) => {
        if (mounted) {
          setConfig(loadedConfig)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return { config, loading, error }
}
