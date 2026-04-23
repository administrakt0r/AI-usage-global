# Palette's Journal

Critical UX and accessibility learnings for the AI Usage Global project.

## 2026-04-23 - Clickable Badge Anti-Pattern
**Learning:** The project uses shadcn/ui `Badge` components with `onClick` handlers to act as filter buttons. Since Badge renders as a `<span>` by default, these are completely invisible to keyboard navigation and screen readers — a clear WCAG failure.
**Action:** Any interactive Badge must use `asChild` with a native `<button>` inside, plus an explicit `aria-label`. Do not rely on `onClick` attached to non-interactive elements anywhere in the app.

## 2026-04-23 - Misleading Cursor on Non-Interactive Containers
**Learning:** The blog listing wraps post cards in `<Card className="cursor-pointer">` even though the Card itself has no `onClick` — only nested links and buttons are interactive. Users see a pointer cursor over empty card padding, but clicking does nothing, creating a broken affordance.
**Action:** Never apply `cursor-pointer` to a container unless the entire container is clickable. Keep cursor hints truthful — only interactive elements should suggest interactivity.

## 2026-04-23 - Breadcrumb Link Used as State Reset Button
**Learning:** The "Posts" breadcrumb in the blog listing uses `href="#"` with `event.preventDefault()` to reset filters. Screen readers announce it as a link, but it behaves like a button, violating user expectations and WCAG semantics.
**Action:** When a breadcrumb item triggers client-side state changes instead of navigation, use `BreadcrumbLink asChild` with a native `<button>` so assistive tech announces it correctly.

