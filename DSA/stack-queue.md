# Stack and Queues

Read the problem, decide the pattern and sketch the approach in your head, then expand **Answer** to check. Code blocks are complete functions you can copy as-is.

## 1. Valid Parentheses

Given a string of only `()[]{}`, return whether every bracket is closed by the matching type in the correct order.

```text
Input:  "()[]{}"   Output: true
Input:  "([)]"     Output: false
Input:  "{[]}"     Output: true
Input:  "("        Output: false
```

<details>
<summary>Answer</summary>

**Pattern:** stack matching.

**Key insight:** push every opener. On a closer, the top of the stack must be its matching opener, so pop it. Any mismatch or an empty stack on a closer is invalid. A non-empty stack at the end means unclosed openers.

**Complexity:** O(n) time, O(n) space.

```js
function isValid(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];

  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}
```

</details>

## 2. Next Greater Element

For every element, find the first element to its right that is larger. Use -1 if none.

```text
Input:  [1, 3, 2, 4]        Output: [3, 4, 4, -1]
Input:  [6, 8, 0, 1, 3]     Output: [8, -1, 1, 3, -1]
Input:  [50, 40, 30, 10]    Output: [-1, -1, -1, -1]
```

<details>
<summary>Answer</summary>

**Pattern:** monotonic stack (decreasing), scanning right to left.

**Key insight:** walking from the right, the stack holds candidates for "next greater" in increasing order from top to bottom. Pop everything smaller than or equal to the current element, because the current element blocks them for anything further left. Whatever remains on top is the answer. Then push the current element.

**Complexity:** O(n) time, each element is pushed and popped at most once. O(n) space.

```js
function nextGreaterElement(arr) {
  const n = arr.length;
  const res = new Array(n).fill(-1);
  const stack = [];

  for (let i = n - 1; i >= 0; i--) {
    while (stack.length > 0 && stack[stack.length - 1] <= arr[i]) {
      stack.pop();
    }
    res[i] = stack.length > 0 ? stack[stack.length - 1] : -1;
    stack.push(arr[i]);
  }
  return res;
}
```

</details>

## 3. Daily Temperatures

Given `temperatures[]`, return `answer[]` where `answer[i]` is how many days you wait after day `i` for a warmer temperature, or 0 if none.

```text
Input:  [73, 74, 75, 71, 69, 72, 76, 73]
Output: [1, 1, 4, 2, 1, 1, 0, 0]

Input:  [30, 40, 50, 60]
Output: [1, 1, 1, 0]
```

<details>
<summary>Answer</summary>

**Pattern:** monotonic stack, but store **indices** instead of values.

**Key insight:** this is "next greater element" where the answer is a distance, not a value. Keep indices on the stack so the distance is `stackTopIndex - i`. The array itself gives you the value at any index, so you never need to store both.

**Complexity:** O(n) time, O(n) space.

```js
function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const res = new Array(n).fill(0);
  const stack = []; // indices, temperatures increasing from top to bottom

  for (let i = n - 1; i >= 0; i--) {
    while (stack.length > 0 && temperatures[stack[stack.length - 1]] <= temperatures[i]) {
      stack.pop();
    }
    if (stack.length > 0) res[i] = stack[stack.length - 1] - i;
    stack.push(i);
  }
  return res;
}
```

</details>
