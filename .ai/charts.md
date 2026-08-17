# Charts and Data Visualization
## Purpose
Communicate comparisons, trends, distributions, and relationships accurately.
## Philosophy
Choose the simplest encoding that answers a user question. Accuracy and legibility outrank decoration.
## Best Practices
- State the question, unit, time range, source, timezone, and freshness.
- Use lines for trends, bars for comparisons, and tables for exact lookup.
- Provide accessible summaries/data tables and color-safe palettes.
## Rules
- Axes and units are labeled; bar axes start at zero unless clearly justified.
- Do not use 3D effects, misleading dual axes, or color as the only series cue.
- Loading, empty, partial, error, and no-permission states are explicit.
## Examples
```text
Revenue by month (TZ: Africa/Dar_es_Salaam, TZS, updated 10:30) + downloadable table.
```
## Anti-patterns
Pie charts with many slices, unlabeled metrics, interpolating missing data silently.
## Checklist
- [ ] Chart type matches question and scale is honest.
- [ ] Units/source/freshness and missing data are clear.
- [ ] Keyboard/screen-reader alternative exists.

Related: `accessibility.md`, `internationalization.md`, `performance.md`.
