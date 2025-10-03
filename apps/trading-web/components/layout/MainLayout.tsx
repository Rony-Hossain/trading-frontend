'use client'

/**
 * Main Layout Component
 * Provides consistent layout structure with header and sidebar
 */
import { useState } from 'react'
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onMenuClick={handleDrawerToggle} />

      {/* Sidebar */}
      {isMobile ? (
        <Sidebar
          open={mobileOpen}
          onClose={handleDrawerToggle}
          variant="temporary"
        />
      ) : (
        <Sidebar open={true} onClose={() => {}} variant="permanent" />
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}
