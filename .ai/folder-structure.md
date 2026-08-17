# Folder Structure
## Purpose
Make ownership and dependency direction visible from the repository tree.
## Philosophy
Prefer feature colocation over file-type sprawl. Shared code earns its location through multiple stable consumers.
## Best Practices
- Keep deployable apps in `apps/`, reusable packages in `packages/`, features beneath their owning app/domain.
- Colocate implementation, tests, styles, schemas, and stories.
- Export feature public APIs from one entry point; keep internals private.
## Rules
- Follow an existing repository structure when present.
- Do not create catch-all `helpers`, `common`, or `misc` directories.
- Generated, migration, fixture, and source files are visibly separated.
## Examples
```text
apps/web/src/features/orders/{components,server,schemas,tests,index.ts}
packages/{ui,config,observability}
```
## Anti-patterns
Global components folder containing feature UI, deep cross-feature imports, duplicate trees by technical layer.
## Checklist
- [ ] Every file has a clear owner.
- [ ] Feature internals and public API are distinct.
- [ ] Tests/docs are near what they describe.

Related: `architecture.md`, `naming-conventions.md`, `project-rules.md`.
