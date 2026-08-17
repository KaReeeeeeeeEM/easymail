# Security

## Purpose
Provide secure defaults across design, implementation, delivery, and operations.

## Philosophy
Minimize trust, privilege, sensitive data, and blast radius. Threat-model based on assets, actors, boundaries, abuse cases, and recovery—not checkbox compliance.

## Best Practices
- Validate input and encode output for its context.
- Keep secrets in managed stores; rotate and scope them.
- Encrypt sensitive data in transit and at rest; classify data before collection.
- Pin and scan dependencies; patch exploitable issues promptly.
- Add security review for auth, payments, uploads, webhooks, AI tools, and personal data.

## Rules
- Never commit secrets or log credentials, tokens, full payment data, or unnecessary PII.
- Apply least privilege to identities, network paths, databases, and CI.
- Set browser protections: CSP, frame restrictions, MIME sniffing protection, and safe referrer policy.
- Use prepared queries and vetted sanitizers; never roll custom cryptography.

## Examples
```ts
logger.info('password reset requested', { userId, requestId }); // never token or email body
```

## Anti-patterns
- Relying on obscurity, client validation, or a perimeter alone.
- Wildcard CORS, permanent credentials, public buckets.
- Collecting data “for later.”

## Checklist
- [ ] Threats, sensitive data, and trust boundaries were reviewed.
- [ ] Input, output, identity, and privilege controls are layered.
- [ ] Secrets and logs are safe.
- [ ] Incident containment and recovery are possible.

Related: `authentication.md`, `authorization.md`, `uploads.md`, `dependencies.md`.
