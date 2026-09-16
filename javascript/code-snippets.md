# JavaScript Code Snippets (Output Questions)

Predict the output of each snippet, then expand **Output & why** to check yourself.

## 1. NaN equality

```js
console.log(NaN == NaN);
console.log(NaN === NaN);
```

<details>
<summary>Output & why</summary>

```text
false
false
```

`NaN` never equals anything, including itself. `NaN` results from converting a non-numeric string to a number:

```js
Number("hi");    // NaN
Number("hello"); // NaN
```

</details>

## 2. Chained comparisons

```js
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
```

<details>
<summary>Output & why</summary>

```text
true
false
```

- `1 < 2` → `true`; in JS, `true` coerces to `1`; so `1 < 3` → `true`.
- `3 > 2` → `true` → `1`; so `1 > 1` → `false`.

</details>

## 3. typeof functions and classes

```js
function dd() {}
console.log(typeof dd);

class MyClass {}
console.log(typeof MyClass);
```

<details>
<summary>Output & why</summary>

```text
function
function
```

Classes are special functions under the hood.

</details>

## 4. `var` in a loop with setTimeout

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1);
}
```

<details>
<summary>Output & why</summary>

```text
3
3
3
```

`var` is function-scoped, so it does not create a new scope per loop iteration — all callbacks share the same `i` in the outer scope. By the time the `setTimeout` callbacks run (after the loop finishes), `i` is already 3, so every callback logs 3.

</details>

## 5. `let` in a loop with setTimeout

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i, "i");
  }, 1);
}
```

<details>
<summary>Output & why</summary>

```text
0 i
1 i
2 i
```

`let` is block-scoped: each iteration creates a new instance of `i`, so each callback captures the `i` of its own iteration.

</details>

## 6. Re-declaring with `var`

```js
var a = 1;
var a = 2;
console.log(a);
```

<details>
<summary>Output & why</summary>

```text
2
```

`var` allows re-declaration; the last assignment wins.

</details>

## 7. `var` then `let` with the same name

```js
var a = 1;
let a = 2;
console.log(a);
```

<details>
<summary>Output & why</summary>

```text
SyntaxError: Identifier 'a' has already been declared
```

</details>

## 8. Re-declaring with `let`

```js
let a = 1;
let a = 2;
console.log(a);
```

<details>
<summary>Output & why</summary>

```text
SyntaxError: Identifier 'a' has already been declared
```

</details>

## 9. Primitive vs Number object

```js
let a = 2;
let b = new Number(2);

console.log(a == b);
console.log(a === b);
```

<details>
<summary>Output & why</summary>

```text
true
false
```

`==` coerces the object to a primitive, so values match. `===` fails because `b` is an object, not a primitive number.

</details>

## 10. Functions can hold properties

```js
function ff() {
  console.log("dsfs");
}
ff.ss = "a";
console.log(ff.ss);
```

<details>
<summary>Output & why</summary>

```text
a
```

Functions are objects, so properties can be attached to them.

</details>

## 11. Post-increment vs pre-increment

```js
let num = 1;
console.log(num++);
console.log(++num);
console.log(num);
```

<details>
<summary>Output & why</summary>

```text
1
3
3
```

- `num++` prints first, then increments (1 → 2).
- `++num` increments first (2 → 3), then prints.

</details>

## 12. Duplicate keys in an object

```js
const a = { a: 1, b: 2, a: 3 };
console.log(a);
```

<details>
<summary>Output & why</summary>

```text
{ a: 3, b: 2 }
```

The last value of a duplicate key wins, but the key keeps its original position.

</details>

## 13. Double negation (!!)

```js
console.log(!!null);
console.log(!!"");
console.log(!!1);
```

<details>
<summary>Output & why</summary>

```text
false
false
true
```

`!!` converts a value to its boolean equivalent: `null` and `""` are falsy, `1` is truthy.

</details>

## 14. Spreading a string

```js
console.log([..."anit"]);
```

<details>
<summary>Output & why</summary>

```text
[ 'a', 'n', 'i', 't' ]
```

Spread splits a string into individual characters.

</details>

## 15. typeof with concatenation

```js
console.log(typeof 3 + 4 + "5");
```

<details>
<summary>Output & why</summary>

```text
number45
```

`typeof 3` → `"number"`; `"number" + 4` → `"number4"`; `+ "5"` → `"number45"`.

</details>

## 16. Comparing array literals

```js
console.log([] == []);
console.log([] === []);
```

<details>
<summary>Output & why</summary>

```text
false
false
```

Always false: JavaScript compares objects by reference, not value.

</details>

## 17. Objects passed to functions are mutated

```js
function getInfo(member) {
  member.name = "anil";
}

const person = { name: "Sarah" };
getInfo(person);

console.log(person);
```

<details>
<summary>Output & why</summary>

```text
{ name: 'anil' }
```

Objects are passed by reference, so the function mutates the original.

</details>

## 18. `let` inside an IIFE

```js
(() => {
  let x = (y = 2);
})();

console.log(typeof x);
```

<details>
<summary>Output & why</summary>

```text
undefined
```

`x` is block-scoped inside the IIFE, so it does not exist outside.

</details>

## 19. Implicit global from `let x = (y = 2)`

```js
(() => {
  let x = (y = 2);
})();

console.log(typeof x);
console.log(typeof y);
```

<details>
<summary>Output & why</summary>

```text
undefined
number
```

`x` is block-scoped, but `y` was never declared — `y = 2` makes it an implicit global.

</details>

## 20. Block scope across two IIFEs

```js
(() => {
  let x = 2;
})();

(() => {
  let x = 2;
})();

console.log(typeof x);
```

<details>
<summary>Output & why</summary>

```text
undefined
```

Each `x` lives inside its own block scope.

</details>

## 21. Implicit global overwritten by second IIFE

```js
(() => {
  let x = (y = 10);
})();

(() => {
  let x = (y = 20);
})();

console.log(y);
```

<details>
<summary>Output & why</summary>

```text
20
```

`y` is an implicit global (declared without `let`/`var`/`const`), so the second IIFE overwrote it.

</details>

## 22. `var` inside an IIFE

```js
(() => {
  var x = 10;
})();

console.log(typeof x);
```

<details>
<summary>Output & why</summary>

```text
undefined
```

`var` is function-scoped, so `x` is not available outside the IIFE. **IMPORTANT:** compare with #21 to see the difference from an implicit global.

</details>

## 23. Unary plus coercion

```js
console.log(true + +"10");
```

<details>
<summary>Output & why</summary>

```text
11
```

`+"10"` converts to the number 10; `true` converts to 1; 1 + 10 = 11.

</details>

## 24. Skipping elements in array destructuring

```js
const [, , a] = [1, 2, 3, 4];
console.log(a);
```

<details>
<summary>Output & why</summary>

```text
3
```

The first two positions are skipped, so `a` binds to index 2.

</details>

## 25. Destructuring an array with object syntax

```js
const { 2: a } = [1, 2, 3, 4];
console.log(a);
```

<details>
<summary>Output & why</summary>

```text
3
```

Arrays are objects with index keys, so `{ 2: a }` picks index 2.

</details>

## 26. Reading a function property before and after assignment

```js
function abc() {
  console.log(abc.xyz);
}

abc();
abc.xyz = 400;
abc.xyz = 200;
abc();
```

<details>
<summary>Output & why</summary>

```text
undefined
200
```

The first call runs before `xyz` is set. It is then assigned 400 and reassigned 200 before the second call.

</details>

## 27. parseInt behavior

```js
console.log(parseInt("10+12"));
console.log(parseInt("M7F"));
console.log(parseInt("7FM"));
console.log(parseInt({ A: 1 }));
console.log(parseInt(10 + 12));
```

<details>
<summary>Output & why</summary>

```text
10
NaN
7
NaN
22
```

- `"10+12"` → parses until the first non-numeric character → 10.
- `"M7F"` → starts with a non-numeric character → NaN.
- `"7FM"` → 7.
- An object → NaN.
- `10 + 12` evaluates to 22 first.

</details>

## 28. map with no return value

```js
console.log(
  [1, 2].map((ele) => {
    if (ele > 0) return;
  })
);
```

<details>
<summary>Output & why</summary>

```text
[ undefined, undefined ]
```

The callback returns nothing (`return;`), so every element maps to `undefined`.

</details>

## 29. Function vs variable hoisting

```js
var a = 10;
console.log(a);
function a() {
  console.log(33);
}
console.log(a);
```

<details>
<summary>Output & why</summary>

```text
10
10
```

The function declaration is hoisted first, then the variable declaration; the variable **assignment** (`a = 10`) then overrides the function.

</details>

## 30. Array constructor

```js
console.log(Array(1, 9));
console.log(Array(2));
```

<details>
<summary>Output & why</summary>

```text
[ 1, 9 ]
[ <2 empty items> ]
```

Multiple arguments become elements; a single number sets the length.

</details>

## 31. NaN comparisons and truthiness

```js
console.log(NaN == true);
console.log(NaN == false);
console.log(NaN == NaN);
console.log(NaN === NaN);

if (NaN) {
  console.log("d");
} else {
  console.log("fds");
}
```

<details>
<summary>Output & why</summary>

```text
false
false
false
false
fds
```

`NaN` never equals anything, and it is falsy — so the `else` branch runs.

</details>

## 32. null vs undefined in arithmetic

```js
console.log(null + 20);
console.log(undefined + 20);
```

<details>
<summary>Output & why</summary>

```text
20
NaN
```

`null` coerces to 0; `undefined` coerces to `NaN`.

</details>

## 33. null vs undefined equality

```js
console.log(null == undefined);
console.log(null === undefined);
```

<details>
<summary>Output & why</summary>

```text
true
false
```

Loosely equal to each other, but different types under strict equality.

</details>

## 34. Loose equality with objects and strings

```js
console.log([] == []);
console.log([] == "");
console.log({} == "");
```

<details>
<summary>Output & why</summary>

```text
false
true
false
```

- `[] == []` → different references.
- `[] == ""` → `==` coerces both operands to the same type (`[]` → `""`).
- `{} == ""` → `{}` cannot be coerced to a matching primitive.

</details>

## 35. delete on an array element

```js
const arr = [1, 2, 3];
delete arr[0];
console.log(arr);
```

<details>
<summary>Output & why</summary>

```text
[ <1 empty item>, 2, 3 ]
```

`delete` leaves a hole; the array length is unchanged.

</details>

## 36. setTimeout vs Promise.then ordering

```js
console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise 1'));
Promise.resolve().then(() => console.log('promise 2'));
console.log('end');
```

<details>
<summary>Output & why</summary>

```text
start
end
promise 1
promise 2
timeout
```

Synchronous code runs to completion first (`start`, `end`). When the call stack empties, the event loop drains the **microtask queue** completely (`promise 1`, `promise 2`) before taking one **macrotask** from the timer queue (`timeout`). A `setTimeout` of 0 never runs before a promise callback that was already queued, no matter how small the delay.

</details>

## 37. async function timing and nested microtasks

```js
async function foo() {
  console.log('foo start');
  await null;
  console.log('foo after await');
}
console.log('script start');
setTimeout(() => console.log('timeout'), 0);
foo();
Promise.resolve()
  .then(() => {
    console.log('then 1');
    Promise.resolve().then(() => console.log('nested then'));
  })
  .then(() => console.log('then 2'));
console.log('script end');
```

<details>
<summary>Output & why</summary>

```text
script start
foo start
script end
foo after await
then 1
nested then
then 2
timeout
```

`foo()` runs synchronously until its first `await`, so `foo start` prints immediately, then control returns to the script (`script end`). `await null` queues the continuation as a microtask **before** the `.then` chain was registered, so `foo after await` beats `then 1`. Inside `then 1` a new microtask is queued; it runs before `then 2` because `then 2` is only queued once `then 1`'s callback returns. Everything in the microtask queue finishes before the timer fires.

</details>

## 38. Sequential awaits vs Promise.all

```js
const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
const bucket = (start) => Math.round((Date.now() - start) / 100) * 100;

async function sequential() {
  const start = Date.now();
  const a = await wait(100, 'a');
  const b = await wait(100, 'b');
  return `${a + b} in ~${bucket(start)}ms`;
}

async function parallel() {
  const start = Date.now();
  const [a, b] = await Promise.all([wait(100, 'a'), wait(100, 'b')]);
  return `${a + b} in ~${bucket(start)}ms`;
}

sequential().then(console.log);
parallel().then(console.log);
```

<details>
<summary>Output & why</summary>

```text
ab in ~100ms
ab in ~200ms
```

Both functions produce the same value, but `sequential` waits for `a` to finish before even starting `b`, so it takes two full delays. `Promise.all` starts both timers at once and waits for the slower one, so it finishes in one delay and logs **first** even though it was called second. Awaiting inside a loop when the calls are independent is the most common async performance mistake in interviews.

</details>

## 39. Arrow function `this` in object methods

```js
const user = {
  role: 'admin',
  regular() { return this.role; },
  arrow: () => this.role,
  nested() {
    const inner = () => this.role;
    return inner();
  },
};
console.log(user.regular());
console.log(user.arrow());
console.log(user.nested());
```

<details>
<summary>Output & why</summary>

```text
admin
undefined
admin
```

A regular method gets `this` from the call site (`user.regular()` → `user`). An arrow function has **no `this` of its own**; it captures `this` from the scope where it was *defined*, which here is the module or global scope, not `user`, so `this.role` is `undefined`. Inside `nested()` the arrow is defined inside a regular method, so it captures that method's `this`, which is `user`. Rule: arrows as object methods lose `this`; arrows as callbacks inside methods keep it.

</details>

## 40. Extracted method and `this` inside setTimeout

```js
'use strict';
const counter = {
  count: 0,
  inc() { this.count++; return this.count; },
  delayed() {
    setTimeout(function () { console.log('function:', this.count); }, 0);
    setTimeout(() => console.log('arrow:', this.count), 0);
  },
};
console.log(counter.inc());
const inc = counter.inc;
try { inc(); } catch (e) { console.log(e.constructor.name); }
counter.delayed();
```

<details>
<summary>Output & why</summary>

```text
1
TypeError
function: undefined
arrow: 1
```

`counter.inc()` works because `this` is `counter`. Assigning the method to `inc` and calling it bare loses the receiver: in strict mode `this` is `undefined`, so `this.count++` throws `TypeError`. Without `'use strict'` it would silently write `NaN` onto the global object instead. Inside `delayed`, the `function` callback is invoked by the timer with no receiver, so `this.count` is `undefined`; the arrow callback captures `this` from `delayed()`, which is `counter`, so it prints `1`. Fix for the extracted case: `counter.inc.bind(counter)` or call it as `counter.inc()`.

</details>

## 41. Class method as callback; bind vs call vs apply

```js
class Button {
  constructor(label) { this.label = label; }
  click() { return this.label; }
}
const b = new Button('Save');
const handlers = [b.click, b.click.bind(b), () => b.click()];
console.log(JSON.stringify(handlers.map((h) => { try { return h(); } catch (e) { return e.constructor.name; } })));

function greet(greeting, punct) { return `${greeting}, ${this.name}${punct}`; }
const p = { name: 'Huxly' };
console.log(greet.call(p, 'Hi', '!'));
console.log(greet.apply(p, ['Hey', '?']));
const bound = greet.bind(p, 'Yo');
console.log(typeof bound, bound('.'));
```

<details>
<summary>Output & why</summary>

```text
["TypeError","Save","Save"]
Hi, Huxly!
Hey, Huxly?
function Yo, Huxly.
```

Class bodies are always strict, so a class method passed around bare (`b.click`) runs with `this === undefined` and throws when it reads `this.label`. `bind` returns a **new function** permanently tied to `b`; wrapping in an arrow calls it as a method. `call` and `apply` invoke immediately with an explicit `this`, differing only in how arguments are passed (list vs array). `bind` does not invoke; it returns a function, which is why `typeof bound` is `function` and the remaining argument is supplied later (partial application).

</details>

## 42. Coercion classics

```js
console.log([] == ![]);
console.log('b' + 'a' + +'a' + 'a');
console.log(0.1 + 0.2, 0.1 + 0.2 === 0.3);
console.log(null >= 0, null > 0, null == 0);
console.log(undefined == null, undefined === null);
console.log(typeof null, typeof NaN, typeof [], typeof function () {});
```

<details>
<summary>Output & why</summary>

```text
true
baNaNa
0.30000000000000004 false
true false false
true false
object number object function
```

`![]` is `false` (arrays are truthy), then `[] == false` coerces both to numbers: `[]` → `''` → `0`, `false` → `0`, so `true`. `+'a'` is unary plus on a non-numeric string, giving `NaN`, which concatenates to `'baNaNa'`. `0.1 + 0.2` is binary floating point, never exactly `0.3`; compare with `Math.abs(a - b) < Number.EPSILON`. Relational operators convert `null` to `0`, so `null >= 0` is `true`, but `==` never converts `null` to a number: `null` only loosely equals `undefined`. `typeof null` is `'object'` (a historic bug), `typeof NaN` is `'number'`, arrays are objects, and functions are the one non-primitive with their own `typeof`.

</details>

## 43. Default sort and map(parseInt)

```js
console.log(String([10, 1, 3, 20].sort()));
console.log(String([10, 1, 3, 20].sort((a, b) => a - b)));
console.log(String(['1', '2', '3'].map(parseInt)));
console.log(String(['1', '2', '3'].map(Number)));
console.log(String(['1', '2', '3'].map((s) => parseInt(s, 10))));
```

<details>
<summary>Output & why</summary>

```text
1,10,20,3
1,3,10,20
1,NaN,NaN
1,2,3
1,2,3
```

`sort()` with no comparator converts elements to **strings** and compares UTF-16 code units, so `'10' < '3'`. Always pass `(a, b) => a - b` for numbers. `map` calls its callback with `(value, index, array)`, and `parseInt` takes `(string, radix)`, so the index becomes the radix: `parseInt('1', 0)` is `1` (radix 0 means auto), `parseInt('2', 1)` is `NaN` (radix 1 is invalid), `parseInt('3', 2)` is `NaN` (`3` is not a binary digit). Use `Number` or wrap the call so only the string is passed.

</details>

## 44. Object.freeze is shallow; spread vs Object.assign

```js
const config = Object.freeze({ theme: 'dark', flags: { beta: true } });
config.theme = 'light';
config.flags.beta = false;
console.log(config.theme, config.flags.beta, Object.isFrozen(config), Object.isFrozen(config.flags));

const original = { a: 1, nested: { b: 2 } };
const spread = { ...original };
const assigned = Object.assign({}, original);
spread.a = 10;
spread.nested.b = 20;
console.log(original.a, original.nested.b, assigned.nested.b);
console.log(spread.nested === original.nested);
```

<details>
<summary>Output & why</summary>

```text
dark false true false
1 20 20
true
```

`Object.freeze` only freezes the top level: reassigning `config.theme` fails silently (throws in strict mode), but `config.flags` is a separate, unfrozen object, so `beta` flips to `false`. Deep freezing needs recursion. Likewise both `{ ...original }` and `Object.assign({}, original)` are **shallow copies**: primitives are copied, nested objects are shared by reference, so mutating `spread.nested.b` changes `original` and `assigned` too. For a true deep copy use `structuredClone` or a recursive clone.

</details>

## 45. `??` vs `||`, and what JSON.stringify drops

```js
const settings = { retries: 0, label: '', enabled: false, timeout: null };
console.log(JSON.stringify([settings.retries || 3, settings.retries ?? 3]));
console.log(JSON.stringify([settings.label || 'untitled', settings.label ?? 'untitled']));
console.log(JSON.stringify([settings.enabled || true, settings.enabled ?? true]));
console.log(JSON.stringify([settings.timeout || 5000, settings.timeout ?? 5000]));

const payload = { id: 1, name: undefined, greet() {}, when: new Date(0), tags: [undefined, () => {}], nan: NaN };
console.log(JSON.stringify(payload));
console.log(JSON.stringify(undefined), JSON.stringify(() => {}));
```

<details>
<summary>Output & why</summary>

```text
[3,0]
["untitled",""]
[true,false]
[5000,5000]
{"id":1,"when":"1970-01-01T00:00:00.000Z","tags":[null,null],"nan":null}
undefined undefined
```

`||` falls through on every **falsy** value (`0`, `''`, `false`, `null`, `undefined`, `NaN`), so it replaces legitimate zeros, empty strings and `false` flags. `??` falls through only on `null` or `undefined`, which is what "use a default when the value is missing" actually means. Use `??` for defaults, `||` for genuine boolean logic. `JSON.stringify` drops object properties whose value is `undefined` or a function, turns `undefined`/functions inside **arrays** into `null` (array length must be preserved), converts `Date` via `toJSON` to an ISO string, and serialises `NaN` and `Infinity` as `null`. Called directly on `undefined` or a function it returns `undefined`, not a string.

</details>
