# Dashboard Implementation Guide
## Purpose
Build a task-oriented operational overview, not a wall of widgets.
## Philosophy
Prioritize decisions and exceptions; progressive disclosure serves detail.
## Architecture
Use a dashboard query/service that returns authorized, time-bounded view models; independent panels fail independently and share filter/URL state.
## Required Components
Shell, title/time range, KPI summaries, primary trend, actionable queue, recent activity, filter controls, refresh/freshness, skeleton/empty/error/permission states.
## Folder Structure
```text
features/dashboard/{components,queries,schemas,tests,index.ts}
```
## UX Expectations
Most important metric/action appears first; units, comparison periods, source, timezone, and freshness are explicit. Follow `../charts.md` and `../responsiveness.md`.
## Security Considerations
Authorize each aggregate and drill-down; tenant-scope cache keys; prevent sensitive cross-panel leakage.
## Testing Expectations
Test aggregation, permissions, filter URLs, partial failures, empty/large data, accessibility, and mobile layout.
## Best Practices
Batch compatible queries, link metrics to action, and monitor panel latency.
## Rules
No decorative metric, misleading comparison, unbounded query, or client-only authorization.
## Examples
```text
Failed payments: 12 · +3 vs previous 7 days · Updated 10:30 · Review →
```
## Anti-patterns
Equal-weight cards, auto-refresh that disrupts reading, unexplained red/green, chart-only exact values.
## Checklist
- [ ] Decisions, hierarchy, filters, states, freshness, security, tests, and responsive behavior are complete.

Related: `../design.md`, `../charts.md`, `../performance.md`.
