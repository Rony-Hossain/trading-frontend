import { currentLocale } from './translate'

function ensureDate(input: Date | string | number): Date | null {
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input
  const date = new Date(input)
  return isNaN(date.getTime()) ? null : date
}

const FRACTION_DIGIT_MIN = 0
const FRACTION_DIGIT_MAX = 20

function toFiniteInteger(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return undefined
  return Math.trunc(parsed)
}

function sanitizeFractionDigits(
  options: Intl.NumberFormatOptions | undefined,
  defaults: { min: number; max: number }
): { min: number; max: number } {
  const rawMax = toFiniteInteger(options?.maximumFractionDigits)
  const rawMin = toFiniteInteger(options?.minimumFractionDigits)

  let max = rawMax ?? defaults.max
  max = Math.min(FRACTION_DIGIT_MAX, Math.max(FRACTION_DIGIT_MIN, max))

  let min: number
  if (rawMin !== undefined) {
    min = Math.min(FRACTION_DIGIT_MAX, Math.max(FRACTION_DIGIT_MIN, rawMin))
  } else if (rawMax !== undefined) {
    min = Math.min(defaults.min, max)
  } else {
    min = defaults.min
  }

  min = Math.min(FRACTION_DIGIT_MAX, Math.max(FRACTION_DIGIT_MIN, min))

  if (min > max) {
    min = max
  }

  if (max < min) {
    max = min
  }

  return { min, max }
}

function stripFractionDigitOptions(
  options?: Intl.NumberFormatOptions
): Intl.NumberFormatOptions | undefined {
  if (!options) return undefined
  const next: Intl.NumberFormatOptions = { ...options }
  delete next.minimumFractionDigits
  delete next.maximumFractionDigits
  return next
}

function safeNumberFormat(
  base: Intl.NumberFormatOptions,
  options?: Intl.NumberFormatOptions,
  fractionDefaults: { min: number; max: number } = { min: 2, max: 2 }
): Intl.NumberFormatOptions {
  const { min, max } = sanitizeFractionDigits(options, fractionDefaults)
  return {
    ...base,
    ...stripFractionDigitOptions(options),
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  }
}

function getLocale(): string {
  try {
    return currentLocale()
  } catch {
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language
    }
    return 'en-US'
  }
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  if (!Number.isFinite(value)) return '--'
  return new Intl.NumberFormat(getLocale(), options).format(value)
}

export function formatCurrency(
  value: number,
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions
): string {
  if (!Number.isFinite(value)) return '--'

  const formatterOptions = safeNumberFormat(
    {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
    },
    options,
    { min: 2, max: 2 }
  )

  try {
    return new Intl.NumberFormat(getLocale(), formatterOptions).format(value)
  } catch {
    const digits = Math.min(
      FRACTION_DIGIT_MAX,
      Math.max(FRACTION_DIGIT_MIN, formatterOptions.maximumFractionDigits ?? 2)
    )
    return `${currency} ${value.toFixed(digits)}`
  }
}

export function formatPercent(value: number, options?: Intl.NumberFormatOptions): string {
  if (!Number.isFinite(value)) return '--'

  const formatterOptions = safeNumberFormat(
    {
      style: 'percent',
    },
    options,
    { min: 2, max: 2 }
  )

  return new Intl.NumberFormat(getLocale(), formatterOptions).format(value)
}

export function formatDate(input: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
  const date = ensureDate(input)
  if (!date) return '--'
  return new Intl.DateTimeFormat(getLocale(), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date)
}

export function formatTime(input: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
  const date = ensureDate(input)
  if (!date) return '--'
  return new Intl.DateTimeFormat(getLocale(), {
    hour: '2-digit',
    minute: '2-digit',
    second: undefined,
    hour12: false,
    ...options,
  }).format(date)
}
