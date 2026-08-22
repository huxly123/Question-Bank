# General / Browser Theory

## 1. Cookies

<details>
<summary>Answer</summary>

Small pieces of data stored in the browser and sent to the server with every HTTP request.

- **Use case:** server communication (e.g., session management, authentication).
- Can be set with an expiration date, or as session-only.
- Included in every HTTP request by default (can be secured with the `HttpOnly` and `Secure` flags).
- **Storage limit:** around 4 KB per cookie.
- **Access:** `document.cookie`.

**Important attributes:**

- `Path=/` — determines the cookie's scope within the application. Setting it to `/` makes the cookie available to all routes (global scope).
- `HttpOnly` — the cookie cannot be accessed through JavaScript's `document.cookie`.
- `Secure` — the cookie is transmitted only over HTTPS connections.
- `SameSite=None` — allows the cookie to be sent with requests originating from other domains. If `SameSite` is `None`, the `Secure` flag must also be set (a browser-enforced rule).

</details>

## 2. Local Storage

<details>
<summary>Answer</summary>

A key-value storage mechanism in the browser with no expiration time. Data persists even after the browser is closed and reopened.

- **Storage limit:** typically 5–10 MB per origin.
- **Access:** `window.localStorage`.

</details>

## 3. Session Storage

<details>
<summary>Answer</summary>

Similar to Local Storage, but data lives only for the duration of the page session (until the tab is closed). Useful for temporary data needed only during a single browsing session.

- **Storage limit:** typically 5 MB per origin.
- **Access:** `window.sessionStorage`.

</details>

## 4. IndexedDB

<details>
<summary>Answer</summary>

A low-level, client-side database that lets web applications store large amounts of structured data in the browser.

**Key features:**
- **Large storage capacity:** no significant size limit (bounded only by browser and user storage policies).
- **Asynchronous API:** avoids blocking the main thread, improving performance.
- **Structured data:** supports complex types such as objects, arrays, and blobs.
- **Indexed queries:** enables efficient querying by indexing data.

**Use cases:**
- **Offline applications:** store data locally for apps that must work offline (note-taking apps, task managers, email clients).
- **Caching large resources:** cache assets like images, videos, or large datasets.

</details>

## 5. Cache Storage

<details>
<summary>Answer</summary>

Part of the Service Worker API — a storage mechanism for network requests and their responses. It is an asynchronous key-value store where:

- **Key:** a URL or `Request` object.
- **Value:** a `Response` object (body and headers).
- Operations are non-blocking for better performance.

**Use cases:**
- **Offline-first applications:** cache key resources (HTML, CSS, JS) so the app works without an internet connection.
- Caching images, fonts, and other static files to avoid repeated downloads.
- Serving cached resources selectively, with a network fallback when data is unavailable.

</details>

## 6. How to block the main thread in JS

<details>
<summary>Answer</summary>

A busy-wait loop keeps the main thread occupied, blocking rendering and interaction:

```js
console.log("Start blocking");

const start = Date.now();
while (Date.now() - start < 5000) {
  // Busy-wait for 5 seconds
}

console.log("End blocking");
```

</details>

## 7. Design patterns

<details>
<summary>Answer</summary>

### a) MVC (Model-View-Controller)

A software architectural pattern that separates concerns in an application, helping organize code and improve maintainability.

| Part | Responsibility |
| --- | --- |
| Model (M) | Manages the data and business logic |
| View (V) | Handles the UI (user interface) |
| Controller (C) | Processes user input and updates the Model and View |

### b) Atomic Design (Atom → Molecule → Organism)

| Level | Meaning | Example |
| --- | --- | --- |
| Atoms | Smallest UI elements | Button, Input, Label |
| Molecules | Combinations of atoms | Search bar (Input + Button) |
| Organisms | Groups of molecules forming a section | Navbar (Logo + Menu + Search) |
| Templates | Page layouts built from organisms | Homepage layout |
| Pages | Real pages with dynamic content | Homepage with user data |

### c) Module pattern

Encapsulates code and avoids polluting the global scope.

```js
const CounterModule = (() => {
  let count = 0;

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
})();

console.log(CounterModule.increment()); // 1
console.log(CounterModule.getCount());  // 1
```

### d) Singleton pattern (global state)

Ensures only one instance of an object exists.

```js
class ThemeManager {
  constructor() {
    if (!ThemeManager.instance) {
      this.theme = "light";
      ThemeManager.instance = this;
    }
    return ThemeManager.instance;
  }
}

const theme1 = new ThemeManager();
const theme2 = new ThemeManager();
console.log(theme1 === theme2); // true (same instance)
```

### e) Higher-Order Component (HOC) in React

A HOC is a function that takes a component and returns a new component.

```jsx
const withAuth = (Component) => {
  return (props) => {
    const isAuthenticated = true; // mock authentication
    return isAuthenticated ? <Component {...props} /> : <p>Login required</p>;
  };
};

const Dashboard = () => <h2>Dashboard</h2>;
const ProtectedDashboard = withAuth(Dashboard);
```

</details>
