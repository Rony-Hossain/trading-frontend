import alertSample from './samples/alert.json'

describe('Alert contract', () => {
  it('contains required fields', () => {
    expect(alertSample.id).toMatch(/alert-/)
    expect(['opportunity', 'protect']).toContain(alertSample.type)
    expect(typeof alertSample.message).toBe('string')
    expect(Array.isArray(alertSample.actions)).toBe(true)
    expect(alertSample.safety).toBeDefined()
    expect(typeof alertSample.safety.max_loss_usd).toBe('number')
    expect(alertSample.analytics?.expected_pnl_usd).toBeGreaterThanOrEqual(0)
  })
})
