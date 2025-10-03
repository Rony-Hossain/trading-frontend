/**
 * useExplainEntry - Fetch glossary term explanation
 */

import { useQuery } from '@tanstack/react-query'
import { ExplainResponse } from '@/lib/types/contracts'

async function fetchExplain(term: string): Promise<ExplainResponse> {
  const response = await fetch(`/api/explain/${encodeURIComponent(term)}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch explanation for ${term}`)
  }

  return response.json()
}

export function useExplainEntry(term: string) {
  return useQuery({
    queryKey: ['explain', term],
    queryFn: () => fetchExplain(term),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - glossary terms rarely change
    enabled: Boolean(term), // Only fetch if term is provided
  })
}
