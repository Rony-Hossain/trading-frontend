'use client'

import { Dashboard } from '../components/Dashboard'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'

export default function Home() {
  return (
    <ProtectedRoute>
      <Dashboard defaultSymbol="AAPL" />
    </ProtectedRoute>
  )
}
