"use client"

import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f7f9fc',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { borderBottom: '1px solid rgba(0,0,0,0.08)' },
      },
    },
  },
})

export default theme

