# SaaS Implementation Guide
## Purpose
Build multi-tenant software with reliable onboarding, billing, roles, and lifecycle management.
## Philosophy
Tenant isolation and entitlements are domain invariants, not UI conveniences.
## Architecture
Model tenant/workspace, membership/roles, invitations, plans/entitlements, subscription, usage, audit, and lifecycle as separate modules.
## Required Components
Onboarding, workspace switcher/settings, members/invites/roles, plan/billing/usage, audit, cancellation/export/deletion, limit and past-due states.
## Folder Structure
```text
features/saas/{tenants,memberships,entitlements,billing,usage,audit,lifecycle,tests}
```
## UX Expectations
Always show active workspace; explain limits and billing consequences; provide recovery for expired invites and failed payments.
## Security Considerations
Tenant-scope every query/cache/job/object, require step-up auth for ownership/billing, audit privilege, secure provider webhooks.
## Testing Expectations
Test cross-tenant denial, role matrix, invite replay/expiry, entitlement transitions, webhook ordering, usage races, cancellation and deletion.
## Best Practices
Snapshot entitlements for decisions, reconcile billing, and make lifecycle workflows resumable.
## Rules
No tenant ID trusted from client, plan-name checks scattered in code, or deletion without retention/export policy.
## Examples
```text
actor + active tenant → membership policy → entitlement → resource policy → use case.
```
## Anti-patterns
Global queries, role-as-plan, access removed before paid-through date without policy.
## Checklist
- [ ] Isolation, roles, entitlements, billing, lifecycle, audit, and tests are complete.

Related: `../authorization.md`, `../database.md`, `../authentication.md`.
