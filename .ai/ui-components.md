# UI Components
## Purpose
Build a coherent, accessible component system without limiting feature composition.
## Philosophy
Use tokens for decisions, primitives for behavior, and composed patterns for recurring product tasks. APIs should be explicit and hard to misuse.
## Best Practices
- Separate headless behavior from visual variants where useful.
- Use composition and semantic variants (`danger`, `quiet`) rather than style escape hatches.
- Document states, content rules, accessibility, and responsive behavior in examples.
## Rules
- Shared components support ref forwarding, focus, disabled/loading states, and semantic HTML.
- Feature-specific business logic stays outside primitives.
- Breaking component changes require migration and consumer verification.
## Examples
```tsx
<Button variant="danger" loading={deleting}>Delete account</Button>
```
## Anti-patterns
One-off copies, boolean prop explosions, arbitrary CSS overrides, clickable non-controls.
## Checklist
- [ ] API is focused and token-based.
- [ ] All states, keyboard behavior, and content extremes work.
- [ ] Reuse is evidenced by real consumers.

Related: `design.md`, `accessibility.md`, `frontend.md`.
