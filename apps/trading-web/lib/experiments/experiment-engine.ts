type Comparator = 'lt' | 'gt'

export interface StopRule {
  metric: string
  threshold: number
  comparator: Comparator
  sampleSize?: number
}

export interface ExperimentDefinition {
  id: string
  rolloutPercentage: number
  stopRule?: StopRule
}

interface MetricSample {
  metric: string
  value: number
}

const STORAGE_KEY = 'experiment-assignments'

function loadAssignments(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAssignments(assignments: Record<string, string>) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments))
  } catch {
    // ignore
  }
}

class ExperimentEngine {
  private assignments: Record<string, string> = loadAssignments()
  private metrics: Record<string, MetricSample[]> = {}
  private experiments: Map<string, ExperimentDefinition> = new Map()

  registerExperiment(definition: ExperimentDefinition) {
    this.experiments.set(definition.id, definition)
  }

  getAssignment(experimentId: string, fallback: string = 'control'): string {
    if (this.assignments[experimentId]) {
      return this.assignments[experimentId]
    }

    const definition = this.experiments.get(experimentId)
    const rollout = definition?.rolloutPercentage ?? 0
    const cohort = Math.random() * 100 < rollout ? 'canary' : fallback
    this.assignments[experimentId] = cohort
    saveAssignments(this.assignments)
    return cohort
  }

  recordMetric(experimentId: string, metric: string, value: number) {
    if (!this.metrics[experimentId]) {
      this.metrics[experimentId] = []
    }
    this.metrics[experimentId].push({ metric, value })
  }

  getMetricAverage(experimentId: string, metric: string): number | null {
    const samples = this.metrics[experimentId]?.filter((sample) => sample.metric === metric)
    if (!samples || samples.length === 0) return null
    const sum = samples.reduce((acc, sample) => acc + sample.value, 0)
    return sum / samples.length
  }

  shouldStop(experimentId: string): boolean {
    const definition = this.experiments.get(experimentId)
    if (!definition?.stopRule) return false

    const { metric, threshold, comparator, sampleSize } = definition.stopRule
    const samples = this.metrics[experimentId]?.filter((sample) => sample.metric === metric)
    if (!samples || samples.length === 0) return false
    if (sampleSize && samples.length < sampleSize) return false

    const average = this.getMetricAverage(experimentId, metric)
    if (average === null) return false

    return comparator === 'lt' ? average < threshold : average > threshold
  }

  clearAssignment(experimentId: string) {
    delete this.assignments[experimentId]
    saveAssignments(this.assignments)
  }
}

export const experimentEngine = new ExperimentEngine()
