# Animations
## Purpose
Use motion to explain change, preserve context, and provide feedback.
## Philosophy
Motion is functional and restrained. It must never delay work or compete with content.
## Best Practices
- Animate opacity and transforms; use consistent duration/easing tokens.
- Keep micro-interactions near 120–200ms and larger transitions near 200–300ms.
- Preserve spatial continuity for drawers, menus, and reordered items.
## Rules
- Honor `prefers-reduced-motion`; remove nonessential movement and autoplay.
- Never animate layout properties in repeated/high-frequency interactions.
- Focus placement and semantics remain correct throughout transitions.
## Examples
```css
@media (prefers-reduced-motion: reduce) { .motion { animation: none; transition: none; } }
```
## Anti-patterns
Entrance animation on every element, bouncing CTAs, motion-only status, blocking page transitions.
## Checklist
- [ ] Motion communicates a state change.
- [ ] Reduced-motion behavior works.
- [ ] Animation is interruptible, performant, and accessible.

Related: `design.md`, `accessibility.md`, `performance.md`.
