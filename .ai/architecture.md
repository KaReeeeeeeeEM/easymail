# Architecture

## Purpose
Define boundaries that let the system evolve without feature coupling.

## Philosophy
Use a modular monolith by default. Organize around business capabilities; introduce services, queues, or packages only when scale, ownership, isolation, or deployment needs justify their operational cost.

## Best Practices
- Keep presentation, application orchestration, domain rules, and infrastructure distinguishable.
- Point dependencies inward: domain logic must not depend on UI, HTTP, or a database client.
- Expose small module APIs; keep implementation private.
- Make external systems replaceable behind adapters and make side effects explicit.
- Record consequential decisions in an ADR as described in `documentation.md`.

## Rules
- A feature owns its UI, use cases, validation, tests, and data access boundary.
- Cross-feature access uses a public contract, not deep imports.
- Transactions protect one business invariant; distributed workflows must be idempotent.
- Do not add an abstraction until two real consumers or a clear volatile boundary exists.

## Examples
```text
features/orders/{domain,application,infrastructure,ui,index.ts}
```
`placeOrder()` depends on `OrderRepository`; the SQL adapter implements it.

## Anti-patterns
- Global `utils` containing business behavior.
- Controllers with authorization, SQL, pricing logic, and email delivery mixed together.
- Premature microservices or generic repositories.

## Checklist
- [ ] Ownership and public boundaries are clear.
- [ ] Business rules are framework-independent.
- [ ] Failure, transaction, and idempotency boundaries are defined.
- [ ] New complexity has an evidenced reason.

Related: `backend.md`, `frontend.md`, `folder-structure.md`, `api.md`.
