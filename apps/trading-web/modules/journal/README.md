# @modules/journal

Trading journal module with auto-ingestion, filtering, tagging, and export capabilities.

## Features

- **Auto-Ingest**: Automatically creates journal entries from:
  - Trade executions
  - Alert triggers
  - Safety line adjustments
  - Target price changes
  - Position opens/closes
- **Filtering**: Filter by event type, symbol, tags, date range, and search
- **Tags**: Organize entries with custom tags
- **Immutability**: System entries are immutable; only notes can be appended
- **Coverage Tracking**: Shows percentage of trades with journal entries
- **Export**: CSV export with timezone-correct timestamps

## Installation

This module is part of the trading platform monorepo and uses workspace dependencies.

## Usage

```tsx
import { JournalPage } from '@modules/journal'

function Journal() {
  return (
    <JournalPage
      entries={journalEntries}
      coveragePercentage={85}
      onAddNote={handleAddNote}
      onCreateEntry={handleCreateEntry}
      onExport={handleExport}
    />
  )
}
```

## Entry Types

- `trade_executed`: Trade execution events
- `alert_triggered`: Alert notifications
- `safety_adjusted`: Safety line changes
- `target_set`: Target price changes
- `manual_note`: User-created notes
- `position_opened`: New position entries
- `position_closed`: Position exit events

## Configuration

Module configuration via `module.config.ts`:

```typescript
featureFlags: {
  'journal.enable_auto_ingest': true,
  'journal.enable_filters': true,
  'journal.enable_tags': true,
  'journal.enable_export': true,
  'journal.enable_append_notes': true,
  'journal.show_coverage': true,
  'journal.immutable_system_entries': true,
}
```

## Site Configuration

Enable/disable per tenant:

```json
{
  "modules": {
    "journal": {
      "enabled": true,
      "autoIngestTrades": true,
      "autoIngestAlerts": true,
      "enableFilters": true,
      "suggestedTags": ["lesson", "mistake", "win", "loss"]
    }
  }
}
```

## Immutability & Audit Trail

System-generated entries are **immutable** to maintain audit integrity:
- Original entry data cannot be modified
- Only notes can be appended
- Edit history is preserved
- UI displays lock icon for immutable entries

## Export Format

CSV export includes:
- Timezone-correct timestamps (UTC with offset)
- All entry metadata
- Tags and notes
- P&L information when available

## Telemetry

Tracked events:
- `journal_viewed`
- `journal_entry_created`
- `journal_exported`
- `journal_coverage_viewed`

## Coverage Metric

The coverage percentage indicates how many trades have associated journal entries. Higher coverage leads to better insights and learning.

## Dependencies

- `@modules/auth`: Authentication
- `@modules/api`: API client
- `@modules/telemetry`: Event tracking
- `@modules/portfolio` (optional): Cross-module integration

## License

MIT
