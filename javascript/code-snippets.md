# JavaScript Code Snippets (Output Questions)

## 1. NaN never equals NaN

```js
console.log(NaN == NaN);  // false
console.log(NaN === NaN); // false
```

`NaN` results from converting a non-numeric string to a number:

```js
Number("hi");    // NaN
Number("hello"); // NaN
```

## 2. Chained comparisons

```js
console.log(1 < 2 < 3); // true
// 1 < 2 => true; in JS, true == 1
// so: 1 < 3 => true

console.log(3 > 2 > 1); // false
// 3 > 2 => true; in JS, true == 1
// so: 1 > 1 => false
```

## 3. typeof functions and classes

```js
function dd() {}
console.log(typeof dd); // "function"

class MyClass {}
console.log(typeof MyClass); // "function"
```

## 4. `var` in a loop with setTimeout

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1);
}
// Output: 3 3 3
```

`var` is function-scoped, so it does not create a new scope per loop iteration. All callbacks share the same `i` in the outer scope. By the time the `setTimeout` callbacks run (after the loop finishes), `i` is already 3, so every callback logs 3.

## 5. `let` in a loop with setTimeout

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i, "i");
  }, 1);
}
// Output: 0 1 2
```

`let` is block-scoped: each iteration creates a new instance of `i`, so each callback captures the `i` of its own iteration.

## 6. Re-declaring with `var`

```js
var a = 1;
var a = 2;
console.log(a); // 2
```

## 7. `var` then `let` with the same name

```js
var a = 1;
let a = 2;
console.log(a); // SyntaxError: Identifier 'a' has already been declared
```

## 8. Re-declaring with `let`

```js
let a = 1;
let a = 2;
console.log(a); // SyntaxError: Identifier 'a' has already been declared
```

## 9. Primitive vs Number object

```js
let a = 2;
let b = new Number(2);

console.log(a == b);  // true — values are equal after coercion
console.log(a === b); // false — b is an object
```

## 10. Functions can hold properties

```js
function ff() {
  console.log("dsfs");
}
ff.ss = "a";
console.log(ff.ss); // "a"
```

## 11. Post-increment vs pre-increment

```js
let num = 1;
console.log(num++); // 1 — prints first, then increments
console.log(++num); // 3 — increments first, then prints
console.log(num);   // 3
```

## 12. Duplicate keys in an object

```js
const a = { a: 1, b: 2, a: 3 };
console.log(a); // { a: 3, b: 2 }
// The last value of a duplicate key wins, but the key keeps its original position.
```

## 13. Double negation (!!)

```js
console.log(!!null); // false
console.log(!!"");   // false
console.log(!!1);    // true
```

## 14. Spreading a string

```js
console.log([..."anit"]); // [ 'a', 'n', 'i', 't' ]
```

## 15. typeof with concatenation

```js
console.log(typeof 3 + 4 + "5"); // "number45"
// typeof 3 => "number"; "number" + 4 => "number4"; + "5" => "number45"
```

## 16. Comparing array literals

```js
console.log([] == []);  // false
console.log([] === []); // false
// Always false: JavaScript compares objects by reference, not value.
```

## 17. Objects passed to functions are mutated

```js
function getInfo(member) {
  member.name = "anil";
}

const person = { name: "Sarah" };
getInfo(person);

console.log(person); // { name: 'anil' }
```

## 18. `let` inside an IIFE

```js
(() => {
  let x = (y = 2);
})();

console.log(typeof x); // "undefined" — x is block-scoped inside the IIFE
```

## 19. Implicit global from `let x = (y = 2)`

```js
(() => {
  let x = (y = 2);
})();

console.log(typeof x); // "undefined"
console.log(typeof y); // "number" — y was never declared, so it becomes a global
```

## 20. Block scope across two IIFEs

```js
(() => {
  let x = 2;
})();

(() => {
  let x = 2;
})();

console.log(typeof x); // "undefined" — each x is inside its own block scope
```

## 21. Implicit global overwritten by second IIFE

```js
(() => {
  let x = (y = 10);
})();

(() => {
  let x = (y = 20);
})();

console.log(y); // 20 — y is an implicit global, so the second IIFE overwrote it
```

## 22. `var` inside an IIFE

```js
(() => {
  var x = 10;
})();

console.log(typeof x); // "undefined"
// var is function-scoped, so x is not available outside the IIFE.
// IMPORTANT: compare with #21 to see the difference from an implicit global.
```

## 23. Unary plus coercion

```js
console.log(true + +"10"); // 11
// +"10" converts to the number 10; true converts to 1; 1 + 10 = 11
```

## 24. Skipping elements in array destructuring

```js
const [, , a] = [1, 2, 3, 4];
console.log(a); // 3
```

## 25. Destructuring an array with object syntax

```js
const { 2: a } = [1, 2, 3, 4];
console.log(a); // 3 — index 2 of the array
```

## 26. Reading a function property before and after assignment

```js
function abc() {
  console.log(abc.xyz);
}

abc();         // undefined — xyz is not set yet
abc.xyz = 400; // assign property xyz on the function
abc.xyz = 200; // reassign it
abc();         // 200
```

## 27. parseInt behavior

```js
console.log(parseInt("10+12"));  // 10  — parses until the first non-numeric character
console.log(parseInt("M7F"));    // NaN — starts with a non-numeric character
console.log(parseInt("7FM"));    // 7
console.log(parseInt({ A: 1 })); // NaN
console.log(parseInt(10 + 12));  // 22  — 10 + 12 evaluates to 22 first
```

## 28. map with no return value

```js
console.log(
  [1, 2].map((ele) => {
    if (ele > 0) return;
  })
); // [undefined, undefined]
```

## 29. Function vs variable hoisting

```js
var a = 10;
console.log(a); // 10
function a() {
  console.log(33);
}
console.log(a); // 10
```

The function declaration is hoisted first, then the variable declaration; the variable **assignment** (`a = 10`) then overrides the function.

## 30. Array constructor

```js
console.log(Array(1, 9)); // [ 1, 9 ]
console.log(Array(2));    // [ <2 empty items> ] — a single number sets the length
```

## 31. NaN comparisons and truthiness

```js
console.log(NaN == true);  // false
console.log(NaN == false); // false
console.log(NaN == NaN);   // false
console.log(NaN === NaN);  // false

if (NaN) {
  console.log("d");
} else {
  console.log("fds"); // NaN is falsy → "fds"
}
```

## 32. null vs undefined in arithmetic

```js
console.log(null + 20);      // 20  — null coerces to 0
console.log(undefined + 20); // NaN — undefined coerces to NaN
```

## 33. null vs undefined equality

```js
console.log(null == undefined);  // true  — loosely equal
console.log(null === undefined); // false — different types
```

## 34. Loose equality with objects and strings

```js
console.log([] == []); // false — different references
console.log([] == ""); // true  — == coerces both operands to the same type ([] → "")
console.log({} == ""); // false — {} cannot be coerced to a matching primitive
```

## 35. delete on an array element

```js
const arr = [1, 2, 3];
delete arr[0];
console.log(arr); // [ <1 empty item>, 2, 3 ] — leaves a hole, length unchanged
```
