# Product Design

## Purpose
Create a recognizable, calm, high-quality interface across products without redesigning each feature.

## Philosophy
Clarity precedes decoration. Use restrained surfaces, strong hierarchy, deliberate whitespace, and one clear primary action. Derive the product’s visual language from existing screens and tokens; this handbook does not impose a brand palette.

## Best Practices
- Start from user task, content hierarchy, and states before visual polish.
- Reuse semantic tokens for color, type, radius, spacing, elevation, and motion.
- Prefer a neutral canvas, subtle borders, limited elevation, and brand color for meaning and emphasis.
- Use an 8-point spacing rhythm with 4px for fine alignment unless the repository defines another scale.
- Design default, hover, focus, active, disabled, loading, empty, error, and success states together.

## Rules
- Never hard-code a new color, shadow, font, or radius when a suitable token exists.
- A view has one dominant heading and normally one primary CTA.
- Dense tools may optimize scan speed; marketing pages may use more expressive composition, but both use shared foundations.
- Preserve recognizable brand and layout patterns from existing products.

## Examples
```css
.card { background: var(--surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); }
```

## Anti-patterns
- Gratuitous gradients, glass effects, oversized headings, or animation.
- Every card having equal visual weight.
- Placeholder-only labels or icon-only critical actions.

## Checklist
- [ ] Hierarchy communicates the main task immediately.
- [ ] Tokens and shared patterns are reused.
- [ ] All interaction states are designed.
- [ ] Mobile, keyboard, contrast, and long-content behavior are sound.

Related: `ui-components.md`, `accessibility.md`, `responsiveness.md`, `animations.md`.
