# Performance
## Purpose
Keep user journeys fast and systems efficient under realistic load.
## Philosophy
Performance is a budget tied to experience, not late-stage tuning. Measure before optimizing and protect improvements with telemetry.
## Best Practices
- Define p75 user-centric web vitals and p95/p99 API latency targets per journey.
- Eliminate waterfalls, batch I/O, paginate data, cache only with explicit freshness/invalidation.
- Budget JavaScript, images, queries, memory, and third-party work.
## Rules
- Benchmark representative data and devices; never claim speed from intuition.
- Every cache states key, owner, TTL, invalidation, and stale behavior.
- Avoid unbounded work in requests, renders, and queues.
## Examples
```text
Search SLO: p95 < 400 ms; limit 50; cache 60 s; invalidate on catalog publish.
```
## Anti-patterns
Premature memoization, unlimited lists, cache-as-database, optimizing averages only.
## Checklist
- [ ] Critical journeys have budgets and baselines.
- [ ] Queries, bundles, assets, and remote calls are bounded.
- [ ] Regressions are measured in CI or monitoring.

Related: `frontend.md`, `database.md`, `monitoring.md`.
