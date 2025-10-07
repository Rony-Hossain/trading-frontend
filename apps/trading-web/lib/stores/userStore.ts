/**
 * User Store - Manages user preferences and authentication state
 * Using Zustand for lightweight state management
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { launchKpiTracker } from '@/lib/analytics/launch-kpi-tracker'

export type ThemeMode = 'light' | 'dark' | 'auto'
export type DashboardMode = 'beginner' | 'expert'
export type ChartType = 'candlestick' | 'line' | 'area' | 'heikin-ashi' | 'renko' | 'point-figure' | 'volume-profile'

export interface ThemePreset {
  id: string
  name: string
  colors: {
    background: string
    surface: string
    primary: string
    secondary: string
    text: string
    textSecondary: string
    success: string
    danger: string
    warning: string
    info: string
  }
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  darkClassic: {
    id: 'darkClassic',
    name: 'Dark Classic',
    colors: {
      background: '#0D1117',
      surface: '#161B22',
      primary: '#58A6FF',
      secondary: '#8B949E',
      text: '#C9D1D9',
      textSecondary: '#8B949E',
      success: '#3FB950',
      danger: '#F85149',
      warning: '#D29922',
      info: '#58A6FF',
    },
  },
  lightModern: {
    id: 'lightModern',
    name: 'Light Modern',
    colors: {
      background: '#FFFFFF',
      surface: '#F6F8FA',
      primary: '#0969DA',
      secondary: '#57606A',
      text: '#24292F',
      textSecondary: '#57606A',
      success: '#1A7F37',
      danger: '#CF222E',
      warning: '#9A6700',
      info: '#0969DA',
    },
  },
  nightBlue: {
    id: 'nightBlue',
    name: 'Night Blue',
    colors: {
      background: '#0A1929',
      surface: '#132F4C',
      primary: '#3399FF',
      secondary: '#66B2FF',
      text: '#B2BAC2',
      textSecondary: '#6B7A90',
      success: '#1DB45A',
      danger: '#E63946',
      warning: '#F77F00',
      info: '#3399FF',
    },
  },
  highContrast: {
    id: 'highContrast',
    name: 'High Contrast',
    colors: {
      background: '#000000',
      surface: '#1A1A1A',
      primary: '#00D9FF',
      secondary: '#7F7F7F',
      text: '#FFFFFF',
      textSecondary: '#B3B3B3',
      success: '#00FF00',
      danger: '#FF0000',
      warning: '#FFFF00',
      info: '#00D9FF',
    },
  },
}

export interface UserPreferences {
  // General
  dashboardMode: DashboardMode
  defaultSymbol: string
  autoRefresh: boolean
  refreshInterval: number // seconds
  deviceSyncVersion?: string

  // Appearance
  themeMode: ThemeMode
  themePreset: string
  customColors?: ThemePreset['colors']
  fontSize: number
  compactMode: boolean

  // Trading
  defaultOrderType: 'market' | 'limit' | 'stop' | 'stop-limit'
  confirmOrders: boolean
  defaultQuantity: number
  riskPerTrade: number // percentage

  // Charts
  defaultChartType: ChartType
  defaultTimeframe: string
  enabledIndicators: string[]
  chartLayout: number // 1, 2, 4, 6 charts

  // Notifications
  enableDesktopNotifications: boolean
  enableSoundAlerts: boolean
  notifyOnSignals: boolean
  notifyOnFills: boolean
  notifyOnPriceAlerts: boolean

  // Data
  dataProvider: string
  showExtendedHours: boolean
  showVolume: boolean
  preferredNewsSources: string[]
  hiddenNewsSources: string[]

  // Advanced
  enableHotkeys: boolean
  enableTradingTerminal: boolean
  maxWebSocketConnections: number
}

interface User {
  id: string
  email: string
  name: string
  createdAt: string
  plan: 'free' | 'pro' | 'enterprise'
}

interface UserState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  token: string | null

  // Preferences
  preferences: UserPreferences

  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
  updatePreferences: (updates: Partial<UserPreferences>) => void
  setThemeMode: (mode: ThemeMode) => void
  setThemePreset: (preset: string) => void
  setDashboardMode: (mode: DashboardMode) => void
  toggleDashboardMode: () => void
  hideNewsSource: (source: string) => void
  unhideNewsSource: (source: string) => void
  resetHiddenSources: () => void
}

const defaultPreferences: UserPreferences = {
  // General
  dashboardMode: 'beginner',
  defaultSymbol: 'AAPL',
  autoRefresh: true,
  refreshInterval: 5,
  deviceSyncVersion: '1.0.0',

  // Appearance
  themeMode: 'dark',
  themePreset: 'darkClassic',
  fontSize: 14,
  compactMode: false,

  // Trading
  defaultOrderType: 'limit',
  confirmOrders: true,
  defaultQuantity: 100,
  riskPerTrade: 2,

  // Charts
  defaultChartType: 'candlestick',
  defaultTimeframe: '1D',
  enabledIndicators: ['SMA_20', 'SMA_50', 'RSI_14', 'MACD'],
  chartLayout: 1,

  // Notifications
  enableDesktopNotifications: true,
  enableSoundAlerts: true,
  notifyOnSignals: true,
  notifyOnFills: true,
  notifyOnPriceAlerts: true,

  // Data
  dataProvider: 'default',
  showExtendedHours: false,
  showVolume: true,
  preferredNewsSources: ['Bloomberg', 'Reuters', 'CNBC'],
  hiddenNewsSources: [],

  // Advanced
  enableHotkeys: true,
  enableTradingTerminal: false,
  maxWebSocketConnections: 5,
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      token: null,
      preferences: defaultPreferences,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => set({ token }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
        token: null,
      }),

      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),

      setThemeMode: (mode) =>
        set((state) => ({
          preferences: { ...state.preferences, themeMode: mode },
        })),

      setThemePreset: (preset) =>
        set((state) => ({
          preferences: { ...state.preferences, themePreset: preset },
        })),

      setDashboardMode: (mode) => {
        launchKpiTracker.recordModeChange(mode)
        set((state) => ({
          preferences: { ...state.preferences, dashboardMode: mode },
        }))
      },

      toggleDashboardMode: () =>
        set((state) => {
          const nextMode = state.preferences.dashboardMode === 'beginner' ? 'expert' : 'beginner'
          launchKpiTracker.recordModeChange(nextMode)
          return {
            preferences: {
              ...state.preferences,
              dashboardMode: nextMode,
            },
          }
        }),

      hideNewsSource: (source: string) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            hiddenNewsSources: Array.from(
              new Set([...state.preferences.hiddenNewsSources, source])
            ),
          },
        })),

      unhideNewsSource: (source: string) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            hiddenNewsSources: state.preferences.hiddenNewsSources.filter((s) => s !== source),
          },
        })),

      resetHiddenSources: () =>
        set((state) => ({
          preferences: { ...state.preferences, hiddenNewsSources: [] },
        })),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        token: state.token,
        preferences: state.preferences,
      }),
    }
  )
)
