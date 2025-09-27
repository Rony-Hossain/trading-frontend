"use client"

import { MaterialDashboard } from '../components/material/MaterialDashboard'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'

export default function Home() {
  return (
    <ProtectedRoute>
      <MaterialDashboard defaultSymbol="AAPL" />
    </ProtectedRoute>
  )
}
