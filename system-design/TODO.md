# System Design — Topics To Study

**Progress: 50 / 137 done (36%)**

`███████████░░░░░░░░░░░░░░░░░░░` 36%

Notes live in this folder: [security](security.md), [networking](networking.md), [communication](communication.md), [performance](performance.md), [design patterns](design-patterns.md), [storage](storage.md). The two course sections (Namaste Frontend System Design) are merged in here by topic.

⭐ = high priority, most likely to come up in frontend interview loops. Tick an item and turn it into a link to the note section you wrote, then run `node progress.js` from the repo root to refresh the bars.

## Fundamentals

_9 / 12 · `████████░░` 75%_

- [x] [How the web works](networking.md#1-how-the-web-works)
- [x] [REST APIs](networking.md#2-rest-apis)
- [x] [GraphQL](networking.md#3-graphql)
- [x] [REST vs GraphQL](networking.md#4-rest-vs-graphql)
- [x] [gRPC](networking.md#5-grpc)
- [x] [CDN (Content Delivery Network)](networking.md#6-cdn-content-delivery-network)
- [x] [Load balancer](networking.md#7-load-balancer)
- [x] [API Gateway](networking.md#8-api-gateway)
- [x] [WebSockets vs polling](communication.md#4-websockets)
- [ ] ⭐ What happens when you load www.google.com (DNS, TCP/TLS, HTTP, parse, render)
- [ ] Communication protocols: HTTP/HTTPS, TCP vs UDP, WebSocket, when each is used
- [ ] ⭐ SPA vs MPA: trade-offs, SEO, routing, when to pick which
## Frontend system design questions ⭐

_0 / 10 · `░░░░░░░░░░` 0%_

Interview-style "design X" prompts. Answer each with the RADIO framework.

- [ ] ⭐ Design a news feed with infinite scroll (virtualization, caching, optimistic updates)
- [ ] ⭐ Design an autocomplete/typeahead at scale (debounce, cancel stale requests, cache)
- [ ] ⭐ Micro-frontend architecture: module federation, shared deps, communication between MFEs (custom events, message bus); it is in your experience questions
- [ ] ⭐ UI component design: modal, dropdown, image carousel, data table (API, state, accessibility)
- [ ] Design a chat application (WebSocket, message ordering, offline queue)
- [ ] Design a component library / design system (theming, versioning, docs)
- [ ] Offline-first PWA (service worker strategies, background sync)
- [ ] Feature flags and A/B testing on the frontend
- [ ] Internationalization (i18n) strategy
- [ ] Frontend error monitoring and analytics (Sentry-style: source maps, sampling)
## High level design

_0 / 7 · `░░░░░░░░░░` 0%_

Case studies from the Namaste course that also appear in every frontend system design question bank. Practise each as a 45-minute whiteboard answer.

- [ ] HLD - Photo Sharing App (Instagram)
- [ ] HLD - E-commerce App (Amazon, Flipkart)
- [ ] HLD - Video Streaming (Netflix)
- [ ] HLD - Live Commentary (CricInfo, Cricbuzz)
- [ ] HLD - Email Client
- [ ] HLD - Analytics Dashboard (Google Analytics)
- [ ] HLD - Google Docs (collaborative editing: Operational Transformation vs CRDT, presence, cursors)
## Architecture & patterns

_5 / 8 · `██████░░░░` 63%_

- [x] [MVC (Model-View-Controller)](design-patterns.md#1-mvc-model-view-controller)
- [x] [Atomic Design (Atom → Molecule → Organism)](design-patterns.md#2-atomic-design-atom--molecule--organism)
- [x] [Module pattern](design-patterns.md#3-module-pattern)
- [x] [Singleton pattern (global state)](design-patterns.md#4-singleton-pattern-global-state)
- [x] [Higher-Order Component (HOC) in React](design-patterns.md#5-higher-order-component-hoc-in-react)
- [ ] Backend for Frontend (BFF) pattern — when to put an API layer in front of the client
- [ ] Observer / Pub-Sub, Command (undo/redo), Factory, Facade patterns
- [ ] Monorepo tooling for frontend (Nx / Turborepo, shared packages, affected builds)
## Data fetching & API design (client view)

_0 / 7 · `░░░░░░░░░░` 0%_

- [ ] Pagination API design: offset vs cursor vs keyset, and how each affects the UI
- [ ] API versioning, error response contracts, idempotency keys for safe retries
- [ ] Retry with exponential backoff + jitter; handling 429 rate limits; client-side circuit breaker; graceful degradation
- [ ] Race conditions in async UI: AbortController, request sequencing, stale-response guards
- [ ] Data fetching patterns: waterfall vs parallel, render-as-you-fetch, prefetch on hover / in viewport
- [ ] Optimistic UI: rollback on failure, conflict handling, dedupe on retry
- [ ] Large file upload: chunking, resumable uploads, presigned URLs, progress + cancel
## Real-time & offline

_5 / 9 · `██████░░░░` 56%_

- [x] [Short polling](communication.md#1-short-polling)
- [x] [Long polling](communication.md#2-long-polling)
- [x] [Server-Sent Events (SSE)](communication.md#3-server-sent-events-sse)
- [x] [WebSockets](communication.md#4-websockets)
- [x] [Webhooks](communication.md#5-webhooks)
- [ ] WebSocket resilience: reconnection with backoff, heartbeats, message ordering, at-least-once vs exactly-once delivery
- [ ] Offline-first conflict resolution: last-write-wins vs merge, sync queue in IndexedDB, Background Sync API
- [ ] Web Push notifications (Push API + service worker) and in-app notification system design
- [ ] Cross-tab communication: BroadcastChannel, storage events, SharedWorker (e.g. logout in one tab logs out all)
## Auth in SPAs

_0 / 2 · `░░░░░░░░░░` 0%_

- [ ] OAuth 2.0 Authorization Code + PKCE for SPAs; refresh token rotation; silent refresh
- [ ] SSO and single logout across multiple frontends / subdomains
## Deployment & delivery

_0 / 3 · `░░░░░░░░░░` 0%_

- [ ] ⭐ Cache busting with content-hashed filenames; `Cache-Control: immutable` for assets vs no-cache for HTML; CDN invalidation and purge
- [ ] ⭐ Deployment skew: old clients hitting new API / ChunkLoadError after deploy, and how to handle it
- [ ] Rollout strategies for frontend: canary, blue-green, rollback; CI/CD pipeline for a web app
## Runtime & browser internals

_0 / 4 · `░░░░░░░░░░` 0%_

- [ ] ⭐ Main-thread scheduling: long tasks, requestAnimationFrame vs requestIdleCallback vs scheduler.yield
- [ ] ⭐ Memory leaks in SPAs: detached DOM nodes, dangling listeners/timers, closures; heap snapshots in DevTools
- [ ] ⭐ Service workers and PWAs: lifecycle, caching strategies, offline, install prompt
- [ ] ⭐ Web Workers: what to offload, message passing, limits
## HTML & CSS

_0 / 10 · `░░░░░░░░░░` 0%_

Markup and styling questions that come up alongside rendering and performance.

- [ ] ⭐ `<script>` async vs defer
- [ ] ⭐ Semantic HTML — why it matters (SEO, a11y)
- [ ] Meta tags, Open Graph, and SEO basics
- [ ] ⭐ Box model (content-box vs border-box)
- [ ] ⭐ Specificity and the cascade
- [ ] ⭐ Flexbox vs Grid — when to use which; center a div three ways
- [ ] Positioning and stacking context (z-index, what creates a new context)
- [ ] Responsive design: media queries, rem vs em vs %, mobile-first
- [ ] Animations/transitions and which properties are GPU-cheap (transform, opacity)
- [ ] Web Components and Shadow DOM vs the real DOM (and vs React's virtual DOM)
## Accessibility

_0 / 5 · `░░░░░░░░░░` 0%_

- [ ] ⭐ Keyboard navigation and focus management (focus trap in a modal)
- [ ] ⭐ ARIA roles and attributes — when native HTML is enough
- [ ] alt text, labels, and screen-reader behavior
- [ ] Color contrast and prefers-reduced-motion
- [ ] Auditing accessibility: axe, Lighthouse, testing with a screen reader, fixing the common failures
## Security

_17 / 20 · `█████████░` 85%_

- [x] [Cross-Site Scripting (XSS)](security.md#1-cross-site-scripting-xss)
- [x] [iFrame protection (clickjacking)](security.md#2-iframe-protection-clickjacking)
- [x] [Content Security Policy (CSP)](security.md#3-content-security-policy-csp)
- [x] [CORS](security.md#4-cors)
- [x] [CSRF (Cross-Site Request Forgery)](security.md#5-csrf-cross-site-request-forgery)
- [x] [Server-Side Request Forgery (SSRF)](security.md#6-server-side-request-forgery-ssrf)
- [x] [Server-Side JavaScript Injection (SSJI)](security.md#7-server-side-javascript-injection-ssji)
- [x] [Subresource Integrity (SRI)](security.md#8-subresource-integrity-sri)
- [x] [HttpOnly, Secure, and SameSite cookies](security.md#9-httponly-secure-and-samesite-cookies)
- [x] [Avoid exposing sensitive data](security.md#10-avoid-exposing-sensitive-data)
- [x] [Why JWT tokens are stored in cookies (instead of localStorage)](security.md#11-why-jwt-tokens-are-stored-in-cookies-instead-of-localstorage)
- [x] [Refresh token & access token](security.md#12-refresh-token--access-token)
- [x] [Authentication vs authorization](security.md#13-authentication-vs-authorization)
- [x] [Session-based / JWT / OAuth authentication](security.md#14-session-based--jwt--oauth-authentication)
- [x] [Checking the Origin / Referer header](security.md#15-checking-the-origin--referer-header)
- [x] [HTTP vs HTTPS](security.md#16-http-vs-https)
- [x] [JWT login flow](security.md#17-jwt-login-flow)
- [ ] Security headers beyond CSP: HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [ ] Dependency security: lockfiles, `npm audit`, supply-chain attacks, SRI for third-party scripts
- [ ] Input validation and sanitization on the client (and why the server must repeat it)
## Database & caching

_6 / 7 · `█████████░` 86%_

- [x] [Cookies](storage.md#1-cookies)
- [x] [Local Storage](storage.md#2-local-storage)
- [x] [Session Storage](storage.md#3-session-storage)
- [x] [IndexedDB](storage.md#4-indexeddb)
- [x] [Cache Storage](storage.md#5-cache-storage)
- [x] [How to block the main thread in JS](storage.md#6-how-to-block-the-main-thread-in-js)
- [ ] Normalizing client-side state (entities by id) and when to denormalize
## Logging & monitoring

_0 / 1 · `░░░░░░░░░░` 0%_

- [ ] Frontend telemetry: what to log client-side, sampling, PII, alerting on error rate and Web Vitals
## Testing

_0 / 5 · `░░░░░░░░░░` 0%_

- [ ] ⭐ Jest basics: mocks, spies, fake timers (test your own debounce)
- [ ] ⭐ React Testing Library: queries, user-event, testing async UI
- [ ] Mocking API calls (MSW or jest.mock)
- [ ] Unit vs integration vs e2e — what to test where
- [ ] E2E basics: Playwright or Cypress
## Performance

_8 / 21 · `████░░░░░░` 38%_

Deep-dive topics grouped the way interviewers ask them; the one-line techniques live inside each. Core Web Vitals are already written up in [performance.md](performance.md).

- [x] [Web rendering fundamentals](performance.md#1-web-rendering-fundamentals)
- [x] [CDN usage](networking.md#6-cdn-content-delivery-network)
- [x] [Code splitting](performance.md#7-code-splitting)
- [x] [LCP (Largest Contentful Paint)](performance.md#2-lcp--largest-contentful-paint)
- [x] [CLS (Cumulative Layout Shift)](performance.md#3-cls--cumulative-layout-shift)
- [x] [INP (Interaction to Next Paint)](performance.md#4-inp--interaction-to-next-paint)
- [x] [FCP (First Contentful Paint)](performance.md#5-fcp--first-contentful-paint)
- [x] [TTFB (Time To First Byte)](performance.md#6-ttfb--time-to-first-byte)
- [ ] ⭐ Critical rendering path: HTML and CSS parsing, CSSOM, render-blocking resources, async/defer
- [ ] ⭐ Network: HTTP/1.1 vs 2 vs 3, DNS/TCP/TLS cost, compression (gzip/Brotli), request batching, `fetchpriority`
- [ ] ⭐ Resource hints: preload, prefetch, preconnect, dns-prefetch, modulepreload
- [ ] ⭐ HTTP caching: `Cache-Control`, `ETag` / `Last-Modified`, `immutable`, stale-while-revalidate, service worker caching, API response caching
- [ ] ⭐ JavaScript bundle: code splitting and dynamic imports, tree shaking, minification, bundle analyzer, replacing heavy libraries
- [ ] ⭐ Rendering and layout: reflow vs repaint, layout thrashing and forced synchronous layout, batching DOM writes, `DocumentFragment`, `content-visibility`
- [ ] ⭐ React rendering performance: `React.memo` / `useMemo` / `useCallback`, state colocation, list virtualization, `Suspense` and lazy boundaries
- [ ] ⭐ Images: lazy loading, responsive `srcset` / `sizes`, WebP / AVIF, explicit dimensions to avoid CLS, CDN transforms
- [ ] Web fonts: `font-display`, preload, subsetting, self-hosting vs Google Fonts
- [ ] Critical CSS: inline above-the-fold CSS, defer the rest, keep CSS small
- [ ] ⭐ Measuring: DevTools Performance panel, Lighthouse, WebPageTest, lab vs field (RUM)
- [ ] Large lists and data: pagination vs infinite scroll vs virtualization, server-side pagination
- [ ] Rendering strategies: SSR, SSG, ISR, edge and streaming (the Next.js deep dive lives in [react/TODO.md](../react/TODO.md))
## Node.js

_0 / 3 · `░░░░░░░░░░` 0%_

For full-stack rounds.

- [ ] Node event loop phases (how it differs from the browser)
- [ ] Express middleware pattern; REST API design and error handling
- [ ] Streams and buffers
## Interview approach

_0 / 3 · `░░░░░░░░░░` 0%_

How the round is judged.

- [ ] ⭐ RADIO framework: requirements, architecture, data model, interface, optimizations; how to split the 45 minutes
- [ ] How the LLD / machine coding round is judged and how to approach it
- [ ] What is expected at early-career vs senior level in a system design round
