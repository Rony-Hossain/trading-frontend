'use client'

/*
 * Disabled Module Stub
 * Provides a safe placeholder for modules removed via build profiles.
 */

const handler: ProxyHandler<any> = {
  get(_target, prop) {
    if (prop === '__esModule') return true
    if (prop === 'default') {
      return () => null
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Module Disabled] Attempted to access export "${String(prop)}" from a disabled module.`)
    }

    return () => null
  },
  apply() {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Module Disabled] Attempted to invoke a disabled module export.')
    }
    return null
  },
}

const disabledModule = new Proxy(() => null, handler)

export default disabledModule
