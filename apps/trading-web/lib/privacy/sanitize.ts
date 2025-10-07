const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const ACCOUNT_ID_REGEX = /(acct|account|user|id)=([A-Za-z0-9_-]+)/gi

export function redact(value: string): string {
  if (!value) return value
  return value.replace(EMAIL_REGEX, '[redacted-email]').replace(ACCOUNT_ID_REGEX, '$1=[redacted]')
}

export function sanitizeTelemetryPayload<T extends Record<string, unknown>>(payload: T): T {
  const clone: Record<string, unknown> = {}
  Object.entries(payload).forEach(([key, val]) => {
    if (typeof val === 'string') {
      clone[key] = redact(val)
    } else if (Array.isArray(val)) {
      clone[key] = val.map((item) => (typeof item === 'string' ? redact(item) : item))
    } else if (val && typeof val === 'object') {
      clone[key] = sanitizeTelemetryPayload(val as Record<string, unknown>)
    } else {
      clone[key] = val
    }
  })
  return clone as T
}
