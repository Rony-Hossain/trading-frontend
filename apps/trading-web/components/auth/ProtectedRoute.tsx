'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { AuthPage } from './AuthPage'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  const renderLoading = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )

  if (!hydrated) return renderLoading()

  if (loading) return renderLoading()

  if (!isAuthenticated) {
    return <AuthPage />
  }

  return <>{children}</>
}
