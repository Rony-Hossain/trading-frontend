import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | undefined | null): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercentage(value: number | undefined | null): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A'
  }
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}

export function formatNumber(value: number | undefined | null): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A'
  }
  return new Intl.NumberFormat('en-US').format(value)
}

export function getSignalColor(signal: string): string {
  switch (signal?.toUpperCase()) {
    case 'BUY':
    case 'STRONG_BUY':
    case 'BULLISH':
    case 'UP':
    case 'HIGH_UP':
      return 'text-green-600'
    case 'SELL':
    case 'STRONG_SELL':
    case 'BEARISH':
    case 'DOWN':
    case 'LOW_DOWN':
      return 'text-red-600'
    case 'HOLD':
    case 'NEUTRAL':
    case 'SIDEWAYS':
    case 'LOW':
    case 'MEDIUM':
      return 'text-yellow-600'
    default:
      return 'text-gray-600'
  }
}

export function getTrendColor(trend: string): string {
  switch (trend?.toUpperCase()) {
    case 'STRONG_UPTREND':
    case 'UPTREND':
      return 'text-green-600'
    case 'STRONG_DOWNTREND':
    case 'DOWNTREND':
      return 'text-red-600'
    case 'SIDEWAYS':
      return 'text-yellow-600'
    default:
      return 'text-gray-600'
  }
}