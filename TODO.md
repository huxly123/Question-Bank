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

### Array
- [ ] Find the factorial of a large number
- [ ] Chocolate Distribution Problem
- [ ] Insert Interval
- [ ] Merge Intervals
- [ ] Non-overlapping Intervals

### Bit Manipulation
- [ ] Number of 1 Bits
- [ ] Counting Bits
- [ ] Missing Number
- [ ] Reverse Bits
- [ ] Find XOR of all subsets of a set

### Dynamic Programming
- [ ] Count ways to reach the n'th stair
- [ ] Coin Change
- [ ] 0/1 Knapsack Problem
- [ ] Longest Increasing Subsequence
- [ ] Longest Common Subsequence
- [ ] Word Break Problem
- [ ] Dice Throw
- [ ] Egg Dropping Puzzle
- [ ] Matrix Chain Multiplication
- [ ] Combination Sum
- [ ] Subset Sum Problem
- [ ] Find maximum possible stolen value from houses
- [ ] Count possible decodings of a given digit sequence
- [ ] Unique paths in a grid with obstacles
- [ ] Jump Game
- [ ] Cutting a Rod
- [ ] Maximum Product Cutting
- [ ] Count number of ways to cover a distance

### Graph
- [ ] Clone Graph
- [ ] Course Schedule
- [ ] Pacific Atlantic Water Flow
- [ ] Number of Islands
- [ ] Longest Consecutive Sequence
- [ ] Snake and Ladder Problem
- [ ] Detect cycle in a directed graph
- [ ] Bridges in a graph
- [ ] Check whether a given graph is bipartite
- [ ] Find size of the largest region in a boolean matrix
- [ ] Flood Fill algorithm
- [ ] Strongly Connected Components
- [ ] Topological Sorting

### Heap
- [ ] Top K Frequent Elements
- [ ] Find Median from Data Stream
- [ ] Largest triplet product in a stream
- [ ] Connect n ropes with minimum cost

### Linked List
- [ ] Reverse a Linked List
- [ ] Detect Cycle in a Linked List
- [ ] Merge Two Sorted Lists
- [ ] Merge K Sorted Lists
- [ ] Remove Nth Node From End of List
- [ ] Reorder List
- [ ] Add 1 to a number represented as a linked list
- [ ] Find the middle of a given linked list
- [ ] Delete last occurrence of an item from a linked list

### Matrix
- [ ] Set Matrix Zeroes
- [ ] Spiral Matrix
- [ ] Transpose of a matrix
- [ ] Word Search

### Stack and Queues
- [ ] Convert infix expression to postfix expression
- [ ] Next Greater Element
- [ ] Delete middle element of a stack
- [ ] Check mirror in n-ary tree
- [ ] The Celebrity Problem
- [ ] Length of the longest valid substring
- [ ] Print right view of a binary tree
- [ ] Find the first circular tour that visits all petrol pumps

### String
- [ ] Longest Substring Without Repeating Characters
- [ ] Longest Repeating Character Replacement
- [ ] Smallest window in a string containing all characters of another string
- [ ] Check whether two strings are anagrams of each other
- [ ] Print all anagrams together
- [ ] Check if a given parentheses expression is balanced
- [ ] Sentence Palindrome
- [ ] Longest Palindromic Substring
- [ ] Palindromic Substrings
- [ ] Longest Common Prefix

### Tree
- [ ] Maximum Depth of Binary Tree
- [ ] Check if two trees have the same structure
- [ ] Invert/Flip Binary Tree
- [ ] Binary Tree Maximum Path Sum
- [ ] Binary Tree Level Order Traversal
- [ ] Serialize and Deserialize Binary Tree
- [ ] Subtree of Another Tree
- [ ] Construct Binary Tree from Preorder and Inorder Traversal
- [ ] Validate Binary Search Tree
- [ ] Kth Smallest Element in a BST
- [ ] Lowest Common Ancestor of a BST
- [ ] Implement Trie (Prefix Tree)
- [ ] Add and Search Word
