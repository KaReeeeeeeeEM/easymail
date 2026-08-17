# Coding Style
## Purpose
Make code unsurprising, reviewable, and safely changeable.
## Philosophy
Readability and local consistency outrank cleverness. Tools enforce mechanics; reviewers focus on design and behavior.
## Best Practices
- Use formatter, linter, strict type checks, small functions, and early returns.
- Prefer immutable data, explicit inputs/outputs, and domain types over primitives.
- Comments explain why, constraints, and hazards—not syntax.
## Rules
- Match repository language conventions and configured tools.
- Avoid `any`, unchecked casts, hidden mutation, and magic values.
- Delete dead code; do not keep commented-out implementations.
## Examples
```ts
type OrderId = Brand<string, 'OrderId'>;
const canCancel = (order: Order) => order.status === 'pending';
```
## Anti-patterns
Dense one-liners, speculative generalization, flag arguments, misleading comments.
## Checklist
- [ ] Names reveal intent and control flow is simple.
- [ ] Types encode meaningful constraints.
- [ ] Formatter, linter, and type checker pass.

Related: `naming-conventions.md`, `architecture.md`, `documentation.md`.
