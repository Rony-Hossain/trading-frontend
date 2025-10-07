'use client'

import { ReactNode } from 'react'
import { getCopy, type CopyMode } from '@/lib/copy/copy-service'
import { isModuleDisabled } from '@/lib/security/disabled-modules'

interface ModuleGuardProps {
  moduleId: string
  mode?: CopyMode
  children: ReactNode
}

export function ModuleGuard({ moduleId, mode = 'beginner', children }: ModuleGuardProps) {
  if (isModuleDisabled(moduleId)) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-3 px-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {getCopy('module.disabled.title', mode)}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {getCopy('module.disabled.body', mode)}
        </p>
      </div>
    )
  }

  return <>{children}</>
}

export default ModuleGuard
