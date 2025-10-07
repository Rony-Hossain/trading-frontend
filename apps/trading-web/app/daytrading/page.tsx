"use client"

import DayTradingDashboard from '../../components/daytrading/DayTradingDashboard'
import ModuleGuard from '@/components/security/ModuleGuard'

export default function DayTradingPage() {
  return (
    <ModuleGuard moduleId="indicators" mode="expert">
      <DayTradingDashboard defaultSymbol="AAPL" />
    </ModuleGuard>
  )
}
