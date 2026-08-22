# JavaScript Theory

## 1. What are the different data types in JavaScript?

<details>
<summary>Answer</summary>

**Primitive types** store a single value:

- **String**
- **Number**
- **BigInt** — stores integers larger than the `Number` limit. Created with the `BigInt()` function or by adding `n` to an integer literal. Mainly used to work with and compare very large numbers.

  ```js
  const bigIntA = BigInt(12345678901234567890);
  console.log(bigIntA); // 12345678901234567168n
  ```

- **Boolean**
- **Undefined** — a variable that is declared but not assigned has the value `undefined`, and its type is also `undefined`.

  ```js
  var x;             // value of x is undefined
  var y = undefined; // we can also assign undefined explicitly
  ```

- **Null**
- **Symbol** — introduced in ES6. Stores an anonymous, unique value. Two symbols are never equal, even with the same description.

  ```js
  var symbol1 = Symbol('symbol');
  var symbol2 = Symbol('symbol');
  console.log(symbol1 === symbol2); // false
  ```

**Non-primitive types** (Object, Array, Function) store multiple or complex values:

- **Object** — stores a collection of data as key-value pairs.
- **Array** — an ordered list of values. `typeof` an array is `"object"`.

```js
// Key-value pairs
var obj1 = {
  x: 43,
  y: "Hello world!",
  z: function () {
    return this.x;
  },
};

// Ordered list
var array1 = [5, "Hello", true, 4.1];
```

</details>

## 2. Explain hoisting in JavaScript

<details>
<summary>Answer</summary>

Hoisting is JavaScript's default behavior of moving all variable and function **declarations** to the top of their scope. No matter where a variable or function is declared, its declaration is treated as if it were at the top of the scope.

- Only declarations are hoisted — initializations are not.
- Running in strict mode (`"use strict"`) prevents using a variable before declaring it.

```js
// a) Variable is usable before its declaration line
hoistedVariable = 3;
console.log(hoistedVariable); // 3
var hoistedVariable;

// b) Function declarations are fully hoisted
hoistedFunction(); // "Hello world!"
function hoistedFunction() {
  console.log("Hello world!");
}

// c) Hoisting also happens inside local scopes
function doSomething() {
  x = 33;
  console.log(x); // 33
  var x;
}

// d) Initializations are NOT hoisted
var x;
console.log(x); // undefined
x = 23;

// e) Strict mode blocks assignment before declaration
"use strict";
x = 23; // Error: x is not declared
var x;
```

</details>

## 3. Difference between `==` and `===`

<details>
<summary>Answer</summary>

Both are comparison operators. `==` compares only values (with type coercion), while `===` compares both value and type.

```js
var x = 2;
var y = "2";
x == y;  // true  — values are equal after coercion
x === y; // false — typeof x is "number", typeof y is "string"
```

</details>

## 4. Why do we use the `debugger` keyword?

<details>
<summary>Answer</summary>

The `debugger` statement stops code execution at that line so you can inspect the program. Execution pauses there and continues only when you step forward while debugging.

</details>

## 5. Difference between `var`, `let`, and `const`

<details>
<summary>Answer</summary>

**var**
- **Scope:** function-scoped — visible anywhere inside the function where it is declared, not block-scoped.
- **Hoisting:** hoisted to the top of its scope, so it can be used before its declaration (value is `undefined`).
- **Reassignment:** can be reassigned and re-declared.

```js
// Scope and hoisting
function exampleVar() {
  if (true) {
    var x = 10;
    console.log(x); // 10
  }
  console.log(x); // 10 — accessible outside the block
}

// Re-declaration is allowed
function rr() {
  var y = 0;
  console.log(y);
  var y = 1;
  console.log(y);
}
rr();
```

**let**
- **Scope:** block-scoped — visible only inside the block (`if`, loop, etc.) where it is declared.
- **Hoisting:** hoisted to the top of the block but not initialized until the declaration line runs. This gap is the *temporal dead zone*.
- **Reassignment:** can be reassigned, but cannot be re-declared in the same scope.

```js
// Scope and hoisting
function exampleLet() {
  if (true) {
    let y = 20;
    console.log(y); // 20
  }
  // console.log(y); // ReferenceError: y is not defined
}

// Re-declaration is NOT allowed
function rr() {
  let y = 0;
  let y = 1; // SyntaxError: Cannot redeclare block-scoped variable
}
```

**const**
- **Scope:** block-scoped, like `let`.
- **Hoisting:** hoisted but not initialized until the declaration line — the temporal dead zone also applies.
- **Reassignment:** cannot be reassigned after the initial assignment.

```js
function exampleConst() {
  if (true) {
    const z = 30;
    console.log(z); // 30
  }
  // console.log(z); // ReferenceError: z is not defined
}
```

</details>

## 6. `var` vs `let` vs `const` — examples

<details>
<summary>Answer</summary>

```js
// Scope
function exampleVarScope() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 (accessible outside the block)
}

function exampleLetConstScope() {
  if (true) {
    let y = 20;
    const z = 30;
  }
  // console.log(y); // ReferenceError (block-scoped)
  // console.log(z); // ReferenceError (block-scoped)
}

// Hoisting
function exampleVarHoisting() {
  console.log(a); // undefined (declaration is hoisted)
  var a = 5;
}

function exampleLetConstHoisting() {
  // console.log(b); // ReferenceError: Cannot access 'b' before initialization
  let b = 10;
}

// Reassignment
function exampleVarReassignment() {
  var x = 10;
  x = 20; // allowed
  console.log(x); // 20
}

function exampleLetReassignment() {
  let y = 30;
  y = 40; // allowed
  console.log(y); // 40
}

function exampleConstReassignment() {
  const z = 50;
  // z = 60; // TypeError: Assignment to constant variable
  console.log(z); // 50
}
```

</details>

## 7. What is the temporal dead zone?

<details>
<summary>Answer</summary>

The Temporal Dead Zone (TDZ) is related to the hoisting behavior of `let` and `const`. It is the period between entering a scope and the actual variable declaration, during which accessing the variable throws a `ReferenceError`. The variable exists in that period, but its value cannot be accessed.

```js
console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
const y = 10;

console.log(z); // undefined — var has no temporal dead zone
var z = 5;
```

</details>

## 8. Implicit vs explicit type coercion

<details>
<summary>Answer</summary>

**Implicit coercion** is the automatic conversion of a value from one data type to another. It happens when the operands of an expression have different types.

```js
// Number to string
const num = 5;
const str = "The number is " + num; // "The number is 5"

// String concatenation with +
const strNum = "10";
const sum = strNum + 5; // "105" — the number 5 is coerced to a string
```

**Explicit coercion** (type casting) is when the developer converts a value deliberately using built-in functions:

```js
// String to number
const strNum = "10";
const num = Number(strNum); // 10

// Number to string
const n = 5;
const s = String(n); // "5"
```

**Boolean coercion** happens in logical operators, ternaries, `if` statements, and loop conditions. It relies on truthy and falsy values.

```js
var x = 0;
var y = 23;

if (x) { console.log(x); } // does not run — 0 is falsy
if (y) { console.log(y); } // runs — 23 is truthy
```

**Logical operators:**

- `||` (OR) — returns the first value if it is truthy; otherwise returns the second value.
- `&&` (AND) — returns the second value if both are truthy; returns the first falsy value it finds.

```js
var x = 220;
var y = "Hello";
var z = undefined;

x || y; // 220     — first value is truthy
x || z; // 220     — first value is truthy
x && y; // "Hello" — both truthy, second is returned
y && z; // undefined — second value is falsy

if (x && y) {
  console.log("Code runs"); // runs — x && y returns "Hello" (truthy)
}

if (x || z) {
  console.log("Code runs"); // runs — x || z returns 220 (truthy)
}
```

**Equality coercion:**

```js
var a = 12;
var b = "12";
a == b; // true — both operands are coerced to the same type before comparing

var c = 226;
var d = "226";
c === d; // false — no coercion; types differ, so they are not equal
```

</details>

## 9. Immutable vs mutable types

<details>
<summary>Answer</summary>

**Immutable types** (primitives) are stored on the stack. Assigning one variable to another copies the value into a new memory space.

```js
let a = 1;
let b = a;
a = 4;
console.log(b); // 1
```

**Mutable types** (non-primitives) are stored on the heap. Assigning one variable to another copies the reference, so both point to the same data.

```js
let arr = [0, 1];
let obj = { a: 1, b: 2 };

let arr2 = arr;
let obj2 = obj;

arr.push(1);
obj['a'] = 2;

console.log(arr2, obj2); // [ 0, 1, 1 ] { a: 2, b: 2 }
```

</details>

## 10. Pass by value vs pass by reference

<details>
<summary>Answer</summary>

**Pass by value:** when a primitive is passed to a function, changing the parameter does not change the original variable.

```js
const a = 1;

function doSome(val) {
  val++;
  console.log('in', val); // 2
}

doSome(a);
console.log(a); // 1
```

**Pass by reference:** when a non-primitive is passed, changing it inside the function changes the original.

```js
// Object
const a = { val: 1 };

function doSome(obj) {
  obj.val = 2;
  console.log('in', obj); // { val: 2 }
}
doSome(a);
console.log(a); // { val: 2 }

// Array
const b = [1, 2];

function doMore(arr) {
  arr.push(4);
  console.log('in', arr); // [ 1, 2, 4 ]
}
doMore(b);
console.log(b); // [ 1, 2, 4 ]
```

</details>

## 11. IIFE (Immediately Invoked Function Expression)

<details>
<summary>Answer</summary>

An IIFE (pronounced "iffy") is a function that runs as soon as it is defined.

```js
(function () {
  // Do something
})();
```

</details>

## 12. What is the `NaN` property?

<details>
<summary>Answer</summary>

`NaN` represents "Not-a-Number" — a value that is not a legal number. Use `isNaN()` to check for it.

Note: `isNaN()` first converts the given value to a Number, then checks whether the result is `NaN`.

```js
isNaN("Hello");   // true
isNaN(345);       // false
isNaN('1');       // false — '1' converts to the number 1
isNaN(true);      // false — true converts to 1
isNaN(false);     // false — false converts to 0
isNaN(undefined); // true
```

Why is `typeof NaN` equal to `"number"`? Because `NaN` is what numeric conversion returns for non-numeric input — for example, `Number("Hi")` returns `NaN`.

</details>

## 13. Explain higher-order functions

<details>
<summary>Answer</summary>

Functions that operate on other functions — either by taking them as arguments or by returning them — are called higher-order functions.

```js
// Taking a function as argument
function higherOrder(fn) {
  fn();
}
higherOrder(function () { console.log("Hello world"); });

// Returning a function
function higherOrder2() {
  return function () {
    return "Do something";
  };
}
var x = higherOrder2();
x(); // "Do something"

// Calling the returned function immediately
higherOrder2()(); // "Do something"
```

**Built-in higher-order functions** — JavaScript arrays provide many, each taking a callback applied to elements:

**map** — calls the function once per element and returns a new array of results.

```js
const numbers = [1, 2, 3];
const squaredNumbers = numbers.map(function (x) {
  return x * x;
});
console.log(squaredNumbers); // [1, 4, 9]
```

**filter** — returns a new array with the elements that pass the test.

```js
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter(function (x) {
  return x % 2 === 0;
});
console.log(evenNumbers); // [2, 4]
```

**reduce** — applies a function against an accumulator and each element (left to right) to reduce the array to a single value.

```js
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce(function (accumulator, currentValue) {
  return accumulator + currentValue;
}, 0);
console.log(sum); // 15
```

**forEach** — executes the function once per element.

```js
const numbers = [1, 2, 3];
numbers.forEach(function (x) {
  console.log(x);
});
// 1
// 2
// 3
```

**some** — checks whether at least one element passes the test.

```js
const numbers = [1, 2, 3];
const hasEven = numbers.some(function (x) {
  return x % 2 === 0;
});
console.log(hasEven); // true
```

**every** — checks whether all elements pass the test.

```js
const numbers = [2, 4, 6];
const allEven = numbers.every(function (x) {
  return x % 2 === 0;
});
console.log(allEven); // true
```

**find** — returns the first element that satisfies the test.

```js
const numbers = [1, 2, 3, 4, 5];
const found = numbers.find(function (x) {
  return x > 3;
});
console.log(found); // 4
```

**findIndex** — returns the index of the first element that satisfies the test.

```js
const numbers = [10, 20, 30, 40, 50];
const index = numbers.findIndex(function (x) {
  return x > 25;
});
console.log(index); // 2
```

**sort** — sorts the array in place and returns it.

```js
const numbers = [3, 1, 5, 2, 4];
numbers.sort(function (a, b) {
  return a - b;
});
console.log(numbers); // [1, 2, 3, 4, 5]
```

**flatMap** — maps each element, then flattens the result into a new array.

```js
const words = ["Hello", "World"];
const chars = words.flatMap(function (word) {
  return word.split("");
});
console.log(chars); // ["H", "e", "l", "l", "o", "W", "o", "r", "l", "d"]
```

</details>

## 14. What is the `this` keyword?

<details>
<summary>Answer</summary>

`this` refers to the context in which a function is executed. Its value depends on **how** the function is called.

**Global context:**

```js
console.log(this === window); // true (in a browser)
```

**Function context:**

```js
function greet() {
  console.log(this); // refers to the global object
}
greet();

const person = {
  name: "John",
  greet: function () {
    console.log(this.name); // refers to the person object
  },
};
person.greet();
```

**`this` in arrow functions:** an arrow function does not get its own `this` from how it is called — it takes `this` from its surrounding lexical scope.

```js
const obj = {
  a: 1,
  greet: () => {
    console.log(this);
  },
};
obj.greet(); // global object

const obj2 = {
  a: 1,
  greet: function () {
    const y = () => {
      console.log(this);
    };
    y();
  },
};
obj2.greet(); // { a: 1, greet: [Function: greet] } — the lexical scope's this
```

</details>

## 15. Explain `call()`, `apply()`, and `bind()`

<details>
<summary>Answer</summary>

**call()** — calls a function with a given `this` value and arguments passed individually.

```js
const person = {
  name: "John",
  greet: function (message) {
    console.log(`${message}, ${this.name}!`);
  },
};

const otherPerson = { name: "Jane" };

person.greet.call(otherPerson, "Hello");
// Output: Hello, Jane!
```

**apply()** — same as `call`, but arguments are passed as an array.

```js
const person = {
  name: "John",
  greet: function (message, message2) {
    console.log(`${message}, ${this.name} ${this.age} ${message2}!`);
  },
};

const otherPerson = { name: "Jane", age: 24 };
person.greet.apply(otherPerson, ["Hello", "Bye!"]); // Hello, Jane 24 Bye!!
```

**bind()** — returns a new function with `this` permanently set to the given object (and optionally preset arguments). The new function can be called later.

```js
const person = {
  name: "John",
  greet: function (message, message2) {
    console.log(`${message}, ${this.name} ${this.age} ${message2}!`);
  },
};

const obj = {
  name: 'Akshaya',
  age: 30,
};

const getGreet = person.greet.bind(obj);
getGreet('hi', 'bye'); // hi, Akshaya 30 bye!
```

</details>

## 16. What is currying?

<details>
<summary>Answer</summary>

Currying is a functional programming technique where a function with multiple arguments is transformed into a sequence of functions, each taking a single argument. It lets you partially apply a function with some arguments and get back a new function that takes the rest.

```js
// Example 1
function add(x) {
  return function (y) {
    return x + y;
  };
}
const addFive = add(5); // partial application
console.log(addFive(3)); // 8

// Example 2 — arrow functions
const sum = (x, y) => x + y;
const curriedAdd = x => y => sum(x, y);
const addFive2 = curriedAdd(5);
console.log(addFive2(3)); // 8

// Example 3 — three levels
function multiply(x) {
  return function (y) {
    return function (z) {
      return x * y * z;
    };
  };
}
console.log(multiply(2)(3)(4)); // 24

// Example 4 — practical use
const formatCurrency = currencySymbol => amount => `${currencySymbol}${amount.toFixed(2)}`;
const formatUSD = formatCurrency("$");
console.log(formatUSD(10.5)); // $10.50
```

</details>

## 17. What are closures?

<details>
<summary>Answer</summary>

A closure is a function bundled together with references to its surrounding state (its lexical environment). It lets a function access and modify variables from its outer scope even after the outer function has finished executing.

```js
function outerFunction() {
  const outerVariable = 'I am from outer function';

  function innerFunction() {
    console.log(outerVariable); // accesses outerVariable from the outer scope
  }

  return innerFunction;
}

const innerFunc = outerFunction(); // outerFunction has finished running
innerFunc(); // still prints: I am from outer function
```

</details>

## 18. Shallow copy vs deep copy

<details>
<summary>Answer</summary>

**Shallow copy** — copies only one level deep. The object and its top-level properties are copied, but nested objects or arrays still reference the same memory as the original. Changing a nested object affects both the original and the copy.

```js
const originalObject = { a: 1, b: { c: 2, d: { e: 4 } } };
const shallowCopy = { ...originalObject };

shallowCopy.a = 2;
shallowCopy.b.c = 3;
shallowCopy.b.d.e = 5;
console.log(originalObject, shallowCopy);
// { a: 1, b: { c: 3, d: { e: 5 } } } { a: 2, b: { c: 3, d: { e: 5 } } }
```

**Deep copy** — creates a new object with new memory for all properties, including nested objects and arrays. Changes to the copy never affect the original.

```js
const originalObject2 = { a: 1, b: { c: 2, d: { e: 4 } } };
const deepCopy = JSON.parse(JSON.stringify(originalObject2));

deepCopy.a = 2;
deepCopy.b.c = 3;
deepCopy.b.d.e = 5;
console.log(originalObject2, deepCopy);
// { a: 1, b: { c: 2, d: { e: 4 } } } { a: 2, b: { c: 3, d: { e: 5 } } }
```

</details>

## 19. Spread operator vs rest operator

<details>
<summary>Answer</summary>

> **Spread** expands an array (or string) into individual elements.
> **Rest** collects individual values into an array.

**Spread operator** — introduced in ES6, it "spreads" the values of an array or string across arguments or elements.

```js
// 1) Merge arrays
const a = [1, 2, 3];
const b = [4, 5, 6];
const c = [...a, ...b];
console.log(c); // [1, 2, 3, 4, 5, 6]

// 2) Insert into an array / spread a string
const myLocations = ["Delhi", "Hyderabad"];
const friendsLocations = ["Mumbai", ...myLocations, "Banglore"];
console.log(friendsLocations); // ['Mumbai', 'Delhi', 'Hyderabad', 'Banglore']

const collegeName = "IIT DELHI";
console.log([...collegeName]); // ['I', 'I', 'T', ' ', 'D', 'E', 'L', 'H', 'I']

// 3) Spread into function arguments
const functionArgs = [1, 2, 3, 4];
function multiplyNumbers(a, b, c, d) {
  return a * b * c * d;
}
console.log(multiplyNumbers(...functionArgs)); // 24

// 4) Copy and extend objects
const name = { firstName: "Eshaan", lastName: "Sharma" };
const bio = { ...name, job: "SDE1" };
console.log(bio.firstName); // Eshaan

// 5) Same idea with another object
const firstObj = { firstName: "Eshaan", lastName: "Sharma" };
const secondObj = { ...firstObj, age: "22" };
console.log(secondObj.firstName); // Eshaan
```

**Rest operator** — a parameter that gathers all remaining values of a function call (or destructuring) into an array. Useful for handling a variable number of inputs.

```js
// 1) Collect all arguments
function testRest(...values) {
  return values;
}
console.log(testRest("Eshaan", "Rahul")); // ["Eshaan", "Rahul"]

// 2) Rest in destructuring
const [firstName, secondName, ...otherInfo] =
  ["Rahul", "Mahajan", "Web developer", "Google India", "Male"];
console.log(otherInfo); // ["Web developer", "Google India", "Male"]

// 3) Variable number of arguments
function multipleArg(...args) {
  let finalArray = args.map(ele => ele * 2);
  console.log(finalArray);
}
multipleArg(1, 2);    // [2, 4]
multipleArg(4, 2, 4); // [8, 4, 8]
```

**Spread and rest together:**

```js
function spreadAndRest(firstArg, secondArg, ...otherArgs) {
  console.log(firstArg, secondArg);
  console.log(otherArgs);
}

spreadAndRest(...[1, 2, 3, 4, 5, 6]);
// 1 2
// [ 3, 4, 5, 6 ]

console.log(...[1, 2, 3, 4, 5, 6]); // 1 2 3 4 5 6 (spread)
```

</details>

## 20. `slice` vs `splice`

<details>
<summary>Answer</summary>

**slice** — cuts elements out of an array **without** modifying the original.

```js
array.slice(start, end)
```

- `start` — index where slicing begins.
- `end` — index where slicing stops (the element at `end` is **not** included).

```js
let arr = ["educative", 4, [1, 3], { type: "animal" }];
let slicedValues = arr.slice(1, 3);
console.log(slicedValues); // [ 4, [ 1, 3 ] ]
```

**splice** — removes or replaces elements **in place** (it modifies the original array) and returns the removed elements.

```js
array.splice(start, deleteCount, newElem1, newElem2, ..., newElemN)
```

- `start` — index where the operation begins.
- `deleteCount` — how many elements to remove from `start` (0 removes nothing).
- `newElem1...newElemN` — values inserted at `start`.

```js
let arr1 = [145, 'hi', 142];
let arr2 = arr1.splice(1, 1, "hello", 'hey');

console.log(arr1); // [ 145, 'hello', 'hey', 142 ] — original modified
console.log(arr2); // [ 'hi' ] — splice returns the removed elements
```

</details>

## 21. Event bubbling vs event capturing

<details>
<summary>Answer</summary>

**Event bubbling** (the browser default) — events fire from the child up to the parent.

```js
document.querySelector("#grandparent").addEventListener('click', (e) => {
  console.log('grandparent');
}, false); // false => bubbling (no capturing)

document.querySelector("#parent").addEventListener('click', (e) => {
  console.log('parent');
}, false);

document.querySelector("#child").addEventListener('click', (e) => {
  console.log('child');
}, false);

// Clicking #child outputs: child, parent, grandparent
```

**Event capturing** — events fire from the parent down to the child.

```js
document.querySelector("#grandparent").addEventListener('click', (e) => {
  console.log('grandparent');
}, true); // true => capturing

document.querySelector("#parent").addEventListener('click', (e) => {
  console.log('parent');
}, true);

document.querySelector("#child").addEventListener('click', (e) => {
  console.log('child');
}, true);

// Clicking #child outputs: grandparent, parent, child
```

**stopPropagation()** — stops the event from traveling any further. It works in both bubbling and capturing phases.

```js
// a) Bubbling: parent stops propagation
document.querySelector("#grandparent").addEventListener('click', (e) => {
  console.log('grandparent');
}, false);

document.querySelector("#parent").addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('parent');
}, false);

document.querySelector("#child").addEventListener('click', (e) => {
  console.log('child');
}, false);

// Clicking #child outputs: child, parent

// b) Capturing: parent stops propagation
document.querySelector("#grandparent").addEventListener('click', (e) => {
  console.log('grandparent');
}, true);

document.querySelector("#parent").addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('parent');
}, true);

document.querySelector("#child").addEventListener('click', (e) => {
  console.log('child');
}, false);

// Clicking #child outputs: grandparent, parent

// c) Capturing: grandparent stops propagation
document.querySelector("#grandparent").addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('grandparent');
}, true);

document.querySelector("#parent").addEventListener('click', (e) => {
  console.log('parent');
}, false);

document.querySelector("#child").addEventListener('click', (e) => {
  console.log('child');
}, false);

// Clicking #child outputs: grandparent
```

> When reasoning about `stopPropagation`, always work out the bubbling/capturing order first — capturing runs parent → child, then bubbling runs child → parent.

</details>

## 22. What is a polyfill?

<details>
<summary>Answer</summary>

A polyfill is a piece of code (usually JavaScript) that provides modern functionality in older browsers or environments that do not support it natively. It "fills the gap" by mimicking the newer feature's behavior.

Example: `Array.prototype.includes` was introduced in ES6 (2015) and is missing in older browsers like Internet Explorer.

```js
if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchElement, fromIndex) {
    const arr = this;
    const start = fromIndex || 0;

    for (let i = Math.max(start, 0); i < arr.length; i++) {
      if (arr[i] === searchElement) {
        return true;
      }
    }

    return false;
  };
}
```

</details>

## 23. Explain the `reduce` function

<details>
<summary>Answer</summary>

```js
array.reduce(callback, initialValue)
// callback = (accumulator, currentValue) => { ... }
```

`reduce` loops through the array, runs the callback on each element, and stores the returned value in the accumulator on every iteration. At the end it returns the accumulator. `initialValue` sets the accumulator's starting value.

```js
const arr = [10, 20, 30];
const res = arr.reduce((acc, curr) => {
  return acc + curr;
}, 0);
console.log(res); // 60

const nested = [
  [1, 2],
  [2, 4],
];
const res1 = nested.reduce((acc, curr) => {
  return acc.concat(curr);
}, []);
console.log(res1); // [ 1, 2, 2, 4 ]
```

</details>

## 24. Write a polyfill for `reduce`

<details>
<summary>Answer</summary>

```js
if (!Array.prototype.reduce1) {
  Array.prototype.reduce1 = function (callback, initialValue) {
    if (typeof callback !== "function") {
      throw new TypeError("Callback must be a function");
    }

    const array = this;
    const length = array.length;
    let accumulator = initialValue !== undefined ? initialValue : array[0];

    for (let i = initialValue !== undefined ? 0 : 1; i < length; i++) {
      if (i in array) {
        accumulator = callback.call(undefined, accumulator, array[i], i, array);
      }
    }

    return accumulator;
  };
}
```

</details>

## 25. Define classes in JavaScript

<details>
<summary>Answer</summary>

A class is a blueprint for creating objects that share the same properties and methods. Classes encapsulate data (properties) and behavior (methods), making code more organized and reusable. In JavaScript, classes are primarily syntactic sugar over the existing prototype-based inheritance model.

```js
class Person {
  constructor(name, age) {
    this.name = name; // property
    this.age = age;   // property
  }

  greet() { // method
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
  }
}

const person1 = new Person("Alice", 25);
person1.greet(); // Hello, my name is Alice and I am 25 years old.
```

**Static methods** — defined on the class itself, not on instances. Used for utility functions that don't depend on instance data.

```js
class MathUtils {
  static add(a, b) {
    return a + b;
  }
}

console.log(MathUtils.add(5, 10)); // 15
```

**Getters and setters** — custom accessors for properties using `get` and `set`.

```js
class Circle {
  constructor(radius) {
    this.radius = radius;
  }

  get diameter() {
    return this.radius * 2;
  }

  set diameter(diameter) {
    this.radius = diameter / 2;
  }
}

const circle = new Circle(10);
console.log(circle.diameter); // 20
circle.diameter = 30;
console.log(circle.radius);   // 15
```

**Private members** — properties or methods (prefixed with `#`) accessible only inside the class where they are defined.

```js
class Example {
  #privateProperty = "I am private";

  #privateMethod() {
    console.log(this.#privateProperty);
  }

  publicMethod() {
    this.#privateMethod(); // accessing the private method
  }
}

const obj = new Example();
obj.publicMethod(); // I am private
// console.log(obj.#privateProperty);
// Error: Private field '#privateProperty' must be declared in an enclosing class
```

**Static members** — properties or methods that belong to the class itself, not to instances. They are accessed via the class name only.

```js
class Example {
  static staticProperty = "I am static";

  static staticMethod() {
    console.log(this.staticProperty);
  }
}

Example.staticMethod();          // I am static
const obj2 = new Example();
console.log(obj2.staticProperty); // undefined — not accessible via an instance
```

</details>

## 26. Inheritance in JavaScript

<details>
<summary>Answer</summary>

Two forms: prototype-based inheritance and class-based inheritance.

**Prototype-based inheritance:**

Every object has an internal `[[Prototype]]` property linking it to another object. This linkage forms the *prototype chain*, which lets an object access properties and methods defined on its prototype. Inheritance is set up with `Object.create()` or `__proto__` — objects inherit directly from other objects.

```js
const parent = {
  greet() {
    console.log("Hello from parent");
  },
};

const child = Object.create(parent);
child.greet(); // Hello from parent

console.log(child.__proto__ === parent); // true
```

**Class-based inheritance:**

Uses the `class` and `extends` keywords. The `super` keyword gives access to the parent class's constructor and methods.

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks.`);
  }
}

const dog = new Dog("Rex");
dog.speak(); // Rex barks.
```

**The `super` keyword:**

In a child class constructor, `super()` calls the parent class constructor. This is required when extending a class — the parent's properties must be initialized before `this` can be used.

```js
class Parent {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello from ${this.name}`);
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name); // call parent constructor
    this.age = age;
  }

  greet() {
    super.greet(); // call parent method
    console.log(`I am ${this.age} years old.`);
  }
}

const child = new Child("Alice", 10);
child.greet();
// Hello from Alice
// I am 10 years old.
```

</details>

## 27. `Object.create()` vs `Object.assign()`

<details>
<summary>Answer</summary>

**Object.create()** — creates a new empty object and sets the given object as its **prototype** (methods live on the prototype, not on the object itself).

```js
const proto = {
  greet() {
    console.log("Hello");
  },
};
const obj = Object.create(proto);
console.log(obj); // {}

console.log(Object.getPrototypeOf(obj)); // { greet: [Function: greet] }

obj.greet(); // Hello
```

**Object.assign()** — copies properties from one or more source objects onto a target object.

```js
Object.assign(target, ...sources)
```

```js
const target = { a: 1 };
const source = { b: 2, c: 3 };
Object.assign(target, source);

console.log(target); // { a: 1, b: 2, c: 3 }
```

</details>

## 28. Explain the `new` keyword

<details>
<summary>Answer</summary>

`new` creates instances of objects defined by constructor functions. It does four things: create a new object → set its prototype → bind `this` to it → return the object.

If a normal function uses `this` to assign values, it must be called with `new` for `this` to bind correctly.

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const john = new Person("John", 25);
console.log(john.name); // "John"

class Animal {
  constructor(type) {
    this.type = type;
  }

  speak() {
    console.log(`I am a ${this.type}`);
  }
}

const dog = new Animal("Dog");
dog.speak(); // "I am a Dog"
```

`new` is also used with built-in objects like `Date`, `RegExp`, and `Map`:

```js
const today = new Date();
console.log(today);

const regex = new RegExp("\\w+");
console.log(regex.test("word")); // true
```

</details>

## 29. Generator functions

<details>
<summary>Answer</summary>

Generator functions are special functions that can pause and resume execution at specific points. They provide a powerful way to work with iterators and lazy evaluation.

```js
function* myGenerator() {
  yield 1;
  yield 2;
  yield 3;
}
const gen = myGenerator(); // returns an iterator
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

Use case — lazy infinite sequences:

```js
function* infiniteNumbers() {
  let num = 1;
  while (true) {
    yield num++;
  }
}

const numbers = infiniteNumbers();
console.log(numbers.next().value); // 1
console.log(numbers.next().value); // 2
console.log(numbers.next().value); // 3
```

| Feature | Regular function | Generator function |
| --- | --- | --- |
| Execution | Runs start to finish | Can pause and resume |
| Return value | Single value or `undefined` | Iterator object |
| Syntax | `function` | `function*` |

</details>

## 30. Promises

<details>
<summary>Answer</summary>

A Promise is a guarantee that you'll get a result in the future. It is used to handle asynchronous tasks, like fetching data from an API.

States:
- **Pending** — the promise is still working (like waiting for a delivery).
- **Fulfilled** — the task succeeded (delivery arrived).
- **Rejected** — the task failed (delivery was canceled).

Use `.then()` for success, `.catch()` for errors, and `.finally()` for code that should run when the task finishes, regardless of the result.

```js
const promise = new Promise((resolve, reject) => {
  const isSuccessful = true;
  setTimeout(() => {
    isSuccessful ? resolve("Success!") : reject("Error!");
  }, 1000);
});

promise
  .then((result) => console.log(result))   // "Success!" if resolved
  .catch((error) => console.error(error))  // "Error!" if rejected
  .finally(() => console.log("Task completed.")); // runs either way
```

**1) Promise.race()** — settles as soon as the first promise in the array resolves or rejects.

```js
const promise1 = new Promise((resolve) => setTimeout(resolve, 100, "Fast"));
const promise2 = new Promise((resolve) => setTimeout(resolve, 500, "Slow"));

Promise.race([promise1, promise2])
  .then((value) => {
    console.log("First resolved:", value); // "First resolved: Fast"
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

**2) Promise.all()** — runs promises in parallel and resolves when **all** are fulfilled. If any promise rejects, the whole `Promise.all` rejects immediately.

Use case: when all tasks must complete before proceeding.

```js
const promise1 = new Promise((res) => setTimeout(() => res("10"), 1000));
const promise2 = new Promise((res) => setTimeout(() => res("20"), 10));
const promise3 = new Promise((res) => setTimeout(() => res("30"), 100));

Promise.all([promise1, promise2, promise3])
  .then((results) => {
    console.log(results); // ["10", "20", "30"]
  })
  .catch((error) => {
    // If any promise rejects: "One of the promises failed: <reason>"
    console.error("One of the promises failed:", error);
  });
```

**3) Promise.allSettled()** — runs promises in parallel and resolves when **all** settle (fulfilled or rejected). It never rejects; it returns an array of result objects.

Use case: when you need the outcome of every task regardless of success or failure.

```js
const promise1 = new Promise((res) => setTimeout(() => res("10"), 1000));
const promise2 = new Promise((res) => setTimeout(() => res("20"), 10));
const promise3 = new Promise((res, rej) => setTimeout(() => rej("30"), 100));

Promise.allSettled([promise1, promise2, promise3])
  .then((results) => {
    console.log(results);
  });

// [
//   { status: 'fulfilled', value: '10' },
//   { status: 'fulfilled', value: '20' },
//   { status: 'rejected', reason: '30' }
// ]
```

**4) Promise.any()** — resolves as soon as the **first** promise fulfills. If all promises reject, it rejects with an `AggregateError` containing all rejection reasons.

Use case: when any one successful result is enough.

```js
const promise1 = new Promise((res) => setTimeout(() => res("10"), 1000));
const promise2 = new Promise((res) => setTimeout(() => res("20"), 10));
const promise3 = new Promise((res) => setTimeout(() => res("30"), 100));

Promise.any([promise1, promise2, promise3])
  .then((result) => {
    console.log("First successful result:", result); // "20"
  })
  .catch((error) => {
    console.error("All promises failed:", error.errors);
  });
```

</details>

## 31. What is infinite currying?

<details>
<summary>Answer</summary>

Infinite currying allows an indefinite number of function calls, where each call passes one argument. Calling with no argument returns the accumulated result.

```js
function add(a) {
  return function (b) {
    if (b !== undefined) {
      return add(a + b); // keep currying while arguments are passed
    }
    return a; // return the final value when called with no argument
  };
}

console.log(add(1)(2)(3)(4)()); // 10
console.log(add(10)(20)(30)()); // 60
```

</details>

## 32. Array methods that modify (or don't modify) the original array

<details>
<summary>Answer</summary>

**Methods that modify the array:**

| Method | What it does | Returns |
| --- | --- | --- |
| `push()` | Adds one or more elements to the end | New length of the array |
| `pop()` | Removes the last element | The removed element |
| `shift()` | Removes the first element | The removed element |
| `unshift()` | Adds one or more elements to the beginning | New length of the array |
| `splice()` | Adds/removes/replaces elements at an index | Array of removed elements |
| `sort()` | Sorts in place using a comparison function | The sorted (mutated) array |
| `reverse()` | Reverses the element order | The reversed (mutated) array |
| `copyWithin()` | Copies a sequence of elements within the array | The modified array |
| `fill()` | Fills all or part of the array with a static value | The modified array |

**Methods that do NOT modify the array:**

| Method | What it does | Returns |
| --- | --- | --- |
| `map()` | Transforms each element via a callback | A new array |
| `filter()` | Keeps elements that pass the callback's condition | A new array |
| `reduce()` | Reduces the array to a single value | A single value |
| `reduceRight()` | Like `reduce()`, but right to left | A single value |
| `concat()` | Merges arrays/values into a new array | A new array |
| `slice()` | Extracts a portion without modifying the original | A new array |
| `flat()` | Flattens nested arrays | A new array |
| `flatMap()` | Maps and flattens in one step | A new array |
| `join()` | Concatenates elements into a string with a delimiter | A string |
| `find()` | First element matching the condition | The element (or `undefined`) |
| `findIndex()` | Index of the first matching element | Index (or `-1`) |
| `every()` | Do all elements pass the condition? | `true` / `false` |
| `some()` | Does at least one element pass? | `true` / `false` |
| `includes()` | Does the array contain a value? | `true` / `false` |
| `indexOf()` | Index of the first occurrence of a value | Index (or `-1`) |
| `lastIndexOf()` | Index of the last occurrence of a value | Index (or `-1`) |

</details>

## 33. Pure vs impure functions

<details>
<summary>Answer</summary>

A **pure function** always produces the same output for the same input and has no side effects.

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // always 5
console.log(add(2, 3)); // always 5
```

An **impure function** produces different outputs for the same input or causes side effects.

```js
let counter = 0;

function incrementCounter() {
  counter += 1; // side effect: modifies outside state
  return counter;
}

console.log(incrementCounter()); // 1
console.log(incrementCounter()); // 2
```

</details>
