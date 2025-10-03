'use client'

/**
 * Theme Provider - Integrates user preferences with Material-UI theme
 */
import { useEffect, useMemo } from 'react'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { useUserStore } from '../stores/userStore'
import { createThemeFromPreset, resolveThemeMode } from '../theme/themeConfig'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { preferences } = useUserStore()
  const { themeMode, themePreset } = preferences

  // Resolve actual theme mode (handle 'auto')
  const resolvedMode = useMemo(() => resolveThemeMode(themeMode), [themeMode])

  // Create MUI theme
  const theme = useMemo(
    () => createThemeFromPreset(themePreset, resolvedMode),
    [themePreset, resolvedMode]
  )

  // Listen for system theme changes when in 'auto' mode
  useEffect(() => {
    if (themeMode !== 'auto') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      // Force re-render by updating a dummy state
      window.dispatchEvent(new Event('themechange'))
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
