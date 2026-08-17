# Internationalization
## Purpose
Support languages, regions, currencies, dates, and plural rules without rewrites.
## Philosophy
Separate meaning from presentation and use locale-aware standards. Translation is product content, not string replacement.
## Best Practices
- Use stable message keys, ICU-style plural/select messages, and native Intl formatting.
- Store UTC instants plus required timezone/business context; store currency with amount.
- Test text expansion, RTL, missing translations, and locale routing.
## Rules
- No concatenated user-facing sentences or hard-coded display formats.
- User locale/timezone is explicit with a documented fallback.
- Identifiers, logs, and API values remain locale-neutral.
## Examples
```ts
new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
```
## Anti-patterns
Manual pluralization, flags as language selectors, assuming 24-hour time or name order.
## Checklist
- [ ] All UI text and metadata are externalized.
- [ ] Dates, numbers, currency, pluralization, RTL, and expansion work.
- [ ] Fallback and missing-key telemetry exist.

Related: `charts.md`, `notifications.md`, `responsiveness.md`.
