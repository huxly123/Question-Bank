# JavaScript & TypeScript — Topics To Study

**Progress: 73 / 100 done (73%)**

`██████████████████████░░░░░░░░` 73%

Theory lives in [theory.md](theory.md), output questions in [code-snippets.md](code-snippets.md).

⭐ = high priority, most likely to come up in frontend interview loops. Tick an item and turn it into a link to the note section you wrote, then run `node progress.js` from the repo root to refresh the bars.

## JavaScript

_33 / 54 · `██████░░░░` 61%_

- [x] [What are the different data types in JavaScript?](theory.md#1-what-are-the-different-data-types-in-javascript)
- [x] [Explain hoisting in JavaScript](theory.md#2-explain-hoisting-in-javascript)
- [x] [Difference between `==` and `===`](theory.md#3-difference-between--and-)
- [x] [Why do we use the `debugger` keyword?](theory.md#4-why-do-we-use-the-debugger-keyword)
- [x] [Difference between `var`, `let`, and `const`](theory.md#5-difference-between-var-let-and-const)
- [x] [`var` vs `let` vs `const` — examples](theory.md#6-var-vs-let-vs-const--examples)
- [x] [What is the temporal dead zone?](theory.md#7-what-is-the-temporal-dead-zone)
- [x] [Implicit vs explicit type coercion](theory.md#8-implicit-vs-explicit-type-coercion)
- [x] [Immutable vs mutable types](theory.md#9-immutable-vs-mutable-types)
- [x] [Pass by value vs pass by reference](theory.md#10-pass-by-value-vs-pass-by-reference)
- [x] [IIFE (Immediately Invoked Function Expression)](theory.md#11-iife-immediately-invoked-function-expression)
- [x] [What is the `NaN` property?](theory.md#12-what-is-the-nan-property)
- [x] [Explain higher-order functions](theory.md#13-explain-higher-order-functions)
- [x] [What is the `this` keyword?](theory.md#14-what-is-the-this-keyword)
- [x] [Explain `call()`, `apply()`, and `bind()`](theory.md#15-explain-call-apply-and-bind)
- [x] [What is currying?](theory.md#16-what-is-currying)
- [x] [What are closures?](theory.md#17-what-are-closures)
- [x] [Shallow copy vs deep copy](theory.md#18-shallow-copy-vs-deep-copy)
- [x] [Spread operator vs rest operator](theory.md#19-spread-operator-vs-rest-operator)
- [x] [`slice` vs `splice`](theory.md#20-slice-vs-splice)
- [x] [Event bubbling vs event capturing](theory.md#21-event-bubbling-vs-event-capturing)
- [x] [What is a polyfill?](theory.md#22-what-is-a-polyfill)
- [x] [Explain the `reduce` function](theory.md#23-explain-the-reduce-function)
- [x] [Write a polyfill for `reduce`](theory.md#24-write-a-polyfill-for-reduce)
- [x] [Define classes in JavaScript](theory.md#25-define-classes-in-javascript)
- [x] [Inheritance in JavaScript](theory.md#26-inheritance-in-javascript)
- [x] [`Object.create()` vs `Object.assign()`](theory.md#27-objectcreate-vs-objectassign)
- [x] [Explain the `new` keyword](theory.md#28-explain-the-new-keyword)
- [x] [Generator functions](theory.md#29-generator-functions)
- [x] [Promises](theory.md#30-promises)
- [x] [What is infinite currying?](theory.md#31-what-is-infinite-currying)
- [x] [Array methods that modify (or don't modify) the original array](theory.md#32-array-methods-that-modify-or-dont-modify-the-original-array)
- [x] [Pure vs impure functions](theory.md#33-pure-vs-impure-functions)
- [ ] ⭐ Execution context and call stack: how the engine runs code (creation vs execution phase, V8 and JIT in one line)
- [ ] ⭐ Scope chain and lexical environment; function declaration vs function expression
- [ ] ⭐ `undefined` vs `null` vs undeclared; `typeof null` and other `typeof` traps
- [ ] ⭐ Arrow functions vs normal functions: `this`, `arguments`, no `prototype`, not constructible
- [ ] ⭐ Prototype chain: `__proto__` vs `prototype`; implement `new` and `instanceof` by hand
- [ ] ⭐ Event loop: microtasks vs macrotasks, `setTimeout(0)` minimum delay, `queueMicrotask`
- [ ] ⭐ Callbacks → Promises → async/await: chaining, `catch`/`finally` placement, unhandled rejections, sequential vs parallel awaits
- [ ] ⭐ Event delegation; `preventDefault` vs `stopPropagation`; `target` vs `currentTarget`
- [ ] Map vs Object, Set vs Array; iterators and `for...of` vs `for...in`
- [ ] Garbage collection, memory leaks (listeners, timers, closures), WeakMap / WeakSet
- [ ] ⭐ Polyfills: `map`, `filter`, `forEach` (reduce is done)
- [ ] ⭐ Polyfills: `call`, `apply`, `bind`
- [ ] ⭐ Polyfills: `Promise.all`, `allSettled`, `race`, `any`
- [ ] ⭐ Debounce and throttle in plain JS, with leading / trailing options
- [ ] ⭐ Deep clone (JSON trick vs `structuredClone` vs recursive) and deep equal
- [ ] ⭐ LRU cache with `Map`
- [ ] Memoize (generic, custom cache key)
- [ ] EventEmitter (`on` / `off` / `emit` / `once`)
- [ ] Flatten a nested object to dotted keys
- [ ] `pipe` / `compose`
- [ ] Promise helpers: promisify, run in sequence, concurrency limit, retry with backoff
## TypeScript

_0 / 6 · `░░░░░░░░░░` 0%_

- [ ] ⭐ `type` vs `interface`
- [ ] ⭐ Generics (write a typed function / hook)
- [ ] ⭐ Utility types: `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`
- [ ] ⭐ Typing React props, children, events, and refs
- [ ] `any` vs `unknown` vs `never`
- [ ] Union and intersection types, narrowing and type guards; discriminated unions with an exhaustive `switch`
## Output questions

_40 / 40 · `██████████` 100%_

Predict-the-output snippets already written up in [code-snippets.md](code-snippets.md). Open items are snippet groups still to collect and write up.

- [x] [NaN equality](code-snippets.md#1-nan-equality)
- [x] [Chained comparisons](code-snippets.md#2-chained-comparisons)
- [x] [typeof functions and classes](code-snippets.md#3-typeof-functions-and-classes)
- [x] [`var` in a loop with setTimeout](code-snippets.md#4-var-in-a-loop-with-settimeout)
- [x] [`let` in a loop with setTimeout](code-snippets.md#5-let-in-a-loop-with-settimeout)
- [x] [Re-declaring with `var`](code-snippets.md#6-re-declaring-with-var)
- [x] [`var` then `let` with the same name](code-snippets.md#7-var-then-let-with-the-same-name)
- [x] [Re-declaring with `let`](code-snippets.md#8-re-declaring-with-let)
- [x] [Primitive vs Number object](code-snippets.md#9-primitive-vs-number-object)
- [x] [Functions can hold properties](code-snippets.md#10-functions-can-hold-properties)
- [x] [Post-increment vs pre-increment](code-snippets.md#11-post-increment-vs-pre-increment)
- [x] [Duplicate keys in an object](code-snippets.md#12-duplicate-keys-in-an-object)
- [x] [Double negation (!!)](code-snippets.md#13-double-negation-)
- [x] [Spreading a string](code-snippets.md#14-spreading-a-string)
- [x] [typeof with concatenation](code-snippets.md#15-typeof-with-concatenation)
- [x] [Comparing array literals](code-snippets.md#16-comparing-array-literals)
- [x] [Objects passed to functions are mutated](code-snippets.md#17-objects-passed-to-functions-are-mutated)
- [x] [`let` inside an IIFE](code-snippets.md#18-let-inside-an-iife)
- [x] [Implicit global from `let x = (y = 2)`](code-snippets.md#19-implicit-global-from-let-x--y--2)
- [x] [Block scope across two IIFEs](code-snippets.md#20-block-scope-across-two-iifes)
- [x] [Implicit global overwritten by second IIFE](code-snippets.md#21-implicit-global-overwritten-by-second-iife)
- [x] [`var` inside an IIFE](code-snippets.md#22-var-inside-an-iife)
- [x] [Unary plus coercion](code-snippets.md#23-unary-plus-coercion)
- [x] [Skipping elements in array destructuring](code-snippets.md#24-skipping-elements-in-array-destructuring)
- [x] [Destructuring an array with object syntax](code-snippets.md#25-destructuring-an-array-with-object-syntax)
- [x] [Reading a function property before and after assignment](code-snippets.md#26-reading-a-function-property-before-and-after-assignment)
- [x] [parseInt behavior](code-snippets.md#27-parseint-behavior)
- [x] [map with no return value](code-snippets.md#28-map-with-no-return-value)
- [x] [Function vs variable hoisting](code-snippets.md#29-function-vs-variable-hoisting)
- [x] [Array constructor](code-snippets.md#30-array-constructor)
- [x] [NaN comparisons and truthiness](code-snippets.md#31-nan-comparisons-and-truthiness)
- [x] [null vs undefined in arithmetic](code-snippets.md#32-null-vs-undefined-in-arithmetic)
- [x] [null vs undefined equality](code-snippets.md#33-null-vs-undefined-equality)
- [x] [Loose equality with objects and strings](code-snippets.md#34-loose-equality-with-objects-and-strings)
- [x] [delete on an array element](code-snippets.md#35-delete-on-an-array-element)
- [x] [Event loop ordering puzzles: `setTimeout` vs `Promise.then`, nested microtasks, `async` return timing, `await` in a loop](code-snippets.md#36-settimeout-vs-promisethen-ordering)
- [x] [`this` puzzles: arrow in object method, extracted method, `this` inside `setTimeout`, class method as callback, `bind` vs `call`](code-snippets.md#39-arrow-function-this-in-object-methods)
- [x] [Coercion classics: `[] == ![]`, `'b' + 'a' + +'a' + 'a'`, `0.1 + 0.2`, `null >= 0`, `[10, 1, 3].sort()`, `['1','2','3'].map(parseInt)`](code-snippets.md#42-coercion-classics)
- [x] [`Object.freeze` is shallow; spread vs `Object.assign` on nested objects](code-snippets.md#44-objectfreeze-is-shallow-spread-vs-objectassign)
- [x] [`??` vs `||` with `0` and `''`; `JSON.stringify` dropping `undefined` and functions](code-snippets.md#45--vs--and-what-jsonstringify-drops)
