# Authentication Flow Implementation Guide
## Purpose
Implement sign-in, registration, verification, recovery, and session management safely.
## Philosophy
Minimize friction without weakening identity assurance or recovery safety.
## Architecture
Integrate a vetted provider through an auth adapter; centralize session middleware and keep authorization separate.
## Required Components
Sign-in/up, verification, forgot/reset, MFA/passkey where required, session/device list, sign-out, callback/error/expired-link states.
## Folder Structure
```text
features/auth/{components,server,provider,schemas,emails,tests}
```
## UX Expectations
Preserve intended destination, avoid enumeration, explain requirements early, support password managers and accessible errors.
## Security Considerations
Secure cookies, CSRF, rotation, rate limits, short-lived single-use recovery, MFA for privilege, safe redirects, audited events.
## Testing Expectations
Test success/denial, expiry/replay, fixation, CSRF, enumeration wording, redirect allowlist, session revocation, and accessibility.
## Best Practices
Generic public errors plus correlated internal telemetry; revoke after compromise.
## Rules
No custom crypto, local-storage sessions, open redirects, or client-trusted roles.
## Examples
```text
reset request → generic response → one-time token → rotate sessions → notify user.
```
## Anti-patterns
Security questions, permanent tokens, revealing registered emails.
## Checklist
- [ ] All flows, threats, session lifecycle, notifications, and tests are complete.

Related: `../authentication.md`, `../security.md`, `../notifications.md`.
