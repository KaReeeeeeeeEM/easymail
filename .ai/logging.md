# Logging
## Purpose
Create structured evidence for debugging, audit, and operations.
## Philosophy
Log decisions and outcomes, not noise. Logs are sensitive production data with cost and retention limits.
## Best Practices
- Emit structured events with timestamp, level, service, environment, event name, request/trace ID, and safe identifiers.
- Log once at ownership boundaries; use metrics for frequent aggregates.
- Define redaction centrally and sample high-volume informational events.
## Rules
- Never log secrets, tokens, passwords, payment data, or unnecessary PII.
- Error logs preserve safe cause/context and correlation.
- Avoid dynamic message templates; fields remain queryable.
## Examples
```ts
logger.info('invoice.created', { invoiceId, tenantId, requestId });
```
## Anti-patterns
`console.log` in production, duplicate stack traces, entire request bodies, log-only monitoring.
## Checklist
- [ ] Event is actionable, structured, correlated, and correctly leveled.
- [ ] Sensitive fields are excluded/redacted.
- [ ] Volume and retention are appropriate.

Related: `monitoring.md`, `security.md`, `error-handling.md`.
