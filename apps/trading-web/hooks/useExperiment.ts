'use client'

import { useEffect, useMemo, useState } from 'react'
import { experimentEngine, type ExperimentDefinition } from '@/lib/experiments/experiment-engine'

export function useExperiment(definition: ExperimentDefinition) {
  const memoizedDefinition = useMemo(() => definition, [definition.id, definition.rolloutPercentage, definition.stopRule])
  const [cohort, setCohort] = useState(() => experimentEngine.getAssignment(memoizedDefinition.id))

  useEffect(() => {
    experimentEngine.registerExperiment(memoizedDefinition)
    setCohort(experimentEngine.getAssignment(memoizedDefinition.id))
  }, [memoizedDefinition])

  const refresh = () => {
    setCohort(experimentEngine.getAssignment(memoizedDefinition.id))
  }

  return { cohort, refresh }
}

export function useCanaryRollout(rolloutPercentage: number): boolean {
  const { cohort } = useExperiment({ id: 'canary-rollout', rolloutPercentage })
  return cohort === 'canary'
}
