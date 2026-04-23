# Bolt's Journal ⚡

Critical performance learnings for this codebase only.

## 2026-04-23 - Scroll Hook Bottlenecks
**Learning:** `useActiveSection` was re-attaching its scroll listener on every state change because `activeSection` was in the `useEffect` dependency array. It also ran `querySelectorAll` + layout reads (`offsetTop`/`offsetHeight`) on every scroll event without throttling, causing layout thrashing.
**Action:** Always use refs to track latest state inside scroll handlers, and throttle with `requestAnimationFrame` to cap work to the display refresh rate.

