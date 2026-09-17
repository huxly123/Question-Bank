# Auth & Security

This note covers the server side of authentication and security (sessions and tokens, password storage, OAuth, authorization, the OWASP list as it hits an API, headers and secrets, TLS, and encryption of data); revise by reading each question, answering aloud before opening the answer, then expanding on any point you skipped. Browser-side basics (XSS, CSP, CORS from the client's view, cookie flags, CSRF) live in [../system-design/security.md](../system-design/security.md) and are linked rather than repeated.

## 1. What is the difference between authentication and authorization?

<details>
<summary>Answer</summary>

Authentication answers "who are you?" and authorization answers "what are you allowed to do?". Login is authentication; checking that the logged-in user may delete this particular watchlist is authorization. Every secure endpoint does the first once and the second on every request.

The flow in a typical API:

```text
1. Authenticate: the user proves identity (password, OAuth login, magic link)
2. The server issues a credential: a session ID in a cookie, or a signed token (JWT)
3. On each request the client sends that credential
4. The server verifies it and learns the user's id and roles      <- authentication
5. The handler checks: may this user do this action on this resource?  <- authorization
6. Yes: proceed. No: 403 Forbidden (401 Unauthorized means "not authenticated at all")
```

Vocabulary: **credential** (what proves identity), **session** (server-side record of a logged-in user), **token** (a self-contained credential the server can verify without a lookup), **role** (a named bundle of permissions such as `admin`), **principal** (the authenticated identity making the request).

Why keep them separate: authentication is solved once, in one middleware, and is usually delegated to a library or provider. Authorization is business logic that changes per feature, so it lives next to the handlers and must be tested like any other rule. The most common real-world bug is doing the first and forgetting the second: an authenticated user reading another user's data by changing an id in the URL.

Where the browser-side details live: cookies, CSRF, CORS and where to store a JWT are covered in [../system-design/security.md](../system-design/security.md). This note covers what the server does.

In an AI product: a tool the model can call (send an email, run a query) must be authorised against the *user's* permissions, not the model's; the model is never a principal.

</details>

## 2. Sessions or JWTs: how do you issue, refresh and store tokens?

<details>
<summary>Answer</summary>

A session keeps state on the server and hands the client an opaque ID; a JWT puts the state inside a signed token so any server can verify it without a lookup. Most APIs pair a short-lived JWT access token with a long-lived, server-tracked refresh token, and rotate the refresh token on every use. In the browser both go in `HttpOnly` cookies; on mobile they go in the platform's secure storage.

Sessions vs JWT:

| | Session | JWT |
|---|---|---|
| What the client holds | random ID, meaningless alone | signed claims (`sub`, `exp`, roles) |
| Server state | store per session (Redis, DB) | none needed to verify |
| Revocation | delete the row, instant | wait for `exp`, or keep a denylist (which is server state again) |
| Scale | store must be shared across instances | any instance verifies with the key |
| Payload | anything, lives server-side | keep small, it rides on every request |

JWT is signed, not encrypted: anyone can base64-decode the claims. Never put secrets in it. Verify the algorithm you expect (reject `alg: none`), use a strong secret for HS256 or an asymmetric key pair (RS256/ES256) when other services must verify without holding the signing key.

Access and refresh tokens: the access token is short-lived (5 to 15 minutes) so a stolen one is worth little and no revocation check is needed per request. The refresh token is long-lived (days to weeks), used only against `/auth/refresh`, and stored server-side as a hash so a database leak does not hand out sessions. Compare the basics in [../system-design/security.md#12-refresh-token--access-token](../system-design/security.md#12-refresh-token--access-token).

Refresh rotation:

```text
client  -> POST /auth/refresh  (cookie: rt_1)
server  -> lookup hash(rt_1): valid, belongs to family F
        -> mark rt_1 used, issue rt_2 in family F, new access token
client  -> ... later POST /auth/refresh (cookie: rt_2)   ok, issue rt_3

attacker -> POST /auth/refresh (stolen rt_1, already used)
server   -> reuse detected: revoke whole family F, force re-login
```

Rotation means each refresh token is single-use. Reuse detection is the point: if an old token shows up, either the user or an attacker has a copy, and you kill both.

Where the client stores them:

- Browser: refresh token in an `HttpOnly; Secure; SameSite=Lax` cookie scoped with `Path=/auth/refresh`, so it is not sent on ordinary API calls. Access token either in a second `HttpOnly` cookie or in JS memory only. Never `localStorage` (XSS reads it); see [../system-design/security.md#11-why-jwt-tokens-are-stored-in-cookies-instead-of-localstorage](../system-design/security.md#11-why-jwt-tokens-are-stored-in-cookies-instead-of-localstorage).
- Mobile: iOS Keychain or Android Keystore, never plain preferences.
- Server-to-server: no refresh flow, use client credentials or signed service tokens.

When to pick sessions: a single web app with a shared Redis, where instant logout and "sign out all devices" matter. When to pick JWT: many services or a third-party API where the verifier must not call back to an auth store on every request. The probe is always "how do you revoke a JWT?", and the honest answer is short expiry plus a refresh token you can revoke.

In an AI product: long-lived API keys for programmatic access are stored hashed like refresh tokens, shown once at creation, and scoped to the tools or models the key may call.

</details>

## 3. How do you store passwords, and why never encrypt them?

<details>
<summary>Answer</summary>

Store a slow, salted, one-way hash of the password using bcrypt or argon2id, never the password and never a reversible encryption of it. On login, hash the submitted password with the stored salt and compare with a constant-time comparison.

Why a slow hash: fast hashes like SHA-256 let an attacker with a leaked table test billions of guesses per second on a GPU. bcrypt and argon2 are deliberately expensive. bcrypt takes a cost factor (each step doubles the work; pick the highest value that keeps login under about 100 ms on your hardware). argon2id adds a memory cost, which defeats GPU and ASIC cracking, and is OWASP's current first recommendation; bcrypt remains fine and is everywhere in Node.

Why a salt: a salt is a random per-user value mixed into the hash. Without it, two users with `password123` share a hash, and a precomputed rainbow table cracks all of them at once. bcrypt generates the salt and embeds it in the output string, so you store one column and there is no separate salt column to manage.

Why never encrypt: encryption is reversible by design. Whoever gets the key (a leaked env var, a compromised server, a rogue admin) gets every password in plain text, and users reuse passwords across sites. Hashing means even you cannot recover the password, which is exactly what you want. If a product manager asks for "show my password" or "email me my password", that is the signal the design is wrong.

```js
import bcrypt from 'bcrypt';
const COST = 12;

export async function register(email, password) {
  const hash = await bcrypt.hash(password, COST);   // salt generated inside
  await db.insert('users', { email, password_hash: hash });
}

export async function login(email, password) {
  const user = await db.findByEmail(email);
  const dummy = '$2b$12$invalidhashinvalidhashinvalidhashinvalidhashinvalidhas';
  const ok = await bcrypt.compare(password, user?.password_hash ?? dummy);
  if (!user || !ok) throw new AuthError('Invalid credentials');   // same message either way
  if (bcrypt.getRounds(user.password_hash) < COST) await rehash(user, password);
  return user;
}
```

Details that get probed:

- Same error and similar timing for "no such user" and "wrong password", or an attacker enumerates accounts. Hashing against a dummy keeps timing even.
- Rehash on successful login when you raise the cost factor; you cannot rehash offline because you do not have the password.
- bcrypt only uses the first 72 bytes of input; reject or pre-hash very long passwords rather than silently truncating.
- A pepper is an extra server-side secret mixed in (usually HMAC before bcrypt); it helps if the database leaks but the app secret does not. Optional.
- Rate limit and lock out login attempts per account and per IP; hashing strength does not stop online guessing.
- Check new passwords against known-breached lists (Have I Been Pwned's k-anonymity range API) instead of complexity rules.
- Password reset tokens are random, single-use, short-lived, and stored hashed for the same reasons.

Do not use MD5, SHA-1, or plain SHA-256, do not write your own scheme, and do not put the pepper in the same database as the hashes.

</details>

## 4. Walk me through the OAuth 2.0 authorization code flow on a whiteboard

<details>
<summary>Answer</summary>

The user is redirected to the provider to log in and consent, the provider redirects back with a short-lived one-time code, and your backend exchanges that code plus its own credentials for tokens. The access token never passes through the browser, and the provider knows it is talking to your registered app.

Roles (define these first, interviewers like it):

- Resource owner: the user.
- Client: your app (its backend is the "confidential client").
- Authorization server: the provider's login and consent service (Google, GitHub, your own).
- Resource server: the API that holds the user's data and accepts the access token.

The sequence:

```text
1. Browser  -> your app:        click "Sign in with Google"
2. Your app -> browser:         302 to provider /authorize?
                                 response_type=code&client_id=..&redirect_uri=..
                                 &scope=openid email&state=<random>
                                 &code_challenge=<sha256(verifier)>&code_challenge_method=S256
3. Browser  -> provider:        user logs in, sees consent screen, approves
4. Provider -> browser:         302 to redirect_uri?code=<one-time>&state=<same>
5. Browser  -> your backend:    hits the callback with code and state
6. Backend: check state matches what it stored in the user's session
7. Backend  -> provider /token: code, redirect_uri, client_id, client_secret,
                                 code_verifier   (server to server, over TLS)
8. Provider -> backend:         access_token, expires_in, refresh_token?, id_token (OIDC)
9. Backend: create your own session or JWT for the user; store provider tokens if you
            need to call the provider's API later
```

Why each piece exists:

- Why a code and not the token in the redirect: the redirect is visible in browser history, logs and referrers. A code is worthless without the client secret (or PKCE verifier), and expires in seconds.
- `state`: a random value tied to the browser session. It stops a CSRF where an attacker makes the victim's browser complete the attacker's login and bind the attacker's account to the victim's session.
- `redirect_uri` must exactly match a pre-registered URI, or an attacker registers their own and receives the code.
- PKCE (Proof Key for Code Exchange): the client sends a hash of a random verifier at step 2 and the verifier itself at step 7. It lets public clients (SPAs, mobile apps) that cannot keep a secret prove they started the flow. Current guidance (the OAuth 2.1 draft) is to use PKCE for every client, including confidential ones.
- OpenID Connect (OIDC) is the identity layer on top of OAuth: `scope=openid` adds an `id_token`, a JWT stating who the user is. OAuth alone is authorization ("may this app read my calendar"), not authentication.

What not to use: the implicit flow (token in the URL fragment) and the password grant are deprecated. Use client credentials for machine-to-machine with no user involved. Overview across sessions, JWT and OAuth is in [../system-design/security.md#14-session-based--jwt--oauth-authentication](../system-design/security.md#14-session-based--jwt--oauth-authentication).

Trade-off probed: OAuth offloads password handling and gives you MFA for free, but adds an external dependency and a redirect dance; a wrong `redirect_uri` allowlist or missing `state` check turns the convenience into an account-takeover bug.

In an AI product: an assistant that reads a user's Gmail or Slack gets a provider token via this flow, scoped to the minimum (`gmail.readonly`), stored encrypted, and refreshed server-side; the model never sees the token, only the tool's output.

</details>

## 5. How do you implement RBAC middleware and resource ownership checks?

<details>
<summary>Answer</summary>

Authenticate once in early middleware, attach the user and their roles to the request, then authorize per route: a role or permission gate as middleware, and an ownership check inside the handler or the database query itself. Missing either gate is the most common real-world API bug.

Terms: authentication says who you are (401 if missing or bad). Authorization says what you may do (403 if not allowed). RBAC is role-based access control: users hold roles, roles hold permissions. ABAC is attribute-based: rules over user, resource and context attributes ("editors may edit drafts in their own team"). Most apps start RBAC and add ownership rules, which is a small slice of ABAC.

```ts
// authenticate: verify token, load user, never trust roles from the client body
app.use(async (req, res, next) => {
  const token = req.cookies.at ?? req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'unauthenticated' });
  try { req.user = await verifyAccessToken(token); next(); }
  catch { return res.status(401).json({ error: 'invalid_token' }); }
});

// authorize by permission, not by role name
const can = (perm: string) => (req, res, next) =>
  req.user.permissions.includes(perm) ? next() : res.status(403).json({ error: 'forbidden' });

app.delete('/orders/:id', can('order:delete'), async (req, res) => {
  // ownership check lives in the query, so it is atomic with the action
  const { rowCount } = await db.query(
    'DELETE FROM orders WHERE id = $1 AND owner_id = $2', [req.params.id, req.user.id]);
  if (rowCount === 0) return res.status(404).end();   // hide existence
  res.status(204).end();
});
```

Ownership checks: the middleware above lets any user with `order:delete` hit the route, but they must only delete their own orders. Checking `owner_id` in the `WHERE` clause avoids a read-then-write race and avoids forgetting the check on one of five handlers. For admins, branch: `owner_id = $2 OR $3 = true`. The bug this prevents is called IDOR or BOLA (insecure direct object reference / broken object level authorization): changing `/orders/123` to `/orders/124` and getting someone else's order. It is number one on the OWASP API Security Top 10.

Design choices and trade-offs:

- Roles in the JWT vs looked up per request: in the token is fast but stale until the token expires (a demoted admin stays admin for 15 minutes). Lookup is fresh but adds a cache or DB hit. Short access tokens make the token approach acceptable for most apps; look up for high-risk actions.
- Check permissions, not roles: `can('order:refund')` survives adding a "support" role; `if (role === 'admin')` scattered through handlers does not.
- Deny by default: register the auth middleware globally and allowlist public routes.
- Return 404 not 403 for objects the user may not see, so the ID space cannot be probed; 403 when the resource is knowable but the action is not allowed.
- Repeat the check in list endpoints and nested routes (`/users/:userId/orders` must ignore `:userId` unless the caller is an admin).
- Beyond a few roles, move policy into one module or a library (Casbin, OPA, CASL) so rules are testable in isolation.

In an AI product: each tool the model can call carries the calling user's identity, and the tool enforces the same ownership checks as the REST route; the model asking for "all orders" must not bypass `owner_id`.

</details>

## 6. Which OWASP Top Ten risks matter most for an API, and how do you defend them?

<details>
<summary>Answer</summary>

For a JSON API the ones that bite are injection, broken authentication, sensitive data exposure (OWASP now calls it cryptographic failures), broken access control, and SSRF. The defence for each is the same shape: never build trust from client input, use the library that does it safely, and fail closed.

Injection: untrusted input is spliced into a command interpreter (SQL, NoSQL, shell, LDAP, template engines).

- SQL: always parameterised queries or a query builder that binds values (`WHERE id = $1`). Never string-concatenate, including for `ORDER BY` and table names; allowlist those.
- NoSQL: `db.users.find({ email: req.body.email })` is injectable when `email` is `{ "$ne": null }`. Validate types before the query (a schema library rejects an object where a string is expected).
- Command: avoid `child_process.exec` with user input; use `execFile` with an argument array.
- Server-side JS: no `eval`, `new Function`, or `vm` on user strings; see [../system-design/security.md#7-server-side-javascript-injection-ssji](../system-design/security.md#7-server-side-javascript-injection-ssji).

Broken authentication (identification and authentication failures):

- Credential stuffing works because there is no rate limit; add per-account and per-IP limits and lockouts.
- Weak or default JWT secrets, accepting `alg: none`, not checking `exp` and `aud`.
- Long-lived tokens with no rotation, session IDs in URLs, no invalidation on logout or password change.
- Password reset links that are guessable or reusable.
- Fix: entries 2 and 3 of this note, plus MFA for admin accounts.

Sensitive data exposure:

- Returning whole database rows (`SELECT *` straight to JSON) leaks `password_hash`, internal flags, other users' fields. Serialize through an explicit allowlist (a DTO).
- Stack traces and SQL text in error responses; return a generic message and a correlation ID.
- Tokens, passwords and PII in logs, URLs or query strings (which end up in proxy logs).
- Verbose 404 vs 403 telling attackers what exists.
- Weak or missing TLS, weak hashing. See entry 9 and [../system-design/security.md#10-avoid-exposing-sensitive-data](../system-design/security.md#10-avoid-exposing-sensitive-data).

Broken access control: the IDOR/BOLA problem in entry 5. OWASP ranks it number one for web apps; for APIs it is the most common finding in bug bounties.

SSRF (server-side request forgery): the server fetches a URL the user supplied (webhook URL, image import, link preview) and the attacker points it at internal services or the cloud metadata endpoint (`169.254.169.254`) to steal credentials.

- Allowlist schemes (`https` only) and, where possible, hostnames.
- Resolve DNS, then reject private, loopback and link-local ranges; re-check after redirects, or disable redirects.
- Make outbound calls through an egress proxy that enforces the rules, so one forgotten check does not matter.
- On AWS, require IMDSv2 so a plain GET cannot read instance credentials.
- Client-side view in [../system-design/security.md#6-server-side-request-forgery-ssrf](../system-design/security.md#6-server-side-request-forgery-ssrf).

Also on the list and worth one line each: security misconfiguration (debug mode on, default creds, open S3 bucket), vulnerable and outdated components (entry 7), insecure deserialization (do not `JSON.parse` then spread into a model without validation; never deserialize with libraries that instantiate classes from user data), insufficient logging and monitoring (failed logins and 403s should be visible and alertable).

Trade-off probed: input validation at the edge versus parameterisation at the sink. Do both. Validation rejects obviously wrong shapes early; parameterisation guarantees safety even when validation has a gap.

In an AI product: prompt injection is an input validation problem with no complete fix, so treat model output as untrusted input to every tool, validate tool arguments against a schema, and enforce authorization in the tool, not in the prompt.

</details>

## 7. How do you handle CORS, security headers, secrets and dependency audits server-side?

<details>
<summary>Answer</summary>

CORS is an allowlist the server publishes, so compute `Access-Control-Allow-Origin` from a fixed list and never echo an arbitrary `Origin` with credentials on. Security headers are a one-line middleware (`helmet`) plus HSTS at the edge. Secrets come from the environment or a secrets manager, never the repo. Dependencies are pinned by lockfile and audited automatically.

CORS from the server's side (browser mechanics are in [../system-design/security.md#4-cors](../system-design/security.md#4-cors)):

- Keep an explicit list of allowed origins per environment. Match the `Origin` header exactly (scheme, host, port), echo that one origin, and add `Vary: Origin` so caches do not serve one origin's response to another.
- `Access-Control-Allow-Origin: *` cannot be combined with `Access-Control-Allow-Credentials: true`. Reflecting whatever origin arrived is `*` with credentials in disguise: any site can call your API as the logged-in user.
- Answer preflights (`OPTIONS`) with `Allow-Methods`, `Allow-Headers` and `Access-Control-Max-Age` so the browser caches them.
- CORS protects browsers, not the API. curl ignores it; authorization is still enforced per request.

Security headers for an API (`helmet` sets sane defaults; tune these):

| Header | Why |
|---|---|
| `Strict-Transport-Security: max-age=31536000; includeSubDomains` | browsers refuse plain HTTP afterwards; stops SSL stripping |
| `X-Content-Type-Options: nosniff` | stop browsers guessing a JSON response is HTML or a script |
| `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'` | an API returns no page, so allow nothing; `frame-ancestors` replaces `X-Frame-Options` |
| `Referrer-Policy: no-referrer` | keep URLs with IDs out of third-party logs |
| `Cache-Control: no-store` on authenticated responses | shared caches must not keep personal data |
| remove `X-Powered-By` | do not advertise Express and its version |

CSP and clickjacking detail for pages live in [../system-design/security.md#3-content-security-policy-csp](../system-design/security.md#3-content-security-policy-csp) and [../system-design/security.md#2-iframe-protection-clickjacking](../system-design/security.md#2-iframe-protection-clickjacking).

Secrets:

- Read from `process.env`; in production inject from a secrets manager (AWS Secrets Manager, Vault) at start time. `.env` files are local only and in `.gitignore`.
- Validate the whole environment at startup with a schema and crash if a variable is missing, rather than failing on the first request that needs it.
- Never log the config object; redact anything named `*_KEY`, `*_SECRET`, `*_TOKEN`.
- Rotate on a schedule and on suspicion; support two valid keys during rotation.
- Scan commits for leaks (gitleaks, GitHub secret scanning). A secret that was ever committed is compromised even if history is rewritten.

Dependency auditing:

- Commit the lockfile and install with `npm ci` so CI runs exactly what was reviewed.
- `npm audit` in CI, with Dependabot or Renovate opening upgrade PRs. Triage rather than failing on every low-severity transitive advisory, or the team learns to ignore red.
- Supply chain: fewer, well-maintained dependencies; watch for typosquats; consider `--ignore-scripts`; keep the Node runtime on a supported line.

Trade-off probed: a strict CORS allowlist versus a frontend team wanting preview deploys on random subdomains. Allow a pattern only outside production.

In an AI product: the LLM provider API key is the most expensive secret you hold (usage is billed per call); keep it server-side only, never in the browser bundle, set spend limits at the provider, and rotate if it ever appears in a log.

</details>

## 8. How does TLS stop MITM, and how do you protect cookie sessions from hijacking and CSRF?

<details>
<summary>Answer</summary>

TLS gives encryption (the attacker cannot read), integrity (cannot modify) and server authentication through a certificate chain (cannot impersonate). Session hijacking is defended by cookie flags, short lifetimes and server-side invalidation; CSRF on a cookie API by `SameSite`, an anti-CSRF token or origin checks.

Handshake at whiteboard depth (HTTP vs HTTPS basics in [../system-design/security.md#16-http-vs-https](../system-design/security.md#16-http-vs-https)):

```text
Client -> Server: ClientHello  (TLS versions, cipher suites, SNI = hostname, key share)
Server -> Client: ServerHello  (chosen suite, key share), Certificate, signature over handshake
Client: verify cert chain to a trusted root CA, check hostname and expiry
Both:   derive the same symmetric session keys from the exchanged key shares (ECDHE)
Both:   all further HTTP is encrypted with a fast symmetric cipher (AES-GCM or ChaCha20)
```

Two ideas to name: asymmetric crypto (the certificate's public key) only authenticates and agrees on a key; a fast symmetric key does the bulk work. ECDHE gives forward secrecy: a fresh key per connection, so a server private key leaked later does not decrypt recorded traffic. TLS 1.3 does this in one round trip and dropped the weak suites.

Man in the middle: an attacker on the path (rogue Wi-Fi, ARP or DNS spoofing). With TLS they see the hostname (SNI) and traffic size but cannot read, alter or impersonate, because they have no CA-signed certificate for your domain. What still works is SSL stripping, keeping the victim on plain HTTP; HSTS with preload closes that. If the load balancer terminates TLS, encrypt or isolate the hop to the app and set `trust proxy` so `req.secure` is right.

Session hijacking: stealing the session ID or token so the attacker becomes the user.

- Vectors: XSS reading `document.cookie`, sniffing plain HTTP, session fixation (attacker plants a known session ID before login), IDs leaked in URLs or logs.
- Defences: `HttpOnly` and `Secure` cookies ([../system-design/security.md#9-httponly-secure-and-samesite-cookies](../system-design/security.md#9-httponly-secure-and-samesite-cookies)), regenerate the session ID on login, idle and absolute timeouts, server-side invalidation on logout and password change.

CSRF for cookie-based APIs (mechanism in [../system-design/security.md#5-csrf-cross-site-request-forgery](../system-design/security.md#5-csrf-cross-site-request-forgery)): cookies are attached automatically, so a third-party page can make the victim's browser POST to your API.

- `SameSite=Lax` (the modern default) blocks cross-site POSTs but still sends the cookie on top-level GET navigations, so never mutate on GET.
- If frontend and API are on different registrable domains you need `SameSite=None; Secure` and a real defence: a synchronizer token (random token in the session, echoed in a header) or double-submit (token in a cookie and in a header, compared server-side), plus an `Origin` check ([../system-design/security.md#15-checking-the-origin--referer-header](../system-design/security.md#15-checking-the-origin--referer-header)).
- Requiring a custom header forces a CORS preflight a cross-site page cannot pass. Simple and effective for JSON APIs.
- Bearer tokens in an `Authorization` header are immune to CSRF because nothing attaches them automatically; the trade is XSS exposure if stored in JS.

Trade-off probed: cookies (CSRF risk, XSS-safe with `HttpOnly`) versus header tokens (XSS risk, CSRF-safe). Common answer: cookies plus `SameSite` plus a CSRF token, and short-lived access tokens either way.

</details>

## 9. Hashing vs encryption, in transit vs at rest: where must PII be protected?

<details>
<summary>Answer</summary>

Hashing is one-way, for verifying or fingerprinting data you never need back; encryption is reversible with a key, for data you must read later. Encrypt in transit with TLS on every hop, and at rest at the storage layer plus field-level for the most sensitive columns. PII should be encrypted, tokenized or masked, and kept out of logs and analytics.

Hashing vs encryption vs HMAC:

| | Hash (SHA-256, bcrypt) | HMAC (keyed hash) | Encryption (AES-GCM, RSA) |
|---|---|---|---|
| Reversible | no | no | yes, with the key |
| Needs a key | no (salt only) | yes | yes |
| Use for | passwords (slow hash), integrity checks, dedupe, cache keys | webhook signatures, JWT HS256, blind indexes | anything you must read back: tokens, PII fields, backups |

Use authenticated encryption (AES-256-GCM) so tampering is detected. Symmetric vs asymmetric is covered in entry 8.

In transit: TLS from client to edge, and also between services, to the database (`sslmode=verify-full`) and to Redis, because "inside the VPC" is where lateral movement happens. mTLS (both sides present certificates) gives service-to-service identity.

At rest, three layers with different threat models:

1. Disk or volume encryption (cloud default): protects a stolen disk or snapshot, not anyone with database access.
2. Database-level encryption and encrypted backups: same, plus backups left in a bucket.
3. Application-level field encryption before insert: the only layer that survives a leaked dump or a curious DBA. Use envelope encryption: a data key encrypts the field, a KMS master key encrypts the data key, and the encrypted data key sits next to the row.

Where PII must be encrypted or masked:

- Card numbers: PCI DSS requires the PAN to be unreadable wherever stored; in practice tokenize with the payment provider and keep a token plus the last four digits.
- Government IDs, bank accounts, health data: field-level encryption, and a legal basis for holding them at all (GDPR, India's DPDP Act). Storing less is the strongest control.
- Emails and phone numbers must stay searchable, so store a blind index (HMAC of the normalised value) beside the ciphertext and query on that.
- Logs, error trackers, analytics, LLM prompts: redact before the data leaves the handler (`****1234`, hashed user IDs). Logging rules are in the Node note entry 12.
- Responses: mask (`+91 ******7890`) unless the endpoint exists to reveal the value; gate that with re-authentication.

Key management is the hard part: keys live in a KMS or HSM, never beside the ciphertext; rotate them and be able to re-encrypt old rows. Encryption with the key next to the data is theatre.

Trade-off probed: field encryption removes indexing, sorting and `LIKE` on that column and adds a KMS call per record. Encrypt the few columns that would be catastrophic to leak, not everything.

In an AI product: PII sent to an LLM provider leaves your trust boundary; redact or pseudonymise before the prompt, check the provider's data retention terms, and treat prompt and completion logs as PII stores.

</details>
