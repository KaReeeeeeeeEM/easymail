# Testing
## Purpose
Provide fast, trustworthy evidence that behavior and contracts remain correct.
## Philosophy
Test observable behavior at the cheapest reliable boundary. Favor many focused unit/integration tests and a small set of critical end-to-end journeys.
## Best Practices
- Cover domain invariants, authorization denials, validation, failures, and boundaries.
- Use deterministic factories and isolated data; mock only true external boundaries.
- Add contract tests for APIs/events and visual/accessibility checks for shared UI.
## Rules
- A bug fix includes a failing regression test when practical.
- Tests cannot depend on order, wall-clock timing, public networks, or shared mutable state.
- Never weaken assertions merely to make CI green.
## Examples
```ts
it('rejects cross-tenant access', async () => expect(loadInvoice(actorA, tenantBId)).rejects.toMatchObject({code:'FORBIDDEN'}));
```
## Anti-patterns
Snapshot-only coverage, testing implementation details, excessive mocks, arbitrary sleeps.
## Checklist
- [ ] Happy, boundary, denial, and failure cases exist.
- [ ] Tests are deterministic and readable.
- [ ] Verification matches change risk.

Related: `api.md`, `accessibility.md`, `deployment.md`.
