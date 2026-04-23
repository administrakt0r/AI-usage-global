## 2025-05-14 - Skip to Content Implementation
**Learning:** For a "Skip to Content" link to work reliably across all browsers (including older ones and specific screen readers), the target element (usually `<main>`) should have `tabIndex={-1}`. This ensures that the focus is programmatically moved to the element even if it's not naturally focusable.
**Action:** Always ensure the target of a skip link has `id="main-content"` and `tabIndex={-1}`.

## 2025-05-14 - Multi-language remnants in Accessibility Labels
**Learning:** Even if the UI appears fully English, `sr-only` (screen-reader only) labels might contain leftover text from other languages if the project was cloned or uses a starter kit from another locale (e.g., Croatian "Promijeni temu").
**Action:** Audit `sr-only` spans and `aria-label` attributes for untranslated strings when working in a multi-language or inherited codebase.
