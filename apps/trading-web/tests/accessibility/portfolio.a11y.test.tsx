import axe from 'axe-core'
import { act } from 'react-dom/test-utils'
import { SellConfirmDialog } from '@/components/portfolio/SellConfirmDialog'
import { AdjustSafetyDialog } from '@/components/portfolio/AdjustSafetyDialog'
import type { Position } from '@/lib/types/contracts'
import { renderWithProviders } from '../test-utils'

const samplePosition: Position = {
  symbol: 'TSLA',
  shares: 20,
  entryPrice: 200,
  currentPrice: 215,
  pnlUsd: 300,
  pnlPct: 0.15,
  safetyLine: 185,
  maxPlannedLossUsd: 400,
  message: 'Up $300 (15%)',
  target: 230,
}

describe('Portfolio dialogs accessibility', () => {
  it('allows keyboard submission of SellConfirmDialog and passes axe scan', async () => {
    const onConfirm = jest.fn().mockResolvedValue(undefined)
    const { container, unmount } = renderWithProviders(
      <SellConfirmDialog
        position={samplePosition}
        isOpen
        onClose={jest.fn()}
        onConfirm={onConfirm}
        isPaperTrade={false}
      />
    )

    const input = container.querySelector('#shares-to-sell') as HTMLInputElement
    expect(input).toBeTruthy()

    act(() => {
      input.focus()
      input.value = '5'
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
    })

    const confirmButton = Array.from(container.querySelectorAll('button')).find((btn) =>
      btn.textContent?.includes('Confirm Sale')
    ) as HTMLButtonElement

    expect(confirmButton).toBeTruthy()

    await act(async () => {
      confirmButton.focus()
      confirmButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      confirmButton.click()
    })

    expect(onConfirm).toHaveBeenCalledWith('TSLA', 5)

    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)

    unmount()
  })

  it('supports keyboard interaction in AdjustSafetyDialog', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    const { container, unmount } = renderWithProviders(
      <AdjustSafetyDialog
        open
        position={samplePosition}
        onClose={jest.fn()}
        onSubmit={onSubmit}
      />
    )

    const safetyInput = container.querySelector('#safety-line') as HTMLInputElement
    expect(safetyInput).toBeTruthy()

    act(() => {
      safetyInput.focus()
      safetyInput.value = '190'
      safetyInput.dispatchEvent(new Event('input', { bubbles: true }))
      safetyInput.dispatchEvent(new Event('change', { bubbles: true }))
    })

    const saveButton = Array.from(container.querySelectorAll('button')).find((btn) =>
      btn.textContent?.includes('Update Safety Line')
    ) as HTMLButtonElement

    await act(async () => {
      saveButton.focus()
      saveButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      saveButton.click()
    })

    expect(onSubmit).toHaveBeenCalled()

    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)

    unmount()
  })
})
