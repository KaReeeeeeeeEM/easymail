# Authorization

## Purpose
Ensure every actor can perform only allowed actions on allowed resources.

## Philosophy
Deny by default and evaluate policy at the trusted boundary. Roles provide coarse capability; resource relationships and state provide fine-grained decisions.

## Best Practices
- Centralize policy functions with actor, action, resource, and tenant context.
- Enforce tenant scoping in query/data-access boundaries as defense in depth.
- Separate ordinary, administrative, and support impersonation capabilities.
- Record high-risk decisions and privileged changes in an audit trail.

## Rules
- UI visibility is never the authorization control.
- Every protected read and write performs a server-side check.
- Never accept tenant, owner, or role from untrusted input without verifying it.
- Bulk operations authorize every selected resource or use an equivalently scoped query.

## Examples
```ts
authorize(actor, 'invoice:update', { tenantId: invoice.tenantId, ownerId: invoice.ownerId });
```

## Anti-patterns
- Scattered role string comparisons.
- “Authenticated means authorized.”
- Global admin bypasses with no audit or expiry.

## Checklist
- [ ] Default is deny and policy ownership is clear.
- [ ] Tenant and object scope are enforced.
- [ ] Bulk, background, admin, and impersonation paths are covered.
- [ ] Allow and deny cases are tested.

Related: `authentication.md`, `security.md`, `database.md`.
