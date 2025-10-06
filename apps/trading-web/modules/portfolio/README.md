# @modules/portfolio

Portfolio management module with real-time position tracking, safety controls, and dialogs.

## Features

- **Portfolio Summary**: Total value, P&L, cost basis, dividends, realized/unrealized split
- **Position List**: Scrollable list of all positions with key metrics
- **Position Details**: Detailed view with safety information and risk metrics
- **Dialogs**:
  - Adjust Safety Line: Modify stop-loss levels
  - Sell Confirmation: Confirm position sales with P&L preview
  - Set Target Price: Define profit targets with alerts
- **Paper/Live Mode Indicator**: Clear indication of trading mode
- **Export**: CSV export with timezone-correct timestamps

## Installation

This module is part of the trading platform monorepo and uses workspace dependencies.

## Usage

```tsx
import { PortfolioSummary, PortfolioList } from '@modules/portfolio'

function PortfolioPage() {
  return (
    <>
      <PortfolioSummary
        positions={positions}
        cashAvailable={10000}
        totalValue={50000}
        totalPnlUsd={5000}
        totalPnlPct={11.11}
        costBasis={45000}
        dividendsYTD={500}
        realizedPnl={2000}
        unrealizedPnl={3000}
      />
      <PortfolioList
        positions={positions}
        onSelectPosition={handleSelectPosition}
      />
    </>
  )
}
```

## Configuration

Module configuration via `module.config.ts`:

```typescript
featureFlags: {
  'portfolio.enable_cost_basis': true,
  'portfolio.enable_realized_unrealized': true,
  'portfolio.enable_export': true,
  'portfolio.enable_safety_adjustment': true,
  'portfolio.enable_target_price': true,
  'portfolio.paper_trade_indicator': true,
}
```

## Site Configuration

Enable/disable per tenant:

```json
{
  "modules": {
    "portfolio": {
      "enabled": true,
      "showCostBasis": true,
      "showDividends": true,
      "allowSafetyAdjustment": true,
      "requireConfirmation": true
    }
  }
}
```

## Telemetry

Tracked events:
- `portfolio_viewed`
- `position_detailed`
- `safety_adjusted`
- `position_closed`
- `trade_mode_indicator_viewed`

## Compliance

- Paper trading badge prominently displayed in dialogs
- Confirmation required for all actions
- Immutable audit trail for safety adjustments

## Dependencies

- `@modules/auth`: Authentication
- `@modules/api`: API client
- `@modules/telemetry`: Event tracking

## License

MIT
