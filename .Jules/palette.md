# Palette's Journal - Critical Learnings

## 2026-08-20 - Contact Form Validation & Mailto UX
**Learning:** For client-side contact forms that submit via `mailto:` links, native browser validation (`required`, `aria-required`) prevents empty submissions, while clear submit feedback (`role="status"`, `aria-live="polite"`) informs users that their email application is opening and provides a fallback email link if pop-up blockers or unconfigured mail handlers interfere.
**Action:** Always include HTML validation attributes, visual required indicators, and inline confirmation state when handling form-triggered mailto links.
