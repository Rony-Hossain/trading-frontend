const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_LOCALE?.trim() || 'en-US'

let activeLocale = DEFAULT_LOCALE
let localeInitialized = false

export function getActiveLocale(): string {
  if (!localeInitialized && typeof window !== 'undefined') {
    const runtimeLocale =
      (window as any).__LOCALE__ ||
      window.localStorage?.getItem('app.locale') ||
      (process.env.NEXT_PUBLIC_LOCALE ? null : navigator.language)

    if (runtimeLocale) {
      activeLocale = runtimeLocale
    }

    localeInitialized = true
  }

  return activeLocale
}

export function setActiveLocale(locale: string) {
  activeLocale = locale
  localeInitialized = true
  if (typeof window !== 'undefined') {
    try {
      window.localStorage?.setItem('app.locale', locale)
    } catch {
      // Ignore storage errors (private mode, etc.)
    }
  }
}

export function resetActiveLocale() {
  localeInitialized = false
  activeLocale = DEFAULT_LOCALE
}

export function isPseudoLocale(locale: string = getActiveLocale()): boolean {
  const normalized = locale.toLowerCase()
  if (process.env.NEXT_PUBLIC_ENABLE_PSEUDO_LOCALE === 'true') {
    return true
  }
  return normalized === 'en-xa' || normalized === 'pseudo'
}
