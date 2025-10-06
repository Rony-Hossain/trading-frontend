'use client'

/**
 * ExpertModuleToggles - Enable/disable expert modules (Indicators, Options, Diagnostics)
 * Phase 4: Expert Surfaces
 */

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  BarChart3,
  Activity,
  ChevronDown,
  Info,
  Lock,
  AlertTriangle
} from 'lucide-react'
import { trackEvent, TelemetryCategory } from '@/lib/telemetry/taxonomy'

interface ExpertModuleConfig {
  id: 'indicators' | 'options' | 'diagnostics'
  name: string
  description: string
  icon: typeof TrendingUp
  enabled: boolean
  requiresPermission?: boolean
  jurisdictionRestricted?: boolean
  betaFeature?: boolean
}

interface ExpertModuleTogglesProps {
  mode: 'beginner' | 'expert'
  enabledModules?: Record<string, boolean>
  onModuleToggle?: (moduleId: string, enabled: boolean) => void
  jurisdictionCode?: string // e.g., 'US', 'EU', 'APAC'
}

export function ExpertModuleToggles({
  mode,
  enabledModules = {},
  onModuleToggle,
  jurisdictionCode = 'US'
}: ExpertModuleTogglesProps) {
  const baseModules: ExpertModuleConfig[] = [
    {
      id: 'indicators',
      name: 'Technical Indicators',
      description: 'RSI, MACD, Bollinger Bands, custom indicator sets with templates',
      icon: TrendingUp,
      enabled: enabledModules.indicators ?? false,
      betaFeature: false,
    },
    {
      id: 'options',
      name: 'Options Trading',
      description: 'Options chains, Greeks analysis, strategy builder',
      icon: BarChart3,
      enabled: enabledModules.options ?? false,
      requiresPermission: true,
      jurisdictionRestricted: jurisdictionCode !== 'US', // Example: only US for now
    },
    {
      id: 'diagnostics',
      name: 'Model Diagnostics',
      description: 'Confidence scores, drift detection, driver analysis, regime hints',
      icon: Activity,
      enabled: enabledModules.diagnostics ?? false,
      betaFeature: true,
    },
  ]

  const [modules, setModules] = useState<ExpertModuleConfig[]>(baseModules)

  // Update internal state when enabledModules prop changes
  useEffect(() => {
    setModules(baseModules)
  }, [enabledModules])

  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  const handleToggle = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId)
    if (!module) return

    // Check if module can be toggled
    if (module.jurisdictionRestricted) {
      return // Don't allow toggle if restricted
    }

    const newEnabled = !module.enabled

    setModules(prev =>
      prev.map(m =>
        m.id === moduleId ? { ...m, enabled: newEnabled } : m
      )
    )

    // Track toggle event
    trackEvent({
      category: TelemetryCategory.SETTINGS,
      action: 'setting_changed',
      setting_key: `expert_module_${moduleId}`,
      old_value: module.enabled,
      new_value: newEnabled,
    })

    onModuleToggle?.(moduleId, newEnabled)
  }

  // Expert mode is required
  if (mode !== 'expert') {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Expert Modules Locked
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Switch to Expert mode above to access advanced features like technical indicators,
              options trading, and model diagnostics.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-900 dark:text-blue-200">
          Expert modules provide advanced features. Enable only what you need to keep your
          interface focused and performant.
        </p>
      </div>

      {/* Module List */}
      <div className="space-y-3">
        {modules.map((module) => {
          const Icon = module.icon
          const isExpanded = expandedModule === module.id
          const isRestricted = module.jurisdictionRestricted
          const requiresPerm = module.requiresPermission

          return (
            <div
              key={module.id}
              className={`border rounded-lg transition-all ${
                module.enabled
                  ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              } ${isRestricted ? 'opacity-60' : ''}`}
            >
              {/* Module Header */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        module.enabled
                          ? 'bg-blue-100 dark:bg-blue-800'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          module.enabled
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {module.name}
                        </h3>
                        {module.betaFeature && (
                          <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                            Beta
                          </span>
                        )}
                        {isRestricted && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                            Restricted
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {module.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={() => handleToggle(module.id)}
                      disabled={isRestricted}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        module.enabled
                          ? 'bg-blue-600'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                      role="switch"
                      aria-checked={module.enabled}
                      aria-label={`Toggle ${module.name}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          module.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() =>
                        setExpandedModule(isExpanded ? null : module.id)
                      }
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      aria-label="More info"
                    >
                      <ChevronDown
                        className={`h-4 w-4 text-gray-600 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Jurisdiction Warning */}
                {isRestricted && (
                  <div className="flex items-start gap-2 mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
                    <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900 dark:text-amber-200">
                      This module is not available in your jurisdiction ({jurisdictionCode}).
                      Contact support for more information.
                    </p>
                  </div>
                )}

                {/* Permission Notice */}
                {requiresPerm && !isRestricted && (
                  <div className="flex items-start gap-2 mt-3 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
                    <Lock className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      Requires additional account verification and permissions.
                    </p>
                  </div>
                )}
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                  <div className="mt-3 space-y-2">
                    <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Features:
                    </h4>
                    {module.id === 'indicators' && (
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                        <li>• 50+ technical indicators</li>
                        <li>• Custom indicator templates</li>
                        <li>• Multi-chart layouts</li>
                        <li>• Indicator-on-indicator validation</li>
                      </ul>
                    )}
                    {module.id === 'options' && (
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                        <li>• Real-time options chains</li>
                        <li>• Greeks analysis (Delta, Gamma, Theta, Vega)</li>
                        <li>• Options strategy builder</li>
                        <li>• Profit/loss scenarios</li>
                      </ul>
                    )}
                    {module.id === 'diagnostics' && (
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                        <li>• Model confidence scores</li>
                        <li>• Drift detection alerts</li>
                        <li>• Top driver analysis</li>
                        <li>• Market regime indicators</li>
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
