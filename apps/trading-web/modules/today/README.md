# @modules/today

Beginner-friendly Today view module for daily trading plan.

## Overview

The Today module provides a simplified, beginner-focused interface for viewing daily trading recommendations. It includes:

- **Daily Plan**: AI-powered trading picks with confidence scores
- **Safety Features**: Visual indicators for stop-loss, daily caps, and paper trading
- **Progressive Disclosure**: Expandable cards with detailed information
- **Real-time Updates**: Automatic refresh and stale data detection
- **Accessibility**: WCAG 2.2 AA compliant with screen reader support

## Installation

This module is part of the trading platform monorepo and uses workspace dependencies.

## Usage

### Register the Module

```typescript
import { ModuleRegistry } from '@/lib/module-registry/registry'
import { todayModuleConfig } from '@modules/today/module.config'

const registry = ModuleRegistry.getInstance()
await registry.register(todayModuleConfig)
```

### Use Components

```typescript
import { PlanList, PlanCard } from '@modules/today'

function MyPage() {
  return <PlanList />
}
```

### Use Hooks

```typescript
import { usePlanQuery } from '@modules/today'

function MyComponent() {
  const { data, isLoading, error } = usePlanQuery()
  // ...
}
```

## Features

### Routes

- `/today` - Main today view page

### Feature Flags

- `today.enable_refresh` - Allow manual plan refresh
- `today.show_confidence` - Show confidence scores
- `today.show_safety_line` - Show stop-loss indicators
- `today.show_budget_impact` - Show budget impact
- `today.enable_explain` - Enable term explanations
- `today.stale_threshold_ms` - Stale data threshold

### Extension Points

- `today.pick-card-actions` - Custom actions for pick cards
- `today.plan-header` - Custom header content

## Components

### PlanList

Main component that displays the list of daily picks.

**Props:** None (uses TanStack Query internally)

**States:**
- Loading
- Error
- Empty
- Stale data
- Success with picks

### PlanCard

Individual pick card with expandable details.

**Props:**
- `pick: Pick` - Pick data
- `mode: 'beginner' | 'expert'` - Display mode

### Supporting Components

- `PlanConfidencePill` - Confidence indicator
- `PlanBadges` - Status badges
- `PlanReason` - Reason explanation
- `PlanSafety` - Safety line (stop-loss)
- `PlanBudget` - Budget impact
- `PlanAction` - Action button
- `ExplainChip` - Inline term explanation
- `ExplainPopover` - Detailed term explanation

## Hooks

### usePlanQuery

TanStack Query hook for fetching daily plan.

```typescript
const { data, isLoading, error, refetch, isStale } = usePlanQuery()
```

**Returns:**
- `data: PlanResponse | undefined`
- `isLoading: boolean`
- `error: Error | null`
- `refetch: () => void`
- `isStale: boolean`

### useExplainEntry

TanStack Query hook for fetching term explanations.

```typescript
const { data, isLoading } = useExplainEntry('confidence')
```

## Configuration

Module configuration is defined in `module.config.ts`:

```typescript
{
  defaultRefreshInterval: 5 * 60 * 1000, // 5 minutes
  maxPicksPerDay: 3,
  showBeginnerHints: true,
  enablePaperTradingBadge: true,
}
```

## Dependencies

### Required
- `@modules/auth@^1.0.0` - Authentication
- `@modules/api@^1.0.0` - API client

### Optional
- `@modules/telemetry@^1.0.0` - Event tracking
- `@modules/notifications@^1.0.0` - Notifications

## Telemetry Events

The module tracks the following events:

- `Performance.time_to_first_plan` - Time to load first plan
- `Plan.view` - Plan viewed
- `Plan.refresh` - Plan manually refreshed
- `Plan.pick_expand` - Pick card expanded
- `Plan.explain_view` - Term explanation viewed

## Accessibility

- Keyboard navigation support (Tab, Enter, Escape)
- Screen reader labels and announcements
- WCAG 2.2 Level AA compliant
- Focus management for modals and popovers
- Color contrast ratios meet standards

## Performance

- Initial load target: < 5 seconds
- TanStack Query caching (5 min stale, 10 min GC)
- Automatic refetch on window focus
- Optimistic updates for user actions

## Testing

```bash
npm test modules/today
```

## License

MIT
