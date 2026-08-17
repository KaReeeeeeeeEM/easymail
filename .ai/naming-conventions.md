# Naming Conventions
## Purpose
Make code and product language searchable, precise, and consistent.
## Philosophy
Names form the team’s shared model. Use domain vocabulary and reveal units, state, and intent.
## Best Practices
- Use verbs for actions, nouns for values/types, `is/has/can/should` for booleans.
- Include units (`timeoutMs`, `amountCents`) and distinguish identifiers (`userId`, `tenantId`).
- Mirror repository casing; default: PascalCase types/components, camelCase code, kebab-case routes/files.
## Rules
- One term per concept; maintain a glossary for important domain language.
- Avoid unexplained abbreviations, generic `data/info/item`, and misleading legacy names.
- Tests describe behavior and condition.
## Examples
```ts
const isPaymentOverdue = dueAt < now;
async function archiveExpiredSessions() {}
```
## Anti-patterns
`handleStuff`, `tmp2`, negative booleans, type suffixes that reveal implementation rather than meaning.
## Checklist
- [ ] Name uses established domain language.
- [ ] Action, state, scope, and units are clear.
- [ ] File/export/route naming matches local convention.

Related: `coding-style.md`, `folder-structure.md`, `documentation.md`.
