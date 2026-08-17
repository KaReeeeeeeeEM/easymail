# Accessibility
## Purpose
Ensure people can perceive, understand, navigate, and operate the product.
## Philosophy
Target WCAG 2.2 AA and design inclusively from the start. Semantic HTML and robust defaults beat retrofitted ARIA.
## Best Practices
- Provide keyboard order, visible focus, labels, instructions, and meaningful alternatives.
- Maintain contrast, 44px touch targets where feasible, zoom/reflow, and clear error recovery.
- Announce async results deliberately without noisy live regions.
## Rules
- No interaction is pointer-only; custom widgets follow established ARIA patterns.
- Never use color alone for meaning.
- Page titles, landmarks, headings, and focus after navigation/dialog actions are intentional.
## Examples
```html
<label for="email">Work email</label><input id="email" type="email" aria-describedby="email-help">
```
## Anti-patterns
Clickable divs, removed focus outlines, placeholder-only labels, positive `tabindex`.
## Checklist
- [ ] Keyboard and screen-reader flows were exercised.
- [ ] Contrast, reflow, touch targets, and reduced motion pass.
- [ ] Automated checks and manual critical-path checks pass.

Related: `forms.md`, `animations.md`, `responsiveness.md`.
