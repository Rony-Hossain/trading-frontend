import axe from 'axe-core'
import { act } from 'react-dom/test-utils'
import { RuleBuilder } from '@/components/rules/RuleBuilder'
import type { RuleGroup } from '@/lib/types/contracts'
import { renderWithProviders } from '../test-utils'

const initialGroup: RuleGroup = {
  id: 'group-root',
  logic: 'AND',
  conditions: [
    {
      id: 'cond-1',
      type: 'indicator',
      field: 'RSI',
      operator: 'less_than',
      value: 30,
      timeframe: '1d',
    },
  ],
  groups: [],
}

describe('RuleBuilder accessibility', () => {
  it('triggers save via keyboard and passes axe scan', async () => {
    const onSave = jest.fn()
    const onPreview = jest.fn()

    const { container, unmount } = renderWithProviders(
      <RuleBuilder initialGroup={initialGroup} onSave={onSave} onPreview={onPreview} mode="beginner" />
    )

    const saveButton = Array.from(container.querySelectorAll('button')).find((btn) =>
      btn.textContent?.includes('Save Rule')
    ) as HTMLButtonElement

    expect(saveButton).toBeTruthy()

    act(() => {
      saveButton.focus()
      saveButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      saveButton.click()
    })

    expect(onSave).toHaveBeenCalledTimes(1)

    const results = await axe.run(container)
    expect(results.violations).toHaveLength(0)

    unmount()
  })
})
