import { ReactNode } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@/theme'

interface RenderResult {
  container: HTMLElement
  unmount: () => void
}

export function renderWithProviders(ui: ReactNode): RenderResult {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  act(() => {
    root.render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {ui}
      </ThemeProvider>
    )
  })

  return {
    container,
    unmount() {
      act(() => {
        root.unmount()
      })
      container.remove()
    },
  }
}
