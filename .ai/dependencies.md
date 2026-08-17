# Dependencies
## Purpose
Control supply-chain, maintenance, compatibility, and runtime cost.
## Philosophy
Every dependency is code the team operates. Prefer platform and existing capabilities; add packages only for durable leverage.
## Best Practices
- Evaluate maintenance, license, security history, size, API stability, and alternatives.
- Pin with lockfiles, automate updates, and review transitive changes.
- Wrap volatile vendor SDKs at infrastructure boundaries.
## Rules
- New runtime dependencies require documented justification.
- No abandoned, unknown-license, or duplicate-purpose package without approval.
- CI uses frozen/reproducible installs and vulnerability scanning.
## Examples
```text
Decision: use existing schema library; avoids a second validator and 28KB client cost.
```
## Anti-patterns
Packages for trivial helpers, floating versions, blind automated major upgrades.
## Checklist
- [ ] Need, alternatives, health, license, and size were assessed.
- [ ] Lockfile and notices are updated.
- [ ] Upgrade/removal path is understood.

Related: `security.md`, `architecture.md`, `performance.md`.
