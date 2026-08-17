# Analytics Implementation Guide
## Purpose
Create decision-ready analytics with defensible definitions.
## Philosophy
A metric without owner, definition, grain, and freshness is not trustworthy.
## Architecture
Define versioned events, ingestion validation, transformations/semantic metrics, authorized query service, and presentation view models.
## Required Components
Metric glossary, filters/time range, KPI/trend/breakdown, comparison, freshness/source, drill-down, export, empty/partial/error states.
## Folder Structure
```text
features/analytics/{events,metrics,queries,components,exports,tests}
```
## UX Expectations
State timezone, units, comparison, missing data, sampling, and update time; make exact data accessible.
## Security Considerations
Minimize identifiers, enforce row/tenant scope, aggregate small cohorts, govern exports and retention.
## Testing Expectations
Test event schemas, deduplication, late data, metric fixtures, timezone boundaries, permissions, chart accuracy, and export parity.
## Best Practices
Own metric definitions centrally and reconcile against known source totals.
## Rules
No silent definition change, vanity metric, unbounded export, or chart-side business calculation.
## Examples
```text
Activation rate v2 = eligible accounts completing A+B within 7 days / eligible accounts.
```
## Anti-patterns
Counting retries as users, mixing timezones, hiding partial ingestion.
## Checklist
- [ ] Definitions, lineage, access, freshness, validation, UX, and tests are complete.

Related: `../charts.md`, `../database.md`, `../monitoring.md`.
