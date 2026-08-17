# API Design

## Purpose
Create stable, predictable contracts for internal and external consumers.

## Philosophy
APIs are products. Optimize for unambiguous semantics, compatibility, secure defaults, and useful failure information.

## Best Practices
- Use resource-oriented HTTP or a documented RPC convention consistently.
- Publish typed schemas for request, response, error, pagination, and webhooks.
- Use cursor pagination for changing or large collections; constrain limits.
- Support idempotency keys for create/payment-like operations.
- Version only when compatibility cannot be preserved; publish deprecation windows.

## Rules
- Validate content type, size, shape, and allowed fields.
- Status codes reflect outcome; errors use stable machine codes and safe human messages.
- Never return secrets, stack traces, or internal database objects.
- Rate-limit abuse-sensitive endpoints and sign webhook payloads.

## Examples
```json
{"error":{"code":"ORDER_NOT_FOUND","message":"Order not found","requestId":"req_123"}}
```

## Anti-patterns
- Always returning `200`, breaking response shapes, offset pagination on volatile feeds.
- Accepting arbitrary sort fields or filter expressions.
- Encoding authorization only in the client.

## Checklist
- [ ] Contract, errors, pagination, and compatibility are documented.
- [ ] Validation, authorization, rate limits, and idempotency are covered.
- [ ] Consumer and contract tests exist.
- [ ] Observability excludes sensitive data.

Related: `backend.md`, `authentication.md`, `error-handling.md`, `documentation.md`.
