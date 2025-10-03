'use client'

/**
 * Sidebar Navigation Component
 */
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Chip,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  ShowChart as ChartIcon,
  AccountBalance as PortfolioIcon,
  Notifications as AlertsIcon,
  Book as JournalIcon,
  Settings as SettingsIcon,
  TrendingUp as SignalsIcon,
  BarChart as AnalyticsIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const DRAWER_WIDTH = 240

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <DashboardIcon />,
  },
  {
    label: 'Charts',
    href: '/charts',
    icon: <ChartIcon />,
  },
  {
    label: 'Portfolio',
    href: '/portfolio',
    icon: <PortfolioIcon />,
  },
  {
    label: 'Signals',
    href: '/signals',
    icon: <SignalsIcon />,
    badge: 5,
  },
  {
    label: 'Alerts',
    href: '/alerts',
    icon: <AlertsIcon />,
    badge: 3,
  },
  {
    label: 'Journal',
    href: '/journal',
    icon: <JournalIcon />,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <AnalyticsIcon />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <SettingsIcon />,
  },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
  variant?: 'permanent' | 'temporary'
}

export function Sidebar({ open, onClose, variant = 'permanent' }: SidebarProps) {
  const pathname = usePathname()

  const drawerContent = (
    <>
      <Toolbar />
      <Box sx={{ overflow: 'auto', pt: 2 }}>
        <List>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <ListItem key={item.href} disablePadding sx={{ px: 1 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? 'inherit' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <Chip
                      label={item.badge}
                      size="small"
                      color="error"
                      sx={{ height: 20, minWidth: 20 }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Box>
    </>
  )

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}
