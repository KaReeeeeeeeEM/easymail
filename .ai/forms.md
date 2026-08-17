# Forms
## Purpose
Create clear, accessible, resilient data-entry experiences.
## Philosophy
Reduce effort and uncertainty. Validation helps users recover; it does not punish them.
## Best Practices
- Use persistent labels, helpful examples, correct input types/autocomplete, and logical grouping.
- Validate client-side for immediacy and server-side for trust; share schemas when feasible.
- Preserve values on failure, focus the first invalid field, and prevent duplicate submission.
## Rules
- Required/optional status and format expectations appear before submission.
- Errors are associated with fields and summarized for long forms.
- Destructive actions require clear consequence and proportionate confirmation.
## Examples
```html
<input id="phone" autocomplete="tel" aria-invalid="true" aria-describedby="phone-error">
```
## Anti-patterns
Placeholder labels, disabled submit with no explanation, clearing failed forms, generic “invalid”.
## Checklist
- [ ] Keyboard, autofill, mobile input, and errors work.
- [ ] Server validation and duplicate-submit protection exist.
- [ ] Loading, success, failure, and unsaved-change states are clear.

Related: `accessibility.md`, `error-handling.md`, `security.md`.
