# Documentation
## Purpose
Preserve the context needed to use, operate, and evolve the system.
## Philosophy
Document decisions and contracts near their owners. Prefer concise, tested, maintained guidance over exhaustive prose.
## Best Practices
- Maintain setup, architecture map, API contracts, runbooks, and ADRs.
- Include rationale, alternatives, consequences, owner, and review date for durable decisions.
- Keep examples executable or verified where practical.
## Rules
- Behavioral/configuration changes update docs in the same change.
- Never duplicate an authoritative rule; link to it.
- Remove stale guidance rather than adding contradictory notes.
## Examples
```text
docs/adr/0023-use-outbox.md: Context → Decision → Consequences → Status
```
## Anti-patterns
Undated diagrams, setup steps that skip prerequisites, comments narrating code.
## Checklist
- [ ] Audience, owner, and source of truth are clear.
- [ ] Commands, links, and examples work.
- [ ] Decisions and operational recovery are documented.

Related: `AGENTS.md`, `api.md`, `monitoring.md`.
