# Error Handling
## Purpose
Make failures safe, diagnosable, and recoverable for users and operators.
## Philosophy
Errors are part of the contract. Classify expected outcomes, preserve causes internally, and expose only actionable safe information.
## Best Practices
- Use typed domain, validation, authorization, dependency, and unexpected errors.
- Map once at transport boundaries; attach request/trace IDs.
- Provide retry guidance only for transient failures and preserve user input.
## Rules
- Never swallow exceptions or expose stack traces/secrets.
- Log unexpected errors once at the responsible boundary.
- Retries are bounded, idempotent, and restricted to transient conditions.
## Examples
```ts
throw new DomainError('INVENTORY_UNAVAILABLE', { retryable: false });
```
## Anti-patterns
Catch-all `500` messages, empty catches, retrying validation failures, toast-only form errors.
## Checklist
- [ ] Error taxonomy and mappings are stable.
- [ ] User message is actionable and safe.
- [ ] Cause, correlation, retry, and recovery are handled.

Related: `api.md`, `logging.md`, `forms.md`.
