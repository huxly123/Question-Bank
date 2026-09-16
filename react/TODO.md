# React & Next.js — Topics To Study

**Progress: 16 / 47 done (34%)**

`██████████░░░░░░░░░░░░░░░░░░░░` 34%

Theory lives in [theory.md](theory.md), snippets in [code-snippets.md](code-snippets.md). Next.js is the migration story interviewers will drill into.

⭐ = high priority, most likely to come up in frontend interview loops. Tick an item and turn it into a link to the note section you wrote, then run `node progress.js` from the repo root to refresh the bars.

## React

_16 / 38 · `████░░░░░░` 42%_

- [x] [Stateless components](theory.md#1-stateless-components)
- [x] [Stateful components](theory.md#2-stateful-components)
- [x] [Reconciliation](theory.md#3-reconciliation)
- [x] [Virtual DOM](theory.md#4-virtual-dom)
- [x] [Controlled components](theory.md#5-controlled-components)
- [x] [Uncontrolled components](theory.md#6-uncontrolled-components)
- [x] [useCallback](theory.md#7-usecallback)
- [x] [useMemo](theory.md#8-usememo)
- [x] [What is a Higher-Order Component (HOC)?](theory.md#9-what-is-a-higher-order-component-hoc)
- [x] [Pure vs impure components](theory.md#10-pure-vs-impure-components)
- [x] [Virtual DOM vs Real DOM](theory.md#11-virtual-dom-vs-real-dom)
- [x] [Why is React faster than vanilla JS (for UI updates)?](theory.md#12-why-is-react-faster-than-vanilla-js-for-ui-updates)
- [x] [How do you structure a recursively rendered component?](theory.md#13-how-do-you-structure-a-recursively-rendered-component)
- [x] [Debounce hook](code-snippets.md#1-debounce-hook)
- [x] [Throttle hook](code-snippets.md#2-throttle-hook)
- [x] [Infinite scroll with IntersectionObserver](code-snippets.md#3-infinite-scroll-with-intersectionobserver)
- [ ] ⭐ JSX under the hood: what it compiles to, Fragments, conditional rendering pitfalls (`&&` with `0`)
- [ ] ⭐ Class vs function components; lifecycle phases and their hook equivalents (mount, update, unmount)
- [ ] ⭐ `useState`: batching, functional updates, stale closures in timeouts and effects
- [ ] ⭐ `useEffect`: dependency array, cleanup, `useLayoutEffect`, why effects run twice in StrictMode
- [ ] ⭐ `useRef`: DOM access vs mutable value vs state; `forwardRef` and `useImperativeHandle`
- [ ] `useReducer` vs `useState`: when reducer logic pays off
- [ ] ⭐ Custom hooks: rules of hooks, when to extract one
- [ ] ⭐ Context API: prop drilling, how it works, why consumers re-render, splitting contexts to avoid it
- [ ] ⭐ Why does a component re-render? Parent renders, prop identity, `React.memo`, finding it with the Profiler
- [ ] ⭐ Keys in lists: why index keys break state
- [ ] ⭐ Synthetic events: delegation at the root, the event object, passing handlers vs calling them
- [ ] ⭐ Data fetching in effects: race conditions, cleanup with `AbortController`, loading and error states; vs React Query / SWR
- [ ] Error boundaries: what they catch and what they do not (event handlers, async, SSR)
- [ ] Portals: modals and tooltips, how events bubble through a portal
- [ ] ⭐ Code splitting: `React.lazy`, `Suspense`, route-based splitting
- [ ] Concurrent rendering: Fiber, render vs commit phases, automatic batching, `useTransition`, `useDeferredValue`
- [ ] ⭐ Server Components vs Client Components: the `'use client'` boundary and what can cross it
- [ ] Component patterns: compound components, render props, HOC vs hooks
- [ ] React Router: nested routes, dynamic params, protected routes, programmatic navigation
- [ ] ⭐ State management: Redux data flow and Redux Toolkit vs Zustand vs Context, when to use which
- [ ] React 19: `use()`, Actions, `useOptimistic`, `useFormStatus`
- [ ] XSS in React: why JSX escapes, `dangerouslySetInnerHTML`, sanitising HTML
## Next.js ⭐

_0 / 9 · `░░░░░░░░░░` 0%_

- [ ] ⭐ CSR vs SSR vs SSG vs ISR, explained with your Gatsby→Next migration numbers (build time, page speed)
- [ ] ⭐ Hydration: what it is, hydration mismatch errors, how to fix them
- [ ] ⭐ App Router vs Pages Router: server components by default, nested layouts, `loading.tsx` / `error.tsx` / `not-found.tsx`, streaming
- [ ] ⭐ Data fetching and caching: `getStaticProps` / `getServerSideProps` vs `fetch` cache options; full route cache, data cache, `revalidatePath` / `revalidateTag`
- [ ] Server Actions: mutations without API routes, progressive enhancement, when not to use them
- [ ] Middleware: auth checks, redirects, rewrites, and its Edge runtime limits
- [ ] `next/image`, `next/font`, and `next/link` prefetching
- [ ] Dynamic and catch-all routes; Route Handlers (API routes); Edge vs Node runtime
- [ ] SEO: `metadata` and `generateMetadata`, sitemap and robots, Open Graph
