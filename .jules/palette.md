# Palette's Journal

Critical UX and accessibility learnings for the AI Usage Global project.

## 2026-04-23 - Clickable Badge Anti-Pattern
**Learning:** The project uses shadcn/ui `Badge` components with `onClick` handlers to act as filter buttons. Since Badge renders as a `<span>` by default, these are completely invisible to keyboard navigation and screen readers — a clear WCAG failure.
**Action:** Any interactive Badge must use `asChild` with a native `<button>` inside, plus an explicit `aria-label`. Do not rely on `onClick` attached to non-interactive elements anywhere in the app.

