interface LaunchKpiSnapshot {
  beginnerActivationPct: number
  alertFollowThroughPct: number
  medianAlertPnl: number
  alertHelpfulnessPct: number
  lossCapSaves: number
  sampleSize: number
}

function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  }
  return sorted[mid]
}

class LaunchKpiTracker {
  private modeSwitches = 0
  private beginnerActivations = 0
  private alertActions = 0
  private alertFollowThroughs = 0
  private alertPnls: number[] = []
  private helpfulVotes = 0
  private helpfulPositive = 0
  private lossCapSaves = 0

  recordModeChange(mode: 'beginner' | 'expert') {
    this.modeSwitches += 1
    if (mode === 'beginner') {
      this.beginnerActivations += 1
    }
  }

  recordAlertAction(action: 'buy_now' | 'sell_now' | 'snooze') {
    if (action === 'buy_now' || action === 'sell_now') {
      this.alertActions += 1
    }
  }

  recordAlertFollowThrough(pnlUsd?: number) {
    this.alertFollowThroughs += 1
    if (typeof pnlUsd === 'number' && !Number.isNaN(pnlUsd)) {
      this.alertPnls.push(pnlUsd)
    }
  }

  recordAlertFeedback(helpful: boolean) {
    this.helpfulVotes += 1
    if (helpful) {
      this.helpfulPositive += 1
    }
  }

  recordLossCapSave() {
    this.lossCapSaves += 1
  }

  snapshot(): LaunchKpiSnapshot {
    const beginnerActivationPct =
      this.modeSwitches === 0 ? 0 : (this.beginnerActivations / this.modeSwitches) * 100
    const alertFollowThroughPct =
      this.alertActions === 0 ? 0 : (this.alertFollowThroughs / this.alertActions) * 100
    const alertHelpfulnessPct =
      this.helpfulVotes === 0 ? 0 : (this.helpfulPositive / this.helpfulVotes) * 100

    return {
      beginnerActivationPct,
      alertFollowThroughPct,
      medianAlertPnl: median(this.alertPnls),
      alertHelpfulnessPct,
      lossCapSaves: this.lossCapSaves,
      sampleSize: this.alertActions,
    }
  }

  reset() {
    this.modeSwitches = 0
    this.beginnerActivations = 0
    this.alertActions = 0
    this.alertFollowThroughs = 0
    this.alertPnls = []
    this.helpfulVotes = 0
    this.helpfulPositive = 0
    this.lossCapSaves = 0
  }
}

export const launchKpiTracker = new LaunchKpiTracker()
export type { LaunchKpiSnapshot }
