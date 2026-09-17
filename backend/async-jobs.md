# Async Jobs & Reliability

This note covers the machinery for work that does not fit inside one HTTP request (queues, BullMQ, idempotent consumers, retries and circuit breakers, 202 + polling, Kafka, eventual consistency and sagas, locks); revise by reading each question, answering aloud before opening the answer, then expanding on any point you skipped.

## 1. What is a background job, and what is a message queue?

<details>
<summary>Answer</summary>

A background job is work the server does *after* replying to the user instead of during the request: sending an email, generating a report, refreshing prices. A message queue is the buffer that holds those jobs until a worker picks them up, so the web server and the worker can run at different speeds and even on different machines.

Without a queue, a slow task blocks the HTTP response, times out on mobile networks, and is lost if the process crashes halfway. With one:

```text
HTTP request -> API validates, pushes a job {type: "refreshPrices", companyId: 42} onto the queue
            -> replies 202 Accepted with a job id in a few milliseconds
Worker process -> pulls the job, does the slow work, marks it done (or failed and retried)
Frontend       -> polls /jobs/:id or receives a push when the status changes
```

The pieces: **producer** (the API that enqueues), **queue** (Redis with BullMQ, or a managed service like SQS), **worker** or **consumer** (a process that runs jobs), **job** (a small JSON payload describing the work, never the work itself), **retry** and **dead-letter queue** (where jobs go after they keep failing).

Why it exists: it turns "do this now and hope" into "record that this must happen, then make sure it does". That gives you retries, rate control, and the ability to scale workers independently of web servers.

When you do not need one: work that finishes in tens of milliseconds and must be in the response anyway. Adding a queue there only adds latency and moving parts.

In an AI product: almost every LLM call that takes more than a couple of seconds, or that costs money and may need a retry, belongs in a job, with the frontend showing status while it runs.

</details>

## 2. Why use a queue, and when is cron or an event stream better?

<details>
<summary>Answer</summary>

A queue lets the request handler hand off slow or unreliable work and reply immediately, while a separate worker does the job later and retries it if it fails. It decouples the producer from the consumer, smooths bursts into a steady processing rate, and gives you a place to retry, delay and observe work.

Three problems a queue solves:

- Decoupling: the API does not need the email provider, the PDF renderer or the LLM to be up right now. It writes the job and moves on. The worker can be deployed, scaled and restarted independently.
- Smoothing spikes: 10,000 signups in a minute become 10,000 jobs drained at whatever rate the workers and downstream APIs can sustain. The queue absorbs the burst instead of the database or a rate-limited third party.
- Retries: a failed job goes back on the queue with a delay. The user already got a response, so a retry costs nothing visible.

Queue vs cron vs event stream:

| | Queue (BullMQ, SQS, RabbitMQ) | Cron / scheduler | Event stream (Kafka) |
|---|---|---|---|
| Trigger | something happened, do this once | time passed, do this batch | something happened, tell everyone |
| Consumers | one worker takes each job | one process runs the script | many independent readers |
| Message lifetime | deleted after success | n/a | kept in a log, replayable |
| Good for | emails, thumbnails, LLM calls | nightly reports, cleanups | audit logs, analytics, fan-out |

Pick cron when the work is naturally periodic and does not care about individual events ("recompute all balances at 02:00"). Pick a queue when each unit of work is triggered by a user action and must happen exactly once-ish. Pick a stream when several teams need the same events, or you need to replay history. BullMQ also does delayed and repeatable jobs, so small cron-like needs often live in the same queue.

When NOT to use a queue: when the caller needs the result synchronously and the work is fast (under ~100 ms); when you cannot tolerate the operational cost of a Redis or broker; when a single process with an in-memory array is honestly enough (a prototype). Every queue adds a failure mode: the job may run late, twice, or never, and you now need monitoring for queue depth and age.

Trade-off probed: latency and simplicity versus resilience and throughput. The interviewer wants to hear that the moment work leaves the request, you own visibility (job status), duplication (entry 4) and ordering (jobs are not guaranteed to run in order once you have more than one worker).

In an AI product: "generate report" calls an LLM for 30 to 90 seconds. Run it as a job; the request returns a job ID (entry 6), the worker retries on provider errors (entry 5), and a burst of users does not turn into a burst of 429s from the provider.

</details>

## 3. How do BullMQ jobs, workers, retries and dead-letter queues fit together?

<details>
<summary>Answer</summary>

BullMQ is a Redis-backed job queue for Node. A `Queue` adds jobs (a name plus JSON data plus options), a `Worker` pulls jobs and runs your processor function, and Redis holds the job state: waiting, active, delayed, completed, failed. Retries, backoff and concurrency are options, not code you write.

```ts
import { Queue, Worker } from 'bullmq';
const connection = { host: 'localhost', port: 6379 };

const reports = new Queue('reports', { connection });

await reports.add('generate', { reportId, userId }, {
  jobId: reportId,                 // same id twice = second add is ignored
  attempts: 5,
  backoff: { type: 'exponential', delay: 2000 }, // 2s, 4s, 8s, 16s
  removeOnComplete: 1000,           // keep last 1000 for inspection
  removeOnFail: false,              // keep failures until you look at them
});

const worker = new Worker('reports', async (job) => {
  await job.updateProgress(10);
  return await generateReport(job.data);   // return value stored on the job
}, { connection, concurrency: 5 });

worker.on('failed', (job, err) => log.error({ jobId: job?.id, attempts: job?.attemptsMade }, err.message));
```

How the pieces behave:

- Jobs: a row in Redis with data, options, `attemptsMade`, progress, return value and a stack trace on failure. `jobId` lets you deduplicate: adding a job with an id that already exists is a no-op while that job is still in Redis.
- Workers: one `Worker` instance per process; `concurrency: 5` means five processor calls in flight at once inside that process. Scale horizontally by running more processes on the same queue name. The worker holds a lock on an active job and renews it; if the process dies the lock expires and the job is marked stalled and picked up again, which is the at-least-once behaviour from entry 4.
- Retries: when the processor throws, BullMQ moves the job to delayed, waits per the backoff, and retries until `attempts` is exhausted. Throwing `UnrecoverableError` skips the remaining retries for permanent errors such as bad input.
- Failed set and dead letters: after the last attempt the job sits in the `failed` state. BullMQ does not name a "dead-letter queue" as a first-class object; the pattern is to treat the failed set as your DLQ, or listen to the `failed` event and `add` the job to a separate `reports-dead` queue for inspection and manual `retry()`. Use a dashboard (Bull Board or similar) to see counts.
- Rate limiting: `limiter: { max: 10, duration: 1000 }` on the Worker caps throughput for a downstream API.

When NOT to use BullMQ: you have no Redis and do not want one; you need multi-consumer fan-out or replay (Kafka, entry 7); or messages must survive Redis loss without persistence configured. Redis persistence and memory limits are your durability story.

Trade-off probed: retries are free only if the processor is idempotent. Also, `concurrency` is per process and per event loop, so CPU-heavy processors gain nothing from raising it.

In an AI product: one queue per cost class. Cheap classification jobs get `concurrency: 20`; long report jobs get `concurrency: 2` and a `limiter` that matches the provider's rate limit, so one noisy customer cannot starve everyone.

</details>

## 4. Why must a queue consumer be idempotent, and how do you make it so?

<details>
<summary>Answer</summary>

Every real queue is at-least-once: a job may be delivered and processed more than once, because the worker can crash after doing the work but before acknowledging it. Idempotent means running the job twice has the same effect as running it once, so the consumer must be written assuming every job will eventually be duplicated.

Why exactly-once is not on offer: the worker does the work (sends the email, charges the card) and then tells the broker "done". Those are two separate systems; there is no transaction spanning both. Crash between them and the broker redelivers. Lock expiry on a slow job (BullMQ stalled jobs) and producer-side retries after a timeout cause the same duplication. You can get effectively-once, but only by making the consumer idempotent.

Techniques, cheapest first:

- Natural idempotency: "set status to `sent`" is safe to repeat; "increment sent_count" is not. Prefer absolute writes (set, upsert) over relative ones (increment, append).
- Unique constraints: insert the result with a unique key derived from the job (`report_id`), catch the duplicate-key error and treat it as success. The database becomes the dedup store.
- Processed-jobs table: before doing side effects, `INSERT INTO processed_jobs (job_id)`; if it conflicts, return early. Write this row in the same transaction as the business rows so they commit or roll back together.
- Pass the key downstream: when the side effect is an external call, forward an idempotency key (the job ID) so the provider deduplicates for you. The HTTP side of this is covered in [node-api.md entry 9](node-api.md#9-how-do-idempotency-keys-make-post-requests-safe-to-retry).
- Producer dedup: BullMQ `jobId` stops the same logical job being enqueued twice while the first is still in Redis. This is a filter, not a guarantee; the consumer still needs its own check.

Ordering is the other trap. Two workers may process "update address" then "delete account" in the wrong order. Fixes: put a version number on the entity and ignore stale jobs, or serialise per entity (entry 9).

When NOT to bother: truly harmless duplicates (recomputing a cache entry). Everything with money, email, or an external write needs the check.

Trade-off probed: idempotency costs a lookup or a unique index per job and some storage for the processed-jobs table (expire rows after a window). The alternative, trusting the queue, fails on the first bad deploy.

In an AI product: a user double-clicks "generate" and the mobile app retries the POST on a timeout. Deduplicate at three layers: the HTTP idempotency key, the BullMQ `jobId` equal to the report ID, and a unique index on `reports.id` when the worker writes the result. Then a duplicate never costs a second paid LLM call.

</details>

## 5. How do timeouts, jittered retries and circuit breakers protect third-party calls?

<details>
<summary>Answer</summary>

Timeouts stop one slow dependency from holding your threads and sockets forever. Retries with exponential backoff and jitter recover from transient failures without turning every client into a synchronised hammer. A circuit breaker notices a dependency is down and fails fast for a while instead of paying the timeout on every call. You use all three together.

Timeouts: every outbound call gets one, always. Without it a hung provider fills your connection pool and your service goes down with theirs. Pick a value from the provider's real p99 plus headroom, not a round number. In Node use `AbortSignal.timeout(ms)` with `fetch`, and separate connect timeout from total timeout where the client allows.

Retries: only retry what is safe and likely to succeed on a second try. Retry on network errors, 408, 429, 5xx; do not retry 400, 401, 403, 404, 422. Do not retry a non-idempotent call unless you send an idempotency key. Cap the total attempts and the total time so a retry storm cannot outlast the user's patience.

Why jitter: if 1,000 clients fail at the same instant and all retry after exactly 2 s, the provider gets the same spike again. Randomising the wait spreads them out. "Full jitter" picks a random value between 0 and the exponential cap.

```ts
async function withRetry<T>(fn: () => Promise<T>, max = 4, base = 500) {
  for (let attempt = 0; ; attempt++) {
    try { return await fn(); }
    catch (err) {
      if (attempt >= max || !isRetryable(err)) throw err;
      const cap = base * 2 ** attempt;                 // 500, 1000, 2000, 4000
      const wait = Math.random() * cap;                // full jitter
      await new Promise(r => setTimeout(r, wait));
    }
  }
}
```

Respect `Retry-After` headers when present: the provider is telling you the wait.

Circuit breaker: a wrapper that tracks recent failures. Closed: calls flow normally. Open: after N failures in a window, calls fail immediately with a fallback for a cooldown period. Half-open: after the cooldown, let one trial call through; success closes the circuit, failure reopens it. It protects you (no wasted timeouts) and the provider (no retry pile-on while they recover). Libraries such as `opossum` implement it for Node; the shape is what matters in an interview.

When NOT to: do not retry inside a request that the caller is already retrying (retry amplification: 3 layers of 3 retries is 27 calls). Decide one layer that owns retries, usually the job worker. Do not wrap a local database call in a breaker; you cannot do anything useful without it anyway.

Trade-off probed: retries trade latency for success rate; breakers trade a few false-open periods for protection against cascading failure. Both need metrics (retry count, breaker state) or they hide problems.

In an AI product: LLM providers throw 429 and 529-style overload errors in bursts. Wrap each provider in its own breaker; when the primary opens, fall back to a second model or provider for the cooldown and tag the job's output with which model produced it.

</details>

## 6. How do you expose long-running work over HTTP without blocking the request?

<details>
<summary>Answer</summary>

Accept the request, enqueue the job, and return `202 Accepted` immediately with a job ID and a URL to check status. The client then polls that URL, or you push status to it over Server-Sent Events, WebSocket or a webhook. The HTTP request never waits on the slow work, so load balancers, proxies and mobile networks cannot time it out.

Flow as a sequence:

```text
Client                      API                          Worker
  | POST /reports {..}        |                              |
  |-------------------------->| insert job (status=queued)   |
  |                           | queue.add('generate', ...)   |
  | 202 Accepted              |                              |
  | Location: /jobs/abc       |                              |
  |<--------------------------|                              |
  |                           |            pick job, status=running, progress=40
  | GET /jobs/abc             |                              |
  |<------ 200 {running,40%}--|                              |
  |                           |            status=done, result_url=/reports/42
  | GET /jobs/abc             |                              |
  |<--- 200 {done, url} ------|   (or 303 See Other -> /reports/42)
```

Status resource shape: `{ id, status: queued|running|done|failed, progress, result?, error?, createdAt }`. Keep it in your database, not only in Redis, so it survives a queue flush and can be listed per user. The worker updates it; the API only reads it.

Polling vs push:

| | Polling | SSE / WebSocket | Webhook |
|---|---|---|---|
| Client work | trivial, works everywhere | needs a stream client | client must run a server |
| Latency | interval-bound | near real time | near real time |
| Server cost | many cheap requests | held connections | one outbound call |
| Use when | web/mobile UI, few jobs | live progress, streaming tokens | server-to-server integrations |

Polling tips: return a `Retry-After` header suggesting the interval, let the client back off (1 s, 2 s, 5 s), and keep the GET cheap. SSE is enough for one-way progress over plain HTTP; save WebSockets for two-way traffic.

When NOT to use 202: if the work reliably finishes within a second or two, a synchronous 200 is simpler. Do not fake it either: returning 202 and then doing the work inline without a queue loses the work on a restart.

Trade-off probed: 202 moves complexity to the client (state machine, polling, "what if the tab closes"). The frontend answer is to keep the job ID in the URL or local storage so a refresh resumes polling.

In an AI product: report generation returns 202 and a job ID; the UI polls for status, then opens an SSE stream for the final step so tokens appear live. The job row keeps model name and token count for cost reporting.

</details>

## 7. What is Kafka, and when would you pick it over a job queue?

<details>
<summary>Answer</summary>

Kafka is a distributed, append-only log. Producers write records to topics, topics are split into partitions, and consumers read partitions at their own pace by tracking an offset. Records are not deleted on read; they stay for a retention period, so many independent consumers can read the same data and any of them can rewind. Pick it when several systems need the same events, when ordering per key matters, or when you need replay and very high throughput; pick a job queue when one worker should do one task once.

Vocabulary in one line each:

- Topic: a named stream, like a table of events.
- Partition: a shard of a topic; ordering is guaranteed only within a partition. Records with the same key (say `userId`) land in the same partition.
- Offset: the consumer's bookmark within a partition; committing the offset is the acknowledgement.
- Consumer group: a set of consumers sharing a topic; each partition is read by exactly one member, so the group scales up to the partition count.
- Retention: how long records are kept (time or size), independent of whether anyone read them.

Queue vs Kafka:

| | Job queue (BullMQ, SQS) | Kafka |
|---|---|---|
| Model | task to be done | fact that happened |
| After consumption | removed | retained, replayable |
| Consumers per message | one | any number of groups |
| Ordering | best effort | strict per partition |
| Retries | built in per job | you re-read or write to a retry topic |
| Ops cost | Redis | brokers, ZooKeeper/KRaft, partitions planning |

Choose Kafka when: order events feed billing, analytics and search indexing at once; you need to reprocess last week after a bug; you handle very high event rates; or the log is your source of truth (event sourcing). Choose a queue when: one consumer type, per-job retry and delay semantics, a small team with Redis already there.

When NOT to use Kafka: as a task queue for one worker, as request/response transport, or before you have outgrown a queue. Managed offerings cut the ops burden but not the design cost of picking partition keys.

Trade-off probed: Kafka gives ordering and replay in exchange for you handling retries, poison messages (a record that always fails blocks its partition) and offsets yourself.

In an AI product: every LLM call emits a `completion.recorded` event with model, tokens and latency. Billing, an evaluation pipeline and a dashboard each consume it independently, and you can replay a day to recompute costs after a pricing change.

</details>

## 8. Explain CAP, eventual consistency, and how sagas replace cross-service transactions

<details>
<summary>Answer</summary>

CAP says that during a network partition a distributed data system must choose between staying consistent (every read sees the latest write) and staying available (every request gets a non-error answer). Eventual consistency is the availability-leaning choice: replicas may disagree briefly but converge. A saga runs a multi-step business transaction across services without a shared database transaction: a sequence of local transactions, each with a compensating action that undoes it if a later step fails.

CAP at explain level:

- C, consistency: after a write completes, every read anywhere returns it (not the C in ACID).
- A, availability: every request to a live node gets a response.
- P, partition tolerance: nodes can lose contact. Real networks partition, so the choice is C or A when it happens.
- CP systems (Postgres with synchronous replicas, ZooKeeper) refuse writes they cannot confirm. AP systems (DNS, a read replica you keep serving from) answer with possibly stale data.

Eventual consistency in practice: you write to the primary, read from a replica a moment later, and miss your own write. Mitigations: route a user's reads to the primary for a few seconds after a write; return the new object in the write response; optimistic UI. The frontend feels this as "I saved but the list did not update".

Sagas: an order flow touches Orders, Payments and Inventory, each with its own database, and no transaction spans them. So:

1. Orders creates the order (`pending`).
2. Payments charges the card. Fails? Compensate step 1: mark the order `cancelled`.
3. Inventory reserves stock. Fails? Compensate step 2: refund; then step 1.
4. Orders marks the order `confirmed`.

Two coordination styles: choreography, where each service emits an event and the next reacts (simple, hard to follow past five services); and orchestration, where one orchestrator (a workflow engine such as Temporal, or your own state machine in a job) calls each step and runs compensations. Orchestration is easier to observe.

Rules: every step and compensation is idempotent (entry 4) because the orchestrator retries; irreversible actions (an email was sent) go last.

When NOT to: if everything lives in one Postgres, use a transaction. Sagas are the price of splitting services; do not pay it early.

Trade-off probed: a saga trades atomicity for availability and autonomy. Users can observe intermediate states (`pending`), so the UI and domain model must name them.

In an AI product: "create workspace, provision vector index, run first embedding job, send welcome email". If embedding fails, the compensation deletes the index and marks the workspace `setup_failed`; the email is last.

</details>

## 9. How do you prevent race conditions: row lock, distributed lock or queue?

<details>
<summary>Answer</summary>

A race condition is two operations reading the same state and both acting on it before either writes, so one update is lost or an invariant breaks (two bookings for one seat). A deadlock is two operations each holding a lock the other needs, so neither finishes. Pick the smallest tool that makes the critical section run one at a time: a row lock when the state is a row, a queue that serialises by key when the work is a job, a distributed lock only when neither fits.

Races in Node: the event loop is single-threaded, but every `await` is a yield point. Two requests interleave between `const balance = await get()` and `await set(balance - amount)`. Concurrency, not threads, causes the race.

Options:

| Tool | How | Use when | Watch out |
|---|---|---|---|
| Atomic SQL | `UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $1` | one row, one statement | check the affected-row count |
| Row lock | `SELECT ... FOR UPDATE` inside a transaction, then write | read-then-write on one or a few rows | hold briefly; lock rows in a fixed order |
| Optimistic lock | `UPDATE ... WHERE id = $1 AND version = $2`, retry on 0 rows | low contention, long user edits | needs a `version` column |
| Unique constraint | let the database reject the second insert | "at most one X per Y" | catch the error, map to 409 |
| Queue serialisation | route all jobs for a key to one worker / one lane | work is already a job; order per entity matters | throughput is capped per key |
| Distributed lock | Redis `SET key value NX PX ttl`, release only if value matches | many services, no shared DB row to lock | TTL vs long work; Redlock caveats |

Deadlocks: Postgres detects them and kills one transaction; your code must retry. Avoid them by locking rows in a consistent order (lower ID first), keeping transactions short, and never awaiting an external HTTP call while holding a row lock.

Distributed locks are the weakest option. A Redis lock has a TTL; if the job outlives the TTL the lock expires and a second worker starts, so you are back to two runners. A fencing token (an increasing number the resource checks) fixes that, but by then a row lock or a per-key queue lane is simpler. Use distributed locks for leader election and "only one cron runner", not for business-data correctness.

Queue serialisation in core BullMQ has no per-key ordering across workers; the pattern is one queue or worker per shard, or a job that takes a row lock itself. BullMQ Pro offers job groups for this (unverified).

Trade-off probed: pessimistic locks cost throughput; optimistic locks cost retries; queues cost latency. Choose by contention level.

In an AI product: two quick edits to one document each trigger an embedding refresh. Serialise per `documentId` and stamp the embedding with the document `version`; a stale job that finishes late sees the version has moved and discards its result.

</details>
