/**
 * usePlanQuery - Fetch today's trading plan
 */

import { useQuery } from '@tanstack/react-query'
import { PlanResponse } from '@/lib/types/contracts'

async function fetchPlan(): Promise<PlanResponse> {
  const response = await fetch('/api/plan')

  if (!response.ok) {
    throw new Error('Failed to fetch plan')
  }

  return response.json()
}

export function usePlanQuery() {
  return useQuery({
    queryKey: ['plan'],
    queryFn: fetchPlan,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  })
}
