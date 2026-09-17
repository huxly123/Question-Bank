# Redis

This note covers the Redis patterns a full-stack round actually asks about (cache-aside and stampedes, rate limiting, distributed locks, sessions versus JWT, the data structures worth knowing, eviction and memory); revise by reading each question, answering aloud before opening the answer, then expanding on any point you skipped.

## 1. What is Redis, and why is it so fast?

<details>
<summary>Answer</summary>

Redis is an in-memory data store: a server that keeps its data in RAM instead of on disk and lets clients read and write it over the network with simple commands. Because RAM is thousands of times faster than disk and Redis processes commands on a single thread with no locking, a read or write usually takes well under a millisecond.

Think of it as a very fast shared dictionary that all your Node instances can reach. A key is a string like `company:42:financials`; the value can be a string, a hash (object), a list, a set, or a sorted set. Every key can carry a TTL (time to live) so it deletes itself.

```text
SET   company:42:financials '{"revenue": 1200}' EX 300   # store for 300 seconds
GET   company:42:financials
INCR  ratelimit:user:7:login                             # atomic counter
DEL   company:42:financials
```

Why it exists: the database is the slow, expensive part of a backend. Redis lets you keep frequently read or short-lived data next to the application so most requests never touch Postgres, and gives you atomic counters and expiring keys that are awkward to build in SQL.

What it is used for in practice: caching query results, rate-limit counters, sessions, short-lived locks, job queues (BullMQ is built on it), and pub/sub between processes.

What it is not: a replacement for Postgres. It is memory-limited, its persistence is optional and delayed, and it has no joins or rich queries. Treat anything in Redis as something you can afford to lose or rebuild, unless you have deliberately configured it as a durable store (entry 7).

In an AI product: caching an LLM response by a hash of the prompt saves the cost of calling the model twice for the same question, and per-user counters keep you under the provider's rate limits.

</details>

## 2. How does cache-aside work, and how do you stop a cache stampede?

<details>
<summary>Answer</summary>

Cache-aside means the application owns the cache: read the cache first, on a miss read the database and write the result back with a TTL, and on every write update the database then delete the cached key. A stampede is when a hot key expires and hundreds of concurrent requests all miss at once and hit the database together; you stop it by letting only one request rebuild the value while the others wait or serve a stale copy.

Read path:

1. `GET user:42`. Hit: return it.
2. Miss: query the database, `SET user:42 <json> EX 300`, return it.

Write path: update the database, then `DEL user:42`. Delete rather than rewrite. Two writers rewriting the cache can land out of order and leave the newer value overwritten by the older one; a delete cannot go stale, and the next reader repopulates. The TTL is the safety net for anything the invalidation misses (a crash between the database write and the `DEL`, a write path you forgot).

Known race in cache-aside: reader A misses and reads the old row, writer B updates the database and deletes the key, then A writes the old row into the cache. It is rare because the database read is fast, and a short TTL bounds the damage. If it matters, delete the key again a few hundred milliseconds after the write (delayed double delete).

Stampede protection, in order of effort:

- Jitter the TTL (`300 + random(0..60)` seconds) so keys warmed at the same time do not expire at the same time.
- Single-flight rebuild: the first request that misses takes a short lock with `SET user:42:lock 1 PX 3000 NX`; only the lock holder queries the database. Others wait a few milliseconds and re-read the cache, or return the stale value if you kept one.
- In-process coalescing: within one Node process, keep a `Map<key, Promise>` so concurrent callers share one in-flight promise. Cheap, but it does not help across instances.
- Stale-while-revalidate: store the value with a logical expiry shorter than the real TTL. When the logical expiry passes, return the stale value immediately and refresh in the background.
- Negative caching: cache "not found" with a short TTL so a burst of requests for a missing id does not become a burst of database misses.

```js
async function getUser(id) {
  const key = `user:${id}`;
  const hit = await redis.get(key);
  if (hit) return JSON.parse(hit);

  const lock = await redis.set(`${key}:lock`, '1', 'PX', 3000, 'NX');
  if (lock !== 'OK') {                 // someone else is rebuilding
    await sleep(50);
    return getUser(id);                // cap the retries in real code
  }
  const user = await db.users.findById(id);
  const ttl = 300 + Math.floor(Math.random() * 60);
  await redis.set(key, JSON.stringify(user), 'EX', ttl);
  await redis.del(`${key}:lock`);
  return user;
}

async function updateUser(id, patch) {
  await db.users.update(id, patch);
  await redis.del(`user:${id}`);       // delete, do not rewrite
}
```

When not to cache-aside: data that must never be stale (balances, inventory counts at checkout), or data read once per write (the cache only adds a network hop). Alternatives the interviewer may name: write-through (write to cache and database together, cache is always warm, writes are slower) and write-behind (write to cache, flush to the database later, fast but loses data if Redis dies).

The trade-off being probed: freshness versus load. TTL length sets how stale you accept; invalidation on write sets how much code you must get right.

In an AI product: cache LLM responses under a hash of model, system prompt, normalised user prompt and parameters; the single-flight lock matters more than usual because each rebuild is a paid call that takes seconds, not milliseconds.

</details>

## 3. How do fixed window, sliding window and token bucket rate limiting differ?

<details>
<summary>Answer</summary>

Fixed window counts requests per calendar bucket (this minute) and is the cheapest but lets a client send double the limit across a boundary. Sliding window counts requests in the last N seconds from now, which is exact but costs more memory. Token bucket gives each client a bucket that refills at a steady rate; it allows short bursts up to the bucket size while enforcing the average, which is what most public APIs want.

Fixed window: one counter per user per bucket.

```js
async function allow(userId, limit = 100) {
  const bucket = Math.floor(Date.now() / 60_000);
  const key = `rl:${userId}:${bucket}`;
  const results = await redis.multi().incr(key).expire(key, 120).exec();
  const count = results[0][1];         // ioredis returns [err, value] pairs
  return count <= limit;
}
```

The bucket is in the key name, so the `EXPIRE` is only cleanup. Weakness: 100 requests at 12:00:59 and 100 more at 12:01:00 both pass, so a burst of 200 in two seconds.

Sliding window log: a sorted set per user with score = timestamp. Exact, but stores one member per request, so it is expensive for high limits.

```text
MULTI
ZREMRANGEBYSCORE rl:u42 -inf (1726480000000     # drop entries older than now - window
ZADD rl:u42 1726480060000 1726480060000-r7      # member must be unique
ZCARD rl:u42                                    # compare to the limit
EXPIRE rl:u42 60
EXEC
```

Sliding window counter: weight the previous fixed bucket by how much of it still falls inside the window (`prev * (1 - elapsed/window) + current`). Approximate, two counters, no boundary burst. Cloudflare uses this.

Token bucket: store `tokens` and `ts` in a hash. On each request refill `tokens += (now - ts) * rate`, cap at capacity, take one if available. The read-modify-write must be atomic across instances, so it lives in a Lua script (`EVAL`, or ioredis `defineCommand`). Capacity is the burst you allow; rate is the sustained limit. Leaky bucket is the same idea seen from the output side: requests drain at a fixed rate and excess is dropped.

| | Fixed window | Sliding log | Token bucket |
|---|---|---|---|
| Accuracy | boundary burst 2x | exact | exact on average |
| Memory per user | one int | one entry per request | two numbers |
| Allows bursts | accidentally | no | by design |
| Cost per request | O(1) | O(log N) | O(1) in Lua |

Where to enforce:

- Edge or gateway (Cloudflare, nginx, API gateway): coarse per-IP limits that stop abuse before it reaches your process. Cheap, but knows nothing about users or plans.
- Application middleware: per user or API key, with limits that depend on the plan. Must use a shared store such as Redis because the counter has to be the same across every instance; an in-memory limiter silently multiplies your limit by the instance count.
- Outbound client: a token bucket in front of a third-party API so you never exceed their quota.

Respond with 429 and a `Retry-After` header; `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` are the common convention for telling the client where it stands. Decide fail-open (Redis down: allow) or fail-closed (deny) up front; most product APIs fail open and alert.

Interview probe: why not `INCR` then `EXPIRE` as two calls? If the process dies between them the key never expires. Use `MULTI`, a Lua script, or `EXPIRE key 60 NX` (Redis 7) so the TTL is set only once.

In an AI product: a token bucket per user protects the provider quota, and the deduction is weighted by estimated LLM tokens rather than one per request, because one 100k-token prompt costs more than a hundred short ones.

</details>

## 4. How does a SET NX PX distributed lock work, and how can it fail?

<details>
<summary>Answer</summary>

`SET lock:job:42 <random-token> NX PX 30000` atomically creates the key only if it does not exist and gives it a 30-second expiry, so at most one client holds it and a crashed client cannot hold it forever. Release by deleting the key only if it still holds your token, in a Lua script, so you never delete a lock someone else acquired after yours expired.

```js
const RELEASE = `
  if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
  end
  return 0`;

async function runOnce(jobId, work) {
  const key = `lock:job:${jobId}`;
  const token = crypto.randomUUID();
  const ok = await redis.set(key, token, 'PX', 30_000, 'NX');
  if (ok !== 'OK') return false;       // someone else has it
  try {
    await work();
  } finally {
    await redis.eval(RELEASE, 1, key, token);
  }
  return true;
}
```

Why each piece matters:

- `NX`: create-if-absent. Without it two clients both "acquire".
- `PX`: the lease. Without it a client that dies mid-job locks everyone out until a human runs `DEL`.
- Random token plus compare-and-delete: a plain `DEL` on release can remove a lock that expired and was re-acquired by another client.

Failure modes:

1. Lease expires while you are still working. Your process paused (GC, slow I/O, network stall), the key expired, another client acquired it, now two clients run the job. The lock has not protected you. Mitigations: pick a TTL well above the p99 job time, or run a watchdog that extends the lease with `PEXPIRE` from a Lua script that first checks the token.
2. Failover loses the lock. Redis replication is asynchronous. A lock written to the primary can be missing on the replica that gets promoted a moment later, and a second client acquires it there.
3. Clock and timing. TTL runs on the Redis server clock; the client cannot know exactly when it expires.
4. Redis unavailable. Decide whether the job skips or runs unlocked.

Redlock is the attempt to fix failure 2: acquire the same lock on a majority of N independent Redis nodes. Martin Kleppmann's critique is the expected follow-up: no lock over an asynchronous network can guarantee mutual exclusion against pauses and clock drift, so Redlock is fine for efficiency but not for correctness.

The rule to state in the interview: use a Redis lock to avoid duplicate work (efficiency), not to guarantee it never happens (correctness). For correctness, make the protected operation itself safe: a unique constraint, a database transaction, a fencing token (a monotonically increasing number the storage layer rejects if it goes backwards), or a consensus store such as etcd or ZooKeeper.

In an AI product: three worker replicas share a cron that re-embeds changed documents; the lock makes one replica run it, and the job is idempotent (upsert by document id) because the lock can be lost.

</details>

## 5. When do you store sessions in Redis, and when is a stateless JWT better?

<details>
<summary>Answer</summary>

A Redis session is an opaque random ID in an HttpOnly cookie that points at server-side state you can read, change and delete at will. A JWT is a signed token that carries its claims with it, so any service can verify it without a lookup, but you cannot revoke it before it expires. Choose sessions when you need instant logout and per-user control; choose short-lived JWTs when many services or third parties must verify identity without calling home.

Sessions in Redis:

```text
HSET sess:9f3a userId 42 role admin csrf k7d2
EXPIRE sess:9f3a 1800                # slide the TTL on each request
HGETALL sess:9f3a
DEL sess:9f3a                        # logout
SADD user:42:sessions 9f3a           # for "log out everywhere"
```

- The cookie holds only the ID (`Set-Cookie: sid=9f3a; HttpOnly; Secure; SameSite=Lax`); the client never sees or holds user data.
- Any instance can serve any request because the state lives in Redis, so no sticky sessions.
- Revocation is `DEL`. Role changes take effect on the next request.
- Cost: one Redis round trip per request, and Redis down means everyone is logged out. Run it as a store (see entry 7), not on a cache instance that may evict sessions.
- In Node: `express-session` with a Redis store such as `connect-redis`.

Stateless JWT:

- Header, payload (claims: `sub`, `exp`, `iat`, roles), signature. The server checks the signature and `exp` and trusts the claims.
- No lookup, so it scales across services and works for mobile and third-party API clients that cannot hold a cookie session.
- Cannot be revoked. A stolen token is valid until `exp`. The fixes all add state back: a denylist of `jti` values in Redis checked on every request, or a per-user `tokenVersion` in Redis compared to a claim.
- Payload is readable by anyone (base64, not encrypted), and a fat token is sent on every request.
- Storage on the client: an HttpOnly cookie or memory, never `localStorage`, which any XSS can read.

| Need | Sessions | JWT |
|---|---|---|
| Instant logout, ban, role change | yes | no (denylist) |
| Verify without network hop | no | yes |
| Many services or third-party callers | awkward | natural |
| Redis outage | logged out | unaffected |
| Token size | tiny | hundreds of bytes |

The common production answer is a hybrid: a short-lived JWT access token (5 to 15 minutes) for stateless verification, plus a refresh token stored in Redis. Refresh is where you enforce revocation and rotation; access-token theft is bounded by its lifetime.

Interview probe: "JWTs are stateless, so they scale better." Reply that verification scales better, but any product that needs logout or bans reintroduces state, so you are choosing where the state lives, not whether it exists.

</details>

## 6. Which Redis data structures should you know, and what is each one for?

<details>
<summary>Answer</summary>

Redis is a key to data-structure store, not a key to string store. Strings handle caches and counters, hashes hold objects with independently updatable fields, sorted sets give you ordered data by score (leaderboards, time windows, delayed jobs), and pub/sub broadcasts messages to whoever is listening right now.

Strings: any bytes up to 512 MB.

```text
SET user:42 '{"name":"Ana"}' EX 300
INCR page:home:views                  # atomic counter
INCRBY credits:42 -5
MGET user:42 user:43                  # batch read
```

Use for cache entries, counters, flags, locks (entry 4). Atomic `INCR` is why Redis is the default for counters across instances.

Hashes: a map of field to value under one key.

```text
HSET user:42 name Ana plan pro
HINCRBY user:42 logins 1
HGET user:42 plan
HGETALL user:42
```

Use when you update one field of an object without rewriting the whole JSON, or store many small objects cheaply (small hashes use a compact encoding). Limit: the TTL is on the whole key, not per field, until Redis 7.4's `HEXPIRE`.

Lists and sets, briefly: `LPUSH`/`BRPOP` make a simple queue; `SADD`/`SISMEMBER`/`SINTER` give membership tests and intersections (tags, followers in common).

Sorted sets: members with a floating-point score, kept sorted. Insert and rank are O(log N).

```text
ZINCRBY leaderboard 10 user:42        # add points
ZRANGE leaderboard 0 9 REV WITHSCORES # top 10 (ZREVRANGE on older Redis)
ZREVRANK leaderboard user:42          # my 0-based rank
ZRANGEBYSCORE due 0 1726480000000     # delayed jobs whose run-at has passed
ZREMRANGEBYSCORE rl:u42 -inf (1726479940000  # trim a sliding window
```

Use for leaderboards, sliding-window rate limits (score = timestamp, entry 3), delayed or scheduled jobs (score = run-at; BullMQ does this), and "top N by anything numeric". Not for arbitrary ordering by a string field.

Pub/sub: `SUBSCRIBE chat:room:7` on one connection, `PUBLISH chat:room:7 "hi"` on another. Delivery is fire-and-forget: no persistence, no acknowledgement, a subscriber that is offline misses the message. Use it to fan out across instances (Socket.IO's Redis adapter, cache-invalidation broadcasts), never as a job queue. For durable messaging use Streams: `XADD` appends to a log, `XREADGROUP` hands entries to consumers in a group, `XACK` confirms them, and unacknowledged entries can be reclaimed.

Interview probe: "how would you implement a leaderboard in Postgres?" `ORDER BY score DESC LIMIT 10` is fine; rank of one user is a `COUNT(*) WHERE score > mine`, which is a scan. The sorted set gives rank in O(log N), which is the reason to pick Redis.

In an AI product: pub/sub carries streamed LLM tokens from the worker that holds the provider connection to whichever API instance holds the user's SSE connection.

</details>

## 7. How do Redis eviction policies and memory limits work for cache versus store?

<details>
<summary>Answer</summary>

`maxmemory` caps how much data Redis holds, and `maxmemory-policy` says what happens when the cap is hit: either evict keys by some rule, or refuse writes. A cache sets a policy that evicts (`allkeys-lru` or `allkeys-lfu`) and treats every key as disposable; a store keeps the default `noeviction`, turns on persistence, and treats hitting the limit as an incident. Never mix the two workloads in one instance.

Policies:

| Policy | Evicts | Use |
|---|---|---|
| `noeviction` (default) | nothing; writes fail with an OOM error, reads work | store |
| `allkeys-lru` | least recently used across all keys | general cache |
| `allkeys-lfu` | least frequently used | cache with a stable hot set |
| `volatile-lru` / `volatile-lfu` | same, but only keys with a TTL | mixed instance (avoid) |
| `volatile-ttl` | keys closest to expiry | cache where TTL means priority |
| `allkeys-random` / `volatile-random` | random | rarely |

Details worth saying:

- LRU and LFU are approximate. Redis samples `maxmemory-samples` keys (default 5) and evicts the best candidate, which is cheap and close enough.
- `volatile-*` with no TTL keys left to evict behaves like `noeviction`. That is how a "cache" instance starts throwing write errors.
- `maxmemory` defaults to 0 (unlimited) on 64-bit, so an unconfigured Redis grows until the OS kills it. Always set it.
- Expired keys are removed lazily on access and by a background sampler, so they count toward memory for a while after they expire.

```text
CONFIG SET maxmemory 2gb
CONFIG SET maxmemory-policy allkeys-lfu
INFO memory                           # used_memory, mem_fragmentation_ratio
MEMORY USAGE user:42                  # bytes for one key
SCAN 0 MATCH sess:* COUNT 1000        # never KEYS in production
UNLINK bigkey                         # delete large keys off the main thread
```

Redis as cache: data is a copy of something else. Eviction is fine, every key has a TTL, persistence is off or a periodic RDB snapshot for a warm restart, and the application must work (slower) with an empty Redis.

Redis as store: data exists only here (sessions, rate-limit counters, locks, queue entries, feature flags). Eviction is data loss: an evicted lock means a job runs twice, an evicted session logs a user out, an evicted counter resets a limit. Use `noeviction`, AOF persistence (`appendfsync everysec`) plus RDB, a replica, and alerts on `used_memory` well before the cap.

Why separate instances: eviction is instance-wide, and logical databases (`SELECT 1`) do not isolate memory. A traffic spike filling the cache will evict your sessions. Run at least two Redis deployments, or one per workload, sized independently.

Interview probe: "why is memory usage higher than the sum of my keys?" Per-key overhead (about 50 to 100 bytes for the key object and dictionary entry), fragmentation (`mem_fragmentation_ratio` above 1.5 is worth investigating), and replica output buffers.

In an AI product: LLM response cache and hot embeddings live in an `allkeys-lfu` instance where losing a key costs one extra API call; rate-limit buckets and job locks live in a `noeviction` instance because losing one costs money or duplicate work.

</details>
