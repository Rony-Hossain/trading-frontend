import axe from 'axe-core'
import { act } from 'react-dom/test-utils'
import { AlertsDrawer } from '@/components/alerts/AlertsDrawer'
import type { Alert } from '@/lib/types/contracts'
import { renderWithProviders } from '../test-utils'

function createAlert(partial?: Partial<Alert>): Alert {
  const now = Date.now()
  return {
    id: 'alert-1',
    type: 'opportunity',
    symbol: 'AAPL',
    message: 'Breakout approaching 185.',
    actions: ['buy_now', 'snooze'],
    safety: {
      max_loss_usd: 125,
      estimated_slippage_bps: 15,
      execution_confidence: 0.82,
    },
    throttle: {
      cooldown_sec: 900,
      dedupe_key: 'AAPL-opportunity',
      suppressed: false,
    },
    paper_trade_only: false,
    expires_at: new Date(now + 5 * 60 * 1000).toISOString(),
    created_at: new Date(now - 60 * 1000).toISOString(),
    ...partial,
  }
}

describe('AlertsDrawer accessibility', () => {
  it('supports keyboard activation and passes axe scan', async () => {
    const onAction = jest.fn()
    const { container, unmount } = renderWithProviders(
      <AlertsDrawer
        open
        alerts={[createAlert()]}
        armed
        quietHours={[]}
        onClose={jest.fn()}
        onToggleArmed={jest.fn()}
        onUpdateQuietHours={jest.fn()}
        onAlertAction={(_id, action) => onAction(action)}
      />
    )

    const buyButton = Array.from(container.querySelectorAll('button')).find((btn) =>
      btn.textContent?.includes('Buy Now')
    )

    expect(buyButton).toBeDefined()

    if (buyButton) {
      act(() => {
        buyButton.focus()
        buyButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
        buyButton.click()
      })

      expect(onAction).toHaveBeenCalledWith('buy_now')
    }

    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)

    unmount()
  })
})
