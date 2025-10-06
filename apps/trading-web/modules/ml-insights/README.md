# @modules/ml-insights

Machine learning model diagnostics, market regime detection, and trade driver explanations.

**Phase 6: ML Insights & Regime Hinting**

## Overview

This module enhances the trading platform with ML transparency and context:

- **DiagnosticsChip**: Displays model confidence, drift status, and top drivers in a compact chip
- **RegimeBanner**: Shows current market regime with auto-adjusted recommendation tone
- **WhyNowPanel**: Explains trade recommendations with top 3 ML drivers
- **Driver Copy Service**: Maps technical driver codes to beginner-friendly explanations
- **Regime Toning**: Automatically adjusts copy tone based on market volatility/regime

## Components

### DiagnosticsChip

Compact diagnostic indicator for embedding in PlanCard or other views.

```tsx
import { DiagnosticsChip } from '@modules/ml-insights'

<DiagnosticsChip
  diagnostics={diagnosticsSummary}
  mode="beginner"
  onFeedback={(helpful) => console.log('Helpful?', helpful)}
/>
```

**Features:**
- Model confidence with beginner labels (Strong/Moderate/Weak)
- Confidence stability trend (rising/stable/falling over last N minutes)
- Drift status indicator (green/yellow/red)
- Top 3 drivers with contribution percentages
- Collapsible panel with detailed breakdown
- Feedback collection (helpful/not helpful)

### RegimeBanner

Market regime banner with contextual guidance.

```tsx
import { RegimeBanner } from '@modules/ml-insights'

<RegimeBanner
  regime={regimeData}
  mode="beginner"
  onDismiss={() => console.log('Dismissed')}
/>
```

**Regime Types:**
- `bull_trending`: Strong uptrend, high momentum
- `bear_trending`: Strong downtrend, risk elevated
- `choppy`: Sideways, low momentum
- `high_volatility`: Large swings, use caution
- `low_volatility`: Calm, stable conditions
- `unknown`: Insufficient data

**Recommendation Tones:**
- `aggressive`: Favorable conditions, normal language
- `moderate`: Standard conditions, balanced language
- `cautious`: Risky conditions, toned-down language

### WhyNowPanel

Displays top drivers behind a trade recommendation.

```tsx
import { WhyNowPanel } from '@modules/ml-insights'

<WhyNowPanel
  symbol="AAPL"
  drivers={mlDrivers}
  mode="beginner"
  showAllDrivers={false}
/>
```

**Driver Metadata:**
- `category`: technical | fundamental | sentiment | options | macro
- `strength`: weak | moderate | strong
- `timeframe`: short | medium | long
- `contribution`: 0.0-1.0 (percentage impact)
- `trend_direction`: up | down | neutral

## Copy Services

### Driver Copy

Maps driver codes to beginner/expert explanations:

```ts
import { getDriverCopy } from '@modules/ml-insights'

getDriverCopy('rsi_oversold', 'beginner')
// "Stock is oversold - price may bounce back up soon"

getDriverCopy('rsi_oversold', 'expert')
// "RSI indicates oversold conditions below 30, potential mean reversion opportunity"
```

**40 driver codes supported:**
- Technical: RSI, MACD, SMA crossovers, Bollinger, volume, support/resistance
- Fundamental: Earnings, revenue, guidance, analyst ratings, valuation
- Sentiment: News sentiment, social buzz, insider trading
- Options: IV rank, put/call ratio, unusual activity
- Macro: Sector rotation, market correlation, interest rates, commodities

### Regime Toning

Auto-adjusts copy based on market regime:

```ts
import { toneActionVerb, getTonedCopy } from '@modules/ml-insights'

toneActionVerb('BUY', regimeData, 'beginner')
// High volatility regime: "Watch before buying"
// Bull trending regime: "Consider buying"

const tonedCopy = getTonedCopy('BUY', regimeData, 'beginner')
// {
//   actionVerb: "Watch before buying",
//   cautionLevel: "high",
//   qualifiers: ["Markets are volatile", "Use tight stop-losses"],
//   riskDisclaimer: "Larger swings possible - manage risk carefully"
// }
```

**Toning Logic:**
- High volatility: Add caution, suggest tight stop-losses
- Bear trending: Warn about counter-trend risk
- Choppy: Note lack of clear direction
- Low volatility: No extra caution needed
- Bull trending + aggressive tone: Confident language

## Telemetry

All interactions tracked:

```ts
// DiagnosticsChip events
diagnostics_expanded
diagnostics_collapsed
diagnostics_feedback (helpful: boolean)

// RegimeBanner events
regime_banner_viewed (regime, confidence, tone)
regime_banner_dismissed

// WhyNowPanel events
why_now_panel_viewed (symbol, num_drivers)
driver_clicked (driver_name, category, contribution)

// General insight events
insight_helpful (insight_type)
insight_confusing (insight_type)
```

## Site Configuration

Control module visibility per tenant:

```json
{
  "modules": {
    "mlInsights": true
  },
  "features": {
    "mlInsightsEnabled": true
  }
}
```

**Per-tenant customization:**
- Enable/disable entire module
- Hide specific features (e.g., only regime banner, no diagnostics)
- Adjust default mode (always beginner explanations)
- Control feedback collection

## Integration Example

Enhance PlanCard with ML insights:

```tsx
import { DiagnosticsChip, WhyNowPanel, RegimeBanner } from '@modules/ml-insights'

export function PlanCard({ pick, regime, diagnostics }) {
  return (
    <div>
      {/* Top banner */}
      <RegimeBanner regime={regime} mode={userMode} />

      {/* Plan header with diagnostics */}
      <div className="flex items-center justify-between">
        <h3>{pick.symbol}</h3>
        <DiagnosticsChip
          diagnostics={diagnostics}
          mode={userMode}
          onFeedback={submitFeedback}
        />
      </div>

      {/* Existing plan content */}
      <PlanAction action={pick.action} />
      <PlanReason reason={pick.reason} />

      {/* Why Now panel at bottom */}
      <WhyNowPanel
        symbol={pick.symbol}
        drivers={pick.drivers}
        mode={userMode}
      />
    </div>
  )
}
```

## Backend Coordination

Expected API response structure:

```ts
// GET /api/ml-insights
{
  "metadata": { ... },
  "diagnostics": {
    "model_confidence": 0.85,
    "drift_status": "green",
    "top_drivers": [
      {
        "name": "rsi_oversold",
        "contribution": 0.42,
        "category": "technical",
        "strength": "strong",
        "timeframe": "short",
        "trend_direction": "up",
        "value": 28.5
      },
      // ... top 3
    ],
    "regime": {
      "regime": "bull_trending",
      "confidence": 0.78,
      "detected_at": "2025-10-04T10:30:00Z",
      "duration_minutes": 45,
      "characteristics": ["high_volume", "narrow_spreads"],
      "recommendation_tone": "aggressive"
    },
    "confidence_stability": {
      "current": 0.85,
      "previous": [0.82, 0.81, 0.83, 0.85],
      "trend": "rising",
      "volatility": 0.02,
      "last_updated": "2025-10-04T10:30:00Z",
      "time_window_minutes": 15
    },
    "last_updated": "2025-10-04T10:30:00Z"
  },
  "regime": { ... },
  "drivers": [ ... ],
  "confidence_history": { ... }
}
```

## Performance

- **Bundle size**: ~25KB (mostly UI components)
- **Lazy loadable**: Yes, can be code-split
- **Critical path**: No, enhances existing views
- **Caching**: Share regime/diagnostics across all picks

## Accessibility

- Keyboard navigation: Full support
- Screen readers: ARIA labels on all interactive elements
- Color blind safe: Icons + text labels
- Reduced motion: No animations required

## Testing

Test with different regime scenarios:

```ts
// High volatility regime
const highVolRegime = {
  regime: 'high_volatility',
  confidence: 0.82,
  recommendation_tone: 'cautious',
  ...
}

// Verify toning
expect(toneActionVerb('BUY', highVolRegime, 'beginner'))
  .toBe('Watch before buying')

// Verify qualifiers
const toned = getTonedCopy('BUY', highVolRegime, 'beginner')
expect(toned.cautionLevel).toBe('high')
expect(toned.qualifiers).toContain('Markets are volatile')
```

## Changelog

### v1.0.0 (Phase 6)
- Initial release
- DiagnosticsChip with confidence stability
- RegimeBanner with 6 regime types
- WhyNowPanel with top 3 drivers
- Driver copy service (40 drivers)
- Regime toning utilities
- Feedback collection UI
- Full telemetry integration
