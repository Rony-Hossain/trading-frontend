const disabledEnv =
  process.env.NEXT_PUBLIC_DISABLED_MODULES?.split(',').map((value) => value.trim()) || []

const disabledSet = new Set(disabledEnv.filter(Boolean))

export function isModuleDisabled(moduleId: string): boolean {
  return disabledSet.has(moduleId)
}

export function getDisabledModules(): string[] {
  return Array.from(disabledSet)
}
