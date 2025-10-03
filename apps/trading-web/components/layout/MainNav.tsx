/**
 * MainNav - Primary navigation component
 * Aligned with IA: /today, /portfolio, /alerts, /explore, /settings, /learn, /journal
 */

'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  TodayOutlined,
  AccountBalanceWalletOutlined,
  NotificationsOutlined,
  ExploreOutlined,
  SettingsOutlined,
  SchoolOutlined,
  BookOutlined,
  MenuIcon,
  Menu as MenuIconMUI,
} from '@mui/icons-material'
import { useState } from 'react'
import { getCopy } from '@/lib/copy/copy-service'

// Navigation items aligned with Phase 1 requirements
const navItems = [
  { path: '/today', label: 'Today', icon: TodayOutlined, shortcut: 'Alt+T' },
  {
    path: '/portfolio',
    label: 'Portfolio',
    icon: AccountBalanceWalletOutlined,
    shortcut: 'Alt+P',
  },
  { path: '/alerts', label: 'Alerts', icon: NotificationsOutlined, shortcut: 'Alt+A' },
  { path: '/journal', label: 'Journal', icon: BookOutlined },
  { path: '/explore', label: 'Explore', icon: ExploreOutlined },
  { path: '/learn', label: 'Learn', icon: SchoolOutlined },
]

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null)
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    setMobileMenuOpen(false)
  }

  const isActive = (path: string) => pathname === path

  // Desktop navigation
  const DesktopNav = (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, cursor: 'pointer', mr: 4 }}
          onClick={() => router.push('/today')}
        >
          Trading Platform
        </Typography>

        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                startIcon={<Icon />}
                variant={isActive(item.path) ? 'contained' : 'text'}
                color={isActive(item.path) ? 'primary' : 'inherit'}
                sx={{
                  textTransform: 'none',
                  fontWeight: isActive(item.path) ? 600 : 400,
                }}
                aria-label={`Navigate to ${item.label}`}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.label}
              </Button>
            )
          })}
        </Box>

        {/* Right side - Settings & Profile */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton
            onClick={() => handleNavigation('/settings')}
            aria-label="Settings"
            color={isActive('/settings') ? 'primary' : 'default'}
          >
            <SettingsOutlined />
          </IconButton>

          <IconButton onClick={handleProfileMenuOpen} aria-label="User menu">
            <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
          </IconButton>

          <Menu
            anchorEl={profileMenuAnchor}
            open={Boolean(profileMenuAnchor)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={() => router.push('/settings')}>Settings</MenuItem>
            <MenuItem onClick={() => router.push('/profile')}>Profile</MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )

  // Mobile navigation
  const MobileNav = (
    <>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIconMUI />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Trading Platform
          </Typography>

          <IconButton onClick={handleProfileMenuOpen} aria-label="User menu">
            <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250 }} role="navigation">
          <List>
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    selected={isActive(item.path)}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <ListItemIcon>
                      <Icon color={isActive(item.path) ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              )
            })}

            <ListItem disablePadding>
              <ListItemButton
                selected={isActive('/settings')}
                onClick={() => handleNavigation('/settings')}
              >
                <ListItemIcon>
                  <SettingsOutlined
                    color={isActive('/settings') ? 'primary' : 'inherit'}
                  />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  )

  return isMobile ? MobileNav : DesktopNav
}
