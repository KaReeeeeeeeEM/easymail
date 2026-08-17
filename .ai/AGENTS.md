# AI Engineering Standards

## Purpose
This is the entry point for every human or AI change. The files in `.ai/` are mandatory, versioned engineering policy—not suggestions. Read this file, `project-rules.md`, and the standards relevant to the requested work before planning or editing.

## Philosophy
Consistency, maintainability, safety, and fit with the existing product matter more than novelty. Preserve established project conventions unless they are unsafe, broken, or the task explicitly changes them. Prefer the smallest coherent change that solves the problem.

## Best Practices
- Inspect the repository, nearby implementations, configuration, tests, and design tokens before coding.
- State important assumptions; validate them from code whenever possible.
- Consult standards by concern: UI work reads `design.md`, `frontend.md`, `accessibility.md`, and `responsiveness.md`; data work reads `backend.md`, `api.md`, and `database.md`; cross-cutting work reads security, testing, and observability standards.
- Use a guide in `prompts/` for its feature class, then apply all referenced standards.
- Update documentation and tests in the same change as behavior.

## Rules
1. Existing repository instructions and explicit user requirements outrank `.ai`; record deliberate exceptions.
2. More specific `.ai` guidance outranks general guidance. Security, privacy, accessibility, and data-integrity rules outrank style preferences.
3. If two equally specific rules conflict, choose the option matching existing code and document the decision. Ask only when the choice is irreversible or materially product-changing.
4. Never silently introduce a new framework, design language, architecture layer, dependency, or naming scheme.
5. Do not claim completion without proportionate verification.

## Examples
For a new billing form: inspect an existing form, read `forms.md`, `api.md`, `security.md`, and `testing.md`, reuse shared controls, validate on both boundaries, and run targeted tests.

## Anti-patterns
- Generating a standalone “beautiful” screen that ignores the product shell and tokens.
- Copying standards into feature code instead of linking to the source.
- Broad refactors hidden inside a focused request.
- Treating a passing build as proof of correct behavior.

## Checklist
- [ ] Relevant `.ai` files and nearby code were read.
- [ ] Existing conventions and user intent were preserved.
- [ ] Security, accessibility, errors, and edge cases were considered.
- [ ] Tests, docs, and verification match the risk.
- [ ] Exceptions and trade-offs are explicit.

## Standards Index
- System: `architecture.md`, `folder-structure.md`, `dependencies.md`, `project-rules.md`
- Product UI: `design.md`, `frontend.md`, `ui-components.md`, `forms.md`, `charts.md`, `animations.md`, `responsiveness.md`, `accessibility.md`
- Services and data: `backend.md`, `api.md`, `database.md`, `uploads.md`, `state-management.md`
- Trust: `authentication.md`, `authorization.md`, `security.md`, `error-handling.md`
- Delivery: `testing.md`, `performance.md`, `logging.md`, `monitoring.md`, `deployment.md`, `git.md`
- Consistency: `coding-style.md`, `naming-conventions.md`, `documentation.md`, `internationalization.md`, `notifications.md`
