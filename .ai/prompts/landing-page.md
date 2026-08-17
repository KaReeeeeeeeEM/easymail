# Landing Page Implementation Guide
## Purpose
Create a fast, credible page that moves a defined audience toward one conversion.
## Philosophy
Specific value, proof, and clarity beat ornamental design.
## Architecture
Prefer static/server rendering, typed content sections, optimized media, and isolated analytics/form integrations.
## Required Components
Header, hero with primary CTA, problem/value sections, proof, feature outcomes, FAQ, final CTA, footer, SEO/social metadata, legal links.
## Folder Structure
```text
features/marketing/{sections,content,assets,analytics,tests}
```
## UX Expectations
Explain audience/value above the fold; use real product visuals and concise copy; preserve brand tokens and responsive hierarchy.
## Security Considerations
Validate lead forms, rate-limit abuse, minimize collection, disclose analytics/cookies, sanitize CMS content.
## Testing Expectations
Test metadata, links, forms, analytics consent, keyboard/contrast, responsive images, and performance budgets.
## Best Practices
One primary CTA, accessible proof, semantic sections, measured conversion events.
## Rules
No fake testimonials/metrics, autoplay media, deceptive urgency, or blocking third-party script.
## Examples
```text
[Outcome headline] [specific supporting proof] [Start free] [View product]
```
## Anti-patterns
Vague slogans, carousel heroes, feature laundry lists, excessive gradients/motion.
## Checklist
- [ ] Message, proof, CTA, SEO, accessibility, privacy, and speed are complete.

Related: `../design.md`, `../performance.md`, `../animations.md`.
