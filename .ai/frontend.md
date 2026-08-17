# Frontend

## Purpose
Set standards for reliable, accessible, maintainable client applications.

## Philosophy
Render from explicit state, keep server state close to its source, and make components easy to understand in isolation. Prefer platform capabilities and server rendering when they simplify the experience.

## Best Practices
- Use typed props and schema-validated boundary data.
- Keep route composition separate from reusable UI and domain behavior.
- Fetch in the layer that owns caching and authorization; avoid client waterfalls.
- Model async UI explicitly: idle, loading, success, empty, and error.
- Preserve URL-addressable filters, pagination, and selected resources.

## Rules
- Components do not fetch implicitly unless they are designated data boundaries.
- Effects synchronize with external systems, not derive render state.
- No unsafe HTML without sanitization and review.
- Use semantic HTML before ARIA; meet `accessibility.md`.

## Examples
```tsx
function OrderTotal({ amount }: { amount: Money }) {
  return <output>{formatMoney(amount)}</output>;
}
```

## Anti-patterns
- Duplicating server state into global client state.
- Boolean-prop explosions and giant route components.
- Index keys for mutable lists; effects for computed values.

## Checklist
- [ ] Data ownership and render states are explicit.
- [ ] Components have focused responsibilities.
- [ ] URL, keyboard, mobile, and failure behavior work.
- [ ] Bundle and rendering costs are proportionate.

Related: `state-management.md`, `forms.md`, `performance.md`, `ui-components.md`.
