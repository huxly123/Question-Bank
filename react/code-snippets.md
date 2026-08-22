# React Code Snippets

## 1. Debounce hook

Returns the value only after it has stopped changing for `delay` milliseconds.

```jsx
export default function useDebounce(value, delay) {
  const [debounceVal, setDebounceVal] = useState();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceVal(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounceVal;
}
```

## 2. Throttle hook

Updates the returned value at most once per `delay` milliseconds.

```jsx
function useThrottle(value, delay) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastCall = useRef(0);

  useEffect(() => {
    const now = Date.now();

    if (now - lastCall.current >= delay) {
      setThrottledValue(value);
      lastCall.current = now;
    }
  }, [value, delay]);

  return throttledValue;
}
```

## 3. Infinite scroll with IntersectionObserver

Load the next page when a sentinel element at the bottom of the list becomes visible.

```jsx
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    },
    { threshold: 1 }
  );

  if (observerRef.current) {
    observer.observe(observerRef.current);
  }

  return () => observer.disconnect();
}, []);
```

```jsx
<div>
  <h2>Infinite Scroll</h2>
  <ul>
    {data.map((item) => (
      <li key={item.id}>{item.title}</li>
    ))}
  </ul>

  {/* Observer target */}
  <div ref={observerRef} style={{ height: "20px", background: "transparent" }}></div>

  {loading && <p>Loading more...</p>}
</div>
```
