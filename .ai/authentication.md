# Authentication

## Purpose
Establish user or service identity safely across sessions and recovery flows.

## Philosophy
Use proven identity providers and protocols. Authentication confirms identity; authorization decides access and belongs in `authorization.md`.

## Best Practices
- Prefer OIDC/OAuth 2.1 providers or mature framework integrations.
- Store browser sessions in Secure, HttpOnly, SameSite cookies; rotate on privilege changes.
- Require MFA for privileged roles and support passkeys where practical.
- Make recovery single-use, short-lived, observable, and resistant to account enumeration.

## Rules
- Never build password hashing or token crypto primitives; use vetted libraries and modern password hashes.
- Apply CSRF protection to cookie-authenticated mutations.
- Revoke relevant sessions after password reset or suspected compromise.
- Login errors must not reveal whether an account exists.

## Examples
```http
Set-Cookie: session=opaque; HttpOnly; Secure; SameSite=Lax; Path=/
```

## Anti-patterns
- Tokens in local storage, long-lived bearer tokens, security questions.
- Treating an email address or client-supplied role as proof of identity.

## Checklist
- [ ] Session creation, rotation, expiry, revocation, and recovery are defined.
- [ ] CSRF, fixation, enumeration, and brute force are mitigated.
- [ ] Privileged accounts use stronger controls.
- [ ] Auth events are audited without logging secrets.

Related: `authorization.md`, `security.md`, `notifications.md`.
