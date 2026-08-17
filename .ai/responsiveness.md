# Responsiveness
## Purpose
Make workflows effective across content sizes, input modes, and viewports.
## Philosophy
Design fluidly around content pressure, not device labels. Preserve capability while changing composition.
## Best Practices
- Start with the narrow layout; add container/media queries where content needs space.
- Use flexible grids, intrinsic sizing, responsive assets, and sensible line lengths.
- Convert dense tables to scroll, priority columns, or structured cards based on task.
## Rules
- No essential action or information disappears solely due to viewport size.
- Avoid fixed page dimensions and horizontal page overflow.
- Test 320px width, zoom/reflow, landscape, touch, keyboard, and long localized text.
## Examples
```css
.grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(18rem,100%),1fr)); }
```
## Anti-patterns
Desktop shrunk to mobile, breakpoint proliferation, hover-only controls, clipped dialogs.
## Checklist
- [ ] Content drives breakpoints.
- [ ] Navigation, tables, forms, dialogs, and media adapt.
- [ ] Touch, zoom, long text, and safe areas work.

Related: `design.md`, `accessibility.md`, `frontend.md`.
