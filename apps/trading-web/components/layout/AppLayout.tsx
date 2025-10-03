/**
 * AppLayout - Main application shell
 * Provides layout structure, query client, and global UI elements
 */

'use client'

import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Box } from '@mui/material'
import { MainNav } from './MainNav'
import { GlobalToasts } from '../ui/GlobalToasts'
import { RouteProgressBar } from '../ui/RouteProgressBar'

// Create query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Route progress indicator */}
        <RouteProgressBar />

        {/* Main navigation */}
        <MainNav />

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: 'background.default',
            pt: 2,
            pb: 4,
          }}
        >
          {children}
        </Box>

        {/* Global toast notifications */}
        <GlobalToasts />
      </Box>

      {/* React Query DevTools (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
