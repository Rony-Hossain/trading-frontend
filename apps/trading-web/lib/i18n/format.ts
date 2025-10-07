import { currentLocale } from './translate'

function ensureDate(input: Date | string | number): Date | null {
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input
  const date = new Date(input)
  return isNaN(date.getTime()) ? null : date
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  if (isNaN(value)) return '--'
  return new Intl.NumberFormat(currentLocale(), options).format(value)
}

export function formatCurrency(
  value: number,
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions
): string {
  if (isNaN(value)) return '--'
  return new Intl.NumberFormat(currentLocale(), {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value)
}

export function formatPercent(value: number, options?: Intl.NumberFormatOptions): string {
  if (isNaN(value)) return '--'
  return new Intl.NumberFormat(currentLocale(), {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value)
}

export function formatDate(input: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
  const date = ensureDate(input)
  if (!date) return '--'
  return new Intl.DateTimeFormat(currentLocale(), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date)
}

export function formatTime(input: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
  const date = ensureDate(input)
  if (!date) return '--'
  return new Intl.DateTimeFormat(currentLocale(), {
    hour: '2-digit',
    minute: '2-digit',
    second: undefined,
    hour12: false,
    ...options,
  }).format(date)
}
