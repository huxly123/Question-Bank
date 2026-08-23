# Design Patterns

## 1. MVC (Model-View-Controller)

<details>
<summary>Answer</summary>

A software architectural pattern that separates concerns in an application, helping organize code and improve maintainability.

| Part | Responsibility |
| --- | --- |
| Model (M) | Manages the data and business logic |
| View (V) | Handles the UI (user interface) |
| Controller (C) | Processes user input and updates the Model and View |

</details>

## 2. Atomic Design (Atom → Molecule → Organism)

<details>
<summary>Answer</summary>

| Level | Meaning | Example |
| --- | --- | --- |
| Atoms | Smallest UI elements | Button, Input, Label |
| Molecules | Combinations of atoms | Search bar (Input + Button) |
| Organisms | Groups of molecules forming a section | Navbar (Logo + Menu + Search) |
| Templates | Page layouts built from organisms | Homepage layout |
| Pages | Real pages with dynamic content | Homepage with user data |

</details>

## 3. Module pattern

<details>
<summary>Answer</summary>

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

</details>

## 4. Singleton pattern (global state)

<details>
<summary>Answer</summary>

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

</details>

## 5. Higher-Order Component (HOC) in React

<details>
<summary>Answer</summary>

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
