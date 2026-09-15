# Recursion

Read the problem, decide the base case and the recursive step in your head, then expand **Answer** to check. Code blocks are complete functions you can copy as-is.

Every recursive function has two parts: a **base case** that returns without recursing, and a **recursive case** that does one unit of work and calls itself on a smaller input. If you cannot name both, you do not have a solution yet.

## 1. Print a Name N Times

Print `"raj"` `n` times using recursion, no loops.

<details>
<summary>Answer</summary>

**Base case:** `n === 0`, stop.
**Recursive case:** print once, recurse with `n - 1`.

```js
function printName(n) {
  if (n === 0) return;
  console.log("raj");
  printName(n - 1);
}
```

</details>

## 2. Print 1 to N, and N to 1

Print the numbers from 1 to `n` in order, then write a second function that prints `n` down to 1.

<details>
<summary>Answer</summary>

**Key insight:** the parameter you decrement controls termination. To count *up* you need a second parameter carrying the current value, or print *after* the recursive call (backtracking).

```js
// counting up: carry the current value
function printOneToN(curr, n) {
  if (curr > n) return;
  console.log(curr);
  printOneToN(curr + 1, n);
}

// counting down: print before recursing
function printNToOne(n) {
  if (n === 0) return;
  console.log(n);
  printNToOne(n - 1);
}

// counting up with one parameter: print after recursing (backtracking)
function printOneToNBacktrack(n) {
  if (n === 0) return;
  printOneToNBacktrack(n - 1);
  console.log(n);
}
```

</details>

## 3. Power, Sum of Array, Product of Array

Write `power(a, b)` = `a^b`, `sumArray(arr)`, and `productArray(arr)` recursively.

<details>
<summary>Answer</summary>

**Key insight:** each answer is "the first element combined with the answer for the rest". The base case returns the identity of the operation: 1 for multiplication, 0 for addition.

```js
function power(a, b) {
  if (b === 0) return 1;
  return a * power(a, b - 1);
}

function sumArray(arr, index = 0) {
  if (index === arr.length) return 0;
  return arr[index] + sumArray(arr, index + 1);
}

function productArray(arr, index = 0) {
  if (index === arr.length) return 1;
  return arr[index] * productArray(arr, index + 1);
}
```

</details>

## 4. Reverse a String

Reverse `"abc"` to `"cba"` using recursion.

<details>
<summary>Answer</summary>

**Key insight:** reverse of `s` = reverse of `s[1..]` + `s[0]`. The first character ends up last.

**Complexity:** O(n²) because `slice` copies each time. Fine for interviews, but say so.

```js
function reverseString(str) {
  if (str.length === 0) return "";
  return reverseString(str.slice(1)) + str[0];
}
```

</details>

## 5. Reverse an Array

Reverse `[1, 2, 3, 4, 5]` in place using recursion.

<details>
<summary>Answer</summary>

**Pattern:** two pointers, recursive.

**Key insight:** swap the outermost pair, then recurse on the inner slice by moving both indices inward. Base case is when they meet or cross.

**Complexity:** O(n) time, O(n) call stack.

```js
function reverseArray(arr, start = 0, end = arr.length - 1) {
  if (start >= end) return arr;
  [arr[start], arr[end]] = [arr[end], arr[start]];
  return reverseArray(arr, start + 1, end - 1);
}
```

**Alternative (build a new array):** walk from the end and push into an accumulator.

```js
function reverseArrayCopy(arr, n = arr.length - 1, res = []) {
  if (n < 0) return res;
  res.push(arr[n]);
  return reverseArrayCopy(arr, n - 1, res);
}
```

</details>

## 6. Palindrome Check

Return `true` if `str` reads the same forwards and backwards. `"madam"` → true.

<details>
<summary>Answer</summary>

**Pattern:** two pointers, recursive.

**Key insight:** compare the outer pair. If they differ, fail immediately. If they match, the answer is the palindrome check of the inner substring. Base case: pointers meet or cross → true.

**Complexity:** O(n) time, O(n) call stack.

```js
function isPalindrome(str, start = 0, end = str.length - 1) {
  if (start >= end) return true;
  if (str[start] !== str[end]) return false;
  return isPalindrome(str, start + 1, end - 1);
}
```

</details>

## 7. Fibonacci

Return the `n`th Fibonacci number. `fib(6)` → 8.

<details>
<summary>Answer</summary>

**Key insight:** two base cases (`fib(0) = 0`, `fib(1) = 1`) and a recursive case that branches twice. The naive version is O(2ⁿ) because it recomputes the same subproblems. Memoisation caches them and brings it to O(n).

```js
function fib(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fib(n - 1) + fib(n - 2);
}

// memoised, O(n) time and space
function fibMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}
```

</details>

## 8. Flatten a Nested Array

Flatten arbitrarily nested arrays into a single level.

```text
Input:  [1, 2, 3, [4, [5, 6]], 7, 8]
Output: [1, 2, 3, 4, 5, 6, 7, 8]
```

<details>
<summary>Answer</summary>

**Key insight:** for each element, if it is an array, flatten it and spread the result. Otherwise keep it. Pass the accumulator as a parameter instead of relying on a global so the function is reusable.

**Complexity:** O(total elements) time.

```js
function flattenArray(arr, result = []) {
  for (const item of arr) {
    if (Array.isArray(item)) flattenArray(item, result);
    else result.push(item);
  }
  return result;
}
```

**One-liner with reduce:**

```js
const flatten = (arr) =>
  arr.reduce((acc, item) => acc.concat(Array.isArray(item) ? flatten(item) : item), []);
```

Interview follow-up: `Array.prototype.flat(Infinity)` does this natively. Know it exists and know why they asked you not to use it.

</details>
