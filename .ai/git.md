# Git and Change Management
## Purpose
Keep history reviewable, attributable, and safe to integrate.
## Philosophy
Commits are coherent units of intent; branches and pull requests are short-lived collaboration tools.
## Best Practices
- Use focused commits with imperative messages and explain why in the body.
- Rebase/merge according to repository policy; resolve conflicts deliberately.
- PRs state problem, approach, verification, risks, screenshots, migration, and rollback.
## Rules
- Never commit secrets, generated artifacts not tracked by policy, or unrelated formatting churn.
- Do not bypass required review/checks or rewrite shared history without coordination.
- Branch names follow repository convention; default new convention is `type/short-description`.
## Examples
```text
feat(invoices): add idempotent payment capture
```
## Anti-patterns
“fix stuff” commits, giant mixed PRs, force-pushing shared branches, drive-by refactors.
## Checklist
- [ ] Diff is scoped and history tells one story.
- [ ] Tests/docs/migrations accompany behavior.
- [ ] Risk and recovery are stated.

Related: `testing.md`, `deployment.md`, `documentation.md`.
