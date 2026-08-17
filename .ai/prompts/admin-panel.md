# Admin Panel Implementation Guide
## Purpose
Build safe internal tools for support and operations.
## Philosophy
Administrative power must be explicit, least-privileged, auditable, and difficult to misuse.
## Architecture
Use separate admin routes and server policies; commands call normal domain use cases with elevated context and audit metadata.
## Required Components
Admin shell, scoped navigation, search, resource detail, action history, reason/confirmation dialogs, permission-denied and break-glass states.
## Folder Structure
```text
features/admin/{components,commands,policies,audit,tests,index.ts}
```
## UX Expectations
Show environment, acting identity, resource identity, consequences, and irreversible actions prominently; optimize dense scan workflows.
## Security Considerations
MFA, short sessions, fine-grained roles, server authorization, rate limits, immutable audit events, time-bound impersonation with banner.
## Testing Expectations
Test every role/denial, tenant isolation, audit completeness, confirmation, bulk actions, and session expiry.
## Best Practices
Require reasons for high-impact actions and use previews/dry runs for bulk changes.
## Rules
No hidden superuser bypass, unaudited mutation, or direct database editing from UI.
## Examples
```text
Suspend account → show effects → require reason → re-auth if high risk → execute → audit.
```
## Anti-patterns
Shared admin credentials, permanent impersonation, generic delete buttons.
## Checklist
- [ ] Least privilege, audit, safe UX, recovery, and denial tests are complete.

Related: `../authorization.md`, `../authentication.md`, `../logging.md`.
