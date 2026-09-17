# Testing & Debugging

This note covers how to test a Node backend (API tests with supertest, the unit/integration split, test databases, mocking HTTP and time), how to debug a running Node process (inspector, heap snapshots, event-loop lag) and why contract tests exist between a frontend and its API; revise by reading each question, answering aloud before opening the answer, then expanding on any point you skipped.

## 1. Why test a backend, and what are the kinds of tests?

<details>
<summary>Answer</summary>

Backend tests exist to prove that an endpoint does what the contract says, keeps doing it after a refactor, and fails loudly when a dependency changes. The kinds differ by how much real machinery they touch.

| Kind | What it exercises | Speed | Typical count |
| --- | --- | --- | --- |
| Unit | One function in isolation: a price calculation, a validator | Milliseconds | Many |
| Integration | A route through the real app, often with a real test database | Hundreds of ms | Dozens |
| Contract | The shape of a response the frontend depends on | Fast | A few per endpoint |
| End-to-end | Frontend plus API plus database, driven like a user | Seconds | Few |

What a backend test looks like: start the app in-process, send a request with a tool like supertest, assert on the status code and body, and check the side effect (a row exists, a job was enqueued).

```js
const res = await request(app).post('/companies').send({ name: 'Infosys', ticker: 'INFY' });
expect(res.status).toBe(201);
expect(await db.company.findUnique({ where: { ticker: 'INFY' } })).not.toBeNull();
```

The two decisions every team makes: how to handle the database (a real one that is reset between tests, or a mock), and how to handle external services (never call them for real in tests; intercept or mock them). Both are covered in the next two entries.

Why frontend testing experience transfers: the same Jest or Vitest runner, the same `jest.fn` and `jest.spyOn`, the same idea of testing behaviour through the public surface rather than internals. What is new is that the public surface is HTTP and the state lives in a database.

In an AI product: the model provider is always mocked in tests, with recorded responses, so the suite is deterministic and free to run.

</details>

## 2. How do you write API tests, and what do you do about the database?

<details>
<summary>Answer</summary>

Unit tests cover pure logic (validators, pricing rules, mappers) with no I/O. Integration tests boot the real Express app in-process, send requests through supertest and assert on status and body, against a real database. For the database, either wrap each test in a transaction you roll back, or start a throwaway Postgres container for the run and truncate tables between tests.

supertest: a small library that takes your Express (or Fastify, or any `http` handler) app, binds it to a random port for the duration of the request, and gives you a chainable request builder. The key design move is exporting the app without calling `listen`; keep `listen` in a separate `server.js` so tests and production share the same wiring.

```js
import request from 'supertest';
import { buildApp } from '../src/app';

const app = buildApp({ db, llm: fakeLlm }); // deps injected, not imported

test('POST /orders creates an order', async () => {
  const res = await request(app)
    .post('/orders')
    .set('Authorization', `Bearer ${token}`)
    .send({ sku: 'abc', qty: 2 })
    .expect(201);

  expect(res.body).toMatchObject({ sku: 'abc', qty: 2 });
  expect(res.headers.location).toMatch(/\/orders\/.+/);
});
```

Unit vs integration on a backend:

| | Unit | Integration |
|---|---|---|
| Scope | one function or module | route, middleware, handler, SQL |
| I/O | none, dependencies stubbed | real DB, outbound HTTP intercepted |
| Speed | milliseconds | tens to hundreds of ms |
| Catches | logic bugs | wiring, SQL, serialization, auth, status codes |

Frontend parallel: unit is testing a hook in isolation; integration is rendering a page in React Testing Library with MSW. On a backend, most bugs live in the wiring (wrong status, missing `await`, bad SQL, auth middleware skipped), so the bulk of the suite should be integration tests against routes, with unit tests reserved for genuinely tricky pure logic. Do not mock the ORM or query layer in an integration test; you end up testing the mock.

Test database strategies:

1. Transaction rollback. `BEGIN` before each test, `ROLLBACK` after. Fast, isolated, no cleanup. Catch: the code under test must run on the same connection, so you need to inject the transaction client (or use a library that patches the pool). It breaks when code commits its own transactions, opens a second connection, or when you need to observe commit-time behaviour. Tests cannot run in parallel on one connection.
2. Throwaway container. Testcontainers or `docker compose` starts Postgres, you run migrations, run the suite, discard it. Give each Jest worker its own database (`CREATE DATABASE test_${JEST_WORKER_ID}`) so parallel workers do not collide, and `TRUNCATE ... RESTART IDENTITY CASCADE` between tests. Slower to start (seconds), but you exercise the real engine, real migrations, real constraints, and CI runs it identically.

Do not swap in SQLite as a Postgres stand-in; types, `jsonb`, constraint behaviour and SQL dialect all differ, so the tests pass and production fails. Do not point supertest at a deployed environment; that is an end-to-end test, slow and flaky by nature. Seed data with small factory functions per test rather than one giant fixture dump every test depends on.

Trade-off probed: speed versus fidelity. Rollback is fastest but dictates how production code manages connections; a container is most realistic but costs startup time and needs Docker in CI. Many teams use a container per run and rollback per test.

Vitest has the same shape (`vi.fn`, `describe`, `test`) if the project uses it.

In an AI product: inject the LLM client so integration tests pass a fake that returns a canned completion. Never hit the real provider in CI; it is slow, costs money, is rate-limited, and returns different text each run.

</details>

## 3. How do you mock external HTTP calls and time in backend tests?

<details>
<summary>Answer</summary>

Replace anything that leaves the process (outbound HTTP, the clock, randomness) and leave the rest real. `jest.fn` builds a stub, `jest.spyOn` wraps a real method so you can assert on calls, `jest.useFakeTimers` controls `setTimeout` and `Date`, and `nock` intercepts outgoing HTTP at the network layer so your real client code still runs. Vitest has `vi.fn`, `vi.spyOn`, `vi.useFakeTimers` with the same shape.

Terms in one line each. Stub: a replacement that returns a canned value. Spy: wraps the real function and records calls. Mock: a stub you also assert calls against (Jest's `jest.fn` is all three). Fake: a working but simplified implementation, such as an in-memory repository.

Two ways to handle outbound HTTP:

- Inject the client and pass a `jest.fn().mockResolvedValue(...)`. Simplest, fully typed, needs dependency injection in the code.
- Intercept at the network layer with nock. Your real client, serialization, headers and retry logic all execute; only the socket is faked. Works with third-party SDKs you do not control.

```js
import nock from 'nock';

beforeAll(() => nock.disableNetConnect()); // unmocked calls fail loudly
afterEach(() => nock.cleanAll());

test('retries once on 503', async () => {
  const scope = nock('https://api.stripe.com')
    .post('/v1/charges').reply(503)
    .post('/v1/charges').reply(200, { id: 'ch_1' });

  const charge = await createCharge({ amount: 500 });

  expect(charge.id).toBe('ch_1');
  expect(scope.isDone()).toBe(true); // both interceptors were consumed
});
```

`disableNetConnect` is the important line: without it a missing interceptor silently hits the internet. Allow `127.0.0.1` with `nock.enableNetConnect` so supertest still works. Caveat: classic nock patches `http.request`, which Node's built-in `fetch` (undici) bypasses; for `fetch`-based code use undici's `MockAgent` or MSW's Node server (which nock versions support `fetch` is unverified).

Fake timers:

```js
jest.useFakeTimers();

test('token refreshes before expiry', async () => {
  const refresh = jest.fn().mockResolvedValue('t2');
  startRefreshLoop(refresh, { everyMs: 60_000 });

  await jest.advanceTimersByTimeAsync(60_000);

  expect(refresh).toHaveBeenCalledTimes(1);
});
```

Gotchas: modern fake timers also freeze `Date.now()`, so set it with `jest.setSystemTime`. When timers and promises mix, use the `...Async` variants so awaited microtasks flush; the sync `advanceTimersByTime` will leave your assertion running before the promise resolves. Never fake timers in a test that uses a real database driver or supertest; their internal timeouts stop firing and the test hangs. The cleanest option is to inject a `now()` function into production code, then a test passes a fixed function and needs no fake timers at all.

Spies: `jest.spyOn(logger, 'warn')` asserts a warning was emitted without silencing everything. Restore with `jest.restoreAllMocks()` in `afterEach` or `restoreMocks: true` in config, otherwise spies leak between tests.

When not to mock: your own modules, the database in integration tests, the unit under test itself.

Trade-off probed: injection versus interception. Injection is simpler and type-safe; interception catches bugs in the real HTTP layer (wrong path, missing header, bad encoding) and works when the call is buried inside an SDK.

In an AI product: record real provider responses once into JSON fixtures and replay them with nock. For streaming, reply with a body of SSE chunks and assert on the assembled text and on how token-usage events are handled.

</details>

## 4. How do you debug a Node process: inspector, memory leaks, blocked event loop?

<details>
<summary>Answer</summary>

`node --inspect` exposes the same Chrome DevTools protocol you use for the frontend, so you get breakpoints, the Memory tab and the CPU profiler on a server process. A leak is found by comparing two heap snapshots and reading what grew and what retains it. A blocked event loop is found by measuring loop lag and then CPU-profiling to see which synchronous work is hogging the thread.

Inspector:

- `node --inspect server.js` listens on port 9229; `--inspect-brk` pauses on the first line, for scripts that exit quickly.
- Attach from `chrome://inspect` ("Open dedicated DevTools for Node") or a VS Code `"request": "attach"` config.
- Debug one Jest test: `node --inspect-brk node_modules/.bin/jest --runInBand path/to/test` plus a `debugger;` statement.
- Send `SIGUSR1` to a running process (Linux/macOS) to enable the inspector without a restart.
- Never expose 9229 publicly; it is remote code execution. Bind to localhost and tunnel with `ssh -L 9229:localhost:9229`.

Heap snapshot for a leak:

Symptom: `process.memoryUsage().heapUsed` climbs steadily under constant load, the container is OOM-killed and restarts every few hours.

1. Warm the service up, take snapshot A (Memory tab, or `v8.writeHeapSnapshot()` from code, or `--heapsnapshot-signal=SIGUSR2` and send the signal).
2. Apply load, for example a few thousand requests with autocannon.
3. Take snapshot B. Taking a snapshot forces a GC, so what remains is genuinely retained.
4. In DevTools select B, switch to "Comparison" against A, sort by size delta.
5. Open the constructor with the biggest growth and read the Retainers pane. It names the path holding the objects alive: a module-level `Map`, an `EventEmitter` listener array, a cache with no maximum size.

Usual culprits: listeners added per request and never removed (`MaxListenersExceededWarning` is the hint), unbounded in-memory caches keyed by user or request ID, closures held by long-lived timers, promises that never settle.

Blocked event loop:

Symptom: every endpoint slows at once, the health check times out, one CPU core sits at 100%.

```js
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
setInterval(() => {
  const p99ms = h.percentile(99) / 1e6; // histogram is in nanoseconds
  if (p99ms > 100) console.warn({ p99ms }, 'event loop lag');
  h.reset();
}, 10_000);
```

Export that as a metric and alert on it. The crude version is a 1-second `setTimeout` that logs how late it fired. To find the culprit, run with `--cpu-prof` (writes a `.cpuprofile` for the Performance tab) or use the inspector's Profiler; wide frames are the blockers. Typical ones: `JSON.parse` on multi-megabyte bodies, `readFileSync` or `bcrypt.hashSync` in a handler, a backtracking regex, sorting a huge array. Fix by moving to a worker thread, streaming, the async variant, or chunking with `setImmediate`.

Trade-off probed: profiling has overhead. A heap snapshot pauses the process for seconds on a large heap, so take it on one canary instance, not the fleet.

</details>

## 5. What is contract testing between frontend and API, and why bother?

<details>
<summary>Answer</summary>

A contract test checks that what the consumer (frontend) expects from the API and what the provider (backend) actually serves still agree, without running both together. It exists because the two codebases deploy independently, and the only other thing that catches a drift is a slow end-to-end suite that runs late or a user in production.

The failure it prevents: the backend renames `userName` to `username`. Every backend test passes. The frontend's MSW handlers and fixtures still say `userName`, so every frontend test passes too. Production breaks. Mocks on each side drift from reality because nothing ties them to the other side.

Two flavours:

| | Schema-based (OpenAPI) | Consumer-driven (Pact) |
|---|---|---|
| The contract | one spec the backend owns | a file generated from the frontend's tests |
| Backend check | validate real responses against the spec in tests | replay the consumer's recorded requests against the real service |
| Frontend check | generate TS types and client from the spec; breaking change is a compile error | its own tests run against a Pact mock server |
| Tells backend what is used | no, spec lists everything | yes, only fields the consumer actually asserted on |
| Machinery | a spec and a validator | a broker to share pacts, verification step in both CIs |

Schema-based is cheap and you may already have the spec: run response validation in your supertest suite and regenerate frontend types in CI. Consumer-driven adds the "can I deploy" question: before a release, the broker confirms this provider version has been verified against the consumer version currently in production. The payoff is that the backend can remove a field with confidence if no consumer's pact mentions it.

When to use: separate teams or repos, independent deploys, mobile apps with old versions in the wild, many services calling each other. When not to: one team in one repo shipping frontend and backend together. There, a shared TypeScript types package, tRPC, or a generated client from OpenAPI plus a few integration tests gives the same guarantee at compile time, and Pact is overhead.

Trade-off probed: contract tests check shape, not behaviour. They catch a missing field or a changed type, not a wrong discount calculation. They also only protect what the consumer declared; an undeclared field used in one component is not covered. They complement integration tests rather than replace them.

Interview follow-up: for GraphQL the schema is the contract and a breaking-change check on the schema in CI does the same job.

In an AI product: pin the streaming event shape (`delta`, `done`, `error`, usage fields) as a contract. A token-by-token renderer fails silently, showing nothing, if an event name changes.

</details>
