## 2026-08-20 - Make scrollable overflow regions keyboard focusable
**Learning:** Containers with `overflow: auto` and a fixed height restrict keyboard users from scrolling if the content inside isn't focusable. This is a common accessibility violation for logs and diffs.
**Action:** Always add `tabindex="0"` and a `focus-visible` style (and ideally `role="region"` with an `aria-label`) to custom scrollable containers like `.details-content` to ensure keyboard accessibility.
