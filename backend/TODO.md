# Backend — Full-Stack Round Checklist

**Progress: 65 / 83 done (78%)**

`███████████████████████░░░░░░░` 78%

Scoped to clear a full-stack interview round, not to master backend. Five layers, each with what to be able to explain (**Learn**) and what to have built once (**Build**). One project runs through all of them: the backend of the AI Financial Analyst from [career.md](../career.md), without the LLM layer. Notes go in this folder, one file per section (`node-api.md`, `postgres.md`, `redis.md`, `auth-security.md`, `async-jobs.md`, `infra.md`, `testing.md`). Then run `node progress.js` from the repo root.

⭐ = asked in almost every full-stack round. Interviewers already believe you can code; they test whether you understand the request path, the database, and what happens when something fails.

## 1. Node runtime & API design

_19 / 21 · `█████████░` 90%_

Learn
- [x] [Event loop phases, `process.nextTick` vs `setImmediate` vs `setTimeout`, why CPU work blocks the loop](node-api.md#1-how-does-the-node-event-loop-work-and-why-does-cpu-work-block-it)
- [x] [Worker threads vs cluster vs child processes: when each applies](node-api.md#2-when-would-you-use-worker-threads-cluster-or-child-processes)
- [x] [Streams and buffers: readable/writable/transform, piping, backpressure](node-api.md#3-how-do-node-streams-work-and-what-is-backpressure)
- [x] [Module system: `require` vs `import`, module caching, `module.exports` vs `exports`](node-api.md#4-how-do-commonjs-and-es-modules-differ-and-how-does-caching-work)
- [x] [REST design: resource naming, status codes, PUT vs PATCH, versioning strategies](node-api.md#5-how-do-you-design-a-clean-rest-api)
- [x] [Pagination: offset vs cursor vs keyset and how each affects the client](node-api.md#6-how-do-offset-cursor-and-keyset-pagination-differ-for-the-client)
- [x] [Idempotency keys for POST; safe retries](node-api.md#7-how-do-idempotency-keys-make-post-requests-safe-to-retry)
- [x] [Validation at the boundary (zod / joi), centralised error handling, error response contract](node-api.md#8-how-do-you-validate-input-and-return-errors-consistently)
- [x] [Express / Fastify middleware order, `next(err)`, sync vs async errors, `express.Router` structure](node-api.md#9-how-does-middleware-order-and-error-handling-work-in-express-and-fastify)
- [x] [Structured logging with correlation IDs; what to log and what never to log](node-api.md#10-what-should-structured-logs-contain-and-what-must-never-be-logged)
- [x] [Graceful shutdown on SIGTERM; health and readiness endpoints](node-api.md#11-how-do-you-shut-a-node-service-down-gracefully)
- [x] [HTTP fundamentals: request/response cycle, methods, status codes, headers, statelessness, keep-alive, HTTP/2](node-api.md#12-walk-me-through-http-cycle-methods-status-codes-headers-keep-alive-http2)
- [x] [Streaming responses: chunked transfer, Server-Sent Events, WebSockets on the server, backpressure to a slow client](node-api.md#13-how-do-you-stream-a-response-to-a-client-from-node)
- [x] [HTTP caching from the server: `Cache-Control`, `ETag`, conditional requests (304)](node-api.md#14-how-does-a-server-control-http-caching-with-cache-control-and-etag)
- [x] [`EventEmitter` and custom events; child processes (`exec`, `spawn`, `fork`)](node-api.md#15-how-do-eventemitter-and-child-processes-work-in-node)
- [x] [Process-level error handling: `unhandledRejection`, `uncaughtException`, when to crash and restart vs recover](node-api.md#16-how-do-you-handle-unhandled-rejections-and-uncaught-exceptions-in-production)
- [x] [Secure file uploads: size limits, content-type checks, streaming to object storage instead of disk](node-api.md#17-how-do-you-handle-file-uploads-securely)
- [x] [Webhooks: signature verification, retries from the sender, idempotent handling on the receiver](node-api.md#18-how-do-you-receive-webhooks-reliably-and-securely)
- [x] [Code design: layered architecture, dependency injection, repository pattern, composition over inheritance, DRY vs premature abstraction](node-api.md#19-what-code-design-principles-do-you-apply-in-a-backend-service)

Build
- [ ] Service skeleton: routes → controllers → services, request validation, error middleware, request-ID logging, `/health`
- [ ] Companies list with cursor pagination and a versioned route prefix

## 2. PostgreSQL

_12 / 15 · `████████░░` 80%_

Learn
- [x] [Schema design and normalisation for users, companies, prices; when to denormalise](postgres.md#1-how-would-you-model-users-companies-and-prices-and-when-would-you-denormalise)
- [x] [Indexes: B-tree basics, composite index column order, covering indexes, why an index is ignored](postgres.md#2-how-do-b-tree-indexes-work-and-why-might-postgres-ignore-one)
- [x] [Reading `EXPLAIN ANALYZE`: seq scan vs index scan, estimated vs actual rows](postgres.md#3-how-do-you-read-explain-analyze-output-to-find-a-slow-query)
- [x] [The N+1 problem and how ORMs cause it; joins vs batched `IN` queries](postgres.md#4-what-is-the-n1-query-problem-and-how-do-you-fix-it)
- [x] [Transactions and isolation levels; optimistic vs pessimistic locking; deadlocks](postgres.md#5-how-do-isolation-levels-locking-and-deadlocks-work-in-postgres)
- [x] [Migrations: forward-only, safe column adds, backfills without downtime](postgres.md#6-how-do-you-run-schema-migrations-without-downtime)
- [x] [Connection pooling: why one connection per request kills the database; pool sizing](postgres.md#7-why-do-you-need-connection-pooling-and-how-do-you-size-the-pool)
- [x] [SQL vs NoSQL: when Postgres is the wrong choice, JSONB as the middle ground](postgres.md#8-when-is-postgres-the-wrong-choice-and-where-does-jsonb-fit)
- [x] [ACID in plain words, and what each letter protects you from](postgres.md#9-explain-acid-in-plain-words-and-what-does-each-letter-protect-against)
- [x] [Read replicas and replication lag; sharding at vocabulary level; when to reach for either](postgres.md#10-what-are-read-replicas-and-sharding-and-when-do-you-need-each)
- [x] [Full-text search in Postgres (`tsvector`, GIN index) vs a dedicated search engine](postgres.md#11-how-does-postgres-full-text-search-work-and-when-do-you-need-a-search-engine)
- [x] [`NULL` and three-valued logic; the SQL traps interviewers like (`NOT IN` with NULLs, `COUNT(col)` vs `COUNT(*)`)](postgres.md#12-how-does-null-break-sql-logic-and-which-traps-should-you-know)

Build
- [ ] Prisma or Drizzle schema with migrations for the three tables and a seed script
- [ ] A deliberately slow query fixed with an index, with the plan saved before and after
- [ ] One multi-statement transaction with a rollback path (for example a watchlist update)

## 3. Redis

_6 / 8 · `████████░░` 75%_

Learn
- [x] [Cache-aside pattern with TTL; cache invalidation on write; stampede protection](redis.md#1-how-does-cache-aside-work-and-how-do-you-stop-a-cache-stampede)
- [x] [Rate limiting: fixed window vs sliding window vs token bucket, and where to enforce it](redis.md#2-how-do-fixed-window-sliding-window-and-token-bucket-rate-limiting-differ)
- [x] [Distributed locks with `SET NX PX` and their failure modes](redis.md#3-how-does-a-set-nx-px-distributed-lock-work-and-how-can-it-fail)
- [x] [Sessions in Redis vs stateless JWT; when each fits](redis.md#4-when-do-you-store-sessions-in-redis-and-when-is-a-stateless-jwt-better)
- [x] [Data structures worth knowing: strings, hashes, sorted sets (leaderboards, sliding windows), pub/sub](redis.md#5-which-redis-data-structures-should-you-know-and-what-is-each-one-for)
- [x] [Eviction policies and memory limits; Redis as cache vs Redis as store](redis.md#6-how-do-redis-eviction-policies-and-memory-limits-work-for-cache-versus-store)

Build
- [ ] Cache the expensive financials endpoint with TTL and invalidate on refresh
- [ ] Sliding-window rate limiter on the login route

## 4. Auth & security

_8 / 9 · `█████████░` 89%_

Learn
- [x] [Sessions vs JWT; access and refresh tokens; refresh rotation; where the client stores them](auth-security.md#1-sessions-or-jwts-how-do-you-issue-refresh-and-store-tokens)
- [x] [Password hashing (bcrypt / argon2), salting, why never encrypt passwords](auth-security.md#2-how-do-you-store-passwords-and-why-never-encrypt-them)
- [x] [OAuth 2.0 authorization code flow at whiteboard depth](auth-security.md#3-walk-me-through-the-oauth-20-authorization-code-flow-on-a-whiteboard)
- [x] [Authorization: RBAC middleware, resource ownership checks](auth-security.md#4-how-do-you-implement-rbac-middleware-and-resource-ownership-checks)
- [x] [OWASP top ten as it applies to an API: injection, broken auth, sensitive data exposure, SSRF](auth-security.md#5-which-owasp-top-ten-risks-matter-most-for-an-api-and-how-do-you-defend-them)
- [x] [CORS, security headers, secrets in environment variables, dependency auditing](auth-security.md#6-how-do-you-handle-cors-security-headers-secrets-and-dependency-audits-server-side)
- [x] [HTTPS and TLS mechanics, man-in-the-middle, session hijacking, CSRF for cookie-based APIs](auth-security.md#7-how-does-tls-stop-mitm-and-how-do-you-protect-cookie-sessions-from-hijacking-and-csrf)
- [x] [Hashing vs encryption; encryption in transit vs at rest; where PII must be encrypted or masked](auth-security.md#8-hashing-vs-encryption-in-transit-vs-at-rest-where-must-pii-be-protected)

Build
- [ ] Signup and login with refresh-token rotation and a protected, role-checked route

## 5. Async jobs & reliability

_8 / 10 · `████████░░` 80%_

Learn
- [x] [Why queues exist: decoupling, smoothing spikes, retries; queue vs cron vs event stream](async-jobs.md#1-why-use-a-queue-and-when-is-cron-or-an-event-stream-better)
- [x] [BullMQ: jobs, workers, retries with exponential backoff, dead-letter queue, concurrency](async-jobs.md#2-how-do-bullmq-jobs-workers-retries-and-dead-letter-queues-fit-together)
- [x] [Idempotent consumers: at-least-once delivery means every job may run twice](async-jobs.md#3-why-must-a-queue-consumer-be-idempotent-and-how-do-you-make-it-so)
- [x] [Timeouts, retries with jitter, and circuit breakers for third-party calls](async-jobs.md#4-how-do-timeouts-jittered-retries-and-circuit-breakers-protect-third-party-calls)
- [x] [Long-running work: return 202 with a job ID, poll or push status](async-jobs.md#5-how-do-you-expose-long-running-work-over-http-without-blocking-the-request)
- [x] [Kafka fundamentals only at the "what is it and when would I pick it over a queue" level](async-jobs.md#6-what-is-kafka-and-when-would-you-pick-it-over-a-job-queue)
- [x] [Eventual consistency and the CAP theorem at explain level; sagas and compensation for transactions across services](async-jobs.md#7-explain-cap-eventual-consistency-and-how-sagas-replace-cross-service-transactions)
- [x] [Race conditions and deadlocks in application code; DB row lock vs distributed lock vs queue serialisation](async-jobs.md#8-how-do-you-prevent-race-conditions-row-lock-distributed-lock-or-queue)

Build
- [ ] Nightly price-refresh job: calls an external API with timeout and retry, safe to run twice, failures land in a dead-letter queue
- [ ] An endpoint that enqueues work and a status endpoint the frontend can poll

## 6. Infrastructure & deployment

_12 / 15 · `████████░░` 80%_

Learn
- [x] [Docker: image vs container, layers and caching, multi-stage builds, `.dockerignore`](infra.md#1-how-do-docker-images-layers-multi-stage-builds-and-dockerignore-fit-together)
- [x] [Docker Compose for app + Postgres + Redis with volumes and env files](infra.md#2-how-would-you-run-an-app-with-postgres-and-redis-in-docker-compose)
- [x] [CI/CD: lint, test, build image, deploy; what runs on every push vs on merge](infra.md#3-what-does-a-cicd-pipeline-run-on-every-push-versus-on-merge)
- [x] [Environment and secrets management: `.env` locally, a secrets manager in production, never in the image](infra.md#4-how-do-you-manage-environment-config-and-secrets-across-local-and-production)
- [x] [Horizontal scaling: stateless app behind a load balancer, sticky sessions vs shared session store](infra.md#5-how-do-you-scale-a-node-api-horizontally-and-where-do-sessions-go)
- [x] [Managed databases and object storage (RDS-style Postgres, S3-style buckets, presigned URLs)](infra.md#6-why-use-managed-postgres-and-object-storage-and-what-are-presigned-urls)
- [x] [Zero-downtime deploys: rolling, blue-green, health checks, running migrations first](infra.md#7-how-do-you-deploy-with-zero-downtime-including-database-migrations)
- [x] [Observability basics: logs, metrics, traces; what to alert on](infra.md#8-what-are-logs-metrics-and-traces-and-what-should-you-alert-on)
- [x] [Basic cloud vocabulary on one provider: compute, managed DB, object storage, load balancer, DNS. Kubernetes is not an immediate priority](infra.md#9-name-the-core-cloud-building-blocks-and-what-each-one-does)
- [x] [Monolith vs microservices: service boundaries, when to split, inter-service communication, what gets harder](infra.md#10-monolith-or-microservices-when-do-you-split-and-what-gets-harder)
- [x] [Reverse proxy and API gateway (nginx-style): TLS termination, routing, rate limiting, request size limits](infra.md#11-what-does-a-reverse-proxy-or-api-gateway-do-in-front-of-node)
- [x] [Finding a slow endpoint in production: APM, event-loop lag, heap snapshots, load testing with k6 or autocannon](infra.md#12-how-do-you-find-and-fix-a-slow-endpoint-in-production)

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
