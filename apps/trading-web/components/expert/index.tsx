'use client'

/**
 * Expert Panels - Lazy-loaded index
 * Dynamically imports expert panels for code-splitting
 */

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

// Loading fallback component
function PanelLoadingFallback({ title }: { title: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 2,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" color="text.secondary">
        Loading {title}...
      </Typography>
    </Box>
  )
}

// Lazy-loaded components with loading states
export const ExpertPanelIndicators = dynamic(
  () => import('./ExpertPanelIndicators').then((mod) => ({ default: mod.ExpertPanelIndicators })),
  {
    loading: () => <PanelLoadingFallback title="Indicators Panel" />,
    ssr: false,
  }
)

export const ExpertPanelOptions = dynamic(
  () => import('./ExpertPanelOptions').then((mod) => ({ default: mod.ExpertPanelOptions })),
  {
    loading: () => <PanelLoadingFallback title="Options Panel" />,
    ssr: false,
  }
)

export const ExpertPanelDiagnostics = dynamic(
  () => import('./ExpertPanelDiagnostics').then((mod) => ({ default: mod.ExpertPanelDiagnostics })),
  {
    loading: () => <PanelLoadingFallback title="Diagnostics Panel" />,
    ssr: false,
  }
)

export const ChartSettingsPanel = dynamic(
  () => import('./ChartSettingsPanel').then((mod) => ({ default: mod.ChartSettingsPanel })),
  {
    loading: () => <PanelLoadingFallback title="Chart Settings" />,
    ssr: false,
  }
)
