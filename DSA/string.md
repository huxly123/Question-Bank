# String

Read the problem, decide the pattern and sketch the approach in your head, then expand **Answer** to check. Code blocks are complete functions you can copy as-is.

## 1. String to Integer (atoi)

Implement `myAtoi(s)` converting a string to a 32-bit signed integer:

1. Skip leading whitespace.
2. Read an optional `+` or `-`.
3. Read digits until a non-digit or the end. No digits → 0.
4. Clamp to `[-2³¹, 2³¹ - 1]`.

```text
Input:  "42"          Output: 42
Input:  "   -042"     Output: -42
Input:  "1337c0d3"    Output: 1337
Input:  "0-1"         Output: 0
Input:  "words 987"   Output: 0
Input:  "-91283472332" Output: -2147483648   // clamped
```

<details>
<summary>Answer</summary>

**Pattern:** parsing with a cursor and edge cases.

**Key insight:** walk one index `i` through the three phases in order. Build the number as `result * 10 + digit`. Check the clamp inside the digit loop, not after, so huge inputs bail out early and never overflow.

**Complexity:** O(n) time, O(1) space.

```js
function myAtoi(s) {
  const INT_MAX = 2 ** 31 - 1;
  const INT_MIN = -(2 ** 31);

  let i = 0;
  let sign = 1;
  let result = 0;

  // 1. leading whitespace
  while (i < s.length && s[i] === " ") i++;

  // 2. sign
  if (i < s.length && (s[i] === "+" || s[i] === "-")) {
    sign = s[i] === "-" ? -1 : 1;
    i++;
  }

  // 3. digits, clamping as we go
  while (i < s.length && s[i] >= "0" && s[i] <= "9") {
    result = result * 10 + Number(s[i]);
    if (sign * result > INT_MAX) return INT_MAX;
    if (sign * result < INT_MIN) return INT_MIN;
    i++;
  }

  return sign * result;
}
```

</details>
