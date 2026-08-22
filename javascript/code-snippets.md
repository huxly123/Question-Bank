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
