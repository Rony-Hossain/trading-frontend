import planSample from './samples/plan-response.json'

describe('Plan contract', () => {
  it('matches required shape', () => {
    expect(typeof planSample.metadata?.generated_at).toBe('string')
    expect(planSample.mode === 'beginner' || planSample.mode === 'expert').toBe(true)
    expect(Array.isArray(planSample.picks)).toBe(true)
    const firstPick = planSample.picks[0]
    expect(firstPick).toBeDefined()
    expect(typeof firstPick.symbol).toBe('string')
    expect(['BUY', 'SELL', 'HOLD', 'AVOID']).toContain(firstPick.action)
    expect(typeof firstPick.entry_hint).toBe('number')
    expect(Array.isArray(firstPick.reason_codes)).toBe(true)
    expect(typeof firstPick.decision_path).toBe('string')
    if (firstPick.news && firstPick.news.length > 0) {
      const news = firstPick.news[0]
      expect(typeof news.source).toBe('string')
      expect(typeof news.url).toBe('string')
    }
  })
})
