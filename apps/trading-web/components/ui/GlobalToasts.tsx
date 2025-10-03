/**
 * GlobalToasts - Toast notification system
 * Uses MUI Snackbar with banner queue management
 */

'use client'

import { Snackbar, Alert, AlertTitle } from '@mui/material'
import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { BannerType, BannerConfig } from '@/lib/states/vocabulary'

interface Toast {
  id: string
  type: BannerType
  message: string
  title?: string
  duration?: number
}

interface ToastContextValue {
  showToast: (config: Omit<Toast, 'id'>) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function GlobalToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((config: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { ...config, id }])
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const handleClose = (id: string) => {
    hideToast(id)
  }

  // Map BannerType to MUI Alert severity
  const getSeverity = (type: BannerType) => {
    switch (type) {
      case 'success':
        return 'success'
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'degraded':
        return 'warning'
      case 'info':
      default:
        return 'info'
    }
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration || 6000}
          onClose={() => handleClose(toast.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            // Stack toasts vertically
            bottom: `${index * 70 + 24}px !important`,
          }}
        >
          <Alert
            onClose={() => handleClose(toast.id)}
            severity={getSeverity(toast.type)}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toast.title && <AlertTitle>{toast.title}</AlertTitle>}
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  )
}
