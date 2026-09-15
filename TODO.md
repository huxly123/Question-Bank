# Topics To Study

Merged checklist of topics still to cover, grouped by area.

⭐ = high priority — most likely to come up in frontend (React/Next.js) interviews.

## JavaScript

- [ ] Strict mode in JavaScript
- [ ] Call stacks
- [ ] Execution context
- [ ] Jobs and priority queues
- [ ] Event loop
- [ ] Shadowing
- [ ] Memory management
- [ ] Method chaining
- [ ] Arrow functions vs normal functions
- [ ] Flattening an object
- [ ] Prototype chaining
- [ ] Callback hell
- [ ] async/await
- [ ] ⭐ Event loop: microtasks vs macrotasks (setTimeout vs Promise ordering output questions)
- [ ] ⭐ Implement debounce and throttle in plain JS (not just the React hooks you have)
- [ ] ⭐ Write Promise.all / Promise.any polyfills
- [ ] ⭐ Event delegation
- [ ] Implement an EventEmitter (on / off / emit / once)
- [ ] Implement memoize
- [ ] Deep clone: JSON trick vs structuredClone vs recursive implementation
- [ ] pipe / compose functions
- [ ] ES Modules vs CommonJS
- [ ] WeakMap / WeakSet and garbage collection

## TypeScript

- [ ] ⭐ type vs interface
- [ ] ⭐ Generics (write a typed function/hook)
- [ ] ⭐ Utility types: Partial, Pick, Omit, Record, ReturnType
- [ ] any vs unknown vs never
- [ ] Union and intersection types, type narrowing / type guards
- [ ] Enums vs const objects (`as const`)
- [ ] Typing React props, children, events, and refs

## React

- [ ] Browser Object Model (BOM)
- [ ] Error boundaries
- [ ] Hooks
- [ ] Reference lifecycle events
- [ ] React patterns
- [ ] Redux and the Redux cycle
- [ ] Web apps
- [ ] React portal
- [ ] How the DOM is traversed
- [ ] Component lifecycle
- [ ] Class vs functional components
- [ ] CSRF and web security in React
- [ ] Interceptors
- [ ] React Fiber
- [ ] Lazy loading in React
- [ ] ⭐ useEffect vs useLayoutEffect (and useEffect cleanup, dependency pitfalls)
- [ ] ⭐ Custom hooks: rules of hooks, when to extract one
- [ ] ⭐ Context API: how it works, why it re-renders, how to avoid the re-render trap
- [ ] ⭐ Keys in lists: why index keys break state
- [ ] Concurrent React: useTransition, useDeferredValue
- [ ] React Server Components vs client components
- [ ] StrictMode (why effects run twice in dev)
- [ ] State management comparison: Redux Toolkit vs Zustand vs Context — when to use which

## Next.js ⭐ (your migration story — interviewers will drill here)

- [ ] ⭐ CSR vs SSR vs SSG vs ISR — explain with your Gatsby→Next migration numbers (build time, page speed)
- [ ] ⭐ Hydration: what it is, hydration mismatch errors, how to fix them
- [ ] ⭐ App Router vs Pages Router (server components, layouts, loading/error files)
- [ ] Data fetching: getStaticProps/getServerSideProps vs fetch + cache options in App Router
- [ ] Server Actions
- [ ] Middleware (auth, redirects, rewrites)
- [ ] next/image and next/font optimization
- [ ] Dynamic routes and catch-all routes
- [ ] Caching layers in Next.js (full route cache, data cache, revalidation)

## CSS

- [ ] Positioning in CSS
- [ ] Stacking context (priority between styles and classes)
- [ ] CSSOM
- [ ] ⭐ Box model (content-box vs border-box)
- [ ] ⭐ Specificity and the cascade
- [ ] ⭐ Flexbox vs Grid — when to use which; center a div three ways
- [ ] Responsive design: media queries, rem vs em vs %, mobile-first
- [ ] Animations/transitions and which properties are GPU-cheap (transform, opacity)
- [ ] Pseudo-classes vs pseudo-elements

## HTML

- [ ] `<script>` async vs defer
- [ ] ⭐ Semantic HTML — why it matters (SEO, a11y)
- [ ] Meta tags, Open Graph, and SEO basics
- [ ] Forms: native validation, input types

## Accessibility (a11y)

- [ ] ⭐ Keyboard navigation and focus management (focus trap in a modal)
- [ ] ⭐ ARIA roles and attributes — when native HTML is enough
- [ ] alt text, labels, and screen-reader behavior
- [ ] Color contrast and prefers-reduced-motion

## Build Tools

- [ ] Webpack
- [ ] Tree shaking
- [ ] Dependency graph
- [ ] What happens when you load www.google.com

## Browser

- [ ] Shared storage
- [ ] Service Worker API
- [ ] Web Workers
- [ ] DynamoDB
- [ ] Progressive Web Apps (PWAs)

## System Design

- [ ] Caching strategies (browser / CDN / API)
- [ ] Rate limiting
- [ ] WebSockets vs polling

### Frontend system design (interview-style "design X" questions)

- [ ] ⭐ Design a news feed with infinite scroll (virtualization, caching, optimistic updates)
- [ ] ⭐ Design an autocomplete/typeahead at scale (debounce, cancel stale requests, cache)
- [ ] ⭐ Micro-frontend architecture — you list this in your experience questions; write real notes (module federation, shared deps, communication between MFEs)
- [ ] Design a chat application (WebSocket, message ordering, offline queue)
- [ ] Design a component library / design system (theming, versioning, docs)
- [ ] Offline-first PWA (service worker strategies, background sync)
- [ ] Feature flags and A/B testing on the frontend
- [ ] Internationalization (i18n) strategy
- [ ] Frontend error monitoring and analytics (Sentry-style: source maps, sampling)

### Additional system design topics (commonly asked, not in the course)

**Architecture & patterns**
- [ ] Backend for Frontend (BFF) pattern — when to put an API layer in front of the client
- [ ] Observer / Pub-Sub, Command (undo/redo), Factory, Facade patterns — design-patterns.md only has MVC, Atomic, Module, Singleton, HOC
- [ ] Event-driven communication between modules / micro-frontends (custom events, message bus)
- [ ] Monorepo tooling for frontend (Nx / Turborepo, shared packages, affected builds)
- [ ] Collaborative editing fundamentals: Operational Transformation vs CRDT, presence, cursors

**Data fetching & API design from the client's view**
- [ ] Pagination API design: offset vs cursor vs keyset, and how each affects the UI
- [ ] API versioning, error response contracts, idempotency keys for safe retries
- [ ] Retry with exponential backoff + jitter; client-side circuit breaker; graceful degradation
- [ ] Race conditions in async UI: AbortController, request sequencing, stale-response guards
- [ ] Data fetching patterns: waterfall vs parallel, render-as-you-fetch, prefetch on hover / in viewport
- [ ] Optimistic UI: rollback on failure, conflict handling, dedupe on retry
- [ ] Large file upload: chunking, resumable uploads, presigned URLs, progress + cancel

**Real-time & offline**
- [ ] WebSocket resilience: reconnection with backoff, heartbeats, message ordering, at-least-once vs exactly-once delivery
- [ ] Offline-first conflict resolution: last-write-wins vs merge, sync queue in IndexedDB, Background Sync API
- [ ] Web Push notifications (Push API + service worker) and in-app notification system design
- [ ] Cross-tab communication: BroadcastChannel, storage events, SharedWorker (e.g. logout in one tab logs out all)

**Auth in SPAs**
- [ ] OAuth 2.0 Authorization Code + PKCE for SPAs; refresh token rotation; silent refresh
- [ ] SSO and single logout across multiple frontends / subdomains

**Deployment & delivery**
- [ ] Cache busting with content-hashed filenames; `Cache-Control: immutable` for assets vs no-cache for HTML
- [ ] Deployment skew: old clients hitting new API / ChunkLoadError after deploy, and how to handle it
- [ ] Rollout strategies for frontend: canary, blue-green, rollback; CI/CD pipeline for a web app
- [ ] CDN cache invalidation and purge strategies

**Runtime & browser internals**
- [ ] Main-thread scheduling: long tasks, requestAnimationFrame vs requestIdleCallback vs scheduler.yield
- [ ] Memory leaks in SPAs: detached DOM nodes, dangling listeners/timers, closures; heap snapshots in DevTools
- [ ] Adaptive loading: `navigator.connection`, Save-Data header, device-class based bundles
- [ ] Streams API for large downloads / progressive rendering of big responses

### Performance (deep-dive topics)

**Network performance**
- [ ] HTTP/1 vs HTTP/2 vs HTTP/3
- [ ] DNS lookup
- [ ] TCP / TLS handshake
- [ ] Reduce network requests
- [ ] Request batching
- [ ] CDN usage
- [ ] Compression (Gzip / Brotli)
- [ ] Resource prioritization

**JavaScript performance**
- [ ] Reduce JavaScript bundle size
- [ ] Code splitting
- [ ] Dynamic imports
- [ ] Tree shaking
- [ ] Dead code elimination
- [ ] Lazy loading
- [ ] Web Workers
- [ ] Debounce
- [ ] Throttle
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
- [x] [LCP (Largest Contentful Paint)](system-design/performance.md#2-lcp--largest-contentful-paint)
- [x] [CLS (Cumulative Layout Shift)](system-design/performance.md#3-cls--cumulative-layout-shift)
- [x] [INP (Interaction to Next Paint)](system-design/performance.md#4-inp--interaction-to-next-paint)
- [x] [FCP (First Contentful Paint)](system-design/performance.md#5-fcp--first-contentful-paint)
- [x] [TTFB (Time To First Byte)](system-design/performance.md#6-ttfb--time-to-first-byte)

**Resource loading optimization**
- [ ] Preload
- [ ] Prefetch
- [ ] Preconnect
- [ ] DNS prefetch
- [ ] Lazy-load scripts

**Build optimization**
- [ ] Bundle splitting
- [ ] Tree shaking
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
- [ ] List virtualization
- [ ] Pagination
- [ ] Infinite scroll
- [ ] Server-side pagination

**Server / architecture-level performance**
- [ ] CDN edge caching
- [ ] Server-Side Rendering (SSR)
- [ ] Static Site Generation (SSG)
- [ ] Incremental Static Regeneration (ISR)
- [ ] Edge rendering

## Namaste Frontend System Design — course topics not yet covered

Lesson titles as listed in the course. Only lessons with no notes in this repo and no existing TODO entry.

**Networking**
- [ ] Communication Protocols

**Security**
- [ ] Security Headers (only CSP and X-Frame-Options covered so far)
- [ ] Dependency Security
- [ ] Compliance & Regulation
- [ ] Input Validation and Sanitization
- [ ] Feature Policy | Permissions-Policy

**Testing**
- [ ] Testing Overview
- [ ] Performance Testing
- [ ] Test-Driven Development Overview
- [ ] Security Testing

**Performance**
- [ ] Performance Importance

**Database & Caching**
- [ ] Database & Caching Overview
- [ ] Normalization
- [ ] API Caching

**Logging & Monitoring**
- [ ] Logging & Monitoring Overview
- [ ] Telemetry
- [ ] Alerting
- [ ] Fixing

**Accessibility**
- [ ] Accessibility Overview
- [ ] Accessibility Tools
- [ ] How to fix accessibility

**Low Level Design**
- [ ] Component Design
- [ ] Config driven UI
- [ ] Shimmer UI
- [ ] Routing & Protected Routes
- [ ] Accordion
- [ ] Real-Time Updates
- [ ] YouTube Live Stream Chat UI

**High Level Design**
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

**System Design [Bonus]**
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

## Machine Coding (build live in 30–60 min — practice these end to end)

- [ ] ⭐ Autocomplete / typeahead with debounce and keyboard navigation
- [ ] ⭐ Modal with focus trap and Escape-to-close
- [ ] ⭐ Tabs component
- [ ] ⭐ Nested comments / folder tree (recursive rendering — you have the theory, build it timed)
- [ ] Star rating (hover + click states)
- [ ] Image carousel
- [ ] Todo list with filters and localStorage persistence
- [ ] Poll / progress-bar widget
- [ ] Drag and drop list reordering
- [ ] Countdown timer / stopwatch (setInterval cleanup)

## Testing

- [ ] ⭐ Jest basics: mocks, spies, fake timers (test your own debounce)
- [ ] ⭐ React Testing Library: queries, user-event, testing async UI
- [ ] Mocking API calls (MSW or jest.mock)
- [ ] Unit vs integration vs e2e — what to test where
- [ ] E2E basics: Playwright or Cypress

## Node.js (for full-stack rounds)

- [ ] Node event loop phases (how it differs from the browser)
- [ ] Streams and buffers
- [ ] Express middleware pattern
- [ ] REST API design + error handling
- [ ] Cluster vs worker threads

## Behavioral / Experience Prep

- [ ] ⭐ Quantify the Gatsby→Next migration: exact build-time and page-speed numbers, before/after — your strongest story, make it STAR-shaped
- [ ] ⭐ Flesh out the app↔web login issue story (what was the root cause, your role)
- [ ] Batch user-list processing story: memory numbers, why batching, alternatives considered
- [ ] A conflict/disagreement story and a failure story
- [ ] Questions to ask the interviewer

## DSA — Questions To Practice

Tracked separately in [DSA/TODO.md](DSA/TODO.md), which lists both solved and open problems.
