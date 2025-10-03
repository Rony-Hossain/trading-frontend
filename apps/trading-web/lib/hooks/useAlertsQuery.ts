/**
 * useAlertsQuery Hook
 * TanStack Query hook for fetching alerts
 */

import { useQuery } from '@tanstack/react-query'
import { fetchAlerts, MOCK_ALERTS_RESPONSE, type AlertsResponse } from '@/lib/api/alerts'

export function useAlertsQuery() {
  return useQuery<AlertsResponse>({
    queryKey: ['alerts'],
    queryFn: async () => {
      try {
        return await fetchAlerts()
      } catch (error) {
        // Fallback to mock data in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using mock alerts data:', error)
          return MOCK_ALERTS_RESPONSE
        }
        throw error
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute - alerts need to be fresh
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    refetchOnWindowFocus: true,
  })
}
