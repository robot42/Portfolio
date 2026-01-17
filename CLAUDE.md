# CLAUDE.md

## Project context
- Single-page portfolio site in `index.html` with all styles in `theme.css`.
- `index.css` is merged and removed; only `theme.css` is loaded.

## Layout and spacing
- Page padding: 48px (top/right/bottom/left).
- Space between sections: 48px.
- Glass cards are max-width `--first-breakpoint` (800px) and centered.
- Avoid horizontal overflow on small screens.

## Glass cards
- Use `.glass-card` for all sections.
- First card has animated border via `.glass-card--hero`.
- Glass border color uses `--glass-border-color`.

## Sections
- Values: two-column layout with image left, text right.
- Skills: two-column layout with image right; skills blocks in 2x2 grid with `gap: var(--small-space)`.
- Footer: two-column layout; centered group; JS loaded from `footer.js`.

## Skills separators
- Skills lists are spans inside `.skills-items`.
- Separator and spacing are controlled by CSS:
  - `--skills-separator`
  - `--skills-separator-gap`

## Images
- All images include `width`/`height` attributes to avoid layout shift.
- Work sample image borders use `--glass-border-color`.

## Animation
- Hero border animation uses conic gradient and animates angle:
  - `@property --glass-border-angle`
  - `@keyframes glass-border-sweep`

## JS
- Email reveal logic lives in `footer.js` and is loaded with `defer`.
