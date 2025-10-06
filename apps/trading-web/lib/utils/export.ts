/**
 * Export utilities for CSV generation with timezone-correct timestamps
 * Phase 3: Portfolio & Journal
 */

import { JournalEntry } from '@/lib/types/contracts'
import { Position } from '@/lib/types/contracts'

/**
 * Convert data to CSV format
 */
function arrayToCSV(headers: string[], rows: string[][]): string {
  const escapeCsvValue = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }

  const csvHeaders = headers.map(escapeCsvValue).join(',')
  const csvRows = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n')

  return `${csvHeaders}\n${csvRows}`
}

/**
 * Format date with timezone information
 */
function formatTimestampWithTimezone(isoString: string): string {
  const date = new Date(isoString)

  // Get timezone offset
  const offset = -date.getTimezoneOffset()
  const offsetHours = Math.floor(Math.abs(offset) / 60)
  const offsetMinutes = Math.abs(offset) % 60
  const offsetSign = offset >= 0 ? '+' : '-'
  const timezone = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`

  // Format: YYYY-MM-DD HH:mm:ss UTC+XX:XX
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC${timezone}`
}

/**
 * Download CSV file
 */
function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Export journal entries to CSV
 */
export function exportJournalToCSV(entries: JournalEntry[], filename?: string): void {
  const headers = [
    'ID',
    'Timestamp',
    'Event Type',
    'Symbol',
    'Title',
    'Description',
    'Tags',
    'Action',
    'Shares',
    'Price',
    'P&L',
    'P&L %',
    'Reason',
    'Created By',
    'Notes',
  ]

  const rows = entries.map((entry) => [
    entry.id,
    formatTimestampWithTimezone(entry.timestamp),
    entry.event_type,
    entry.symbol || '',
    entry.title,
    entry.description,
    entry.tags.join('; '),
    entry.metadata?.action || '',
    entry.metadata?.shares?.toString() || '',
    entry.metadata?.price?.toString() || '',
    entry.metadata?.pnl?.toString() || '',
    entry.metadata?.pnl_pct?.toString() || '',
    entry.metadata?.reason || '',
    entry.created_by,
    entry.notes?.join('; ') || '',
  ])

  const csvContent = arrayToCSV(headers, rows)
  const defaultFilename = `journal-export-${new Date().toISOString().split('T')[0]}.csv`

  downloadCSV(filename || defaultFilename, csvContent)
}

/**
 * Export portfolio positions to CSV
 */
export function exportPortfolioToCSV(
  positions: Position[],
  metadata?: {
    totalValue: number
    cashAvailable: number
    totalPnL: number
    costBasis?: number
    dividendsYTD?: number
    realizedPnl?: number
    unrealizedPnl?: number
  },
  filename?: string
): void {
  const timestamp = formatTimestampWithTimezone(new Date().toISOString())

  // Portfolio summary rows
  const summaryRows: string[][] = []
  summaryRows.push(['Portfolio Export', timestamp])
  summaryRows.push([]) // Empty row

  if (metadata) {
    summaryRows.push(['Summary'])
    summaryRows.push(['Total Portfolio Value', metadata.totalValue.toFixed(2)])
    summaryRows.push(['Cash Available', metadata.cashAvailable.toFixed(2)])
    summaryRows.push(['Total P&L', metadata.totalPnL.toFixed(2)])

    if (metadata.costBasis !== undefined) {
      summaryRows.push(['Cost Basis', metadata.costBasis.toFixed(2)])
    }
    if (metadata.dividendsYTD !== undefined) {
      summaryRows.push(['Dividends YTD', metadata.dividendsYTD.toFixed(2)])
    }
    if (metadata.realizedPnl !== undefined) {
      summaryRows.push(['Realized P&L', metadata.realizedPnl.toFixed(2)])
    }
    if (metadata.unrealizedPnl !== undefined) {
      summaryRows.push(['Unrealized P&L', metadata.unrealizedPnl.toFixed(2)])
    }

    summaryRows.push([]) // Empty row
  }

  // Position headers
  const positionHeaders = [
    'Symbol',
    'Shares',
    'Entry Price',
    'Current Price',
    'P&L (USD)',
    'P&L (%)',
    'Safety Line',
    'Max Planned Loss (USD)',
    'Current Value',
    'Cost Basis',
    'Message',
  ]

  // Position rows
  const positionRows = positions.map((position) => [
    position.symbol,
    position.shares.toString(),
    position.entryPrice.toFixed(2),
    position.currentPrice.toFixed(2),
    position.pnlUsd.toFixed(2),
    position.pnlPct.toFixed(2),
    position.safetyLine.toFixed(2),
    position.maxPlannedLossUsd.toFixed(2),
    (position.currentPrice * position.shares).toFixed(2),
    (position.entryPrice * position.shares).toFixed(2),
    position.message,
  ])

  // Combine summary and positions
  const summaryCSV = summaryRows.map((row) => row.join(',')).join('\n')
  const positionsCSV = arrayToCSV(positionHeaders, positionRows)
  const csvContent = `${summaryCSV}\n\nPositions\n${positionsCSV}`

  const defaultFilename = `portfolio-export-${new Date().toISOString().split('T')[0]}.csv`

  downloadCSV(filename || defaultFilename, csvContent)
}

/**
 * Export combined journal and portfolio report
 */
export function exportCombinedReport(
  entries: JournalEntry[],
  positions: Position[],
  metadata?: Parameters<typeof exportPortfolioToCSV>[1],
  filename?: string
): void {
  // This could generate a more comprehensive report combining both datasets
  // For now, we'll export them separately with a timestamp
  const timestamp = new Date().toISOString().split('T')[0]

  exportJournalToCSV(entries, `journal-${timestamp}.csv`)
  exportPortfolioToCSV(positions, metadata, `portfolio-${timestamp}.csv`)
}
