"use client"

import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useRouter, usePathname } from 'next/navigation'
import { TrendingUp, Timeline, AccountBalance, ShowChart } from '@mui/icons-material'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navigationItems = [
    { path: '/', label: 'Home', icon: <ShowChart /> },
    { path: '/daytrading', label: 'Day Trading', icon: <TrendingUp /> },
    { path: '/options', label: 'Options Trading', icon: <Timeline /> },
    { path: '/portfolio', label: 'Portfolio', icon: <AccountBalance /> },
  ]

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Trading Platform
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navigationItems.map((item) => (
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
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}