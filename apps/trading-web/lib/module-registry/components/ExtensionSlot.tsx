/**
 * Extension Slot Component
 * Renders extensions registered for a given slot
 */

'use client'

import { Suspense, lazy } from 'react'
import type { ExtensionSlotProps } from '../types'
import { moduleRegistry } from '../registry'

export function ExtensionSlot({
  name,
  context = {},
  fallback = null,
}: ExtensionSlotProps) {
  const extensions = moduleRegistry.getExtensions(name)

  if (extensions.length === 0) {
    return <>{fallback}</>
  }

  return (
    <div className="extension-slot" data-slot={name}>
      {extensions.map((extension, index) => {
        // Check condition if provided
        if (extension.condition && !extension.condition(context)) {
          return null
        }

        // Lazy load component
        const Component = lazy(extension.component)

        return (
          <Suspense key={`${name}-${index}`} fallback={<div>Loading...</div>}>
            <Component {...context} />
          </Suspense>
        )
      })}
    </div>
  )
}
