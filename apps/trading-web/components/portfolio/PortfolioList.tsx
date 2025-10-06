'use client'

/**
 * PortfolioList - Displays list of portfolio positions
 * Phase 3: Portfolio & Journal
 */

import { Position } from '@/lib/types/contracts'
import { PortfolioRow } from './PortfolioRow'
import { Loader2 } from 'lucide-react'

interface PortfolioListProps {
  positions: Position[]
  loading?: boolean
  onSelectPosition: (symbol: string) => void
}

export function PortfolioList({
  positions,
  loading = false,
  onSelectPosition,
}: PortfolioListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading positions...</span>
      </div>
    )
  }

  if (positions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No positions found</p>
        <p className="text-sm text-gray-500 mt-2">
          Your positions will appear here once you start trading
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {positions.map((position) => (
        <PortfolioRow
          key={position.symbol}
          position={position}
          onSelect={onSelectPosition}
        />
      ))}
    </div>
  )
}
