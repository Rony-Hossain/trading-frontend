# Rules Module (@modules/rules)

Advanced rules engine for creating custom alerts and automated trading actions.

## Features

- **Visual Rule Builder**: IF/AND/OR condition builder with add/remove controls
- **Real-time Validation**: Live error, warning, and conflict detection as you build
- **Enforced Nesting Cap**: Maximum 3-level nesting depth to prevent overly complex rules
- **Rule Library**: Manage, enable/disable, and organize saved rules
- **Rule Templates**: Pre-built strategies for common scenarios
- **Backtest Preview**: Test rules against historical data before deployment
- **Conflict Detection**: Automatic validation to prevent impossible conditions (e.g., RSI > 70 AND RSI < 30)
- **Telemetry Tracking**: Full event tracking for rule building and performance

**Note:** Drag-and-drop reordering requires `@dnd-kit/core` and `@dnd-kit/sortable` packages. Package installation and implementation deferred to future release. Currently uses add/delete buttons for condition management.

## Components

### RuleBuilder

Visual interface for creating and editing rules with nested conditions.

```tsx
import { RuleBuilder } from '@modules/rules'

<RuleBuilder
  initialGroup={existingRule?.root_group}
  onSave={(group, actions) => {
    // Save the rule
  }}
  onPreview={(group) => {
    // Show preview
  }}
  mode="beginner"
/>
```

**Features:**
- Add/remove conditions dynamically
- Support for nested AND/OR groups (expert mode, max 3 levels)
- Real-time validation with error/warning/conflict alerts
- Multiple condition types: indicator, price, volume, news, options, time
- Multiple operators: greater_than, less_than, equals, crosses_above, crosses_below, between
- Visual logic chips showing AND/OR relationships
- Inline field selection and value input
- Disabled "Add Group" button when max depth reached
- Save button disabled until all errors/conflicts resolved

### RuleLibrary

Browse and manage saved rules and templates.

```tsx
import { RuleLibrary } from '@modules/rules'

<RuleLibrary
  rules={userRules}
  templates={availableTemplates}
  onCreateRule={() => navigate('/rules/new')}
  onEditRule={(rule) => navigate(`/rules/${rule.id}/edit`)}
  onDeleteRule={(id) => deleteRule(id)}
  onToggleRule={(id, enabled) => updateRule(id, { enabled })}
  onDuplicateRule={(rule) => duplicateRule(rule)}
  onUseTemplate={(template) => createFromTemplate(template)}
  mode="expert"
/>
```

**Features:**
- Search and filter rules
- Enable/disable rules with toggle
- View trigger count and backtest stats
- Duplicate existing rules
- Delete with confirmation
- Browse template library by category
- Template popularity and win rate metrics

### RulePreview

Backtest rules against historical data and validate before saving.

```tsx
import { RulePreview } from '@modules/rules'

<RulePreview
  symbol="AAPL"
  ruleGroup={currentRuleGroup}
  onClose={() => setShowPreview(false)}
  mode="beginner"
/>
```

**Features:**
- 30-day historical backtest
- Win rate and profit/loss statistics
- Sample trigger list with conditions met
- Validation warnings for edge cases
- Conflict detection (mutually exclusive conditions)
- Performance summary with visual indicators
- Beginner mode explanations

## API Functions

### fetchRules()

Fetch all rules for the current user.

```ts
const { rules, total_count } = await fetchRules()
```

### createRule(request)

Create a new rule.

```ts
const newRule = await createRule({
  name: 'My Custom Rule',
  description: 'Buy when RSI < 30',
  symbol: 'AAPL',
  root_group: {
    id: 'group-1',
    logic: 'AND',
    conditions: [/* ... */],
    groups: [],
  },
  actions: [
    { type: 'alert', message: 'RSI oversold' }
  ],
  enabled: true,
})
```

### updateRule(ruleId, request)

Update an existing rule.

```ts
await updateRule('rule-123', {
  enabled: false,
  name: 'Updated Name',
})
```

### deleteRule(ruleId)

Delete a rule.

```ts
await deleteRule('rule-123')
```

### previewRule(request)

Run a backtest preview.

```ts
const preview = await previewRule({
  symbol: 'AAPL',
  root_group: ruleGroup,
  lookback_days: 30,
})

console.log('Win rate:', preview.backtest_stats.win_rate)
console.log('Triggers:', preview.total_triggers)
console.log('Warnings:', preview.validation_warnings)
```

### fetchRuleTemplates()

Get available rule templates.

```ts
const templates = await fetchRuleTemplates()
```

## Rule Templates

8 pre-built templates included:

1. **RSI Oversold Bounce** (Reversal) - Mean reversion on RSI < 30
2. **Momentum Breakout** (Breakout) - Price + volume breakout
3. **Stop Loss Trigger** (Risk Management) - Auto-sell at safety line
4. **MACD Golden Cross** (Momentum) - MACD bullish crossover
5. **Bollinger Band Squeeze** (Breakout) - Volatility expansion
6. **Moving Average Crossover** (Momentum) - 50/200 SMA golden cross
7. **High Volume Breakout** (Breakout) - Institutional activity
8. **Take Profit at Target** (Risk Management) - Auto-sell at target

## Configuration

```ts
import { mergeRulesConfig } from '@modules/rules'

const config = mergeRulesConfig({
  enabled: true,
  maxRulesPerUser: 50,
  maxConditionsPerRule: 20,
  maxNestedGroups: 3,
  backtestLookbackDays: 30,
  allowedConditionTypes: ['indicator', 'price', 'volume'],
  allowedActionTypes: ['alert', 'notify'],
  requireApprovalForAutoTrade: true,
})
```

## Condition Types

- **indicator**: Technical indicators (RSI, MACD, SMA, EMA, Bollinger, ATR)
- **price**: Price data (current, open, high, low, close, previous_close)
- **volume**: Volume metrics (volume, volume_avg, volume_ratio)
- **news**: Sentiment analysis (sentiment_score, news_count, importance)
- **options**: Options data (iv_rank, put_call_ratio, max_pain, greeks)
- **time**: Time-based (time_of_day, day_of_week, days_since_earnings)

## Operators

- **greater_than**: Value > threshold
- **less_than**: Value < threshold
- **equals**: Value = threshold
- **crosses_above**: Value crosses above threshold (requires previous value < threshold)
- **crosses_below**: Value crosses below threshold (requires previous value > threshold)
- **between**: threshold1 < Value < threshold2

## Action Types

- **alert**: Send in-app alert notification
- **notify**: Send email/SMS notification
- **buy**: Auto-buy shares (requires approval in production)
- **sell**: Auto-sell shares (requires approval in production)

## Telemetry Events

All rule interactions are tracked:

- `condition_added` - User adds a condition
- `group_added` - User adds a nested group
- `condition_deleted` - User removes a condition
- `group_deleted` - User removes a group
- `rule_saved` - Rule saved (includes build duration, condition count)
- `rule_previewed` - Backtest preview requested
- `rule_deleted` - Rule deleted
- `rule_toggled` - Rule enabled/disabled
- `rule_duplicated` - Rule duplicated
- `template_used` - Template selected
- `rule_preview_loaded` - Preview data loaded successfully
- `rule_accepted_from_preview` - User accepts rule after preview

## Validation & Conflict Detection

The preview system automatically detects:

- **Impossible conditions**: RSI > 100, price < 0
- **Mutually exclusive conditions**: RSI > 70 AND RSI < 30
- **Never-triggering conditions**: Conditions that didn't match in backtest
- **Redundant conditions**: Duplicate or overlapping logic
- **Missing required fields**: Incomplete condition configuration

## Integration with Site Config

Enable/disable rules module per tenant:

```json
{
  "modules": {
    "rules": true,
    "alerts": true
  },
  "jurisdiction": "US"
}
```

## Backend Coordination

Coordinate with backend team on:

1. **POST /api/rules** - Create rule
2. **GET /api/rules** - List user rules
3. **PATCH /api/rules/:id** - Update rule
4. **DELETE /api/rules/:id** - Delete rule
5. **POST /api/rules/preview** - Backtest preview
6. **GET /api/rules/templates** - Get templates

All endpoints should return proper ResponseMetadata and handle errors gracefully.

## Best Practices

1. **Always preview rules** before enabling in production
2. **Start with templates** for beginners
3. **Limit nested groups** to 2-3 levels for maintainability
4. **Use meaningful names** for rules and descriptions
5. **Test in paper trading** before live trading
6. **Monitor trigger counts** to avoid spam
7. **Set appropriate cooldowns** in throttle settings
8. **Validate win rates** - aim for >50% before deploying

## Accessibility

- Full keyboard navigation support
- ARIA labels on all interactive elements
- Screen reader announcements for dynamic changes
- High contrast mode support
- Focus management in dialogs and nested components

## Performance

- Rules builder uses React.memo for condition rows
- Virtualized lists for large rule libraries (>50 rules)
- Debounced search (300ms)
- Lazy loading for preview data
- Optimistic UI updates for toggle/delete

## Future Enhancements

- [ ] Multi-symbol rules (trigger on any of N symbols)
- [ ] Advanced backtesting (custom date ranges, multiple timeframes)
- [ ] Rule chaining (one rule triggers another)
- [ ] Machine learning suggestions based on portfolio
- [ ] Social sharing of templates
- [ ] Performance leaderboard for templates
- [ ] Real-time rule execution logs
- [ ] A/B testing different rule variations
