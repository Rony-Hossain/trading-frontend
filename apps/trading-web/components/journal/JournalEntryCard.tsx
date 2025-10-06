'use client'

/**
 * JournalEntryCard - Single journal entry card
 * Phase 3: Portfolio & Journal
 */

import { JournalEntry } from '@/lib/types/contracts'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  Bell,
  Shield,
  Target,
  StickyNote,
  Clock,
  Tag,
  Lock,
  Edit3,
} from 'lucide-react'

interface JournalEntryCardProps {
  entry: JournalEntry
  onAddNote?: (entryId: string) => void
}

const EVENT_ICONS = {
  trade_executed: TrendingUp,
  alert_triggered: Bell,
  safety_adjusted: Shield,
  target_set: Target,
  manual_note: StickyNote,
  position_opened: TrendingUp,
  position_closed: TrendingDown,
}

const EVENT_COLORS = {
  trade_executed: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  alert_triggered: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  safety_adjusted: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  target_set: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  manual_note: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20',
  position_opened: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
  position_closed: 'text-red-600 bg-red-50 dark:bg-red-900/20',
}

export function JournalEntryCard({ entry, onAddNote }: JournalEntryCardProps) {
  const Icon = EVENT_ICONS[entry.event_type]
  const colorClass = EVENT_COLORS[entry.event_type]
  const date = new Date(entry.timestamp)
  const isProfitable = entry.metadata?.pnl ? entry.metadata.pnl >= 0 : null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${colorClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {entry.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <time dateTime={entry.timestamp}>
                {date.toLocaleDateString()} {date.toLocaleTimeString()}
              </time>
              {entry.symbol && (
                <>
                  <span>·</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {entry.symbol}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        {!entry.is_editable && (
          <div className="flex items-center gap-1 text-xs text-gray-500" title="Immutable entry">
            <Lock className="h-3 w-3" />
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{entry.description}</p>

      {/* Metadata */}
      {entry.metadata && (
        <div className="space-y-2 mb-3">
          {entry.metadata.action && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Action</span>
              <span
                className={`font-medium ${
                  entry.metadata.action === 'BUY'
                    ? 'text-green-600'
                    : entry.metadata.action === 'SELL'
                    ? 'text-red-600'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {entry.metadata.action}
              </span>
            </div>
          )}
          {entry.metadata.shares && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Shares</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {entry.metadata.shares}
              </span>
            </div>
          )}
          {entry.metadata.price && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Price</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(entry.metadata.price)}
              </span>
            </div>
          )}
          {entry.metadata.pnl !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">P&L</span>
              <div className="flex items-center gap-1">
                {isProfitable ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span
                  className={`font-medium ${
                    isProfitable ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isProfitable ? '+' : ''}
                  {formatCurrency(entry.metadata.pnl)}
                  {entry.metadata.pnl_pct !== undefined &&
                    ` (${formatPercentage(entry.metadata.pnl_pct)})`}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Tag className="h-3 w-3 text-gray-500" />
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Notes */}
      {entry.notes && entry.notes.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
          <h4 className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
            <StickyNote className="h-3 w-3" />
            Notes ({entry.notes.length})
          </h4>
          <div className="space-y-1">
            {entry.notes.map((note, index) => (
              <p key={index} className="text-xs text-gray-600 dark:text-gray-400 pl-4">
                • {note}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Add Note Button */}
      {onAddNote && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
          <button
            onClick={() => onAddNote(entry.id)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Edit3 className="h-3 w-3" />
            <span>Add Note</span>
          </button>
          {!entry.is_editable && (
            <p className="text-xs text-gray-500 mt-1">
              Notes are append-only and cannot modify the original entry
            </p>
          )}
        </div>
      )}
    </div>
  )
}
