# Infrastructure & Deployment

This note covers how a Node service gets packaged, shipped and run (Docker, Compose, CI/CD, secrets, scaling, managed cloud services, zero-downtime deploys, observability, proxies, production debugging); revise by reading each question, answering aloud before opening the answer, then expanding on any point you skipped.

## 1. How do Docker images, layers, multi-stage builds and .dockerignore fit together?

<details>
<summary>Answer</summary>

An image is a read-only, layered filesystem plus metadata (entrypoint, env, exposed ports) built from a Dockerfile. A container is a running process started from an image, with its own writable layer, network namespace and process tree. One image can run as many containers; deleting a container leaves the image untouched.

Layers and caching:

- Each Dockerfile instruction (`FROM`, `RUN`, `COPY`) produces a layer. Layers are content-addressed and shared between images on the same host and in the registry.
- Build cache: Docker reuses a layer if the instruction and its inputs are unchanged. The first changed instruction invalidates that layer and every layer after it.
- So order instructions from least to most volatile: copy `package.json` and the lockfile, run install, then copy source. A code change then re-runs only the final copy, not the install.

Multi-stage builds: one stage has the full toolchain to compile and install; the final stage copies only the output. The result has no dev dependencies, no compiler and no source; smaller image, smaller attack surface, faster pulls.

```dockerfile
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:lts-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

`.dockerignore` works like `.gitignore` for the build context: everything not excluded is sent to the daemon and is eligible for `COPY . .`. Always exclude `node_modules`, `.git`, `.env*`, `dist`, coverage and logs. Otherwise your host `node_modules` (possibly wrong-platform binaries) overwrites the freshly installed ones, secrets leak into a layer, and every build ships a huge context.

Trade-offs the interviewer probes:

- Alpine is small but uses musl, so native modules (sharp, bcrypt) can need rebuilding; a `-slim` Debian image is the safe default when you hit that.
- `npm ci` over `npm install`: installs exactly the lockfile and fails if it is out of date, so builds are reproducible.
- Run as a non-root user (`USER node`); the official image ships one.
- Pin the base image tag; `latest` makes builds non-reproducible.
- A file deleted in a later `RUN rm` is still in the image history. Multi-stage is the fix, not `rm`.

In an AI product: never bake an LLM provider key into an image with `ENV`; it ends up in `docker history` and in every registry copy.

</details>

## 2. How would you run an app with Postgres and Redis in Docker Compose?

<details>
<summary>Answer</summary>

Docker Compose describes several containers, their network and volumes in one YAML file, so `docker compose up` gives every developer the same app, database and cache with one command. It is for local development and small single-host deployments; it is not an orchestrator for multi-node production.

```yaml
services:
  api:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    environment:
      DATABASE_URL: postgres://app:app@db:5432/app
      REDIS_URL: redis://cache:6379
    depends_on:
      db: { condition: service_healthy }
      cache: { condition: service_started }
  db:
    image: postgres:alpine   # pin a specific major in real projects
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 10
  cache:
    image: redis:alpine
    volumes: [redisdata:/data]
volumes:
  pgdata:
  redisdata:
```

How it works:

- Every service joins a default network and can reach the others by service name. `db` resolves to the Postgres container, so the connection string uses the container port (5432), not a host-mapped one.
- `ports` publishes to the host only when you need to reach the service from your laptop. The API needs it; Postgres often does not.
- Named volumes (`pgdata`) live outside the container's writable layer, so `docker compose down` keeps the data and `down -v` wipes it. Bind mounts (`./src:/app/src`) are for live-reloading code, not for database files.
- `env_file` loads key=value pairs into the container. Keep `.env` out of git and commit an `.env.example`.
- `depends_on` only orders startup. `condition: service_healthy` plus a healthcheck is what actually waits for Postgres to accept connections; without it the API races the database and crashes on first boot. Even so, the app should retry its connection.

When not to use: production with more than one host, autoscaling or rolling deploys. Compose has no scheduler; you graduate to ECS, Kubernetes or a managed platform. Keep the Compose file anyway for local dev and for integration tests in CI.

Probe: "why does the API connect to `db:5432` but you use `localhost:5433` from psql?" Inside the Compose network the service name resolves and the container port applies; from the host you go through whatever mapping `ports` published.

</details>

## 3. What does a CI/CD pipeline run on every push versus on merge?

<details>
<summary>Answer</summary>

CI runs lint, type-check, tests and a build on every push to give a fast signal; CD packages the merged commit into an image, pushes it to a registry and deploys it. The split: everything cheap and side-effect-free runs on every push and pull request; anything that publishes or touches an environment runs only on merge to the main branch (or on a tag).

| Stage | On PR / push | On merge to main |
|---|---|---|
| Install, lint, typecheck | yes | yes |
| Unit and integration tests (Postgres and Redis as service containers) | yes | yes |
| Build Docker image | yes, to catch Dockerfile breaks; do not push | yes, push tagged with the commit SHA |
| Deploy to staging | no | yes, automatic |
| Deploy to production | no | manual approval, or automatic after smoke tests |

```yaml
name: ci
on:
  push: { branches: [main] }
  pull_request:
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres: { image: postgres:alpine, env: { POSTGRES_PASSWORD: test }, ports: ["5432:5432"] }
    steps:
      - uses: actions/checkout@vN        # pin the current major
      - uses: actions/setup-node@vN
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm run lint && npm run typecheck && npm test
  build-and-deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@vN
      - run: docker build -t $REGISTRY/api:${{ github.sha }} .
      - run: docker push $REGISTRY/api:${{ github.sha }}
      - run: ./scripts/deploy.sh ${{ github.sha }}
```

Principles:

- Tag images with the git SHA, not `latest`. A deploy is then "point the service at this exact image", and a rollback is pointing it at the previous SHA.
- Build once, promote the same image through staging and production. Rebuilding per environment means you never tested what you shipped.
- Cache `node_modules` and Docker layers in CI, or every run pays the full install.
- Secrets for pushing and deploying come from the CI provider's secret store and are available only to the merge job, never to PR builds from forks.
- Keep the pipeline fast enough that people wait for it (around ten minutes is a common rule of thumb, not a standard).

Trade-off probed: continuous deployment (every merge ships) versus continuous delivery (every merge is shippable, a human presses the button). Small teams with good tests and fast rollback do the former; regulated products and mobile releases do the latter.

In an AI product: tests that call a real LLM are slow, flaky and cost money. Mock the provider in CI and run a tiny set of real-call smoke tests on merge or nightly only.

</details>

## 4. How do you manage environment config and secrets across local and production?

<details>
<summary>Answer</summary>

Configuration is anything that differs between environments (database URL, feature flags, log level); secrets are configuration that must never be readable by anyone who should not have it (database password, API keys, JWT signing key). Both are injected at runtime through environment variables; neither is baked into the image or committed to git.

Locally: a `.env` file loaded by `dotenv` or Node's `--env-file` flag, git-ignored, with a committed `.env.example` listing every key with a dummy value. The example doubles as documentation.

In production: a secrets manager (AWS Secrets Manager or SSM Parameter Store; Vault, GCP Secret Manager and Azure Key Vault are equivalents). The platform (ECS task definition, Lambda config, Kubernetes secret) reads from the manager at start and exposes the values to the process as env vars or a mounted file. Application code is identical in both cases: it reads `process.env.DATABASE_URL`.

Rules:

- Validate all config at boot with a schema (zod, envalid) and crash immediately if a required key is missing. A misconfigured service should fail fast, not 500 at 3am.
- Never `ENV SECRET=...` or `COPY .env` in a Dockerfile. Layers are readable with `docker history`, so anyone with registry pull access has the secret. `.dockerignore` must exclude `.env*`.
- Never log the full config object. Redact known secret keys in the logger.
- Rotate: a secrets manager supports rotation and versioning; a `.env` on a server does not. Rotation only takes effect if the app re-reads or restarts, so short-lived credentials (IAM roles, RDS IAM authentication) beat long-lived passwords where available.
- Prefer identity over secrets: a container running with an IAM role can call S3 with no key at all.
- Different secrets per environment. Staging must not hold production keys.

Trade-off: env vars are universal and simple but visible in `/proc/<pid>/environ` and in crash dumps; file mounts are slightly safer and can support rotation without restart, at the cost of more platform-specific setup.

In an AI product: LLM provider keys are the highest-value secret you hold because a leak is billed to you within minutes. Keep them server-side only, one key per environment, and set spend alerts with the provider.

</details>

## 5. How do you scale a Node API horizontally, and where do sessions go?

<details>
<summary>Answer</summary>

Run N identical copies of the API behind a load balancer and keep every copy stateless, so any request can go to any instance. State that must outlive a request (sessions, uploads, cache, jobs) lives in shared services: Postgres, Redis, S3, a queue. Scaling is then adding or removing instances, and a crashed instance loses nothing.

Vertical scaling (a bigger machine) is simpler and often enough early, but it has a ceiling, is a single point of failure, and a restart takes everything down. Horizontal scaling has no ceiling in principle but forces you to remove hidden state.

What "stateless" rules out:

- In-memory session maps (the `express-session` default MemoryStore).
- Uploads saved to local disk.
- In-process caches that must be consistent (a per-instance cache of rarely-changing data is fine).
- In-process cron or singletons: two instances run the job twice. Use a queue with one worker, or a distributed lock.
- WebSocket rooms held in one process: use a Redis pub/sub adapter so a message on instance A reaches a socket on instance B.

Sessions, two options:

| | Sticky sessions | Shared session store |
|---|---|---|
| How | LB pins a client to one instance (cookie or IP hash) | Session stored in Redis; any instance reads it |
| Pro | No code change | True statelessness; an instance can die freely |
| Con | Uneven load; instance death logs users out; deploys must drain | One more dependency; a Redis round-trip per request |
| Use | Legacy apps you cannot change | The default for new services |

Stateless tokens (JWT) avoid the store entirely at the price of hard revocation; see the auth note.

The load balancer (AWS ALB; nginx or HAProxy self-hosted) distributes requests, health-checks each instance and stops routing to unhealthy ones, and terminates TLS. Autoscaling adds instances on CPU, request count or queue depth and removes them when quiet, which requires instances that start fast (small images) and stop cleanly (graceful shutdown; see the Node note).

Inside one machine, Node's `cluster` module or PM2 forks one process per core; that is horizontal scaling within the box and is complementary. In containers you usually run one process per container and let the orchestrator replicate.

Probe: "what breaks when you go from one instance to two?" Sessions, uploads, cron, WebSockets, rate limiters counting in memory, and any code that assumed a single process.

In an AI product: scale the stateless HTTP workers on request count and the LLM job workers separately on queue depth; a long-running generation is a queued job, not an HTTP request held open across a deploy.

</details>

## 6. Why use managed Postgres and object storage, and what are presigned URLs?

<details>
<summary>Answer</summary>

A managed database is Postgres run by the cloud provider: they handle the OS, patching, backups, failover and monitoring; you get an endpoint and credentials. Object storage is a flat key-value store for files with per-object URLs and permissions. Presigned URLs let a client upload or download one object directly without your server relaying the bytes.

Managed Postgres (AWS RDS or Aurora; Cloud SQL, Azure Database, Neon, Supabase are equivalents):

- You choose instance size, storage and Multi-AZ (a synchronous standby in another zone that takes over on failure).
- Automated backups and point-in-time recovery are built in. Test the restore; a backup nobody has restored is a hope.
- Read replicas offload reporting or read-heavy endpoints; replication lag means a just-written row may not be there yet.
- Connection limits depend on instance size, and Node pools multiply by instance count; a proxy (RDS Proxy, PgBouncer) sits in between when the count gets large.
- You give up superuser access and some extensions, and pay a premium over a self-run VM. For nearly every team the premium is worth it.

Object storage (AWS S3; GCS, Azure Blob, Cloudflare R2, MinIO are equivalents):

- Buckets hold objects addressed by key (`uploads/2024/avatar-123.png`). There are no real directories; the slash is a naming convention.
- Durable and cheap per gigabyte, effectively unlimited, with lifecycle rules to expire or archive.
- Private by default. Serve public assets through a CDN (CloudFront) in front of the bucket rather than making the bucket public.

Presigned URLs: the server, which holds credentials, signs a URL granting one operation (PUT or GET) on one key for a short time. The browser then talks to S3 directly.

Upload flow:

1. Client calls `POST /uploads` with filename and content type.
2. Server validates (type, size limit, user quota), generates a key, returns `{ uploadUrl, key }`.
3. Client `PUT`s the file to `uploadUrl`.
4. Client calls `POST /uploads/{key}/complete`; server records it and optionally queues processing.

Benefits: Node instances never buffer large files, so they stay small and stateless. Downsides: you must set CORS on the bucket, you cannot inspect the bytes before they land (scan asynchronously), and you must clean up after clients that get a URL and never finish.

</details>

## 7. How do you deploy with zero downtime, including database migrations?

<details>
<summary>Answer</summary>

Zero downtime means users never see errors during a deploy: new instances start and prove healthy before old ones stop serving, and the database stays compatible with both versions while both run. The three ingredients are a deploy strategy, a real health check, and migrations that are backward compatible.

Strategies:

- Rolling: replace instances a few at a time. Cheap, no extra capacity, but old and new run together for minutes, so both must tolerate each other's schema and API.
- Blue-green: bring up a full new set (green) beside the old (blue), switch the load balancer, keep blue for instant rollback. Costs double capacity for a while; rollback is a flip.
- Canary: send a small share of traffic to the new version, watch error rate and latency, then widen. Needs weighted routing and good metrics.

Health checks: the load balancer or orchestrator polls an endpoint before sending traffic and keeps polling to detect failures.

- Liveness ("am I running?"): a trivial 200. If it fails, restart me.
- Readiness ("can I take traffic?"): checks database and cache connections and that warm-up finished. If it fails, stop routing to me but do not restart.

Do not make readiness call every downstream on every poll, or one slow dependency pulls your whole fleet out of rotation.

Graceful shutdown completes the picture: on SIGTERM stop accepting connections, finish in-flight requests, exit (see the Node note).

Migrations first, and backward compatible. Because old code runs against the new schema during a rollout, every migration must be additive (the expand-and-contract pattern):

1. Add a nullable column or new table; deploy code that writes both old and new.
2. Backfill in batches.
3. Deploy code that reads the new column.
4. Drop the old column in a later release of its own.

Never rename a column in one step; never add a `NOT NULL` column without a default; build indexes with `CREATE INDEX CONCURRENTLY` to avoid long locks. Run migrations as a separate pipeline step before the rollout, not on app boot where N instances race to run them.

Rollback: the schema is compatible with the previous version, so rollback is redeploying the previous image tag with no database change.

Trade-off probed: blue-green buys instant rollback at double cost; rolling is cheap but demands discipline about compatibility. Feature flags decouple "deployed" from "released" and ease the pressure on either.

</details>

## 8. What are logs, metrics and traces, and what should you alert on?

<details>
<summary>Answer</summary>

Logs are timestamped events with context; metrics are numbers aggregated over time; traces follow one request across services and show where the time went. Together they answer "what happened", "how much and how often", and "where". Alert on symptoms users feel, not on every cause.

Logs: structured JSON, one line per event, with `level`, `msg`, `requestId`, `route`, `durationMs`. Ship them from stdout to a central store (CloudWatch Logs; Loki and Datadog are equivalents). Search by `requestId` to reconstruct one request. Never log secrets or full request bodies; see the Node note on what must not be logged.

Metrics: cheap to store and to query over long ranges. The four "golden signals" for an HTTP service: latency (p50/p95/p99, never the average), traffic (requests per second), errors (5xx rate), saturation (CPU, memory, event-loop lag, pool usage, queue depth). Expose them with `prom-client` or push to CloudWatch; use a histogram for latency so percentiles can be computed.

Traces: each request gets a trace ID propagated in headers (W3C `traceparent`); each unit of work is a span with a start, end and attributes. OpenTelemetry is the vendor-neutral SDK; the backend is X-Ray, Jaeger, Tempo or Datadog. A trace shows the endpoint spent 900 ms in one SQL query and 30 ms in Node. Put the trace ID in every log line so the three pillars join.

What to alert on:

- Symptom-based: 5xx rate above a threshold for several minutes, p99 latency above the target, health checks failing, queue lag growing, jobs failing repeatedly.
- Not on: CPU at 70 percent, a single error, a disk at 60 percent. Those belong on dashboards, not pages.
- Every alert needs a runbook link and an owner. An alert nobody acts on gets muted and then hides a real one.
- Define an SLO (say, 99.9 percent of requests under 500 ms) and alert when the error budget burns too fast.

Trade-off: high-cardinality labels (user ID as a metric label) explode metric storage; put those in logs and traces instead, and sample traces in high-traffic services.

In an AI product: record tokens in and out and provider latency as metrics per model and per feature, and alert on token spend per hour exceeding a budget; a retry loop against a paid API is a cost incident as much as a reliability one.

</details>

## 9. Name the core cloud building blocks and what each one does.

<details>
<summary>Answer</summary>

Compute runs your code, a managed database holds relational data, object storage holds files, a load balancer spreads traffic and terminates TLS, and DNS points a name at the load balancer. Every provider sells these; AWS names below, with equivalents alongside.

| Need | AWS | Elsewhere | What it does for a Node API |
|---|---|---|---|
| Compute (VMs) | EC2 | GCE, Azure VMs, Droplets | A machine you SSH into and run Node or Docker on. Most control, most ops |
| Compute (containers) | ECS, with Fargate for serverless containers | Cloud Run, Container Apps, Fly.io, Render | You give it an image and a count; it runs and replaces containers. The usual sweet spot |
| Compute (functions) | Lambda | Cloud Functions, Azure Functions | Runs a handler per event, scales to zero, has cold starts and time limits. Good for webhooks and glue |
| Managed DB | RDS, Aurora | Cloud SQL, Azure Database, Neon | Postgres with backups, failover, patching |
| Cache and queue | ElastiCache (Redis), SQS | Memorystore, Upstash | Session store, rate limiting, job queue |
| Object storage | S3 | GCS, Azure Blob, R2 | Uploads, exports, static assets |
| CDN | CloudFront | Cloud CDN, Cloudflare | Caches static assets and cacheable API responses at the edge |
| Load balancer | ALB (HTTP), NLB (TCP) | Cloud Load Balancing | TLS termination, health checks, routing by path or host |
| DNS | Route 53 | Cloud DNS, Cloudflare | Maps `api.example.com` to the ALB; weighted records enable blue-green |
| Registry | ECR | Artifact Registry, GHCR, Docker Hub | Stores built images by tag |
| Secrets | Secrets Manager, SSM | Secret Manager, Key Vault | See entry 4 |
| Identity | IAM | Cloud IAM | Roles that let a container call S3 without a key |

Glue vocabulary:

- Region: a geographic area. Availability zone (AZ): an isolated data centre inside it. Run across two AZs for resilience.
- VPC: your private network. Public subnets hold the load balancer; private subnets hold the app and database, which have no public IP.
- Security group: a firewall on a service. The database's group allows only the app's group on port 5432.

A minimal production shape: Route 53 to ALB to an ECS Fargate service (two or more tasks in private subnets) to RDS Postgres (Multi-AZ) and ElastiCache Redis; S3 plus CloudFront for files; ECR for images; Secrets Manager for config; CloudWatch for logs and alarms.

Kubernetes (EKS on AWS) is the general-purpose orchestrator: it runs containers across nodes from a declarative desired state. Know that it exists and that ECS or a PaaS covers most small teams. It is not a priority for this round.

</details>

## 10. Monolith or microservices: when do you split, and what gets harder?

<details>
<summary>Answer</summary>

A monolith is one deployable unit with one codebase and usually one database; microservices are several independently deployed services, each owning its data and talking over the network. Start with a well-structured monolith. Split when a boundary has a clear owner, a clear contract, and a scaling, deployment or team reason the monolith cannot meet.

Why a monolith first:

- One deploy, one test suite, one local setup. Refactoring across a boundary is a rename, not a coordinated release.
- Work spanning features is a single database transaction.
- Latency between modules is a function call.
- You do not know your real boundaries yet; splitting early bakes in the wrong ones.

A "modular monolith" is the middle ground: strict module boundaries inside one process (separate folders, each exposing a small interface, no reaching into another module's tables). If you later split, the seams already exist.

When to split (want more than one reason):

- Team scale: several teams blocking each other's deploys and merge queues.
- Different scaling profiles: a CPU-heavy PDF renderer or LLM job runner should not scale with the login endpoint.
- Different runtimes: a Python ML service beside a Node API.
- Isolation: a component whose failure or security posture must not take down the rest (payments).
- Independent release cadence.

Boundaries follow business capabilities (orders, billing, notifications), not technical layers (a "database service"). Each service owns its data; nobody else queries its tables. Shared data is exposed through an API or published events.

Inter-service communication:

| Style | Examples | Use when |
|---|---|---|
| Synchronous request/response | HTTP/REST, gRPC | Caller needs the answer now (fetch a price) |
| Asynchronous events | SQS, Kafka, RabbitMQ, BullMQ | Caller only needs it to happen eventually (send email, update search index) |

Prefer async where the product allows; it removes temporal coupling and absorbs bursts.

What gets harder:

- Consistency: no cross-service transactions. You get eventual consistency, sagas (a sequence of local transactions with compensating actions), and the outbox pattern (write the event in the same transaction as the data, publish it afterwards).
- Debugging: one user action spans five logs. Distributed tracing becomes mandatory.
- Failure modes: partial outages, timeouts, retries and duplicate messages. You need timeouts, circuit breakers and idempotent consumers.
- Operations: N pipelines, N dashboards, N on-call surfaces, contract versioning between services.
- Local development: running twelve services on a laptop.
- Data joins: a report that was one SQL query becomes an aggregation service or a warehouse.

Trade-off probed: microservices trade code complexity for operational complexity. They pay off when organisational scale is the bottleneck, not as a performance optimisation.

In an AI product: the common first split is the HTTP API versus an LLM job worker service connected by a queue, because their scaling, timeouts and cost profiles are entirely different.

</details>

## 11. What does a reverse proxy or API gateway do in front of Node?

<details>
<summary>Answer</summary>

A reverse proxy sits in front of your application servers, accepts client connections and forwards requests to them. It handles the concerns that are the same for every app (TLS, routing, limits, compression, static files) so Node does not have to. An API gateway is a reverse proxy with API-specific features: authentication, per-client rate limits, request transformation and usage analytics. nginx, HAProxy, Caddy, Envoy and Traefik are proxies; AWS API Gateway, Kong and Apigee are gateways.

What it does:

- TLS termination: the proxy holds the certificate, speaks HTTPS to the client and plain HTTP to Node on the private network. Certificate rotation (Let's Encrypt, ACM) happens in one place. In AWS the ALB does this job; nginx is the self-hosted equivalent.
- Routing by host (`api.example.com` vs `www`) or path (`/api/` to Node, `/` to static files). Path routing is how a monolith gets split gradually.
- Load balancing across several upstreams with health checks.
- Rate limiting per IP or key before requests reach the app, returning 429. A coarse first line; per-user limits still live in the app with Redis.
- Request size limits: reject a huge body before Node buffers it. Also request timeouts and header size limits.
- Buffering: the proxy absorbs slow uploads and downloads so Node's event loop is not tied to a slow phone.
- Compression, static file serving, caching of GET responses, hiding topology.

```text
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

server {
  listen 443 ssl;
  server_name api.example.com;
  client_max_body_size 10m;

  location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://node_upstream;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
  }
}
```

Getting Node right behind a proxy:

- Set `app.set('trust proxy', 1)` in Express so `req.ip` and `req.protocol` come from the `X-Forwarded-*` headers; otherwise every client looks like the proxy's IP and rate limits collapse into one bucket. Trust only your own proxy, since clients can forge the header.
- Long-lived responses (SSE, WebSockets) need a higher `proxy_read_timeout` and buffering off for that location.

When not to use one: a small service on a platform (Fly, Render, Cloud Run, or behind an ALB) already gets TLS and routing; adding nginx is another thing to run. Use a gateway product when you sell an API to third parties and need keys, quotas and analytics per customer.

In an AI product: streaming LLM responses over SSE means turning off proxy buffering for that route, or the client sees nothing until the whole answer is done.

</details>

## 12. How do you find and fix a slow endpoint in production?

<details>
<summary>Answer</summary>

Start from the symptom in your metrics, use traces to find which span is slow, then reproduce under load and profile Node itself if the time is in your code rather than a dependency. Fix, then re-run the same load test to prove it.

Step by step:

1. Scope with metrics: p99 or p50? One route or all? Since a deploy, a traffic change, or data growth?
2. Read a trace for a slow request (an APM such as Datadog, New Relic or X-Ray). The waterfall says whether it is the database, an external API, or CPU in Node. Most often it is a query: missing index, N+1, or lock waits. Confirm with `EXPLAIN ANALYZE`; see the Postgres note.
3. If the time is in Node, check event-loop lag: how late timers fire. High lag means a request is doing synchronous CPU work (huge JSON parse, sync crypto, bad regex) and everyone else waits. Measure with `perf_hooks.monitorEventLoopDelay` or the APM's gauge. Fix by moving the work to a worker thread or a job.
4. Profile CPU: `node --cpu-prof` writes a profile you open in Chrome DevTools; the flame graph shows the hot function.
5. If latency climbs over hours and restarts fix it, suspect a memory leak: a growing heap causes long GC pauses. Take two heap snapshots minutes apart (`v8.writeHeapSnapshot()` on a signal) and compare retained objects. Usual suspects: unbounded in-memory caches and listeners added per request.
6. Check saturation elsewhere: an exhausted connection pool, slow Redis, an upstream API with no timeout.

Load testing, to reproduce and to verify:

- `autocannon -c 100 -d 30 <url>` for quick throughput and latency on one endpoint.
- k6 for scripted scenarios (login, browse, checkout) with thresholds that fail CI when p95 exceeds a target.
- Use production-like data volume; an index problem is invisible on 200 rows.

Fixes in rough order of payoff: fix the query or add the index; cache in Redis with a TTL; move CPU work off the event loop; add timeouts to dependencies; scale horizontally last.

Trade-off probed: profiling in production has overhead. Sample traces, never expose `--inspect` publicly, and take heap snapshots on one instance pulled from the load balancer, since a snapshot pauses the process.

In an AI product: the slow span is usually the LLM provider; stream the response, set a timeout, and track provider latency as its own metric.

</details>
