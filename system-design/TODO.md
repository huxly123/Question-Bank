# System Design — Topics To Study

**Progress: 50 / 233 done (21%)**

`██████░░░░░░░░░░░░░░░░░░░░░░░░` 21%

Notes live in this folder: [security](security.md), [networking](networking.md), [communication](communication.md), [performance](performance.md), [design patterns](design-patterns.md), [storage](storage.md). The two course sections (Namaste Frontend System Design) are merged in here by topic.

⭐ = high priority, most likely to come up in frontend interview loops. Tick an item and turn it into a link to the note section you wrote, then run `node progress.js` from the repo root to refresh the bars.

## Fundamentals

_9 / 13 · `███████░░░` 69%_

- [x] [How the web works](networking.md#1-how-the-web-works)
- [x] [REST APIs](networking.md#2-rest-apis)
- [x] [GraphQL](networking.md#3-graphql)
- [x] [REST vs GraphQL](networking.md#4-rest-vs-graphql)
- [x] [gRPC](networking.md#5-grpc)
- [x] [CDN (Content Delivery Network)](networking.md#6-cdn-content-delivery-network)
- [x] [Load balancer](networking.md#7-load-balancer)
- [x] [API Gateway](networking.md#8-api-gateway)
- [ ] Caching strategies (browser / CDN / API)
- [ ] Rate limiting
- [x] [WebSockets vs polling](communication.md#4-websockets)
- [ ] Communication Protocols
- [ ] What happens when you load www.google.com

## Frontend system design questions ⭐

_0 / 9 · `░░░░░░░░░░` 0%_

Interview-style "design X" prompts.

- [ ] ⭐ Design a news feed with infinite scroll (virtualization, caching, optimistic updates)
- [ ] ⭐ Design an autocomplete/typeahead at scale (debounce, cancel stale requests, cache)
- [ ] ⭐ Micro-frontend architecture — you list this in your experience questions; write real notes (module federation, shared deps, communication between MFEs)
- [ ] Design a chat application (WebSocket, message ordering, offline queue)
- [ ] Design a component library / design system (theming, versioning, docs)
- [ ] Offline-first PWA (service worker strategies, background sync)
- [ ] Feature flags and A/B testing on the frontend
- [ ] Internationalization (i18n) strategy
- [ ] Frontend error monitoring and analytics (Sentry-style: source maps, sampling)

## High level design

_0 / 12 · `░░░░░░░░░░` 0%_

Lesson titles from the Namaste course. Practise each as a 45-minute whiteboard answer.

- [ ] HLD Overview
- [ ] HLD - Photo Sharing App (Instagram)
- [ ] HLD - E-commerce App (Amazon, Flipkart)
- [ ] HLD - Video Streaming (Netflix)
- [ ] HLD - Music Streaming (Spotify)
- [ ] HLD - Live Commentary (CricInfo, Crickbuzz)
- [ ] HLD - Email Client
- [ ] HLD - Diagram Tools (Excalidraw)
- [ ] HLD - Analytics Dashboard (Google Analytics)
- [ ] HLD - Google Docs
- [ ] HLD - Google Sheets
- [ ] HLD Kanban Board

## Architecture & patterns

_5 / 10 · `█████░░░░░` 50%_

- [x] [MVC (Model-View-Controller)](design-patterns.md#1-mvc-model-view-controller)
- [x] [Atomic Design (Atom → Molecule → Organism)](design-patterns.md#2-atomic-design-atom--molecule--organism)
- [x] [Module pattern](design-patterns.md#3-module-pattern)
- [x] [Singleton pattern (global state)](design-patterns.md#4-singleton-pattern-global-state)
- [x] [Higher-Order Component (HOC) in React](design-patterns.md#5-higher-order-component-hoc-in-react)
- [ ] Backend for Frontend (BFF) pattern — when to put an API layer in front of the client
- [ ] Observer / Pub-Sub, Command (undo/redo), Factory, Facade patterns — design-patterns.md only has MVC, Atomic, Module, Singleton, HOC
- [ ] Event-driven communication between modules / micro-frontends (custom events, message bus)
- [ ] Monorepo tooling for frontend (Nx / Turborepo, shared packages, affected builds)
- [ ] Collaborative editing fundamentals: Operational Transformation vs CRDT, presence, cursors

## Data fetching & API design (client view)

_0 / 7 · `░░░░░░░░░░` 0%_

- [ ] Pagination API design: offset vs cursor vs keyset, and how each affects the UI
- [ ] API versioning, error response contracts, idempotency keys for safe retries
- [ ] Retry with exponential backoff + jitter; client-side circuit breaker; graceful degradation
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

_0 / 4 · `░░░░░░░░░░` 0%_

- [ ] Cache busting with content-hashed filenames; `Cache-Control: immutable` for assets vs no-cache for HTML
- [ ] Deployment skew: old clients hitting new API / ChunkLoadError after deploy, and how to handle it
- [ ] Rollout strategies for frontend: canary, blue-green, rollback; CI/CD pipeline for a web app
- [ ] CDN cache invalidation and purge strategies

## Runtime & browser internals

_0 / 7 · `░░░░░░░░░░` 0%_

- [ ] Main-thread scheduling: long tasks, requestAnimationFrame vs requestIdleCallback vs scheduler.yield
- [ ] Memory leaks in SPAs: detached DOM nodes, dangling listeners/timers, closures; heap snapshots in DevTools
- [ ] Adaptive loading: `navigator.connection`, Save-Data header, device-class based bundles
- [ ] Streams API for large downloads / progressive rendering of big responses
- [ ] Service Worker API
- [ ] Web Workers
- [ ] Progressive Web Apps (PWAs)

## HTML & CSS

_0 / 13 · `░░░░░░░░░░` 0%_

Markup and styling questions that come up alongside rendering and performance.

- [ ] `<script>` async vs defer
- [ ] ⭐ Semantic HTML — why it matters (SEO, a11y)
- [ ] Meta tags, Open Graph, and SEO basics
- [ ] Forms: native validation, input types
- [ ] Positioning in CSS
- [ ] Stacking context (priority between styles and classes)
- [ ] CSSOM
- [ ] ⭐ Box model (content-box vs border-box)
- [ ] ⭐ Specificity and the cascade
- [ ] ⭐ Flexbox vs Grid — when to use which; center a div three ways
- [ ] Responsive design: media queries, rem vs em vs %, mobile-first
- [ ] Animations/transitions and which properties are GPU-cheap (transform, opacity)
- [ ] Pseudo-classes vs pseudo-elements

## Accessibility

_0 / 7 · `░░░░░░░░░░` 0%_

The last three are lesson titles from the Namaste Frontend System Design course.

- [ ] ⭐ Keyboard navigation and focus management (focus trap in a modal)
- [ ] ⭐ ARIA roles and attributes — when native HTML is enough
- [ ] alt text, labels, and screen-reader behavior
- [ ] Color contrast and prefers-reduced-motion
- [ ] Accessibility Overview
- [ ] Accessibility Tools
- [ ] How to fix accessibility

## Security

_17 / 22 · `████████░░` 77%_

Namaste course lessons not yet covered in [security.md](security.md).

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

- [ ] Security Headers (only CSP and X-Frame-Options covered so far)
- [ ] Dependency Security
- [ ] Compliance & Regulation
- [ ] Input Validation and Sanitization
- [ ] Feature Policy | Permissions-Policy

## Database & caching

_6 / 11 · `█████░░░░░` 55%_

- [x] [Cookies](storage.md#1-cookies)
- [x] [Local Storage](storage.md#2-local-storage)
- [x] [Session Storage](storage.md#3-session-storage)
- [x] [IndexedDB](storage.md#4-indexeddb)
- [x] [Cache Storage](storage.md#5-cache-storage)
- [x] [How to block the main thread in JS](storage.md#6-how-to-block-the-main-thread-in-js)
- [ ] Database & Caching Overview
- [ ] Normalization
- [ ] API Caching
- [ ] Shared storage
- [ ] DynamoDB

## Logging & monitoring

_0 / 4 · `░░░░░░░░░░` 0%_

- [ ] Logging & Monitoring Overview
- [ ] Telemetry
- [ ] Alerting
- [ ] Fixing

## Testing

_0 / 9 · `░░░░░░░░░░` 0%_

The last four are lesson titles from the Namaste Frontend System Design course.

- [ ] ⭐ Jest basics: mocks, spies, fake timers (test your own debounce)
- [ ] ⭐ React Testing Library: queries, user-event, testing async UI
- [ ] Mocking API calls (MSW or jest.mock)
- [ ] Unit vs integration vs e2e — what to test where
- [ ] E2E basics: Playwright or Cypress
- [ ] Testing Overview
- [ ] Performance Testing
- [ ] Test-Driven Development Overview
- [ ] Security Testing

## Performance

_8 / 79 · `█░░░░░░░░░` 10%_

Deep-dive topics. Core Web Vitals are already written up in [performance.md](performance.md).

- [x] [Web rendering fundamentals](performance.md#1-web-rendering-fundamentals)

**Network performance**
- [ ] HTTP/1 vs HTTP/2 vs HTTP/3
- [ ] DNS lookup
- [ ] TCP / TLS handshake
- [ ] Reduce network requests
- [ ] Request batching
- [x] [CDN usage](networking.md#6-cdn-content-delivery-network)
- [ ] Compression (Gzip / Brotli)
- [ ] Resource prioritization

**JavaScript performance**
- [ ] Reduce JavaScript bundle size
- [x] [Code splitting](performance.md#7-code-splitting)
- [ ] Dynamic imports
- [ ] Tree shaking
- [ ] Dead code elimination
- [ ] Lazy loading
- [ ] Avoid large libraries

**Rendering performance**
- [ ] Reflow vs repaint
- [ ] Layout thrashing
- [ ] Reduce DOM manipulation
- [ ] Batch DOM updates
- [ ] Use DocumentFragment
- [ ] Virtualization / windowing
- [ ] Avoid forced synchronous layout

**React performance optimization**
- [ ] React.memo
- [ ] useMemo
- [ ] useCallback
- [ ] Lazy loading components
- [ ] Suspense
- [ ] State colocation
- [ ] Avoid unnecessary re-renders
- [ ] List virtualization

**Image optimization**
- [ ] Lazy-load images
- [ ] Responsive images
- [ ] Image compression
- [ ] Modern formats (WebP / AVIF)
- [ ] Proper image dimensions
- [ ] CDN image optimization

**CSS performance**
- [ ] Minify CSS
- [ ] Reduce CSS bundle size
- [ ] Avoid deep selectors
- [ ] Avoid layout thrashing
- [ ] Use GPU acceleration (transform / opacity)
- [ ] Critical CSS

**Caching strategies**
- [ ] Browser caching
- [ ] Cache-Control header
- [ ] ETag
- [ ] Last-Modified
- [ ] Service Worker caching
- [ ] Stale-while-revalidate

**Core Web Vitals**
- [x] [LCP (Largest Contentful Paint)](performance.md#2-lcp--largest-contentful-paint)
- [x] [CLS (Cumulative Layout Shift)](performance.md#3-cls--cumulative-layout-shift)
- [x] [INP (Interaction to Next Paint)](performance.md#4-inp--interaction-to-next-paint)
- [x] [FCP (First Contentful Paint)](performance.md#5-fcp--first-contentful-paint)
- [x] [TTFB (Time To First Byte)](performance.md#6-ttfb--time-to-first-byte)

**Resource loading optimization**
- [ ] Preload
- [ ] Prefetch
- [ ] Preconnect
- [ ] DNS prefetch
- [ ] Lazy-load scripts

**Build optimization**
- [ ] Webpack
- [ ] Dependency graph
- [ ] Bundle splitting
- [ ] Minification
- [ ] Bundle analyzer
- [ ] Remove unused code
- [ ] Optimize dependencies

**Performance monitoring**
- [ ] Chrome DevTools Performance tab
- [ ] Lighthouse audit
- [ ] WebPageTest
- [ ] Real User Monitoring (RUM)

**Large data rendering optimization**
- [ ] Pagination
- [ ] Infinite scroll
- [ ] Server-side pagination

**Server / architecture-level performance**
- [ ] CDN edge caching
- [ ] Server-Side Rendering (SSR)
- [ ] Static Site Generation (SSG)
- [ ] Incremental Static Regeneration (ISR)
- [ ] Edge rendering

**Course lessons**
- [ ] Performance Importance

## Node.js

_0 / 5 · `░░░░░░░░░░` 0%_

For full-stack rounds.

- [ ] Node event loop phases (how it differs from the browser)
- [ ] Streams and buffers
- [ ] Express middleware pattern
- [ ] REST API design + error handling
- [ ] Cluster vs worker threads

## Interview approach

_0 / 10 · `░░░░░░░░░░` 0%_

Namaste course bonus lessons on how the round is judged.

- [ ] Real DOM vs Shadow DOM
- [ ] SPA vs MPA
- [ ] HTML Parsing vs CSS Parsing
- [ ] Why Most Candidates Get Rejected in LLD Round
- [ ] Time Breakups in System Design Interview
- [ ] Radio Framework
- [ ] How to approach LLD Machine Coding Problems
- [ ] System Design Expectations from Early in Career Developers
- [ ] System Design Expectations from Senior Developers
- [ ] System Design Skills to Showcase on Your Resume
