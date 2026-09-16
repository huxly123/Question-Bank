# PostgreSQL

This note covers the Postgres knowledge a full-stack round probes (schema design, indexes, query plans, N+1, transactions and locking, migrations, pooling, when not to use Postgres, ACID, replication and sharding vocabulary, full-text search, NULL traps); revise by reading each question, answering aloud before opening the answer, then expanding on any point you skipped.

Running example: a financial-data app with `users`, `companies` and `prices` (one row per company per trading day).

## 1. How would you model users, companies and prices, and when would you denormalise?

<details>
<summary>Answer</summary>

Put each fact in exactly one place, give every table a primary key, and link tables with foreign keys. That is normalisation in practice. Denormalise (copy or precompute data) only when a measured read path is too slow and you can afford to keep the copy correct.

Normalisation means removing duplicated facts so an update has one row to change. The forms in one line each:

- 1NF: one value per cell, no lists in a column. Do not store `tickers = 'AAPL,MSFT'` on a user.
- 2NF: every non-key column depends on the whole key. In `prices (company_id, trade_date, close, company_name)`, `company_name` depends only on `company_id`, so it moves out.
- 3NF: no column depends on another non-key column. If `sector` decides `sector_description`, the description lives in a `sectors` table.

```sql
CREATE TABLE users (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       text NOT NULL UNIQUE,
  referred_by bigint REFERENCES users(id),          -- nullable, used in entry 12
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE companies (
  id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ticker  text NOT NULL UNIQUE,
  name    text NOT NULL,
  sector  text
);

CREATE TABLE prices (
  company_id  bigint NOT NULL REFERENCES companies(id),
  trade_date  date NOT NULL,
  close       numeric(18, 6) NOT NULL,             -- never float for money
  volume      bigint,
  PRIMARY KEY (company_id, trade_date)
);

CREATE TABLE watchlist_items (
  user_id    bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id bigint NOT NULL REFERENCES companies(id),
  PRIMARY KEY (user_id, company_id)
);
```

Design choices worth saying aloud:

- `prices` uses a natural composite key `(company_id, trade_date)`. It enforces "one close per company per day" and doubles as the index for the main query (prices for one company over a date range).
- Many-to-many (users watch companies) is a join table with its own composite primary key, not an array column.
- `numeric` for money, `timestamptz` for instants, `date` for trading days, `text` over `varchar(n)` unless the limit is a real business rule.
- Constraints (`NOT NULL`, `UNIQUE`, `CHECK`, foreign keys) are the cheapest bugs you will ever prevent. Put them in the database, not only in the ORM.

When to denormalise:

- A hot read needs a join or aggregate that is measurably slow. Example: the dashboard shows each company's latest close. Computing it is `SELECT DISTINCT ON (company_id) ... ORDER BY company_id, trade_date DESC` over millions of rows. Adding `companies.latest_close` and `latest_trade_date`, updated when a price is inserted, turns that into a single-table read.
- You need a point-in-time snapshot. An order stores the price it was filled at, even though `prices` has it, because the "current" row can change later.
- Counters (`watchers_count` on companies) to avoid `COUNT(*)` on every render.

The trade-off: every copy is a second source of truth. You now need a trigger, a transaction that writes both, or a background job, plus a way to detect drift. Do it late, do it with a measurement, and keep the normalised data as the source of truth so the copy can be rebuilt.

In an AI product: an `embeddings` table (`id`, `company_id`, `chunk_text`, `embedding vector(1536)`, `source`) references `companies` by foreign key, so a deleted company cascades to its vectors; the chunk text is deliberately denormalised into the row so retrieval does not need a second lookup.

</details>

## 2. How do B-tree indexes work, and why might Postgres ignore one?

<details>
<summary>Answer</summary>

A B-tree index is a sorted, balanced tree of key values, each pointing at a table row. Postgres walks it in a few page reads to find matching keys, then fetches the rows. Postgres ignores an index when the planner thinks scanning the table is cheaper, or when the query is written so the index cannot be used.

What a B-tree serves: `=`, `<`, `<=`, `>`, `>=`, `BETWEEN`, `IN`, `IS NULL`, and `ORDER BY` on the indexed columns. It serves `ticker LIKE 'AA%'` only when the index uses `text_pattern_ops` or the database collation is `C`. It never serves `LIKE '%AA'`.

Composite index column order matters. The index is sorted by the first column, then the second within it, like a phone book by surname then first name.

```sql
-- Main query: one company over a date range
SELECT trade_date, close FROM prices
WHERE company_id = 42 AND trade_date BETWEEN '2024-01-01' AND '2024-03-31';

-- Good: equality column first, range column second (this is already the PK order)
CREATE INDEX ON prices (company_id, trade_date);
```

Rules:

- The index is usable for any leftmost prefix: `(company_id)` alone, or `(company_id, trade_date)`. It is useless for a query on `trade_date` alone.
- Put equality columns first, then the range column, then columns you only sort by.
- One composite index on `(a, b)` usually beats two single indexes; the planner can combine single indexes with a bitmap scan, but it is slower.

Covering index: add the columns the query selects so Postgres can answer from the index alone (an "index-only scan") without touching the table.

```sql
CREATE INDEX prices_company_date_close_idx
  ON prices (company_id, trade_date) INCLUDE (close);
```

`INCLUDE` columns are stored in the leaf pages but not sorted or used for lookups. An index-only scan still checks the visibility map, so a table with many recent updates and no `VACUUM` will fall back to heap fetches.

Why an index is ignored:

| Cause | Fix |
|---|---|
| Table is small; a seq scan is genuinely cheaper | Nothing; this is correct |
| Predicate matches a large share of rows (low selectivity) | Accept the seq scan, or add a filter |
| Function or cast on the column: `WHERE date(created_at) = '2024-01-01'` | Rewrite as a range: `created_at >= ... AND created_at < ...`, or index the expression |
| Type mismatch: comparing `bigint` column to `text` parameter | Fix the parameter type in the driver |
| Leading column missing from `WHERE` | Reorder or add an index |
| Stale statistics after a bulk load | `ANALYZE prices;` |
| `OR` across different columns | Split into `UNION`, or index both columns for a bitmap OR |

Every index costs write time and disk, and slows `INSERT` on `prices`, which is the highest-volume table. Index for measured queries, not "just in case".

In an AI product: pgvector similarity queries do not use B-tree at all; they use an HNSW or IVFFlat index (`CREATE INDEX ON embeddings USING hnsw (embedding vector_cosine_ops)`), which trades exact results for speed, so the interviewer wants you to name that as a different index type with its own recall trade-off.

</details>

## 3. How do you read EXPLAIN ANALYZE output to find a slow query?

<details>
<summary>Answer</summary>

`EXPLAIN` shows the plan the planner chose with estimated costs; `EXPLAIN ANALYZE` actually runs the query and adds real timings and row counts. Read the tree from the innermost, most-indented node outwards, and look for the node where time is spent or where estimated rows are far from actual rows.

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT trade_date, close FROM prices
WHERE company_id = 42 AND trade_date >= '2024-01-01';
```

Illustrative output:

```text
Index Scan using prices_pkey on prices  (cost=0.43..120.10 rows=62 width=14)
                                        (actual time=0.031..0.210 rows=61 loops=1)
  Index Cond: ((company_id = 42) AND (trade_date >= '2024-01-01'::date))
  Buffers: shared hit=5
Planning Time: 0.120 ms
Execution Time: 0.240 ms
```

How to read each part:

- `cost=0.43..120.10`: startup cost and total cost in arbitrary planner units, not milliseconds. Only compare them against other plans for the same query.
- `rows=62` (estimated) vs `rows=61` (actual): close together, so statistics are healthy.
- `actual time=0.031..0.210`: ms to first row and to last row, for one execution of the node.
- `loops=N`: the node ran N times; multiply the per-loop time and rows by `loops` to get the real total. A nested loop with `loops=10000` on the inner side is a classic hidden cost.
- `Buffers: shared hit` are pages from cache, `read` are pages from disk.

Scan types:

| Node | Meaning | Good or bad |
|---|---|---|
| Seq Scan | reads the whole table | fine for small tables or most rows; bad with a selective `WHERE` on a big table |
| Index Scan | walks the index, fetches each matching row from the table | good for few rows |
| Index Only Scan | answers from the index alone | best; needs a covering index and a vacuumed table |
| Bitmap Heap Scan | collects matching pages from one or more indexes, then reads them in order | good for a medium number of rows |

Join types: Nested Loop (good when one side is tiny), Hash Join (builds a hash table of one side; good for large unsorted sets), Merge Join (both sides sorted, often via indexes).

Estimated vs actual rows is the key diagnostic. When they differ by 10x or more the planner is choosing based on wrong information:

- Stale statistics after a bulk insert or big delete: run `ANALYZE`, and check autovacuum is keeping up.
- Correlated columns (`sector` and `ticker` prefix): the planner multiplies selectivities as if independent. `CREATE STATISTICS` on the column pair fixes this.
- Complex expressions or `jsonb` lookups the planner cannot estimate.

Practical habits: `EXPLAIN ANALYZE` on an `UPDATE` or `DELETE` really runs it, so wrap it in `BEGIN; ... ROLLBACK;`. Run it against production-sized data; a plan on a 100-row dev table is meaningless. Paste output into a plan visualiser when the tree is deep.

</details>

## 4. What is the N+1 query problem and how do you fix it?

<details>
<summary>Answer</summary>

N+1 is when code fetches a list of N parent rows with one query, then runs one more query per parent to load its children: 1 + N round trips. Each query is fast, so nothing looks slow in isolation, but a page listing 50 companies fires 51 queries. Fix it by loading the children for all parents in one query, either with a `JOIN` or with a batched `WHERE ... IN` lookup.

How ORMs cause it: lazy loading. `company.prices` looks like a property access in JavaScript, but it is a query, run inside a loop, and invisible to whoever reads the template.

```js
// N+1: one query for companies, then one per company
const companies = await prisma.company.findMany({ take: 50 });
for (const c of companies) {
  c.latest = await prisma.price.findFirst({ where: { companyId: c.id }, orderBy: { tradeDate: 'desc' } });
}
```

Fix 1: a join, one query, database does the work.

```sql
SELECT c.id, c.ticker, p.trade_date, p.close
FROM companies c
LEFT JOIN LATERAL (
  SELECT trade_date, close FROM prices
  WHERE company_id = c.id ORDER BY trade_date DESC LIMIT 1
) p ON true
ORDER BY c.ticker LIMIT 50;
```

Fix 2: two queries, batched by IDs. Fetch parents, collect their IDs, fetch all children in one query, group them in application code.

```sql
SELECT * FROM prices
WHERE company_id = ANY($1::bigint[]) AND trade_date >= $2;
```

`= ANY(array)` is the parameterised form of `IN (...)` in Postgres; a single bind parameter instead of building a placeholder list.

Joins vs batched IN:

| | JOIN | Batched IN |
|---|---|---|
| Round trips | 1 | 2 (or 1 + number of relations) |
| Result shape | flat rows; the parent repeats for every child | separate lists, grouped in code |
| Multiple has-many relations | row count multiplies (companies x prices x news), the "cartesian explosion" | stays linear |
| Fits an ORM | `include` / eager load usually generates this or the batched form | DataLoader pattern, `where: { id: { in } }` |

Use a join when you need one child per parent, or filter or sort parents by child columns. Use batched IN when loading two or more collections per parent, or in a GraphQL resolver where a DataLoader collects IDs during one tick and issues one query per relation.

How to detect it: log query counts per request, or set a test that fails when a request issues more than a threshold. Prisma, Drizzle and TypeORM all log SQL; watching a list endpoint emit the same query with different IDs is the fingerprint.

In an AI product: rendering a conversation list with the last message of each thread is exactly this shape; a `LATERAL` join or a `DISTINCT ON (conversation_id)` query replaces one query per thread.

</details>

## 5. How do isolation levels, locking and deadlocks work in Postgres?

<details>
<summary>Answer</summary>

A transaction groups statements so they all commit or all roll back. Isolation level decides what one transaction can see of others running at the same time; Postgres defaults to Read Committed. Pessimistic locking takes a row lock up front (`SELECT ... FOR UPDATE`); optimistic locking takes no lock and checks a version column at write time. A deadlock is two transactions each waiting for a lock the other holds; Postgres detects it and aborts one.

Isolation levels in Postgres (Read Uncommitted exists in the SQL standard but behaves as Read Committed here):

| Level | What you see | Anomaly still possible |
|---|---|---|
| Read Committed (default) | each statement sees data committed before that statement started | non-repeatable read: the same `SELECT` twice in one transaction can differ |
| Repeatable Read | one snapshot taken at the first statement, for the whole transaction | write skew; an `UPDATE` on a row changed by another transaction fails with a serialization error |
| Serializable | as if transactions ran one after another | none, but transactions can be aborted with error `40001` and must be retried |

Postgres uses MVCC (multi-version concurrency control): writers create new row versions rather than overwriting, so readers never block writers and writers never block readers. Writers do block writers on the same row.

Pessimistic locking, for short critical sections where conflict is likely:

```sql
BEGIN;
SELECT cash_balance FROM users WHERE id = 7 FOR UPDATE;   -- row locked until commit
UPDATE users SET cash_balance = cash_balance - 100 WHERE id = 7;
COMMIT;
```

Variants: `FOR UPDATE NOWAIT` errors instead of waiting; `FOR UPDATE SKIP LOCKED` skips rows others hold, the standard trick for a job queue table where many workers pull the next job.

Optimistic locking, for long-lived edits (a user editing a form) where conflict is rare:

```sql
UPDATE companies
SET name = $1, version = version + 1
WHERE id = $2 AND version = $3;
-- rowCount = 0 means someone else saved first; return 409 to the client
```

No lock is held while the user thinks, and the check costs nothing extra. The trade-off: the loser has to redo the work.

Deadlocks: transaction A locks user 1 then wants user 2; transaction B locks user 2 then wants user 1. Neither can proceed. After `deadlock_timeout` (default one second) Postgres aborts one with error `40P01`; the other continues.

Avoiding them:

- Lock rows in a consistent order (sort IDs before updating).
- Keep transactions short; never hold a transaction open across a network call or an LLM request.
- Update in one statement where possible (`UPDATE ... WHERE id = ANY($1)` locks in one go).
- Treat `40P01` and `40001` as retryable in the application, with a small bounded retry loop.

Interview probe: "which level would you use for a balance transfer?" Read Committed plus `FOR UPDATE` on both rows in ID order, or Serializable with retries. Explain that Serializable is simplest to reason about and costs more aborts under contention.

In an AI product: an idempotency table for paid completion calls (entry 7 in the Node note) relies on the `INSERT` and the business write sharing one transaction; if the transaction stays open while the model call runs, you are holding row locks for many seconds, so write the key first, run the call outside any transaction, then store the result.

</details>

## 6. How do you run schema migrations without downtime?

<details>
<summary>Answer</summary>

Treat migrations as forward-only, versioned files applied in order by a tool, and make each step safe to run while the old code is still serving traffic. The rule is "expand, migrate, contract": add the new thing, move data and code over, remove the old thing in a later release.

Forward-only means you do not rely on `down` migrations in production. Rolling back a deploy runs the old code against the new schema, so every migration must be compatible with the previous code version. If a migration is wrong, ship a new migration that fixes it.

Why schema changes are dangerous: `ALTER TABLE` takes an `ACCESS EXCLUSIVE` lock. It waits for every running query on that table to finish, and while it waits every new query queues behind it. One slow report can stall the whole app for a lock that would take a millisecond to hold.

Safe patterns, using "add a required `country` column to companies":

```sql
SET lock_timeout = '3s';                    -- give up rather than block traffic

-- 1. Expand: nullable column, no rewrite. A constant DEFAULT is also
--    metadata-only in modern Postgres (since 11).
ALTER TABLE companies ADD COLUMN country text;

-- 2. Deploy code that writes country on every insert/update.

-- 3. Backfill in batches, outside a single huge transaction.
UPDATE companies SET country = 'US'
WHERE country IS NULL AND id BETWEEN 1 AND 10000;   -- repeat per range

-- 4. Enforce without a full-table lock.
ALTER TABLE companies ADD CONSTRAINT companies_country_not_null
  CHECK (country IS NOT NULL) NOT VALID;            -- instant, checks new rows only
ALTER TABLE companies VALIDATE CONSTRAINT companies_country_not_null;  -- scans, but does not block writes
ALTER TABLE companies ALTER COLUMN country SET NOT NULL;   -- uses the validated check, no rescan
ALTER TABLE companies DROP CONSTRAINT companies_country_not_null;

-- 5. Index without blocking writes (cannot run inside a transaction).
CREATE INDEX CONCURRENTLY companies_country_idx ON companies (country);
```

Things that rewrite the table or block for a long time and need the expand/contract treatment: changing a column type, adding a column with a volatile default (`now()`, `gen_random_uuid()`), adding `NOT NULL` directly to a big table, renaming a column the old code still reads.

Renames: add the new column, dual-write from code, backfill, switch reads, drop the old column two releases later.

Backfills: batch by primary key range, pause between batches, make the job resumable. A single `UPDATE` of 50 million rows holds locks, bloats the table, and can fill the WAL.

Tooling (Prisma Migrate, Drizzle Kit, node-pg-migrate, plain SQL files with a `schema_migrations` table): check migrations into git, run them in CI against a fresh database, and run them as a separate deploy step before the new code rolls out, never on app startup where every instance would race.

`CREATE INDEX CONCURRENTLY` can leave an invalid index if it fails; check `pg_index.indisvalid`, drop and retry.

</details>

## 7. Why do you need connection pooling, and how do you size the pool?

<details>
<summary>Answer</summary>

Every Postgres connection is a separate server process with its own memory, and opening one costs a TCP handshake, TLS, and authentication. If each HTTP request opens its own connection, a traffic spike of 2,000 concurrent requests tries to open 2,000 processes, exceeds `max_connections` (default 100), and every request beyond that fails. A pool keeps a fixed set of open connections and lends them to requests, so the database sees a steady, bounded load.

Two places a pool can live:

- In the application: `pg.Pool` in Node, one pool per process. Fine for a single service with a few instances.
- In front of the database: PgBouncer or the connection pooler your cloud provider offers. Needed when you run many app instances, serverless functions, or several services, because each one has its own application pool and the total still overwhelms Postgres. Transaction-mode pooling lets hundreds of app connections share tens of real ones, at the cost of features that need a stable session (session-level `SET`, advisory locks, `LISTEN`, prepared statements in some setups).

```js
import pg from 'pg';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                       // per Node process
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000 // fail fast instead of queueing forever
});

// One-off query: pool checks a client out and back in for you
const { rows } = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);

// Transaction: must hold one client for all statements
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE users SET cash_balance = cash_balance - $1 WHERE id = $2', [amt, uid]);
  await client.query('INSERT INTO orders (user_id, company_id, amount) VALUES ($1, $2, $3)', [uid, cid, amt]);
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();              // forgetting this leaks the connection
}
```

Pool sizing: smaller than most people expect. Postgres does work per connection with real CPU cores; more connections than cores means context switching, not throughput. The HikariCP rule of thumb is `connections = (cores * 2) + number_of_disks`, so a 4-core database server is happiest at roughly 10 active connections. Start there, measure wait time for a connection and query latency, and adjust.

Then budget: `sum over all app instances of pool.max` must stay under `max_connections` with headroom for migrations, admin and replication. Ten instances with `max: 10` is already 100. That arithmetic is what pushes teams to PgBouncer.

Failure signs: `connectionTimeoutMillis` errors mean the pool is exhausted, usually a leaked client or a transaction held open across slow I/O. `too many connections for role` means the sum above overflowed. Long queue wait with idle CPU on the database means the pool is too small; high CPU with many active connections means it is too big.

Never hold a pooled client while awaiting something outside the database (an HTTP call, a model response). Query, release, do the slow thing, then take a client again.

In an AI product: serverless API routes plus long-running model calls are the worst case for pooling, because each cold function opens its own pool and holds connections for the whole request; put a transaction-mode pooler in front of Postgres and keep the database work at the start and end of the handler.

</details>

## 8. When is Postgres the wrong choice, and where does JSONB fit?

<details>
<summary>Answer</summary>

Postgres is the right default for almost any application with relationships, constraints and transactions. It becomes the wrong choice when the workload is a very high write rate of simple key-value or time-series data, when data must be spread across many machines with no joins, or when you genuinely need a specialised engine (search, graph, cache). JSONB gives you schemaless columns inside a relational table, which covers most "we need NoSQL for flexibility" arguments.

Relational (SQL) strengths: enforced schema, foreign keys, joins, ACID transactions across tables, mature tooling, one system to operate. Weaknesses: vertical scaling first, schema changes need migrations, horizontal sharding is manual.

When to reach for something else:

| Need | Why Postgres struggles | Typical choice |
|---|---|---|
| Cache, session store, rate limits | sub-millisecond reads, TTL per key, hot in memory | Redis |
| Millions of writes per second, append-only, queried by time | write amplification, index maintenance | Cassandra, ClickHouse, a time-series database |
| Documents with wildly varying shape, sharded across regions, no cross-document transactions needed | manual sharding, joins not needed anyway | MongoDB, DynamoDB |
| Full-text search with typo tolerance, facets, relevance tuning | basic ranking, no fuzzy matching without extensions | Elasticsearch, Meilisearch (see entry 11) |

The honest interview answer: most products never hit those limits, and "we might need to scale" is not a reason to give up joins and transactions on day one.

JSONB as the middle ground: a binary JSON column type with operators and indexes. Use it for data that is genuinely variable per row and mostly read as a blob.

```sql
ALTER TABLE users ADD COLUMN preferences jsonb NOT NULL DEFAULT '{}';

UPDATE users SET preferences = preferences || '{"theme": "dark"}' WHERE id = 7;

SELECT id FROM users WHERE preferences ->> 'theme' = 'dark';     -- extract as text
SELECT id FROM users WHERE preferences @> '{"alerts": {"price": true}}';  -- containment

CREATE INDEX users_preferences_idx ON users USING GIN (preferences);  -- serves @> and ?
```

Good JSONB uses: user preferences, third-party API payloads stored as received, form responses, per-tenant settings, event metadata. Bad uses: anything you filter, join or aggregate on regularly (`company_id` inside JSON instead of a foreign key), anything with a stable shape (just add columns), and anything that needs a constraint the database should enforce.

Trade-offs: no foreign keys into JSON, no type checking of the contents unless you add a `CHECK`, updates rewrite the whole value, and GIN indexes are large and slow to update.

In an AI product: store each chat message as a row with typed columns (`conversation_id`, `role`, `created_at`) and a `content jsonb` column for the provider-specific payload (tool calls, citations, token usage), so the relational part stays queryable while the shape can change with every model release.

</details>

## 9. Explain ACID in plain words, and what does each letter protect against?

<details>
<summary>Answer</summary>

ACID is the set of guarantees a transactional database gives so that you can reason about a group of writes as one event. Atomicity: all or nothing. Consistency: every rule holds after each transaction. Isolation: concurrent transactions do not see each other's half-finished work. Durability: once committed, it survives a crash.

Atomicity

- Guarantee: the statements in a transaction either all take effect or none do.
- Protects you from: a transfer that debits the buyer and crashes before crediting the seller. Without atomicity, money disappears.
- How Postgres does it: `BEGIN ... COMMIT` marks the transaction, and MVCC row versions are only visible once the transaction ID is marked committed. `ROLLBACK`, or a crash, leaves the old versions in place.

Consistency

- Guarantee: a transaction moves the database from one valid state to another valid state, where "valid" is defined by your constraints: primary keys, foreign keys, `UNIQUE`, `CHECK`, `NOT NULL`, triggers.
- Protects you from: a `prices` row for a company that does not exist, two users with the same email, a negative `cash_balance` if you added `CHECK (cash_balance >= 0)`.
- Note: the database can only enforce the rules you declare. Consistency in ACID is not the same as consistency in the CAP theorem (that one is about replicas agreeing).

Isolation

- Guarantee: concurrent transactions behave as if they ran alone, to the degree the isolation level promises (entry 5).
- Protects you from: reading a balance mid-transfer, two requests both seeing "seat available" and both booking it, a report summing rows while half of them are being updated.
- How: MVCC snapshots for reads, row locks for writes, and serialization checks at the strict levels.

Durability

- Guarantee: after `COMMIT` returns, the change is on disk and survives power loss.
- Protects you from: a confirmed order vanishing when the server restarts.
- How: the write-ahead log (WAL). Every change is appended to the WAL and flushed (`fsync`) before the commit is acknowledged; the data files are updated later. On restart Postgres replays the WAL. `synchronous_commit = off` trades a small window of possible loss for faster commits, which is acceptable for analytics ingestion but not for orders.

A sentence for each that interviewers like:

```text
Atomicity  - no half-done work
Consistency - no rule broken
Isolation  - no peeking at others' half-done work
Durability - no forgetting what was confirmed
```

Where ACID stops: it covers one database. A workflow that writes to Postgres and then calls a payment API is not atomic; you need idempotency keys, the outbox pattern, or compensating actions to get similar safety across systems.

In an AI product: writing the user message, the assistant reply and the token-usage row for billing in one transaction is atomicity doing real work; a crash between them would otherwise leave a reply you cannot charge for or a charge with no reply.

</details>

## 10. What are read replicas and sharding, and when do you need each?

<details>
<summary>Answer</summary>

A read replica is a copy of the database that receives every change from the primary and serves read-only queries, so you scale reads by adding copies. Sharding splits the data itself across several databases by a key, so you scale writes and storage, at the cost of losing single-database joins and transactions. Reach for replicas when reads dominate and a small lag is acceptable; reach for sharding only when a single primary cannot hold the writes or the data, and after partitioning and caching have been tried.

Replication in Postgres:

- Streaming replication ships WAL records (entry 9) from the primary to replicas, which replay them. Physical replication copies the whole cluster byte for byte; logical replication publishes selected tables as row changes and can feed a different version or a different system.
- It is asynchronous by default. The primary commits and returns before the replica has applied the change.

Replication lag is the delay between commit on the primary and visibility on the replica, usually milliseconds, sometimes seconds under heavy write load or long-running replica queries. The bug it causes is read-your-own-writes: the user saves a watchlist item, the next request reads from the replica, and the item is missing.

Ways to handle lag:

- Route reads that follow a write to the primary, for that request or for a short window per user (sticky reads); send dashboards, lists and reports to replicas.
- `synchronous_commit = remote_apply` with a synchronous replica removes the lag but makes every commit wait on the network; usually too expensive for the whole system.

Replicas also give you a failover target and a place for heavy analytics. Before sharding, partition. Declarative partitioning splits one logical table into child tables on a single server:

```sql
CREATE TABLE prices (
  company_id bigint NOT NULL,
  trade_date date NOT NULL,
  close numeric(18, 6) NOT NULL,
  PRIMARY KEY (company_id, trade_date)     -- must include the partition key
) PARTITION BY RANGE (trade_date);

CREATE TABLE prices_2024 PARTITION OF prices
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

Queries with a `trade_date` filter touch only the relevant partition; dropping a year is `DROP TABLE prices_2019`.

Sharding vocabulary:

- Shard key: the column that decides which database a row lives in (`user_id` for per-user data, `company_id` for prices). Every query must include it or hit every shard.
- Hash vs range sharding: hash spreads load evenly; range keeps neighbours together and can hot-spot.
- Resharding: moving data when you add shards, the painful part.
- Cross-shard joins and transactions: avoid them by design or do them in the application.
- Tools: Citus extension for Postgres, or application-level routing.

When each is right: replicas for a read-heavy product with acceptable lag, which is nearly every consumer app. Sharding when write throughput or data size exceeds one large primary, or for tenant isolation. Teams that shard early usually regret it.

In an AI product: retrieval (vector search over embeddings) is read-heavy and tolerates lag well, so it runs against replicas; conversation writes and idempotency checks stay on the primary.

</details>

## 11. How does Postgres full-text search work, and when do you need a search engine?

<details>
<summary>Answer</summary>

Postgres full-text search converts text into a `tsvector` (a sorted list of normalised word stems with positions), converts the user's query into a `tsquery`, and matches them with `@@`. A GIN index on the `tsvector` makes it fast. It is good enough for searching company names, notes and documents inside an app; you need a dedicated engine when relevance quality, typo tolerance, facets or search-specific features become the product.

Vocabulary in one line each: stemming reduces "prices" and "pricing" to "price"; stop words ("the", "and") are dropped; a text search configuration such as `'english'` bundles those rules; GIN (generalised inverted index) maps each term to the rows containing it.

```sql
ALTER TABLE companies
  ADD COLUMN search tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(ticker, ''))
  ) STORED;

CREATE INDEX companies_search_idx ON companies USING GIN (search);

SELECT ticker, name, ts_rank(search, q) AS rank
FROM companies, websearch_to_tsquery('english', 'apple inc') AS q
WHERE search @@ q
ORDER BY rank DESC
LIMIT 10;
```

Notes on the example: the generated column keeps the vector in sync without a trigger. `websearch_to_tsquery` accepts user-typed syntax (`"exact phrase"`, `-excluded`, `or`) safely; `to_tsquery` is stricter and throws on bad input. `setweight` lets you rank a match in `name` above a match in a description.

Prefix and fuzzy matching: `to_tsquery('app:*')` matches stems starting with "app". For typos, the `pg_trgm` extension indexes three-letter fragments and supports `similarity()` and `ILIKE '%appl%'` with a GIN or GiST index. Together they cover "good enough" search for most internal and B2B products.

Where Postgres FTS falls short:

| Need | Postgres | Dedicated engine (Elasticsearch, OpenSearch, Meilisearch, Typesense) |
|---|---|---|
| Ranking | `ts_rank`, `ts_rank_cd`, basic | BM25 and tunable scoring |
| Typo tolerance | only via `pg_trgm` | built in |
| Facets and aggregations on results | manual `GROUP BY`, slow on large result sets | first-class |
| Synonyms, per-language analysers | dictionaries, some setup | rich, configurable |
| Operations | none extra, same transactions | another cluster, indexing pipeline, eventual consistency |

The trade-off an interviewer probes: a search engine is a second copy of the data. You must index writes into it (via an outbox or change stream), handle it being behind, and handle it being down. Start with Postgres FTS, measure result quality with real queries, and move when users complain about relevance rather than when engineers get curious.

In an AI product: hybrid search combines a `tsvector` match (exact terms, tickers, product codes that embeddings miss) with a pgvector similarity query, merging the two ranked lists with reciprocal rank fusion in SQL or application code; Postgres holding both is the reason to prefer pgvector over a separate vector store at this stage.

</details>

## 12. How does NULL break SQL logic, and which traps should you know?

<details>
<summary>Answer</summary>

`NULL` means "unknown", not zero and not empty string. Any comparison with `NULL` yields `UNKNOWN`, not `TRUE` or `FALSE`, and `WHERE` keeps only rows whose condition is `TRUE`. That third truth value is what makes `NOT IN` with a `NULL`, `COUNT(col)`, and `!=` filters silently drop rows.

Three-valued logic:

```text
NULL = NULL      -> NULL (unknown), never TRUE
NULL <> 1        -> NULL
NULL AND FALSE   -> FALSE   (one side decides it)
NULL OR TRUE     -> TRUE
NULL AND TRUE    -> NULL
NOT NULL         -> NULL
```

Test for `NULL` with `IS NULL` / `IS NOT NULL`. To compare two nullable columns treating `NULL` as equal, use `IS DISTINCT FROM` / `IS NOT DISTINCT FROM`.

Trap 1: `NOT IN` with a `NULL` in the list. `users.referred_by` is nullable.

```sql
-- Intended: users nobody referred. Returns zero rows if any referred_by is NULL.
SELECT * FROM users
WHERE id NOT IN (SELECT referred_by FROM users);
```

`id NOT IN (1, 2, NULL)` expands to `id <> 1 AND id <> 2 AND id <> NULL`. The last part is `NULL`, so the whole condition is never `TRUE`. Fixes:

```sql
SELECT u.* FROM users u
WHERE NOT EXISTS (SELECT 1 FROM users r WHERE r.referred_by = u.id);
-- or: NOT IN (SELECT referred_by FROM users WHERE referred_by IS NOT NULL)
```

`NOT EXISTS` is also usually the better plan (an anti-join).

Trap 2: `COUNT(col)` vs `COUNT(*)`. `COUNT(*)` counts rows. `COUNT(volume)` counts rows where `volume IS NOT NULL`. All aggregates except `COUNT(*)` skip `NULL`s, so `AVG(volume)` averages only the known values, and `SUM` over zero rows returns `NULL`, not 0. Wrap with `COALESCE(SUM(volume), 0)`.

Trap 3: `WHERE sector <> 'Tech'` excludes rows where `sector IS NULL`, because `NULL <> 'Tech'` is unknown. If those should appear, write `WHERE sector IS DISTINCT FROM 'Tech'`.

Trap 4: `UNIQUE` allows many `NULL`s, because no two `NULL`s are equal. A unique index on `(user_id, deleted_at)` for soft deletes does not stop duplicates while `deleted_at IS NULL`. Use a partial unique index `WHERE deleted_at IS NULL`, or `UNIQUE NULLS NOT DISTINCT` in recent Postgres versions.

Trap 5: sorting. `NULL`s sort as larger than every value, so `ORDER BY volume DESC` puts them first. Add `NULLS LAST` when that is not what the UI wants.

Trap 6: string concatenation. `first_name || ' ' || last_name` is `NULL` if either part is `NULL`; use `concat_ws(' ', first_name, last_name)`, which skips nulls.

Design defence: make columns `NOT NULL` with a sensible default whenever the value is always known. Nullable columns are for genuinely optional facts (`referred_by`, `sector`), and every one of them is a place where these traps can appear.

</details>
