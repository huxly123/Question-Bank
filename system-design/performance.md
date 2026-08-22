# Performance

## 1. Web rendering fundamentals

<details>
<summary>Answer</summary>

Web rendering is the process where the browser converts HTML, CSS, and JavaScript into visual pixels using the DOM, CSSOM, render tree, layout, paint, and compositing.

```text
HTML
↓
DOM construction
↓
CSS
↓
CSSOM construction
↓
DOM + CSSOM
↓
Render tree
↓
Layout (reflow)
↓
Paint
↓
Compositing
↓
Pixels displayed on screen
```

</details>

## Core Web Vitals


## 2. LCP — Largest Contentful Paint

<details>
<summary>Answer</summary>

**Definition:** time taken to render the largest visible element in the viewport.

Usually one of: a hero image, a large heading, a banner image, or a video poster.

**Good value:** ✅ ≤ 2.5 seconds

**Example flow:**

```text
User opens page
↓
HTML loads
↓
Largest element (hero image / heading) renders
↓
Time recorded = LCP
```

**How to improve:**
- Optimize images (WebP/AVIF)
- Use a CDN
- Lazy-load non-critical images
- Reduce render-blocking CSS/JS
- Improve server response time

</details>

## 3. CLS — Cumulative Layout Shift

<details>
<summary>Answer</summary>

**Definition:** measures unexpected layout movement during page load.

**Example:**

```text
User tries to click a button
↓
Ad loads above it
↓
Button moves
↓
User clicks the wrong element
```

**Good value:** ✅ ≤ 0.1

**Common causes:**
- Images without width/height
- Ads injected dynamically
- Fonts causing reflow
- Late-loading components

**How to improve:**
- Always set image dimensions
- Reserve space for ads
- Use `font-display: swap`
- Avoid inserting content above existing content

</details>

## 4. INP — Interaction to Next Paint

<details>
<summary>Answer</summary>

**Definition:** measures how fast the UI responds after a user interaction (click, tap, keyboard input).

**Flow:**

```text
User clicks button
↓
Browser runs the JS event handler
↓
UI updates
↓
Next frame paints
↓
Time measured = INP
```

**Good value:** ✅ ≤ 200 ms

**How to improve:**

**Reduce main-thread blocking — break large JS tasks.** Long tasks (>50 ms) block the main thread; break them into smaller chunks so the browser can process interactions.

```js
// Bad
for (let i = 0; i < 1e9; i++) process(i);

// Better
function chunk() {
  for (let i = 0; i < 1000; i++) process(i);
  setTimeout(chunk, 0);
}
```

**a) Use `requestIdleCallback`** — runs non-critical tasks when the browser is idle, preventing them from blocking user interactions.

```js
requestIdleCallback(() => {
  sendAnalytics();
});
```

Use for: analytics, logging, background processing.

**b) Optimize event handlers** — handlers should finish quickly after a user interaction; avoid heavy computation inside them.

```js
// Bad
button.onclick = () => heavyCalculation();

// Better
button.onclick = () => {
  updateUI();
  setTimeout(heavyCalculation, 0);
};
```

Tips: debounce/throttle events, minimize DOM operations.

**c) Use code splitting** (see below).

</details>

## 5. FCP — First Contentful Paint

<details>
<summary>Answer</summary>

**Definition:** time taken for the first visible content (text, SVG, image, canvas) to appear on screen.

**Flow:**

```text
User opens page
↓
HTML parsed
↓
First visible content appears
↓
Time recorded = FCP
```

**Good value:** ✅ ≤ 1.8 seconds

**How to improve:**

**a) Inline critical CSS.** Critical CSS is the CSS required to render above-the-fold content (the visible part of the page). Normally:

```text
Browser loads HTML
↓
Requests CSS file
↓
Waits for CSS to download
↓
Page renders
```

CSS is render-blocking, so FCP is delayed. Solution: place the important CSS directly inside the HTML.

**b) Reduce render-blocking resources.** The main thread handles JS execution, rendering, and user interactions; heavy JS blocks it, delaying interaction and hurting INP.

```js
// Blocks the UI
button.addEventListener("click", () => {
  heavyCalculation();
});
```

Fixes: remove unnecessary JS, use `async`/`defer`, use Web Workers for heavy tasks.

**c) Use preloading.**

**d) Use a CDN.**

</details>

## 6. TTFB — Time To First Byte

<details>
<summary>Answer</summary>

**Definition:** time taken for the browser to receive the first byte from the server.

**Flow:**

```text
Request sent
↓
DNS lookup
↓
TCP/TLS handshake
↓
Server processing
↓
First byte returned
↓
TTFB measured
```

**Good value:** ✅ ≤ 800 ms

**How to improve:**
- Faster backend processing
- CDN caching
- Edge rendering
- Server-side caching
- Optimize database queries

</details>

## 7. Code splitting

<details>
<summary>Answer</summary>

**Definition:** a technique to split a large JS bundle into smaller chunks that load only when needed (on demand).

**Types:**

**1️⃣ Route-based splitting** — load code per page/route.

```js
const Dashboard = React.lazy(() => import("./Dashboard"));
```

👉 Dashboard code loads only when the user visits that route.

**2️⃣ Component-based splitting** — load heavy components only when required.

```js
const Chart = React.lazy(() => import("./Chart"));
```

👉 Useful for charts, modals, and maps.

**3️⃣ Dynamic imports** — the native JS way to load modules lazily.

```js
import("./utils").then((module) => {
  module.calculate();
});
```

👉 Loaded only when executed.

</details>
