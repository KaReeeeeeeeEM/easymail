# Monitoring
## Purpose
Detect user-impacting failures and guide reliable recovery.
## Philosophy
Monitor outcomes through the four golden signals: latency, traffic, errors, and saturation. Alerts must be actionable and tied to service objectives.
## Best Practices
- Define SLIs/SLOs for critical journeys and instrument traces across boundaries.
- Alert on sustained user impact or error-budget burn; attach dashboards and runbooks.
- Monitor queues, dependencies, certificates, backups, and synthetic critical paths.
## Rules
- Every paging alert has owner, severity, threshold, runbook, and resolution test.
- Metrics use bounded-cardinality labels.
- New critical dependencies receive health and failure telemetry.
## Examples
```text
Alert: checkout success <99.5% for 10m → payments runbook → owner: Commerce.
```
## Anti-patterns
Paging on raw CPU alone, unowned alerts, high-cardinality user IDs, dashboards without decisions.
## Checklist
- [ ] User outcomes and dependencies are visible.
- [ ] Alerts are actionable and tested.
- [ ] Runbooks, ownership, and recovery signals exist.

Related: `logging.md`, `performance.md`, `deployment.md`.
