"use client"

import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Badge } from '@mui/material'
import { useRouter, usePathname } from 'next/navigation'
import { TrendingUp, Timeline, AccountBalance, ShowChart, AdminPanelSettings } from '@mui/icons-material'
import { Sparkles } from 'lucide-react'
import { getCopy, type CopyMode } from '../lib/copy/copy-service'
import { isModuleDisabled } from '../lib/security/disabled-modules'

interface NavigationProps {
  onOpenWhatsNew?: () => void
  hasWhatsNew?: boolean
}

export default function Navigation({ onOpenWhatsNew, hasWhatsNew = false }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const mode: CopyMode = 'beginner'
  const navigationItems = [
    { path: '/', labelKey: 'nav.home', icon: <ShowChart /> },
    { path: '/daytrading', labelKey: 'nav.day_trading', icon: <TrendingUp />, moduleId: 'indicators' },
    { path: '/options', labelKey: 'nav.options', icon: <Timeline />, moduleId: 'options' },
    { path: '/portfolio', labelKey: 'nav.portfolio', icon: <AccountBalance /> },
    { path: '/admin/site-config', labelKey: 'nav.admin', icon: <AdminPanelSettings /> },
  ]

  const visibleItems = navigationItems.filter((item) => !item.moduleId || !isModuleDisabled(item.moduleId))

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {getCopy('nav.brand', mode)}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {visibleItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => router.push(item.path)}
              variant={pathname === item.path ? 'outlined' : 'text'}
              sx={{ 
                borderColor: pathname === item.path ? 'white' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {getCopy(item.labelKey, mode)}
            </Button>
          ))}
          {onOpenWhatsNew && (
            hasWhatsNew ? (
              <Badge
                color="secondary"
                variant="dot"
                overlap="circular"
                sx={{ '& .MuiBadge-badge': { top: 4, right: 4 } }}
              >
                <Button
                  color="inherit"
                  startIcon={<Sparkles size={16} />}
                  onClick={onOpenWhatsNew}
                  variant="text"
                >
                  What&apos;s new
                </Button>
              </Badge>
            ) : (
              <Button
                color="inherit"
                startIcon={<Sparkles size={16} />}
                onClick={onOpenWhatsNew}
                variant="text"
              >
                What&apos;s new
              </Button>
            )
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
