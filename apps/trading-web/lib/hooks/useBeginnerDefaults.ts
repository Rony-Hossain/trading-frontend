/**
 * useBeginnerDefaults Hook
 * TanStack Query hook for fetching server-enforced beginner defaults
 */

import { useQuery } from '@tanstack/react-query'
import { fetchBeginnerDefaults, MOCK_BEGINNER_DEFAULTS, type DefaultsResponse } from '@/lib/api/defaults'

export function useBeginnerDefaults() {
  return useQuery<DefaultsResponse>({
    queryKey: ['beginner-defaults'],
    queryFn: async () => {
      try {
        return await fetchBeginnerDefaults()
      } catch (error) {
        // Fallback to mock data in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using mock beginner defaults:', error)
          return MOCK_BEGINNER_DEFAULTS
        }
        throw error
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - defaults rarely change
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
    refetchOnWindowFocus: false,
  })
}
