# Bolt's Journal ⚡

Critical performance learnings for this codebase only.

## 2026-04-23 - Scroll Hook Bottlenecks
**Learning:** `useActiveSection` was re-attaching its scroll listener on every state change because `activeSection` was in the `useEffect` dependency array. It also ran `querySelectorAll` + layout reads (`offsetTop`/`offsetHeight`) on every scroll event without throttling, causing layout thrashing.
**Action:** Always use refs to track latest state inside scroll handlers, and throttle with `requestAnimationFrame` to cap work to the display refresh rate.

## 2026-04-23 - Search Input Bottleneck
**Learning:** The blog search input updates React state on every keystroke, causing full re-renders of the entire `Blog` component and O(n) filtering over all posts. With daily publishing, this list will grow, making the cost per keystroke increase linearly.
**Action:** Debounce the search query with a small custom hook and memoize filtered/paginated arrays to avoid recomputing on every render.

## 2026-04-24 - BlogGrid Re-render Optimization
**Learning:** The `BlogGrid` component re-renders whenever `Blog` re-renders, even when `posts` array reference hasn't changed. Since the parent filters and paginates posts on every render (even when results are memoized), passing new array references triggers child re-renders unnecessarily.
**Action:** Wrap `BlogGrid` with `React.memo` to prevent re-renders when props haven't changed. This is especially impactful as the blog grows—each avoided re-render saves rendering 9 Card components with Images.

