# Database

## Purpose
Protect data integrity while keeping persistence understandable and performant.

## Philosophy
The database is a correctness boundary. Encode durable invariants with types, constraints, and transactions; use application checks for context-dependent policy.

## Best Practices
- Use migrations that are reviewed, repeatable, and safe for live traffic.
- Choose precise types; use foreign keys, unique constraints, and checks.
- Index observed query patterns and verify with query plans.
- Use expand/backfill/contract for breaking schema changes.
- Define retention, deletion, backup, and restore expectations for sensitive data.

## Rules
- Production schema never changes manually.
- Money uses integer minor units or fixed decimals; timestamps are UTC.
- Queries are parameterized and bounded; lists paginate.
- Transactions are short and include all writes required by an invariant.

## Examples
```sql
ALTER TABLE orders ADD CONSTRAINT orders_total_nonnegative CHECK (total_cents >= 0);
CREATE UNIQUE INDEX orders_idempotency_key_uq ON orders(idempotency_key);
```

## Anti-patterns
- ORM-generated migrations accepted without inspection.
- JSON blobs replacing stable relational structure.
- N+1 queries, missing foreign keys, destructive one-step renames.

## Checklist
- [ ] Constraints express durable invariants.
- [ ] Migration supports rollback or safe forward recovery.
- [ ] Query plans and indexes match expected scale.
- [ ] Backup, privacy, and retention implications are addressed.

Related: `architecture.md`, `performance.md`, `security.md`, `deployment.md`.
