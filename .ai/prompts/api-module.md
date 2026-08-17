# API Module Implementation Guide
## Purpose
Deliver a versionable, observable, secure API capability and its operational contract.
## Philosophy
Design contract-first around consumer use cases and explicit failure semantics.
## Architecture
Route/transport → schema validation → authentication/authorization → application use case → repository/integration → response mapper.
## Required Components
Schemas/DTOs, handlers, use cases, policies, persistence adapter, error mapping, OpenAPI/docs, metrics/logs, unit/integration/contract tests.
## Folder Structure
```text
features/<module>/{domain,application,infrastructure,http,schemas,tests,index.ts}
```
## UX Expectations
For developer consumers: predictable naming, examples, stable codes, pagination metadata, request IDs, deprecation and retry guidance.
## Security Considerations
Validate size/type/fields, scope identity, authorize objects, rate-limit abuse, redact telemetry, sign/verify callbacks.
## Testing Expectations
Test schema boundaries, all status/error mappings, auth denials, idempotency/concurrency, pagination, compatibility, and dependency failure.
## Best Practices
Keep handlers thin, use stable DTOs, bound all work, and publish examples generated from schemas.
## Rules
No ORM leakage, breaking contract without migration, unbounded collection, or ambiguous `200` error.
## Examples
```text
POST /v1/invoices + Idempotency-Key → 201 Invoice | stable 4xx error | retry-safe 5xx.
```
## Anti-patterns
Business logic in handlers, undocumented fields, arbitrary filtering, stack traces.
## Checklist
- [ ] Contract, policy, data boundary, errors, docs, observability, and tests are complete.

Related: `../api.md`, `../backend.md`, `../testing.md`.
