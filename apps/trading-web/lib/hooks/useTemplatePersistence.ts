/**
 * Template Persistence Hooks
 * Phase 4: Expert Surfaces
 * Manages saving, loading, and syncing user templates for indicators and charts
 */

import { useState, useEffect, useCallback } from 'react'

export interface UserTemplate<T> {
  id: string
  name: string
  data: T
  createdAt: string
  updatedAt: string
  userId?: string
}

export interface TemplateStorageOptions {
  storageKey: string
  syncToBackend?: boolean
  maxTemplates?: number
}

/**
 * Hook for persisting user templates (indicators, chart layouts, etc.)
 */
export function useTemplatePersistence<T>(
  options: TemplateStorageOptions
) {
  const { storageKey, syncToBackend = false, maxTemplates = 20 } = options

  const [templates, setTemplates] = useState<UserTemplate<T>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load templates from localStorage on mount
  useEffect(() => {
    loadTemplates()
  }, [storageKey])

  const loadTemplates = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        setTemplates(parsed)
      }
      setIsLoading(false)
    } catch (err) {
      setError('Failed to load templates')
      setIsLoading(false)
    }
  }, [storageKey])

  const saveToStorage = useCallback(
    (newTemplates: UserTemplate<T>[]) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newTemplates))
        if (syncToBackend) {
          // TODO: Sync to backend API
          syncToBackendAPI(newTemplates)
        }
      } catch (err) {
        setError('Failed to save templates')
      }
    },
    [storageKey, syncToBackend]
  )

  const saveTemplate = useCallback(
    (name: string, data: T): UserTemplate<T> => {
      const newTemplate: UserTemplate<T> = {
        id: `template-${Date.now()}`,
        name,
        data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setTemplates(prev => {
        const updated = [...prev, newTemplate]
        // Enforce max templates limit
        const trimmed = updated.slice(-maxTemplates)
        saveToStorage(trimmed)
        return trimmed
      })

      return newTemplate
    },
    [maxTemplates, saveToStorage]
  )

  const updateTemplate = useCallback(
    (id: string, updates: Partial<UserTemplate<T>>) => {
      setTemplates(prev => {
        const updated = prev.map(template =>
          template.id === id
            ? {
                ...template,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : template
        )
        saveToStorage(updated)
        return updated
      })
    },
    [saveToStorage]
  )

  const deleteTemplate = useCallback(
    (id: string) => {
      setTemplates(prev => {
        const updated = prev.filter(template => template.id !== id)
        saveToStorage(updated)
        return updated
      })
    },
    [saveToStorage]
  )

  const getTemplate = useCallback(
    (id: string): UserTemplate<T> | undefined => {
      return templates.find(template => template.id === id)
    },
    [templates]
  )

  const exportTemplate = useCallback((template: UserTemplate<T>) => {
    const dataStr = JSON.stringify(template, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${template.name}-template.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [])

  const importTemplate = useCallback(
    (file: File): Promise<UserTemplate<T>> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const imported = JSON.parse(e.target?.result as string)
            const newTemplate: UserTemplate<T> = {
              ...imported,
              id: `template-${Date.now()}`, // Generate new ID
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }

            setTemplates(prev => {
              const updated = [...prev, newTemplate]
              const trimmed = updated.slice(-maxTemplates)
              saveToStorage(trimmed)
              return trimmed
            })

            resolve(newTemplate)
          } catch (err) {
            reject(new Error('Invalid template file'))
          }
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsText(file)
      })
    },
    [maxTemplates, saveToStorage]
  )

  const clearAllTemplates = useCallback(() => {
    setTemplates([])
    localStorage.removeItem(storageKey)
    if (syncToBackend) {
      // TODO: Clear from backend
    }
  }, [storageKey, syncToBackend])

  return {
    templates,
    isLoading,
    error,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    exportTemplate,
    importTemplate,
    clearAllTemplates,
    refreshTemplates: loadTemplates,
  }
}

/**
 * Sync templates to backend API (placeholder)
 */
async function syncToBackendAPI<T>(templates: UserTemplate<T>[]) {
  // TODO: Implement backend sync
  // POST /api/user/templates
  console.log('[Template Sync] Would sync to backend:', templates.length, 'templates')
}

/**
 * Hook specifically for indicator templates
 */
export function useIndicatorTemplates() {
  return useTemplatePersistence<any>({
    storageKey: 'expert-indicator-templates',
    syncToBackend: true,
    maxTemplates: 20,
  })
}

/**
 * Hook specifically for chart layout templates
 */
export function useChartLayoutTemplates() {
  return useTemplatePersistence<any>({
    storageKey: 'expert-chart-layouts',
    syncToBackend: true,
    maxTemplates: 15,
  })
}
