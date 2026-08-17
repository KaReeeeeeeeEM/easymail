# Backend

## Purpose
Define dependable server-side application and domain behavior.

## Philosophy
Treat all inputs and dependencies as fallible. Keep request adapters thin, domain decisions explicit, and side effects observable and retry-safe.

## Best Practices
- Parse and validate at every trust boundary.
- Put use-case orchestration in application services and invariants in domain code.
- Apply timeouts, bounded retries with jitter, and circuit breaking to remote calls.
- Use background jobs for slow, retryable work; persist intent before dispatch where consistency matters.
- Pass request context, actor, locale, and trace information explicitly.

## Rules
- Authorize every protected operation server-side.
- Mutations that may be retried require idempotency or deduplication.
- Do not expose persistence models as public API objects.
- Every resource acquisition has bounded lifetime and cleanup.

## Examples
```ts
const input = CreateInvoice.parse(request.body);
await authorize(actor, 'invoice:create', input.accountId);
return createInvoice.execute(input, { idempotencyKey });
```

## Anti-patterns
- Business logic in route handlers, hooks, or ORM callbacks.
- Infinite retries, swallowed errors, or unbounded queries.
- Trusting client-supplied ownership fields.

## Checklist
- [ ] Validation, authorization, and invariants are separate and complete.
- [ ] Timeouts and retries are bounded.
- [ ] Transactions and idempotency are intentional.
- [ ] Logs and metrics describe important outcomes.

Related: `api.md`, `database.md`, `security.md`, `logging.md`.
