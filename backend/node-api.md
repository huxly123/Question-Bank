# Node Runtime & API Design

This note covers how Node actually runs your code (event loop, workers, streams, modules, process lifecycle) and how to design HTTP APIs on top of it (REST, pagination, idempotency, validation, streaming, caching, webhooks); revise by reading each question, answering aloud before opening the answer, then expanding on any point you skipped.

## 1. How does the Node event loop work, and why does CPU work block it?

<details>
<summary>Answer</summary>

Node runs your JavaScript on a single thread and uses the event loop (provided by libuv) to schedule callbacks as I/O completes. Each loop iteration walks through fixed phases, and between callbacks it drains two extra queues: `process.nextTick` first, then Promise microtasks. Because there is only one JS thread, any long synchronous computation stops the loop from reaching the next callback, so every request waits.

The phases, in order, per iteration:

| Phase | What runs |
|---|---|
| timers | `setTimeout` / `setInterval` callbacks whose time has passed |
| pending callbacks | some deferred system callbacks (for example TCP errors) |
| poll | waits for I/O and runs I/O callbacks (this is where the loop spends most of its time) |
| check | `setImmediate` callbacks |
| close callbacks | `socket.on('close')` and similar |

Two queues sit outside the phases and are drained after every callback: the `nextTick` queue (drained first, fully) and the microtask queue (resolved Promises, `queueMicrotask`). A `nextTick` that keeps scheduling another `nextTick` starves I/O forever; a recursive `setImmediate` does not, because it yields to the poll phase each iteration.

Ordering rules worth stating:

- `process.nextTick` runs before any Promise callback, which runs before any timer or immediate.
- `setTimeout(fn, 0)` vs `setImmediate(fn)` from the main module is not deterministic; it depends on how long process startup took relative to the 1 ms timer floor.
- Inside an I/O callback, `setImmediate` always fires before `setTimeout(fn, 0)`, because the check phase comes right after poll.

```js
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
// nextTick, promise, then timeout/immediate in either order
```

Why CPU work blocks: async I/O is offloaded to the OS or to libuv's small thread pool (default 4 threads, used for file system, DNS lookup, crypto, zlib). Your JS callbacks and any loops, JSON parsing, regex or hashing you write run on the one main thread. A 500 ms `JSON.parse` of a huge payload means zero requests are served for 500 ms. Fixes: move the work to a worker thread, chunk it and yield with `setImmediate`, or stream instead of buffering.

In an AI product: token streaming from an LLM is pure I/O and fits the loop perfectly, but tokenising or embedding large documents in-process is CPU work and belongs in a worker or a separate service.

</details>

## 2. When would you use worker threads, cluster, or child processes?

<details>
<summary>Answer</summary>

Worker threads run JavaScript in parallel inside the same process for CPU-bound work. Cluster forks copies of your whole server so multiple processes share one port and use all CPU cores for I/O-bound traffic. Child processes run a separate program (any language) with its own memory, communicating over stdio or an IPC channel.

| | Worker threads | Cluster | Child process |
|---|---|---|---|
| Unit | thread in the same process | forked Node process running the same script | any executable |
| Memory | isolated by default, can share via `SharedArrayBuffer` | separate | separate |
| Talk via | `postMessage` (structured clone) | IPC messages, shared listening socket | stdin/stdout, or IPC with `fork` |
| Best for | CPU-heavy JS: parsing, image resize, hashing | scaling an HTTP server across cores | running CLI tools, Python scripts, isolating crashes |
| Cost | cheap-ish, but each has its own V8 isolate | one full Node runtime per core | process startup, serialisation |

Worker threads: use for a job that would block the loop for more than a few milliseconds. Keep a pool (for example with `piscina`) rather than spawning per request, because startup is not free. Pass small messages; large data should go through a `SharedArrayBuffer` or be re-read from disk in the worker.

```js
// main.js
import { Worker } from 'node:worker_threads';
const w = new Worker('./hash.js', { workerData: { input } });
w.once('message', (digest) => res.json({ digest }));
w.once('error', next);
```

Cluster: the primary process accepts connections and hands them to workers (round-robin on Linux and macOS by default). Workers do not share memory, so session state must live in Redis or the database, not in a module-level variable. In containers you usually skip cluster and run one process per container, letting Kubernetes or the orchestrator scale replicas; cluster still matters on a bare VM.

Child processes: `spawn` for streaming output, `exec` for small buffered shell commands, `fork` for a Node script with a built-in message channel. Use when the work is not JavaScript, needs a different runtime, or must be killable independently.

Interview probe: "why not just use cluster for CPU work?" Because a CPU-heavy request still blocks that worker's loop; cluster only multiplies throughput, it does not isolate the slow request from the others landing on the same worker.

In an AI product: PDF text extraction or local embedding models run in worker threads or a separate Python child process; the HTTP server that streams model output stays on the main thread.

</details>

## 3. How do Node streams work, and what is backpressure?

<details>
<summary>Answer</summary>

Streams process data in chunks instead of loading it all into memory. Readable streams produce chunks, Writable streams consume them, Transform streams sit in between and change data as it flows. Backpressure is the signal that a consumer is slower than the producer; the producer must pause until the consumer catches up, otherwise memory grows without bound.

Buffers are Node's raw byte arrays; a stream chunk is usually a `Buffer` unless the stream is in object mode or you set an encoding.

The four stream types:

- Readable: `fs.createReadStream`, an incoming HTTP request, `process.stdin`.
- Writable: `fs.createWriteStream`, an HTTP response, `process.stdout`.
- Duplex: both, independent directions (a TCP socket).
- Transform: a Duplex where output is computed from input (`zlib.createGzip()`, a CSV parser).

Backpressure mechanics: every stream has a `highWaterMark` (default 16 KiB for byte streams). `writable.write(chunk)` returns `false` when the internal buffer is over that mark. A well-behaved producer stops and waits for the `'drain'` event before writing more. `pipe` and `pipeline` do this for you.

```js
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('big.log'),
  createGzip(),
  createWriteStream('big.log.gz'),
);
```

Prefer `pipeline` over `.pipe()`: it propagates errors from any stage and destroys all streams on failure. With `.pipe()` an error in the middle leaves the others dangling.

Custom transform:

```js
import { Transform } from 'node:stream';
const upper = new Transform({
  transform(chunk, _enc, cb) { cb(null, chunk.toString().toUpperCase()); },
});
```

When not to use streams: small payloads (a few KB) where the bookkeeping outweighs the benefit, or when you genuinely need the whole document before you can act (validating a full JSON body).

Async iteration is the modern read pattern: `for await (const chunk of readable) { ... }` respects backpressure automatically.

In an AI product: an LLM provider's response is a readable stream of tokens; your HTTP response to the browser is a writable. Piping one into the other with a Transform that reformats events is the whole streaming endpoint, and backpressure protects your memory when the browser is on a slow connection.

</details>

## 4. How do CommonJS and ES modules differ, and how does caching work?

<details>
<summary>Answer</summary>

CommonJS (`require`) loads modules synchronously at call time and exports a single mutable object; ES modules (`import`) are resolved statically before execution, load asynchronously, and export live read-only bindings. Both cache each module by resolved file path so it executes once per process.

Key differences:

| | CommonJS | ES modules |
|---|---|---|
| Syntax | `require()`, `module.exports` | `import` / `export` |
| Loading | synchronous, can be conditional | static, hoisted; dynamic via `import()` |
| Exports | a copy of a value at require time | live binding to the exporting module's variable |
| `this` at top level | `module.exports` | `undefined` |
| Filename access | `__dirname`, `__filename` | `import.meta.url` |
| Top-level `await` | no | yes |
| Opt in | default for `.js`, or `.cjs` | `"type": "module"` in package.json, or `.mjs` |

Module caching: `require` stores the loaded module in `require.cache` keyed by absolute path. A second `require` of the same file returns the same object, so a module is a natural singleton (a database pool exported from `db.js` is shared across the app). Deleting the cache entry forces a fresh load, which test tools use. ESM has an equivalent internal cache but no public API to clear it.

`module.exports` vs `exports`: `exports` is just a local variable pointing at `module.exports`. Adding properties works through either. Reassigning `exports = fn` rebinds the local variable only; the module still exports the original empty object.

```js
// works
exports.add = (a, b) => a + b;
// works
module.exports = { add };
// silently exports {} -- classic bug
exports = { add };
```

Interop: ESM can `import` a CommonJS module; the whole `module.exports` becomes the default export. Going the other way, `require()` of an ES module has historically thrown, with a synchronous `require(esm)` allowed only in recent Node versions when the module graph has no top-level `await`. Dual packages ship both via the `exports` field in package.json.

Circular imports: CommonJS gives the second module a partially filled `exports` object; ESM gives a binding that is in the temporal dead zone until initialised. Both are a smell; break the cycle.

</details>

## 5. How do you design a clean REST API?

<details>
<summary>Answer</summary>

Model the API as nouns (resources) addressed by URLs, use HTTP methods for the verbs, use status codes to say what happened, and keep every request self-contained. Consistency matters more than purity: a predictable API is one the frontend can wrap in a generic client.

Resource naming:

- Plural nouns, lowercase, hyphens: `/users`, `/order-items`.
- Hierarchy for ownership: `/users/{id}/addresses`. Do not nest more than two levels; flatten with query filters instead.
- No verbs in paths. For actions that do not map to CRUD, model a sub-resource: `POST /orders/{id}/cancellation` rather than `POST /cancelOrder`.
- Filtering, sorting and paging via query string: `?status=paid&sort=-createdAt&limit=20`.

Methods and status codes:

| Method | Meaning | Typical success |
|---|---|---|
| GET | read, safe, cacheable | 200 |
| POST | create or non-idempotent action | 201 with `Location`, or 200/202 |
| PUT | replace the whole resource, idempotent | 200 or 204 |
| PATCH | partial update | 200 |
| DELETE | remove, idempotent | 204 |

Errors: 400 malformed, 401 not authenticated, 403 authenticated but not allowed, 404 not found (also used to hide existence), 409 conflict (duplicate, version mismatch), 422 valid JSON but fails business rules, 429 rate limited, 500 our bug, 503 dependency down. Never return 200 with `{ "error": ... }` in the body; clients and proxies key off the status.

PUT vs PATCH: PUT sends the full representation; any omitted field is reset. That is idempotent by definition. PATCH sends only changes, so `{ "name": "x" }` leaves other fields alone. Simple PATCH with a partial JSON object (JSON Merge Patch, `application/merge-patch+json`) is enough for most APIs; JSON Patch (`application/json-patch+json`) is a list of operations for when you need array edits. PATCH is not automatically idempotent (an `increment` operation is not).

Versioning strategies:

- URL path `/v1/users`: most visible, easiest to route and cache, common in practice.
- Header `Accept: application/vnd.myapp.v2+json`: cleaner URLs, harder to test in a browser.
- Query `?version=2`: simple but easy to forget and messy for caching.
- Better than all of them: additive changes. Add fields, never remove or rename, and only bump the version for genuinely breaking changes.

Interview probe: "should a GET ever change state?" No. Safe methods let caches, prefetchers and retries treat the request as harmless.

</details>

## 6. How do offset, cursor and keyset pagination differ for the client?

<details>
<summary>Answer</summary>

Offset pagination skips N rows and is simple but gets slower and less stable as N grows. Keyset pagination uses the last row's sort values in a `WHERE` clause, so every page is fast and stable, but you can only move to the next or previous page. Cursor pagination is keyset with the sort values encoded into an opaque token the client passes back.

Offset:

```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 20 OFFSET 400;
```

The database still reads and discards 400 rows, so page 5000 is much slower than page 1. If a row is inserted while the user is paging, items shift and the client sees a duplicate or misses one. Upside for the client: page numbers, jump to page 37, show "page 3 of 12" because you can count.

Keyset:

```sql
SELECT * FROM orders
WHERE (created_at, id) < ($1, $2)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

The tie-breaker column (`id`) is required because `created_at` is not unique. With an index on `(created_at, id)` the query is a seek, constant time regardless of depth. New inserts do not shift the page. Downside: no random access, and the sort order is fixed by the cursor; changing sort means starting over.

Cursor (as the client sees it): the API returns `{ data, nextCursor }` where `nextCursor` is a base64 of `{ created_at, id }`. The client stores only that string and sends `?cursor=...`. Opaque tokens let you change the encoding later without breaking clients, and they stop clients from constructing their own offsets.

How each affects the frontend:

| | Offset | Cursor/keyset |
|---|---|---|
| UI it supports | numbered pages, jump-to | infinite scroll, next/prev |
| Total count | cheap to show | usually omitted or approximate |
| Stability under inserts | duplicates/gaps | stable |
| Deep pages | slow | fast |
| Sorting | any column | must be part of the cursor |

Choose offset for admin tables with modest data and page numbers. Choose cursor for feeds, logs, chat history, anything user-generated and growing. If a product manager wants both jump-to-page and a huge table, negotiate: a search filter almost always beats page 940.

In an AI product: conversation history and message lists are cursor-paginated; a chat UI loads older messages backwards with `beforeCursor` while streaming new ones at the bottom.

</details>

## 7. How do idempotency keys make POST requests safe to retry?

<details>
<summary>Answer</summary>

The client generates a unique key (usually a UUID) per logical operation and sends it in an `Idempotency-Key` header. The server stores the key with the outcome of the first attempt; any retry with the same key returns the stored response instead of performing the action again. This turns a non-idempotent POST such as "charge card" into something the client can retry blindly after a timeout.

Why it is needed: a network timeout is ambiguous. The request may never have arrived, or it may have succeeded and the response was lost. Without a key the client must choose between possibly double-charging and possibly not charging at all.

Server flow:

1. Read the key. Reject the request (400) if the endpoint requires one and it is missing.
2. Look it up, scoped to the authenticated user so two customers cannot collide.
3. Not found: insert a row in state `in_progress`, run the operation, store the status code and body, mark `completed`.
4. Found and `completed`: return the stored status and body, plus a header such as `Idempotent-Replayed: true`.
5. Found and `in_progress`: another attempt is still running; return 409 so the client backs off and retries.
6. Found, but the request body differs from the stored fingerprint (hash of the body): return 422; the client is reusing a key for a different operation.

```sql
CREATE TABLE idempotency_keys (
  user_id      uuid NOT NULL,
  key          text NOT NULL,
  request_hash text NOT NULL,
  status       text NOT NULL,       -- in_progress | completed
  response_code int,
  response_body jsonb,
  created_at   timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, key)
);
```

Step 3 must be atomic with the operation. Either write the key and the business rows in one database transaction, or accept a small window where the operation succeeded but the key row failed, and design the operation itself to be safe to re-run (unique constraint on `order_number`, for example).

Keys expire; 24 hours is a common window. The client should keep the same key across retries of the same user action and generate a new one for a genuinely new action.

What idempotency keys do not solve: they do not make two different clients agree, and they do not help GET or PUT, which are already idempotent.

In an AI product: a "generate report" job that costs money per call gets an idempotency key so a flaky mobile network does not trigger three paid completions; the stored response can also point at a job ID the client polls.

</details>

## 8. How do you validate input and return errors consistently?

<details>
<summary>Answer</summary>

Validate every input where it enters the process (HTTP body, query, params, headers, webhook payloads, queue messages) with a schema library such as zod or joi, so everything downstream can trust its types. Funnel all failures into one error-handling middleware that maps known error classes to status codes and a single response shape, and treats anything unknown as a 500 without leaking internals.

Boundary validation with zod:

```ts
import { z } from 'zod';

const CreateOrder = z.object({
  items: z.array(z.object({ sku: z.string().min(1), qty: z.number().int().positive() })).min(1),
  couponCode: z.string().trim().optional(),
});
type CreateOrder = z.infer<typeof CreateOrder>;  // one source of truth for the type

app.post('/orders', (req, res, next) => {
  const parsed = CreateOrder.safeParse(req.body);
  if (!parsed.success) return next(new ValidationError(parsed.error.issues));
  // parsed.data is typed and clean
});
```

Why here and not deeper: services and repositories should never have to ask "is this a string?". Also strip unknown fields (zod does by default) so a client cannot smuggle `isAdmin: true` into an insert.

Error classes: define a small hierarchy, `AppError` with `statusCode`, `code` and `expose` flag, plus subclasses like `NotFoundError`, `ValidationError`, `ConflictError`. Business code throws these; it never touches `res`.

Centralised handler (Express, four arguments):

```ts
app.use((err, req, res, _next) => {
  const known = err instanceof AppError;
  const status = known ? err.statusCode : 500;
  if (!known) logger.error({ err, requestId: req.id }, 'unhandled');
  res.status(status).json({
    type: known ? err.code : 'internal_error',
    title: known ? err.message : 'Something went wrong',
    status,
    requestId: req.id,
    errors: known && err.details ? err.details : undefined,
  });
});
```

The error response contract: one shape for every error, documented once. RFC 7807 "Problem Details" (`application/problem+json` with `type`, `title`, `status`, `detail`, `instance`) is a good ready-made one. Always include a request ID so support can find the log line. Never include stack traces, SQL, or internal hostnames in production responses.

Distinguish 400 (cannot parse or wrong shape) from 422 (parsed but fails a rule like "coupon expired") from 409 (conflicts with existing state). Frontends can then map validation errors to fields by path.

Interview probe: "validation in the DB or the app?" Both: the schema stops bad input early with a helpful message; database constraints are the last line and catch bugs in your own code.

</details>

## 9. How does middleware order and error handling work in Express and Fastify?

<details>
<summary>Answer</summary>

Express runs middleware in registration order and each function must call `next()` to continue, `next(err)` to skip to the nearest error handler, or send a response to stop. Synchronous throws inside a handler are caught by Express; in Express 4 a rejected promise in an `async` handler is not, so you must catch it and pass it to `next`. Fastify is async-first: returning or throwing from a handler is handled for you, and it adds schema validation and typed hooks.

Order matters:

```js
app.use(express.json({ limit: '1mb' }));   // 1. parse body
app.use(requestId);                          // 2. attach ID for logs
app.use(authenticate);                       // 3. set req.user
app.use('/orders', ordersRouter);            // 4. routes
app.use((req, res) => res.status(404).json({ type: 'not_found' }));  // 5. fallthrough
app.use(errorHandler);                       // 6. error handler LAST
```

If the body parser is registered after a route, `req.body` is undefined in that route. If the error handler is registered before the routes, it never sees their errors.

`next(err)`: passing any argument other than the string `'route'` jumps past all normal middleware to the next function with four parameters `(err, req, res, next)`. You can chain several error handlers (log, then format).

Sync vs async errors in Express 4:

```js
app.get('/a', (req, res) => { throw new Error('caught by express'); });
app.get('/b', async (req, res) => { throw new Error('unhandled rejection in v4'); });
// fix: wrap
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
app.get('/b', wrap(async (req, res) => { ... }));
```

Express 5 forwards rejected promises to the error handler automatically.

`express.Router` structure: one router per resource, mounted under a prefix. Router-level middleware (auth for `/admin`) applies only to that router. Use `mergeParams: true` when a nested router needs `:userId` from its parent path. Keep handlers thin: parse and validate, call a service, send.

Fastify differences:

- Handlers are `async`; `return payload` sends, `throw` goes to `setErrorHandler`.
- Request lifecycle hooks (`onRequest`, `preValidation`, `preHandler`, `onSend`, `onResponse`) replace ad-hoc middleware ordering.
- JSON Schema on `body`, `querystring`, `params`, `response`; validation runs before your handler and serialisation is compiled, which is a big part of its speed.
- Plugins are encapsulated: a decorator registered inside one plugin is not visible to siblings unless you use `fastify-plugin`.

Choose Express for ubiquity and ecosystem; Fastify when you want built-in validation, structured logging (it ships pino), and better throughput.

</details>

## 10. What should structured logs contain, and what must never be logged?

<details>
<summary>Answer</summary>

Log one JSON object per event with a stable set of fields (timestamp, level, message, service, request ID, user ID, duration) so a log platform can filter and aggregate. Attach a correlation ID to every request and propagate it to downstream calls so one user action can be traced across services. Never log secrets, credentials, tokens, full card numbers, passwords, or raw personal data.

Structured means machine-readable: `{"level":"info","msg":"order created","orderId":"o_123","requestId":"r_9","durationMs":42}` instead of `"Order o_123 created in 42ms"`. Libraries: pino (fast, JSON by default, used by Fastify) or winston.

Correlation IDs:

1. Read `X-Request-Id` (or `traceparent` if you use OpenTelemetry) from the incoming request; generate a UUID if missing.
2. Store it in `AsyncLocalStorage` so any log call deep in the stack can read it without threading `req` through every function.
3. Echo it in the response header and forward it on outgoing HTTP calls and queue messages.

```js
import { AsyncLocalStorage } from 'node:async_hooks';
export const ctx = new AsyncLocalStorage();

app.use((req, res, next) => {
  const id = req.get('x-request-id') ?? crypto.randomUUID();
  res.set('x-request-id', id);
  ctx.run({ requestId: id }, next);
});

const log = (level, msg, extra) =>
  baseLogger[level]({ ...ctx.getStore(), ...extra }, msg);
```

What to log:

- Request start/finish: method, path (templated, not with IDs, to avoid cardinality explosion), status, duration, request ID, user ID.
- Business events: order created, payment failed, with entity IDs.
- Errors with stack trace, once, at the boundary where they are handled; not at every layer they pass through.
- External call latency and outcome (provider, endpoint, status, ms).

What never to log:

- Passwords, API keys, session tokens, `Authorization` and `Cookie` headers, webhook secrets.
- Full request or response bodies by default; they contain PII and blow up storage.
- Card numbers, national IDs, health data; regulations (PCI, GDPR) make logs a liability.
- Anything you would not want in a screenshot pasted into Slack.

Use the logger's redaction feature (pino `redact: ['req.headers.authorization', 'body.password']`) so a mistake in one place is caught centrally. Log levels: `error` needs a human, `warn` is degraded, `info` is business flow, `debug` off in production.

In an AI product: log prompt and completion token counts, model, latency and cost per request, but be deliberate about logging prompt text itself; it is user data.

</details>

## 11. How do you shut a Node service down gracefully?

<details>
<summary>Answer</summary>

Listen for `SIGTERM`, immediately stop accepting new connections and fail the readiness check, let in-flight requests finish, close database pools and queue consumers, then exit with code 0. Put a hard timeout on the whole sequence so a stuck connection cannot keep the process alive until the orchestrator kills it with `SIGKILL`.

Why: during a deploy or autoscale the orchestrator (Kubernetes, ECS, a PaaS) sends `SIGTERM`, waits a grace period (Kubernetes defaults to 30 seconds), then `SIGKILL`s. Without handling, Node exits on `SIGTERM` at once and every open request gets a reset connection.

```js
const server = app.listen(port);
let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, 'shutting down');
  const killer = setTimeout(() => process.exit(1), 10_000).unref();

  server.close(async () => {          // stop accepting, wait for in-flight
    await db.end();
    await queue.close();
    clearTimeout(killer);
    process.exit(0);
  });
  server.closeIdleConnections?.();   // drop keep-alive sockets with no request
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

Details that bite:

- `server.close` waits for existing connections, but idle keep-alive sockets count as connections; without `closeIdleConnections` (or a shorter `keepAliveTimeout`) shutdown can hang until the timeout.
- Run `node server.js` directly in your Docker `CMD` (exec form, not `sh -c` and not `npm start`), otherwise the signal goes to the shell or npm and may not reach Node.
- Set `terminationGracePeriodSeconds` longer than your internal timeout so your code, not `SIGKILL`, decides.

Health vs readiness:

| Endpoint | Question it answers | Effect when failing |
|---|---|---|
| `/healthz` (liveness) | Is the process alive and not deadlocked? | orchestrator restarts the container |
| `/readyz` (readiness) | Can it serve traffic right now? | removed from the load balancer, not restarted |

Liveness should be trivial and never depend on the database, or a DB outage causes a restart storm. Readiness checks dependencies (DB ping, cache) and returns 503 as soon as `shuttingDown` is true so the balancer drains traffic before connections are closed. There is a short lag between marking unready and the balancer noticing; a small delay (a few seconds) before `server.close` covers it.

In an AI product: a long streaming response may outlive your grace period; on `SIGTERM` finish or cleanly end active streams and let the client reconnect with the last event ID rather than cutting mid-token.

</details>

## 12. Walk me through HTTP: cycle, methods, status codes, headers, keep-alive, HTTP/2

<details>
<summary>Answer</summary>

HTTP is a stateless request/response protocol: the client opens a TCP (or TLS) connection, sends a request line, headers and optional body, and the server replies with a status line, headers and body. Every request must carry everything the server needs (auth token, cookies) because the server keeps no memory of previous requests. Keep-alive reuses the connection for several requests; HTTP/2 multiplexes many requests over one connection at once.

The cycle in one line: DNS lookup, TCP handshake, TLS handshake (for HTTPS), request, server processing, response, connection kept open or closed.

Request anatomy:

```text
POST /api/orders HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJ...
Content-Length: 27

{"sku":"A1","qty":2}
```

Methods and their properties: safe (no state change: GET, HEAD, OPTIONS), idempotent (same result if repeated: GET, PUT, DELETE, HEAD), neither (POST, usually PATCH). Caches and retry logic depend on these guarantees.

Status code classes: 1xx informational, 2xx success, 3xx redirection (301 permanent, 302/307 temporary, 304 not modified), 4xx client error, 5xx server error. Know the common ones from the REST entry, plus 405 method not allowed, 408 request timeout, 413 payload too large, 415 unsupported media type, 502 bad gateway, 504 gateway timeout.

Headers worth naming:

- Content negotiation: `Content-Type`, `Accept`, `Content-Length` or `Transfer-Encoding: chunked`.
- Caching: `Cache-Control`, `ETag`, `Last-Modified`, `Vary`.
- Auth and state: `Authorization`, `Cookie` / `Set-Cookie`.
- Cross-origin: `Origin`, `Access-Control-Allow-Origin`.
- Proxies: `Host`, `X-Forwarded-For`, `X-Forwarded-Proto`; trust these only from your own load balancer (`app.set('trust proxy', 1)` in Express).

Statelessness: sessions are an illusion built on cookies or tokens; the server looks state up per request. This is what lets you run many identical instances behind a load balancer.

Keep-alive: in HTTP/1.1 connections persist by default; `Connection: close` ends one. Node's `http.Agent` keeps a pool of sockets per host when `keepAlive: true`. Reuse skips TCP and TLS handshakes, which dominate latency for small requests. HTTP/1.1 still serves one request at a time per connection (head-of-line blocking), so browsers open about six connections per host.

HTTP/2: one TCP connection carries many concurrent streams, headers are compressed (HPACK), and there is no head-of-line blocking at the HTTP layer (still some at TCP, which HTTP/3 over QUIC addresses). Node supports it in `node:http2`, but in practice you terminate HTTP/2 at the load balancer or CDN and talk HTTP/1.1 to Node. Bundling and domain sharding were HTTP/1.1 workarounds that HTTP/2 makes unnecessary.

In an AI product: token streaming over a single long-lived response is a normal HTTP/1.1 chunked response; load balancer idle timeouts (often 60 seconds) are the usual reason a stream dies, so send heartbeats.

</details>

## 13. How do you stream a response to a client from Node?

<details>
<summary>Answer</summary>

For one-way server-to-client streams, write chunks to the response as they are ready; HTTP/1.1 sends them with `Transfer-Encoding: chunked` because the total length is unknown. Server-Sent Events (SSE) is a text format on top of that with built-in browser reconnection. WebSockets give a two-way persistent socket when the client also needs to push frequently. In all three, respect backpressure by checking the return value of `write` so a slow client does not fill server memory.

Chunked transfer: Node does this automatically when you call `res.write` without setting `Content-Length`. Call `res.flushHeaders()` early so the client sees the status before the first chunk. Disable compression middleware for streaming routes or make sure it flushes, otherwise gzip buffers your chunks.

SSE format and handler:

```js
app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  const send = (event, data, id) =>
    res.write(`id: ${id}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  const heartbeat = setInterval(() => res.write(': ping\n\n'), 15_000);
  req.on('close', () => { clearInterval(heartbeat); /* cancel upstream work */ });
});
```

Each message is `data:` lines ending with a blank line; optional `event:` names the type, `id:` lets the browser resend `Last-Event-ID` on reconnect, and `retry:` sets the reconnect delay. Browser side is `new EventSource(url)`; it is GET-only and cannot set custom headers, so auth is via cookie or query token. Lines starting with `:` are comments, useful as heartbeats to keep proxies from closing an idle connection.

WebSockets on the server: the client sends an HTTP `Upgrade: websocket` request; the server (usually the `ws` library, or Socket.IO for fallbacks and rooms) switches the socket to the WebSocket framing protocol. Use when the client sends many messages (collaborative editing, games, chat typing indicators). Costs: sticky state per connection, harder to load balance, and no HTTP caching or standard auth middleware.

| | Chunked JSON/NDJSON | SSE | WebSocket |
|---|---|---|---|
| Direction | server to client | server to client | both |
| Reconnect | client code | built into browser | client code |
| Works through plain HTTP infra | yes | yes | needs upgrade support |
| Use | fetch + `ReadableStream` | live feeds, token streams | chat, real-time collab |

Backpressure to a slow client: `res.write` returns `false` when the socket buffer is full. Pause the upstream source (call `upstream.pause()` or stop reading the provider stream) and resume on `res.on('drain')`. `pipeline(upstream, transform, res)` handles it for you when the source is a Node stream. Also handle `req.on('close')` to stop the upstream work; otherwise you keep paying for output nobody is reading.

In an AI product: SSE is the default for LLM token streaming (it is what most provider APIs use). Convert the provider's stream to your own event types (`token`, `tool_call`, `done`, `error`), send a heartbeat comment every 15 seconds, and abort the provider request when the client disconnects to save cost.

</details>

## 14. How does a server control HTTP caching with Cache-Control and ETag?

<details>
<summary>Answer</summary>

`Cache-Control` tells browsers and CDNs whether and for how long they may reuse a response without asking. `ETag` (or `Last-Modified`) gives the response a version identifier; the client sends it back in `If-None-Match`, and if nothing changed the server replies `304 Not Modified` with no body, saving bandwidth even though a round trip still happens.

`Cache-Control` directives that matter:

| Directive | Meaning |
|---|---|
| `max-age=N` | fresh for N seconds; no request needed |
| `s-maxage=N` | same, but only for shared caches (CDN) |
| `public` / `private` | shared caches may / may not store it (`private` for per-user data) |
| `no-cache` | may store, but must revalidate with the server before use |
| `no-store` | never store (auth tokens, bank balances) |
| `must-revalidate` | do not serve stale after expiry, even if origin is down |
| `stale-while-revalidate=N` | serve stale for N seconds while fetching fresh in the background |
| `immutable` | content never changes; skip revalidation (hashed asset filenames) |

Typical recipes:

- Hashed static assets: `public, max-age=31536000, immutable`.
- HTML or API list that changes often: `no-cache` plus an ETag, so each request is a cheap 304 when unchanged.
- Personal data: `private, no-store`.
- Public API read behind a CDN: `public, s-maxage=60, stale-while-revalidate=300`.

Conditional requests in Express:

```js
app.get('/api/products/:id', async (req, res) => {
  const product = await repo.get(req.params.id);
  const etag = `"${product.version}"`;        // or a hash of the body
  if (req.get('if-none-match') === etag) return res.status(304).end();
  res.set({ ETag: etag, 'Cache-Control': 'private, no-cache' });
  res.json(product);
});
```

Express and Fastify compute a weak ETag from the body for you on normal `res.send`, and Express returns 304 automatically when it matches. Rolling your own from a `version` or `updated_at` column avoids serialising the body only to discard it.

`Last-Modified` / `If-Modified-Since` does the same with a timestamp at one-second granularity; ETags are preferred when content can change more than once a second or when the timestamp is not reliable.

`Vary`: list request headers that change the response (`Vary: Accept-Encoding, Authorization`) so a cache does not serve a gzipped or another user's version to the wrong client.

Trade-off the interviewer probes: long `max-age` means fast pages but stale data after a deploy; solve it with content-hashed filenames for assets and short TTL plus revalidation for data. Note also that ETags double as optimistic concurrency tokens for writes via `If-Match` (412 on mismatch).

</details>

## 15. How do EventEmitter and child processes work in Node?

<details>
<summary>Answer</summary>

`EventEmitter` is Node's observer pattern: objects register listeners with `on`, and `emit` calls them synchronously in registration order. Most core APIs (streams, servers, sockets, child processes) extend it. Child processes let you run other programs: `spawn` streams their output, `exec` buffers it after running through a shell, and `fork` starts another Node script with a message channel.

EventEmitter essentials:

```js
import { EventEmitter } from 'node:events';
class Orders extends EventEmitter {}
const orders = new Orders();

orders.on('created', (order) => sendEmail(order));
orders.once('created', (order) => trackFirstOrder(order));
orders.on('error', (err) => logger.error(err));   // REQUIRED if you ever emit 'error'
orders.emit('created', order);                    // listeners run now, synchronously
```

Rules to know:

- Listeners run synchronously when `emit` is called; an `async` listener returns a promise nobody awaits, so its rejection becomes an unhandled rejection. Wrap or use `events.once` with `await` for request-scoped waits.
- Emitting `'error'` with no listener throws and can crash the process.
- Node warns after more than 10 listeners on one event (a leak detector, adjustable with `setMaxListeners`). Real leaks come from adding a listener per request and never removing it; use `off` or `once`.
- Custom events are great for decoupling side effects inside one process (audit log, cache invalidation) but they are not durable; if you need delivery across restarts or services, use a queue.

Child processes (`node:child_process`):

| | `exec` | `execFile` | `spawn` | `fork` |
|---|---|---|---|---|
| Shell | yes | no | no by default | no |
| Output | buffered string via callback (`maxBuffer` limit) | buffered | streams (`stdout`, `stderr`) | streams plus IPC |
| Use | short shell one-liner | run a binary with args safely | long or large output | another Node script you talk to |

```js
import { spawn, fork } from 'node:child_process';
const ff = spawn('ffmpeg', ['-i', input, '-f', 'mp3', 'pipe:1']);
ff.stdout.pipe(res);
ff.on('close', (code) => code !== 0 && logger.warn({ code }, 'ffmpeg failed'));

const worker = fork('./job.js');
worker.send({ type: 'start', jobId });
worker.on('message', (m) => { /* progress */ });
```

Never build an `exec` command string from user input; that is shell injection. Pass arguments as an array to `spawn` or `execFile`. Always handle the `'error'` event (binary not found) and the exit code separately; both can occur.

In an AI product: an event emitter is a convenient in-process way to fan out `token` events from one provider stream to a logger, a cost meter and the HTTP response, while a `spawn`ed Python process handles a model that has no Node binding.

</details>

## 16. How do you handle unhandled rejections and uncaught exceptions in production?

<details>
<summary>Answer</summary>

An uncaught exception or unhandled rejection means the process is in an unknown state, so the safe move is to log it with full context, flush logs, and exit non-zero so the supervisor (Kubernetes, PM2, systemd) restarts a clean instance. Recover only from errors you understand at a boundary, such as one failed request; do not try to keep a process running after a bug you did not anticipate.

The two hooks:

```js
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ err: reason }, 'unhandled rejection');
  shutdown('unhandledRejection');   // same graceful path as SIGTERM, then exit(1)
});

process.on('uncaughtException', (err, origin) => {
  logger.fatal({ err, origin }, 'uncaught exception');
  // state may be corrupt; do not keep serving. Flush logs and exit fast.
  process.exit(1);
});
```

Node's default behaviour: an uncaught exception crashes the process. Since Node 15 an unhandled rejection also crashes (mode `throw`), which is what you want; older code that relied on the warning-only behaviour hid real bugs.

Why crash instead of continuing: after an uncaught exception you do not know which callbacks did not run, which locks were left held, or which half-written state exists. Continuing risks serving wrong data quietly. A restart costs a few seconds; corrupted state costs an incident.

Why recovery is fine at the request boundary: an error inside one HTTP handler is caught by the error middleware, becomes a 500 for that client, and the process continues. The blast radius is one request. That is the correct place to recover.

Practical checklist:

- Every `async` function called without `await` (fire-and-forget) needs a `.catch`. This is the most common source of unhandled rejections.
- Every `EventEmitter` that can emit `'error'` needs a listener.
- Every stream pipeline uses `pipeline` so errors surface in one place.
- Set timeouts on outbound calls so a hung dependency does not look like a crash later.
- Run under a supervisor with restart limits and back-off; a crash loop should page someone, not restart silently forever.
- Do not use `domain` or clever resume-after-crash libraries; they are deprecated for a reason.

Interview probe: "what about a worker that fails one job?" Catch it inside the job runner, mark the job failed with the error, and keep the worker alive. The job is the boundary there, just as the request is for HTTP.

In an AI product: a provider returning a 529 or a malformed stream is an expected failure, so catch it in the request, retry with backoff for a bounded number of attempts, and return a clear error; only a programming bug should crash the process.

</details>

## 17. How do you handle file uploads securely?

<details>
<summary>Answer</summary>

Cap the size before reading the body, verify the file type from its bytes rather than the client's `Content-Type` or extension, and stream the file straight to object storage (S3, GCS, R2) under a server-generated name rather than writing it to your server's disk. Better still, let the browser upload directly to storage with a short-lived presigned URL so the file never touches your API process.

Threats you are defending against:

- Denial of service: a 10 GB upload or thousands of tiny ones exhausting disk or memory.
- Malicious content: an HTML or SVG file served back from your domain runs scripts (stored XSS); an executable disguised as an image.
- Path traversal: a filename like `../../etc/passwd` used in a disk write.
- Wrong-user access: predictable object keys let people guess other users' files.

Server-side streaming upload with limits:

```js
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
const upload = multer({
  storage: multer.memoryStorage(),               // or a streaming S3 storage engine
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

app.post('/avatar', upload.single('file'), async (req, res, next) => {
  const type = await fileTypeFromBuffer(req.file.buffer);   // sniff magic bytes
  if (!type || !['image/png', 'image/jpeg'].includes(type.mime))
    return next(new ValidationError('unsupported file type'));
  const key = `avatars/${req.user.id}/${crypto.randomUUID()}.${type.ext}`;
  await s3.putObject({ Bucket, Key: key, Body: req.file.buffer, ContentType: type.mime });
  res.status(201).json({ key });
});
```

For anything bigger than a few MB, use a streaming parser (busboy, or multer with a stream storage engine) and `Upload` from the AWS SDK's lib-storage, which multipart-uploads as chunks arrive; memory stays flat.

Presigned URL flow (preferred for large files):

1. Client asks `POST /uploads` with filename, size, type; you validate, generate a key, and return a presigned PUT URL valid for a few minutes with a content-length and content-type condition.
2. Browser uploads directly to the bucket.
3. Client calls `POST /uploads/{id}/complete`; you verify the object exists (HEAD), optionally sniff its first bytes, and record it.

Serving files back: serve from a separate domain or CDN, set `Content-Disposition: attachment` for anything not an image, force `Content-Type` from your record not the object, and use signed GET URLs for private files. Consider a virus scan step for user-shared documents (an async job).

Why not local disk: disk fills, files are lost on redeploy, and multiple instances cannot see each other's files.

In an AI product: users upload PDFs for retrieval; stream to storage, enqueue an extraction job with the object key, and never pass the whole file through the HTTP process or into a prompt unvalidated.

</details>

## 18. How do you receive webhooks reliably and securely?

<details>
<summary>Answer</summary>

Verify the sender's signature over the raw request body before parsing, respond `2xx` quickly after persisting the event, and process it asynchronously in a way that is idempotent on the event ID, because senders retry on any non-2xx or timeout and can deliver the same event more than once, sometimes out of order.

Signature verification: the sender computes an HMAC (a keyed hash, usually SHA-256) of the body with a shared secret and puts it in a header. You recompute and compare with a constant-time function so an attacker cannot learn the signature byte by byte through timing.

```js
import crypto from 'node:crypto';

// raw body is required: express.json() would re-serialise and change bytes
app.post('/webhooks/pay', express.raw({ type: '*/*' }), (req, res) => {
  const ts = req.get('x-timestamp');
  const sig = req.get('x-signature');
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return res.sendStatus(400); // replay window
  const expected = crypto.createHmac('sha256', SECRET).update(`${ts}.${req.body}`).digest('hex');
  const ok = sig?.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  if (!ok) return res.sendStatus(401);

  const event = JSON.parse(req.body);
  enqueue(event);                  // persist first, process later
  res.sendStatus(200);
});
```

Including a timestamp in the signed payload stops replay attacks; a five-minute tolerance is common. Rotate secrets by accepting two during a changeover.

Retries from the sender: providers typically retry with exponential backoff over hours or days until they get a `2xx`. Consequences for you:

- Respond fast (most senders time out in a few seconds). Do not call your own downstreams inline; save the event and return.
- Any `5xx` means you will see the event again. That is good for transient failures and bad for permanent ones; return `2xx` for events you deliberately ignore.
- Ordering is not guaranteed. `payment.succeeded` may arrive before `payment.created`. Fetch current state from the provider's API when a decision depends on order, or treat the webhook as a hint to sync.

Idempotent handling on the receiver:

```sql
CREATE TABLE webhook_events (
  provider   text NOT NULL,
  event_id   text NOT NULL,
  received_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  PRIMARY KEY (provider, event_id)
);
```

Insert with `ON CONFLICT DO NOTHING`; if zero rows were inserted, the event is a duplicate and you skip processing. Make the processing itself safe to run twice as well (upsert by provider object ID) because a crash between insert and processing will replay it.

Operational extras: log every event ID and outcome, alert on a rising failure rate, expose a manual replay tool, and lock the endpoint down by IP allowlist only as a secondary control since sender IPs change.

In an AI product: a provider's batch job completion or a fine-tune finished callback is a webhook; treat it as a signal to fetch the result, not as the result itself.

</details>

## 19. What code-design principles do you apply in a backend service?

<details>
<summary>Answer</summary>

Separate transport, business logic and data access into layers so each can change and be tested alone. Pass dependencies in from the outside (dependency injection) rather than importing singletons, hide persistence behind a repository interface, and prefer composing small functions or objects over inheritance hierarchies. Apply DRY to knowledge, not to lines that merely look alike, because a wrong abstraction costs more than duplication.

Layered architecture:

```text
routes/controllers  -> parse HTTP, validate, call a service, map result to a response
services            -> business rules, transactions, orchestration; no req/res, no SQL
repositories        -> all database access for one aggregate; return domain objects
infrastructure      -> DB client, HTTP clients, queues, config
```

The dependency direction is one way: controllers know services, services know repository interfaces, nothing below knows about HTTP. The test payoff is direct: a service test passes an in-memory repository and never starts a server or a database.

Dependency injection without a framework:

```ts
export function makeOrderService(deps: { orders: OrderRepo; payments: PaymentGateway; clock: () => Date }) {
  return {
    async place(input: CreateOrder) {
      const order = await deps.orders.insert({ ...input, createdAt: deps.clock() });
      await deps.payments.charge(order);
      return order;
    },
  };
}
// composition root (index.ts) wires real implementations once
const orderService = makeOrderService({ orders: pgOrderRepo(pool), payments: stripeGateway(), clock: () => new Date() });
```

Injecting `clock` makes time-dependent logic testable; the same goes for random IDs. NestJS gives you a container and decorators for this; plain factory functions are enough for most Express or Fastify apps.

Repository pattern: one module per aggregate (`OrderRepo`) exposing intention-revealing methods (`findOpenByUser`, `insert`, `markPaid`), not a generic `query(sql)`. It centralises SQL, makes swapping Postgres for a test double trivial, and stops SQL leaking into handlers. Cost: another layer, and naive repos can hide N+1 queries; keep them thin and let them expose exactly the queries the domain needs.

Composition over inheritance: a `PremiumUser extends User extends BaseModel` chain couples everything to the base class's assumptions. Instead compose behaviours (`withAuditLog(repo)`, `withCache(repo)`) or pass strategies. In TypeScript, interfaces plus plain objects usually beat abstract classes.

DRY vs premature abstraction: DRY means one place for each piece of knowledge (the tax rate, the validation rule). Two handlers that look similar today but serve different business concepts are not duplication of knowledge; merging them creates a function full of flags. Rule of thumb: tolerate duplication until the third occurrence and until you can name the concept clearly. Extract when a change would need to be made in several places for the same reason.

Interview probe: "isn't this over-engineering for a small service?" Layers and injection are cheap when done with plain functions; skip repositories only if you are certain the service will stay a thin CRUD wrapper.

In an AI product: put the LLM provider behind an interface (`complete`, `stream`, `embed`) so you can swap models, add a caching or cost-tracking decorator, and fake it in tests without network calls.

</details>
