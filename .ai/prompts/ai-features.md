# AI Feature Implementation Guide
## Purpose
Build useful AI behavior with measurable quality, bounded agency, and safe failure.
## Philosophy
AI output is untrusted and probabilistic. Design around a concrete user decision, evaluation set, fallback, and human control.
## Architecture
Use a provider-neutral model gateway, versioned prompts, structured schemas, retrieval/tool boundaries, policy checks, telemetry, and evals.
## Required Components
Input/context UI, consent where needed, streaming/progress, citations/provenance, edit/approve/retry, feedback, limits, unavailable/unsafe states.
## Folder Structure
```text
features/ai/<capability>/{prompts,schemas,tools,retrieval,evals,components,tests}
```
## UX Expectations
Set expectations, distinguish generated content, preserve user control, show sources/uncertainty when material, and never fake determinism.
## Security Considerations
Treat prompts/retrieved text as hostile, authorize every tool/data fetch, prevent secret leakage, redact logs, constrain output and spend.
## Testing Expectations
Maintain representative golden/adversarial evals; test schema failure, injection, tool denial, timeout, provider failure, cost/latency, and fallback.
## Best Practices
Use structured output, least-privileged tools, model/version telemetry, and staged rollout.
## Rules
No autonomous irreversible action, unsourced high-stakes claim, or raw model output passed to execution/rendering.
## Examples
```text
retrieve authorized context → model proposes structured action → validate/policy → user confirms → execute idempotently.
```
## Anti-patterns
Prompt-only security, logging full conversations by default, shipping without evals.
## Checklist
- [ ] User value, evals, privacy, grounding, tools, fallback, cost, and approval are complete.

Related: `../security.md`, `../api.md`, `../monitoring.md`.
