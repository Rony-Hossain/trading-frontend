/**
 * Theme Configuration
 * Integrates Material-UI with custom theme presets
 */
import { createTheme, ThemeOptions } from '@mui/material/styles'
import { THEME_PRESETS, ThemePreset, ThemeMode } from '../stores/userStore'

/**
 * Get system theme preference
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Resolve theme mode (handles 'auto' mode)
 */
export function resolveThemeMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'auto') {
    return getSystemTheme()
  }
  return mode
}

/**
 * Create Material-UI theme from preset
 */
export function createThemeFromPreset(
  presetId: string,
  mode: 'light' | 'dark'
): ReturnType<typeof createTheme> {
  const preset = THEME_PRESETS[presetId] || THEME_PRESETS.darkClassic
  const colors = preset.colors

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.secondary,
      },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.text,
        secondary: colors.textSecondary,
      },
      success: {
        main: colors.success,
      },
      error: {
        main: colors.danger,
      },
      warning: {
        main: colors.warning,
      },
      info: {
        main: colors.info,
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            backgroundColor: colors.surface,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.surface,
            borderRight: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  }

  return createTheme(themeOptions)
}

/**
 * Chart theme configuration for Lightweight Charts
 */
export function getChartTheme(preset: ThemePreset, mode: 'light' | 'dark') {
  const colors = preset.colors

  return {
    layout: {
      background: {
        type: 'solid' as const,
        color: colors.surface,
      },
      textColor: colors.text,
      fontSize: 12,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    grid: {
      vertLines: {
        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      },
      horzLines: {
        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      },
    },
    crosshair: {
      mode: 1,
      vertLine: {
        color: colors.secondary,
        width: 1,
        style: 3,
        labelBackgroundColor: colors.primary,
      },
      horzLine: {
        color: colors.secondary,
        width: 1,
        style: 3,
        labelBackgroundColor: colors.primary,
      },
    },
    timeScale: {
      borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      timeVisible: true,
      secondsVisible: false,
    },
    rightPriceScale: {
      borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
  }
}

/**
 * Get candlestick colors based on theme
 */
export function getCandlestickColors(preset: ThemePreset) {
  return {
    upColor: preset.colors.success,
    downColor: preset.colors.danger,
    borderUpColor: preset.colors.success,
    borderDownColor: preset.colors.danger,
    wickUpColor: preset.colors.success,
    wickDownColor: preset.colors.danger,
  }
}
