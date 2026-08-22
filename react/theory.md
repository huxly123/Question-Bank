# React Theory

## 1. Stateless components

<details>
<summary>Answer</summary>

Stateless components do not manage any state internally. They rely entirely on the props passed to them for rendering data or behavior.

</details>

## 2. Stateful components

<details>
<summary>Answer</summary>

Stateful components manage their own state, using hooks like `useState` or `useReducer` (or class-based state in older React).

</details>

## 3. Reconciliation

<details>
<summary>Answer</summary>

Reconciliation is React's way of updating the user interface efficiently. By comparing the old and new virtual DOM, React minimizes changes to the real DOM, resulting in faster performance and a smoother user experience.

</details>

## 4. Virtual DOM

<details>
<summary>Answer</summary>

The Virtual DOM is a lightweight, in-memory representation (copy) of the browser's actual DOM. It is a JavaScript object tree representing the real DOM. React uses it to make UI updates faster and more efficient: the initial render creates the real DOM, and afterwards each state change updates the virtual DOM first, which is then used to update the real DOM with minimal changes.

</details>

## 5. Controlled components

<details>
<summary>Answer</summary>

A controlled component is a form element (like `<input>`, `<textarea>`, `<select>`) whose value is controlled by React state.

```jsx
function ControlledComponent() {
  const [name, setName] = useState("");

  const handleChange = (e) => {
    setName(e.target.value); // update state with the input's value
  };

  return (
    <div>
      <label>Name: </label>
      <input
        type="text"
        value={name}            // controlled by state
        onChange={handleChange} // updates state on change
      />
      <p>Your name: {name}</p>
    </div>
  );
}
```

</details>

## 6. Uncontrolled components

<details>
<summary>Answer</summary>

An uncontrolled component is a form element that manages its own state internally. React does not control the input's value; the DOM itself does. The value is read when needed via a ref.

```jsx
function UncontrolledComponent() {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Input Value: " + inputRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name: </label>
      <input
        type="text"
        ref={inputRef} // ref to access the input's value
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

</details>

## 7. useCallback

<details>
<summary>Answer</summary>

`useCallback` memoizes a function so it keeps the same reference across renders until its dependencies change. Passing a new function reference as a prop (or in a `useEffect` dependency array) on every render can cause unnecessary re-renders, so we memoize the function until its dependencies change.

</details>

## 8. useMemo

<details>
<summary>Answer</summary>

`useMemo` memoizes the result of a computation and only recomputes it when its dependencies change, so the computation is not repeated on every re-render.

</details>

## 9. What is a Higher-Order Component (HOC)?

<details>
<summary>Answer</summary>

A Higher-Order Component is a function that takes a React component as input and returns a new component. It lets you reuse component logic across multiple components by wrapping them in the HOC.

</details>

## 10. Pure vs impure components

<details>
<summary>Answer</summary>

**Pure function components** only re-render when their props or state change. They are optimized with `React.memo`.

```jsx
import React, { memo } from 'react';

const PureComponent = memo(({ name }) => {
  console.log('PureComponent Rendered');
  return <h1>Hello, {name}</h1>;
});

export default function App() {
  return <PureComponent name="Alice" />;
}
```

**Impure function components** (not wrapped in `React.memo`) re-render whenever their parent re-renders, regardless of whether their props or state changed.

</details>

## 11. Virtual DOM vs Real DOM

<details>
<summary>Answer</summary>

The **Real DOM** is the actual UI representation the browser uses. It is slow and inefficient for frequent updates.

The **Virtual DOM** is a lightweight in-memory copy of the Real DOM that React uses to optimize performance by reducing the number of Real DOM updates. It is typically represented as a tree of nested JavaScript objects called "vnodes" (virtual nodes).

</details>

## 12. Why is React faster than vanilla JS (for UI updates)?

<details>
<summary>Answer</summary>

- **Virtual DOM:** a lightweight in-memory copy of the DOM enables more efficient updates.
- **Batching updates:** React groups multiple updates together to reduce reflows/repaints.
- **Reconciliation:** React calculates the minimal set of DOM changes needed.
- **Declarative UI:** declarative syntax makes UI updates more predictable and efficient.
- **Re-render optimization:** only components that need updating are re-rendered.
- **Efficient list handling:** keys let React reconcile list updates efficiently.

</details>

## 13. How do you structure a recursively rendered component?

<details>
<summary>Answer</summary>

Recursive components are useful for rendering hierarchical or nested data (menus, trees, comments) in a clean, maintainable way. The component renders itself for each nested level and stops at a base case (no more children).

```jsx
import React from 'react';

const Menu = ({ items }) => {
  if (!items || items.length === 0) return null; // base case

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          <a href={item.link}>{item.name}</a>

          {/* If the item has a submenu, render it recursively */}
          {item.submenu && item.submenu.length > 0 && (
            <Menu items={item.submenu} />
          )}
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const menuItems = [
    { name: 'Home', link: '/home' },
    {
      name: 'About',
      link: '/about',
      submenu: [
        { name: 'Team', link: '/about/team' },
        { name: 'Company', link: '/about/company' },
      ],
    },
    { name: 'Contact', link: '/contact' },
  ];

  return (
    <div>
      <h1>Recursive Menu</h1>
      <Menu items={menuItems} />
    </div>
  );
};

export default App;
```

</details>
