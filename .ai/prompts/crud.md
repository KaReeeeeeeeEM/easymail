# CRUD Module Implementation Guide
## Purpose
Build complete, secure resource workflows beyond four endpoints.
## Philosophy
Model business actions and lifecycle, not database tables exposed through UI.
## Architecture
Define domain schema/invariants, application commands/queries, repository adapter, API contracts, and feature UI.
## Required Components
List/search/filter/pagination, detail, create/edit forms, archive/delete/restore as allowed, audit metadata, all async/permission states.
## Folder Structure
```text
features/<resource>/{domain,server,api,components,schemas,tests,index.ts}
```
## UX Expectations
Preserve filters in URL, confirm consequential actions, retain failed input, support useful empty states and optimistic updates only when recoverable.
## Security Considerations
Validate allowed fields, authorize each action/resource, tenant-scope queries, prevent mass assignment and enumeration.
## Testing Expectations
Test invariants, uniqueness/concurrency, permissions, pagination/filter contracts, forms, failures, and lifecycle transitions.
## Best Practices
Use transactions, stable error codes, bounded queries, and soft deletion only with a clear retention need.
## Rules
Never expose ORM objects, accept client ownership, or perform unbounded bulk operations.
## Examples
```text
POST command → validate → authorize → enforce invariant → transact → event/audit → resource DTO.
```
## Anti-patterns
Table-to-API generators as final design, hard deletes by default, N+1 lists.
## Checklist
- [ ] Lifecycle, contracts, permissions, states, concurrency, tests, and docs are complete.

Related: `../api.md`, `../database.md`, `../forms.md`.
