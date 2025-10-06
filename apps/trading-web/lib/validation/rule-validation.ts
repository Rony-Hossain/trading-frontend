/**
 * Rule Validation & Conflict Detection
 * Phase 5: Rules Engine & Advanced Alerts
 */

import type { RuleGroup, RuleCondition, RuleOperator } from '@/lib/types/contracts'

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  conflicts: string[]
}

/**
 * Validate a complete rule group
 */
export function validateRuleGroup(group: RuleGroup, maxNesting = 3, currentDepth = 0): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    conflicts: [],
  }

  // Check nesting depth
  if (currentDepth > maxNesting) {
    result.valid = false
    result.errors.push(`Maximum nesting depth of ${maxNesting} exceeded`)
    return result
  }

  // Validate each condition
  group.conditions.forEach((condition, index) => {
    const conditionResult = validateCondition(condition)
    if (!conditionResult.valid) {
      result.valid = false
      result.errors.push(`Condition ${index + 1}: ${conditionResult.errors.join(', ')}`)
    }
    result.warnings.push(...conditionResult.warnings)
  })

  // Check for conflicts within the group
  if (group.logic === 'AND') {
    const andConflicts = detectAndConflicts(group.conditions)
    result.conflicts.push(...andConflicts)
    if (andConflicts.length > 0) {
      result.valid = false
    }
  }

  // Recursively validate nested groups
  if (group.groups) {
    group.groups.forEach((nestedGroup, index) => {
      const nestedResult = validateRuleGroup(nestedGroup, maxNesting, currentDepth + 1)
      if (!nestedResult.valid) {
        result.valid = false
        result.errors.push(`Nested group ${index + 1}: ${nestedResult.errors.join(', ')}`)
      }
      result.warnings.push(...nestedResult.warnings)
      result.conflicts.push(...nestedResult.conflicts)
    })
  }

  // Check for empty groups
  if (group.conditions.length === 0 && (!group.groups || group.groups.length === 0)) {
    result.valid = false
    result.errors.push('Group must contain at least one condition or nested group')
  }

  return result
}

/**
 * Validate a single condition
 */
export function validateCondition(condition: RuleCondition): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    conflicts: [],
  }

  // Check required fields
  if (!condition.type) {
    result.valid = false
    result.errors.push('Condition type is required')
  }

  if (!condition.field) {
    result.valid = false
    result.errors.push('Field is required')
  }

  if (!condition.operator) {
    result.valid = false
    result.errors.push('Operator is required')
  }

  if (condition.value === undefined || condition.value === null) {
    result.valid = false
    result.errors.push('Value is required')
  }

  // Validate value ranges based on field
  if (condition.field === 'RSI') {
    if (typeof condition.value === 'number') {
      if (condition.value < 0 || condition.value > 100) {
        result.valid = false
        result.errors.push('RSI value must be between 0 and 100')
      }
      if (condition.value2 !== undefined && (condition.value2 < 0 || condition.value2 > 100)) {
        result.valid = false
        result.errors.push('RSI value2 must be between 0 and 100')
      }
    }
  }

  if (condition.field === 'volume_ratio') {
    if (typeof condition.value === 'number' && condition.value < 0) {
      result.valid = false
      result.errors.push('Volume ratio cannot be negative')
    }
  }

  if (condition.field.includes('price') || condition.field === 'current_price') {
    if (typeof condition.value === 'number' && condition.value < 0) {
      result.valid = false
      result.errors.push('Price cannot be negative')
    }
  }

  // Validate 'between' operator
  if (condition.operator === 'between') {
    if (condition.value2 === undefined || condition.value2 === null) {
      result.valid = false
      result.errors.push('Between operator requires two values')
    } else if (typeof condition.value === 'number' && typeof condition.value2 === 'number') {
      if (condition.value >= condition.value2) {
        result.valid = false
        result.errors.push('First value must be less than second value for between operator')
      }
    }
  }

  // Warnings for edge cases
  if (condition.field === 'RSI' && typeof condition.value === 'number') {
    if (condition.operator === 'greater_than' && condition.value > 90) {
      result.warnings.push(`RSI > ${condition.value} is extremely rare and may never trigger`)
    }
    if (condition.operator === 'less_than' && condition.value < 10) {
      result.warnings.push(`RSI < ${condition.value} is extremely rare and may never trigger`)
    }
  }

  if (condition.field === 'volume_ratio' && typeof condition.value === 'number') {
    if (condition.value > 5) {
      result.warnings.push(`Volume ratio > ${condition.value} is very rare and may not trigger often`)
    }
  }

  return result
}

/**
 * Detect conflicts in AND groups (mutually exclusive conditions)
 */
export function detectAndConflicts(conditions: RuleCondition[]): string[] {
  const conflicts: string[] = []

  // Group conditions by field
  const conditionsByField = new Map<string, RuleCondition[]>()
  conditions.forEach((condition) => {
    const existing = conditionsByField.get(condition.field) || []
    existing.push(condition)
    conditionsByField.set(condition.field, existing)
  })

  // Check each field for conflicting conditions
  conditionsByField.forEach((fieldConditions, field) => {
    if (fieldConditions.length < 2) return

    // Check for impossible combinations
    for (let i = 0; i < fieldConditions.length; i++) {
      for (let j = i + 1; j < fieldConditions.length; j++) {
        const conflict = detectConditionConflict(fieldConditions[i], fieldConditions[j])
        if (conflict) {
          conflicts.push(conflict)
        }
      }
    }
  })

  return conflicts
}

/**
 * Detect conflict between two conditions on the same field
 */
function detectConditionConflict(cond1: RuleCondition, cond2: RuleCondition): string | null {
  if (cond1.field !== cond2.field) return null

  const val1 = typeof cond1.value === 'number' ? cond1.value : 0
  const val2 = typeof cond2.value === 'number' ? cond2.value : 0

  // Greater than conflicts
  if (cond1.operator === 'greater_than' && cond2.operator === 'less_than') {
    if (val1 >= val2) {
      return `${cond1.field} cannot be both > ${val1} AND < ${val2} (impossible)`
    }
  }

  if (cond1.operator === 'less_than' && cond2.operator === 'greater_than') {
    if (val1 <= val2) {
      return `${cond1.field} cannot be both < ${val1} AND > ${val2} (impossible)`
    }
  }

  // Equals conflicts
  if (cond1.operator === 'equals' && cond2.operator === 'equals') {
    if (val1 !== val2) {
      return `${cond1.field} cannot equal both ${val1} and ${val2} (impossible)`
    }
  }

  if (cond1.operator === 'equals' && cond2.operator === 'greater_than') {
    if (val1 <= val2) {
      return `${cond1.field} = ${val1} conflicts with ${cond1.field} > ${val2} (impossible)`
    }
  }

  if (cond1.operator === 'equals' && cond2.operator === 'less_than') {
    if (val1 >= val2) {
      return `${cond1.field} = ${val1} conflicts with ${cond1.field} < ${val2} (impossible)`
    }
  }

  // Between conflicts
  if (cond1.operator === 'between' && cond2.operator === 'greater_than') {
    const val1Max = typeof cond1.value2 === 'number' ? cond1.value2 : val1
    if (val2 >= val1Max) {
      return `${cond1.field} between ${val1}-${val1Max} conflicts with ${cond1.field} > ${val2} (impossible)`
    }
  }

  if (cond1.operator === 'between' && cond2.operator === 'less_than') {
    if (val2 <= val1) {
      return `${cond1.field} between ${val1}-${cond1.value2} conflicts with ${cond1.field} < ${val2} (impossible)`
    }
  }

  return null
}

/**
 * Count total conditions in a rule group (including nested)
 */
export function countConditions(group: RuleGroup): number {
  let count = group.conditions.length
  if (group.groups) {
    count += group.groups.reduce((sum, g) => sum + countConditions(g), 0)
  }
  return count
}

/**
 * Get all unique fields used in a rule group
 */
export function getUsedFields(group: RuleGroup): Set<string> {
  const fields = new Set<string>()

  group.conditions.forEach((condition) => {
    fields.add(condition.field)
  })

  if (group.groups) {
    group.groups.forEach((nestedGroup) => {
      const nestedFields = getUsedFields(nestedGroup)
      nestedFields.forEach((field) => fields.add(field))
    })
  }

  return fields
}

/**
 * Suggest improvements for a rule
 */
export function suggestImprovements(group: RuleGroup): string[] {
  const suggestions: string[] = []
  const fields = getUsedFields(group)
  const conditionCount = countConditions(group)

  // Suggest adding volume confirmation for price-based rules
  if ((fields.has('current_price') || fields.has('price')) && !fields.has('volume') && !fields.has('volume_ratio')) {
    suggestions.push('Consider adding volume confirmation to improve signal quality')
  }

  // Suggest RSI for momentum strategies
  if (fields.has('MACD') && !fields.has('RSI')) {
    suggestions.push('Adding RSI can help confirm MACD signals and reduce false positives')
  }

  // Warn about single-condition rules
  if (conditionCount === 1) {
    suggestions.push('Single-condition rules may produce false signals. Consider adding confirmation conditions.')
  }

  // Warn about overly complex rules
  if (conditionCount > 10) {
    suggestions.push('Rules with many conditions may be overfitted and perform poorly in live trading')
  }

  // Suggest stop-loss for buy actions
  const hasPrice = fields.has('current_price') || fields.has('price')
  if (hasPrice && !fields.has('stop_loss') && !fields.has('safety_line')) {
    suggestions.push('Consider adding a stop-loss condition for risk management')
  }

  return suggestions
}
