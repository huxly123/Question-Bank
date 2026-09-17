# Question Bank

Personal interview preparation notes — theory, output questions, code snippets, and DSA practice, organized by topic. Every question's answer is collapsed behind a **details** toggle, so you can quiz yourself: read the question, answer it in your head, then expand to check.

## How this repo works

1. **Pick a topic** from the area's checklist. [TODO.md](TODO.md) is the dashboard that links to every checklist and shows progress per area.
2. **Learn it and write it up** in the matching note file (or a new file), following [template.md](template.md).
3. **Tick it in that checklist** and turn the item into a link to the section you wrote, so the checklist stays the "what's next" view and the notes stay the "what I know" view.
4. **Run `node progress.js`** from the repo root to refresh every progress bar.
5. **Revise** by opening a note file on GitHub and answering the questions before expanding them.

**Adding a new topic area:** create a folder with a `theory.md` and a `TODO.md` (see [template.md](template.md) and any existing area checklist), and link both below. The dashboard picks the new checklist up automatically.

## Notes

### JavaScript
- [Checklist](javascript/TODO.md) — JavaScript and TypeScript topics still to cover
- [Theory](javascript/theory.md) — data types, hoisting, closures, `this`, promises, classes, and more (33 questions)
- [Code snippets](javascript/code-snippets.md) — predict-the-output practice (45 snippets)

### React
- [Checklist](react/TODO.md) — React and Next.js topics still to cover
- [Theory](react/theory.md) — virtual DOM, reconciliation, controlled/uncontrolled components, hooks, HOCs
- [Code snippets](react/code-snippets.md) — debounce, throttle, infinite scroll

### System Design
- [Checklist](system-design/TODO.md) — system design, performance, browser internals, HTML/CSS, accessibility, testing and Node topics, including the Namaste course lessons
- [Security](system-design/security.md) — XSS, CSRF, CORS, CSP, cookies, HTTPS, JWT/OAuth/session auth
- [Networking](system-design/networking.md) — how the web works, REST, GraphQL, gRPC, CDN, load balancer, API gateway
- [Communication](system-design/communication.md) — polling, SSE, WebSockets, webhooks
- [Performance](system-design/performance.md) — rendering pipeline, Core Web Vitals, code splitting
- [Design patterns](system-design/design-patterns.md) — MVC, Atomic Design, module, singleton, HOC
- [Storage](system-design/storage.md) — cookies, localStorage, sessionStorage, IndexedDB, Cache Storage, main-thread blocking

### Backend
- [Checklist](backend/TODO.md) — Node runtime and API design, PostgreSQL, Redis, auth and security, async jobs, infrastructure; scoped to clear a full-stack round
- [Node runtime & API design](backend/node-api.md) — event loop, workers, streams, REST and pagination, idempotency, validation and errors, logging, shutdown, HTTP, streaming responses, caching, uploads, webhooks, code design (21 questions)
- [Testing & debugging](backend/testing.md) — API tests with supertest and test databases, mocking HTTP and time, the inspector and heap snapshots, contract testing (5 questions)
- [Infrastructure & deployment](backend/infra.md) — Docker and Compose, CI/CD, secrets, horizontal scaling, managed DB and object storage, zero-downtime deploys, observability, cloud building blocks, monolith vs microservices, reverse proxy, finding a slow endpoint (13 questions)
- [Async jobs & reliability](backend/async-jobs.md) — why queues, BullMQ retries and dead letters, idempotent consumers, timeouts and circuit breakers, 202 and polling, Kafka vs queue, CAP and sagas, race conditions and locks (9 questions)
- [Auth & security](backend/auth-security.md) — sessions vs JWT and refresh rotation, password hashing, OAuth code flow, RBAC, OWASP for APIs, headers and secrets, TLS and CSRF, hashing vs encryption (9 questions)
- [PostgreSQL](backend/postgres.md) — schema design, indexes and EXPLAIN, N+1, transactions and locking, migrations, pooling, JSONB, ACID, replicas and sharding, full-text search, NULL traps (13 questions)
- [Redis](backend/redis.md) — cache-aside and stampedes, rate limiting algorithms, distributed locks, sessions vs JWT, data structures, eviction (7 questions)

### Behavioral
- [Checklist](behavioral/TODO.md) — stories to finish and questions to be able to answer out loud
- [Stories](behavioral/stories.md) — STAR(R) story bank with a matrix of which story answers which question
- [Questions](behavioral/questions.md) — HR screen, hiring manager, behavioral categories, and questions to ask them, answers collapsed

### Machine Coding
- [Checklist](machine-coding/TODO.md) — components to build live, plus the course's low-level design lessons

### DSA
- [DSA tracker](DSA/TODO.md) — every problem, solved and open, with a patterns cheat sheet; solved ones link to their write-up
- [Array](DSA/array.md), [Binary Search](DSA/binary-search.md), [Recursion](DSA/recursion.md), [Stack and Queues](DSA/stack-queue.md), [String](DSA/string.md), [Two Pointers and Sliding Window](DSA/sliding-window.md) — self-quizzing problem notes with copyable JavaScript solutions

## Other

- [TODO](TODO.md) — progress dashboard linking every area checklist
- [progress.js](progress.js) — refreshes all counts and bars: `node progress.js`
- [Career context](career.md) — goal, roadmap, skill levels and advice rules that Claude loads every session
- [Resources](resources.md) — interview question banks and job boards
- [Template](template.md) — format and conventions for new notes
