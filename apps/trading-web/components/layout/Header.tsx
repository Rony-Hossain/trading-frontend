'use client'

/**
 * Main Header Component
 * Displays navigation, search, notifications, and user menu
 */
import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Tooltip,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle,
  Brightness4,
  Brightness7,
  Dashboard as DashboardIcon,
} from '@mui/icons-material'
import { useUserStore } from '@/lib/stores/userStore'
import Link from 'next/link'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const {
    user,
    preferences,
    setThemeMode,
    toggleDashboardMode,
  } = useUserStore()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null)

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchor(event.currentTarget)
  }

  const handleNotifClose = () => {
    setNotifAnchor(null)
  }

  const handleThemeToggle = () => {
    const newMode = preferences.themeMode === 'dark' ? 'light' : 'dark'
    setThemeMode(newMode)
  }

  const isDark = preferences.themeMode === 'dark'

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Menu Button */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo & Title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Trading Platform
        </Typography>

        {/* Dashboard Mode Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 'auto' }}>
          <Tooltip title="Toggle Dashboard Mode">
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.dashboardMode === 'expert'}
                  onChange={toggleDashboardMode}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <DashboardIcon fontSize="small" />
                  <Typography variant="body2">
                    {preferences.dashboardMode === 'expert' ? 'Expert' : 'Beginner'}
                  </Typography>
                </Box>
              }
            />
          </Tooltip>
        </Box>

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <Tooltip title="Toggle Theme">
            <IconButton color="inherit" onClick={handleThemeToggle}>
              {isDark ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotifOpen}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton color="inherit" component={Link} href="/settings">
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title="Account">
            <IconButton color="inherit" onClick={handleUserMenuOpen}>
              {user ? (
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  alt={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={handleNotifClose}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Notifications</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleNotifClose}>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                AAPL Signal: Buy
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Strong momentum detected - 2 minutes ago
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotifClose}>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Order Filled
              </Typography>
              <Typography variant="caption" color="text.secondary">
                TSLA 100 shares @ $242.50 - 5 minutes ago
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotifClose}>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Price Alert
              </Typography>
              <Typography variant="caption" color="text.secondary">
                MSFT reached $380.00 - 15 minutes ago
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleNotifClose}>
            <Typography variant="body2" color="primary" align="center" width="100%">
              View All Notifications
            </Typography>
          </MenuItem>
        </Menu>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleUserMenuClose}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">{user?.name || 'Guest'}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || 'Not logged in'}
            </Typography>
          </Box>
          <Divider />
          <MenuItem component={Link} href="/profile" onClick={handleUserMenuClose}>
            Profile
          </MenuItem>
          <MenuItem component={Link} href="/settings" onClick={handleUserMenuClose}>
            Settings
          </MenuItem>
          <MenuItem component={Link} href="/journal" onClick={handleUserMenuClose}>
            Trade Journal
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleUserMenuClose}>
            <Typography color="error">Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
