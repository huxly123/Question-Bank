# Backend — Full-Stack Round Checklist

**Progress: 0 / 83 done (0%)**

`░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░` 0%

Scoped to clear a full-stack interview round, not to master backend. Five layers, each with what to be able to explain (**Learn**) and what to have built once (**Build**). One project runs through all of them: the backend of the AI Financial Analyst from [career.md](../career.md), without the LLM layer. Notes go in this folder, one file per section (`node-api.md`, `postgres.md`, `redis.md`, `auth-security.md`, `async-jobs.md`, `infra.md`, `testing.md`). Then run `node progress.js` from the repo root.

⭐ = asked in almost every full-stack round. Interviewers already believe you can code; they test whether you understand the request path, the database, and what happens when something fails.

## 1. Node runtime & API design

_0 / 21 · `░░░░░░░░░░` 0%_

Learn
- [ ] ⭐ Event loop phases, `process.nextTick` vs `setImmediate` vs `setTimeout`, why CPU work blocks the loop
- [ ] ⭐ Worker threads vs cluster vs child processes: when each applies
- [ ] Streams and buffers: readable/writable/transform, piping, backpressure
- [ ] Module system: `require` vs `import`, module caching, `module.exports` vs `exports`
- [ ] ⭐ REST design: resource naming, status codes, PUT vs PATCH, versioning strategies
- [ ] ⭐ Pagination: offset vs cursor vs keyset and how each affects the client
- [ ] ⭐ Idempotency keys for POST; safe retries
- [ ] ⭐ Validation at the boundary (zod / joi), centralised error handling, error response contract
- [ ] Express / Fastify middleware order, `next(err)`, sync vs async errors, `express.Router` structure
- [ ] Structured logging with correlation IDs; what to log and what never to log
- [ ] Graceful shutdown on SIGTERM; health and readiness endpoints
- [ ] ⭐ HTTP fundamentals: request/response cycle, methods, status codes, headers, statelessness, keep-alive, HTTP/2
- [ ] ⭐ Streaming responses: chunked transfer, Server-Sent Events, WebSockets on the server, backpressure to a slow client
- [ ] HTTP caching from the server: `Cache-Control`, `ETag`, conditional requests (304)
- [ ] `EventEmitter` and custom events; child processes (`exec`, `spawn`, `fork`)
- [ ] Process-level error handling: `unhandledRejection`, `uncaughtException`, when to crash and restart vs recover
- [ ] Secure file uploads: size limits, content-type checks, streaming to object storage instead of disk
- [ ] Webhooks: signature verification, retries from the sender, idempotent handling on the receiver
- [ ] Code design: layered architecture, dependency injection, repository pattern, composition over inheritance, DRY vs premature abstraction

Build
- [ ] Service skeleton: routes → controllers → services, request validation, error middleware, request-ID logging, `/health`
- [ ] Companies list with cursor pagination and a versioned route prefix

## 2. PostgreSQL

_0 / 15 · `░░░░░░░░░░` 0%_

Learn
- [ ] ⭐ Schema design and normalisation for users, companies, prices; when to denormalise
- [ ] ⭐ Indexes: B-tree basics, composite index column order, covering indexes, why an index is ignored
- [ ] ⭐ Reading `EXPLAIN ANALYZE`: seq scan vs index scan, estimated vs actual rows
- [ ] ⭐ The N+1 problem and how ORMs cause it; joins vs batched `IN` queries
- [ ] ⭐ Transactions and isolation levels; optimistic vs pessimistic locking; deadlocks
- [ ] Migrations: forward-only, safe column adds, backfills without downtime
- [ ] ⭐ Connection pooling: why one connection per request kills the database; pool sizing
- [ ] SQL vs NoSQL: when Postgres is the wrong choice, JSONB as the middle ground
- [ ] ⭐ ACID in plain words, and what each letter protects you from
- [ ] Read replicas and replication lag; sharding at vocabulary level; when to reach for either
- [ ] Full-text search in Postgres (`tsvector`, GIN index) vs a dedicated search engine
- [ ] `NULL` and three-valued logic; the SQL traps interviewers like (`NOT IN` with NULLs, `COUNT(col)` vs `COUNT(*)`)

Build
- [ ] Prisma or Drizzle schema with migrations for the three tables and a seed script
- [ ] A deliberately slow query fixed with an index, with the plan saved before and after
- [ ] One multi-statement transaction with a rollback path (for example a watchlist update)

## 3. Redis

_0 / 8 · `░░░░░░░░░░` 0%_

Learn
- [ ] ⭐ Cache-aside pattern with TTL; cache invalidation on write; stampede protection
- [ ] ⭐ Rate limiting: fixed window vs sliding window vs token bucket, and where to enforce it
- [ ] Distributed locks with `SET NX PX` and their failure modes
- [ ] Sessions in Redis vs stateless JWT; when each fits
- [ ] Data structures worth knowing: strings, hashes, sorted sets (leaderboards, sliding windows), pub/sub
- [ ] Eviction policies and memory limits; Redis as cache vs Redis as store

Build
- [ ] Cache the expensive financials endpoint with TTL and invalidate on refresh
- [ ] Sliding-window rate limiter on the login route

## 4. Auth & security

_0 / 9 · `░░░░░░░░░░` 0%_

Learn
- [ ] ⭐ Sessions vs JWT; access and refresh tokens; refresh rotation; where the client stores them
- [ ] ⭐ Password hashing (bcrypt / argon2), salting, why never encrypt passwords
- [ ] OAuth 2.0 authorization code flow at whiteboard depth
- [ ] Authorization: RBAC middleware, resource ownership checks
- [ ] ⭐ OWASP top ten as it applies to an API: injection, broken auth, sensitive data exposure, SSRF
- [ ] CORS, security headers, secrets in environment variables, dependency auditing
- [ ] HTTPS and TLS mechanics, man-in-the-middle, session hijacking, CSRF for cookie-based APIs
- [ ] Hashing vs encryption; encryption in transit vs at rest; where PII must be encrypted or masked

Build
- [ ] Signup and login with refresh-token rotation and a protected, role-checked route

## 5. Async jobs & reliability

_0 / 10 · `░░░░░░░░░░` 0%_

Learn
- [ ] ⭐ Why queues exist: decoupling, smoothing spikes, retries; queue vs cron vs event stream
- [ ] ⭐ BullMQ: jobs, workers, retries with exponential backoff, dead-letter queue, concurrency
- [ ] ⭐ Idempotent consumers: at-least-once delivery means every job may run twice
- [ ] ⭐ Timeouts, retries with jitter, and circuit breakers for third-party calls
- [ ] Long-running work: return 202 with a job ID, poll or push status
- [ ] Kafka fundamentals only at the "what is it and when would I pick it over a queue" level
- [ ] Eventual consistency and the CAP theorem at explain level; sagas and compensation for transactions across services
- [ ] Race conditions and deadlocks in application code; DB row lock vs distributed lock vs queue serialisation

Build
- [ ] Nightly price-refresh job: calls an external API with timeout and retry, safe to run twice, failures land in a dead-letter queue
- [ ] An endpoint that enqueues work and a status endpoint the frontend can poll

## 6. Infrastructure & deployment

_0 / 15 · `░░░░░░░░░░` 0%_

Learn
- [ ] ⭐ Docker: image vs container, layers and caching, multi-stage builds, `.dockerignore`
- [ ] ⭐ Docker Compose for app + Postgres + Redis with volumes and env files
- [ ] ⭐ CI/CD: lint, test, build image, deploy; what runs on every push vs on merge
- [ ] Environment and secrets management: `.env` locally, a secrets manager in production, never in the image
- [ ] ⭐ Horizontal scaling: stateless app behind a load balancer, sticky sessions vs shared session store
- [ ] Managed databases and object storage (RDS-style Postgres, S3-style buckets, presigned URLs)
- [ ] Zero-downtime deploys: rolling, blue-green, health checks, running migrations first
- [ ] Observability basics: logs, metrics, traces; what to alert on
- [ ] Basic cloud vocabulary on one provider: compute, managed DB, object storage, load balancer, DNS. Kubernetes is not an immediate priority
- [ ] ⭐ Monolith vs microservices: service boundaries, when to split, inter-service communication, what gets harder
- [ ] Reverse proxy and API gateway (nginx-style): TLS termination, routing, rate limiting, request size limits
- [ ] Finding a slow endpoint in production: APM, event-loop lag, heap snapshots, load testing with k6 or autocannon

Build
- [ ] Dockerfile with a multi-stage build and a Compose file that brings up the whole stack
- [ ] GitHub Actions workflow that runs tests and builds the image on every push
- [ ] Deploy the API to one managed platform with Postgres and Redis attached, and document the steps

## 7. Testing & debugging

_0 / 5 · `░░░░░░░░░░` 0%_

Learn
- [ ] ⭐ API tests with supertest; unit vs integration for a backend; test database strategy (transaction rollback or a throwaway container)
- [ ] Mocking external calls and time: stubs, spies, fake timers, `nock`-style HTTP interception
- [ ] Debugging Node: the inspector, reading a heap snapshot for a leak, detecting a blocked event loop
- [ ] Contract testing between frontend and API at the "why it exists" level

Build
- [ ] Test suite for the auth routes and the price-refresh job with the external API mocked, running in CI
