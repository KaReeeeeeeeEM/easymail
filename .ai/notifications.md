# Notifications
## Purpose
Deliver timely, relevant feedback without creating noise or risk.
## Philosophy
Use inline feedback for local actions, toasts for transient confirmation, inbox/email/push for durable or off-session events.
## Best Practices
- Let users control nonessential channels and frequency.
- Deduplicate, group bursts, deep-link to the relevant safe destination, and localize content.
- Track queued, delivered, failed, opened, and acted-on outcomes.
## Rules
- Never put secrets or sensitive details in lock-screen-visible content.
- Critical state cannot rely on a toast alone.
- Retries are bounded and sending is idempotent; honor unsubscribe/preferences.
## Examples
```text
Payment failed — Review payment method [Open billing]
```
## Anti-patterns
Success toast after every trivial action, repeated alerts, ambiguous “Something happened”.
## Checklist
- [ ] Channel, urgency, durability, and user preference match.
- [ ] Content is actionable, safe, localized, and deduplicated.
- [ ] Delivery/failure are observable.

Related: `error-handling.md`, `internationalization.md`, `monitoring.md`.
