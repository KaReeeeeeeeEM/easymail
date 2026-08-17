# Deployment
## Purpose
Ship changes safely, repeatably, and reversibly.
## Philosophy
Build once, promote the same artifact, automate checks, and reduce blast radius with incremental rollout.
## Best Practices
- Use immutable artifacts, environment parity, health/readiness checks, and feature flags.
- Run backward-compatible migrations separately from code that depends on them.
- Prefer canary/rolling releases and automatic rollback on objective signals.
## Rules
- Secrets and environment configuration stay outside artifacts.
- Every release records commit, artifact, migrations, operator, and outcome.
- Rollback or forward-recovery steps are defined before risky release.
## Examples
```text
expand schema → deploy dual-read/write code → backfill/verify → contract schema
```
## Anti-patterns
Manual production edits, latest-tag deployments, destructive migrations coupled to startup.
## Checklist
- [ ] CI checks and artifact provenance pass.
- [ ] Migration and recovery are safe.
- [ ] Health, telemetry, flags, and rollback are ready.

Related: `database.md`, `monitoring.md`, `git.md`.
