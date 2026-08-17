# Project Rules
## Purpose
Provide the enforceable workflow applied to every project and change.
## Philosophy
Ideas should move quickly without sacrificing coherence: discover the local system, reuse it, implement a narrow vertical slice, and prove it works.
## Best Practices
- Before editing, inventory stack, scripts, structure, tokens, shared components, comparable features, and repository instructions.
- Write a short acceptance model covering users, outcome, states, permissions, data, and failure.
- Reuse existing foundations; make new primitives broadly useful and documented.
- Keep changes scoped and leave the repository cleaner only where touched.
## Rules
- `AGENTS.md` precedence is mandatory.
- No unrequested redesign, dependency, architecture migration, schema destruction, or public contract break.
- Never invent commands or claim tests ran; report exact verification and known gaps.
- New behavior includes loading, empty, error, permission, responsive, and accessible states where applicable.
- Keep secrets and generated private data out of version control.
## Examples
```text
Discover → read relevant standards/feature guide → define acceptance → implement → test → review diff/docs → report.
```
## Anti-patterns
Starting from a blank visual template, solving adjacent problems, silent assumptions, “works on my machine”.
## Checklist
- [ ] Local conventions and relevant standards were inspected.
- [ ] Acceptance, scope, and edge states are satisfied.
- [ ] Tests/checks are proportionate and reported truthfully.
- [ ] Docs/contracts/migrations and recovery are complete.

Related: every `.ai` standard; start at `AGENTS.md`.
