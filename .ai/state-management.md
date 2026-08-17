# State Management
## Purpose
Keep state ownership, synchronization, and transitions predictable.
## Philosophy
Use the narrowest durable owner: URL for navigation state, server cache for remote data, component state for local interaction, and global stores only for truly cross-cutting client state.
## Best Practices
- Normalize server cache keys and invalidate from successful mutations.
- Derive values during render; model complex workflows with explicit states/reducers.
- Persist only necessary, versioned, non-sensitive client state.
## Rules
- One source of truth per datum.
- Do not mirror props or server results without a synchronization requirement.
- Optimistic updates require rollback and conflict behavior.
## Examples
```text
URL: page/filter; query cache: invoices; component: open row; store: session preferences.
```
## Anti-patterns
Global store by default, effect chains, persisted auth tokens, impossible boolean combinations.
## Checklist
- [ ] Owner and lifetime are explicit.
- [ ] Loading/error/stale/conflict transitions are modeled.
- [ ] Persistence is minimal and safe.

Related: `frontend.md`, `api.md`, `forms.md`.
