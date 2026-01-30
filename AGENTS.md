# Repository Guidelines

## Project Structure & Module Organization
- `index.html` is the main landing page.
- `theme.css` holds the shared styles for the main site.
- `side-projects/` contains standalone project pages and assets:
  - `side-projects/*.html` for project writeups.
  - `side-projects/side-project.css` for side project-specific styles.
  - `side-projects/baba/` for the embedded mini-site and its assets.
- Root-level images (e.g., `skills_illustration.png`, `values_illustration.png`) are shared assets.
- `footer.js` powers the “Contact me” button behavior.

## Build, Test, and Development Commands
There is no build system or test runner configured.

## Coding Style & Naming Conventions
- Indentation: 4 spaces in HTML and CSS.
- Keep markup semantic and minimal; prefer utility classes from `theme.css`.
- Class names are kebab-case (e.g., `side-project-card`); IDs are snake_case when used (e.g., `side_project_icons_img`).
- Keep CSS in `theme.css` for shared rules and `side-projects/side-project.css` for project-specific rules.

## Testing Guidelines
- No automated tests are present.
- Validate changes by loading the HTML files in a browser and checking layout across desktop and mobile widths.

## Commit & Pull Request Guidelines
- Recent commit messages are short, imperative, and sentence-case (e.g., `Update theme.css`, `rework of side project pages`).
- For PRs: include a brief summary, list affected pages (e.g., `index.html`, `side-projects/icons.html`), and attach screenshots for layout changes.

## Configuration Notes
- External fonts are loaded from Google Fonts; keep those `<link>` tags in each page’s `<head>`.
