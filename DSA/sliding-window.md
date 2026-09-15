# Two Pointers and Sliding Window

Read the problem, decide the pattern and sketch the approach in your head, then expand **Answer** to check. Code blocks are complete functions you can copy as-is.

Two flavours to recognise:

- **Fixed window:** the size `k` is given. Slide by adding the new right element and removing the old left one.
- **Variable window:** grow `r` until a constraint breaks, then shrink `l` until it holds again. Track the best window seen.

## 1. Maximum Sum Subarray of Size K

Return the largest sum of any contiguous subarray of exactly length `k`.

```text
Input:  arr = [1, 2, 3, 4, -5], k = 2
Output: 7        // [3, 4]
```

<details>
<summary>Answer</summary>

**Pattern:** fixed-size sliding window.

**Key insight:** compute the first window's sum, then for each slide subtract the element leaving on the left and add the one entering on the right. No inner loop.

**Complexity:** O(n) time, O(1) space.

```js
function maxSumSubarrayOfSizeK(arr, k) {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];

  let maxSum = windowSum;
  for (let r = k; r < arr.length; r++) {
    windowSum += arr[r] - arr[r - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
```

</details>

## 2. Longest Substring Without Repeating Characters

Return the length of the longest substring with all distinct characters.

```text
Input:  "abcabcbb"    Output: 3     // "abc"
Input:  "aabaab!bb"   Output: 3     // "ab!"
Input:  "bbbbb"       Output: 1
```

<details>
<summary>Answer</summary>

**Pattern:** variable sliding window + last-seen map.

**Key insight:** store the last index of every character. When the current character was last seen **inside** the window (`lastSeen >= l`), jump `l` to one past that index. Never move `l` backwards, which is why the `>= l` check matters.

**Complexity:** O(n) time, O(min(n, alphabet)) space.

```js
function lengthOfLongestSubstring(s) {
  const lastSeen = {};
  let l = 0;
  let max = 0;

  for (let r = 0; r < s.length; r++) {
    if (lastSeen[s[r]] !== undefined && lastSeen[s[r]] >= l) {
      l = lastSeen[s[r]] + 1;
    }
    lastSeen[s[r]] = r;
    max = Math.max(max, r - l + 1);
  }
  return max;
}
```

</details>

## 3. Max Consecutive Ones III

Given a binary array and `k`, return the longest run of 1s you can get by flipping at most `k` zeros.

```text
Input:  nums = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], k = 2
Output: 6        // flip the two zeros at indices 4 and 5
```

<details>
<summary>Answer</summary>

**Pattern:** variable sliding window with a budget.

**Key insight:** reframe as "longest window containing at most `k` zeros". Grow `r`, count zeros. When the count exceeds `k`, shrink `l` until it is back within budget. Every time the window is valid, it is a candidate.

**Complexity:** O(n) time, O(1) space.

```js
function longestOnes(nums, k) {
  let l = 0;
  let zeros = 0;
  let max = 0;

  for (let r = 0; r < nums.length; r++) {
    if (nums[r] === 0) zeros++;

    while (zeros > k) {
      if (nums[l] === 0) zeros--;
      l++;
    }

    max = Math.max(max, r - l + 1);
  }
  return max;
}
```

</details>

## 4. Alternating Groups (Circular)

`colors[]` is a circle of tiles (0 = red, 1 = blue). An alternating group is `k` contiguous tiles in the circle whose colours alternate. Count them.

```text
Input:  colors = [0, 1, 0, 1, 0], k = 3        Output: 3
Input:  colors = [0, 1, 0, 0, 1, 0, 1], k = 6  Output: 2
Input:  colors = [1, 1, 0, 1], k = 4           Output: 0
```

<details>
<summary>Answer</summary>

**Pattern:** sliding window over a circular array using modulo indexing.

**Key insight:** iterate `i` from 1 to `n + k - 2` and read `colors[i % n]` so the window wraps around. Track the current alternating run length. Reset to 1 whenever two neighbours match. Every position where the run is at least `k` ends one valid group.

**Complexity:** O(n + k) time, O(1) space.

```js
function numberOfAlternatingGroups(colors, k) {
  const n = colors.length;
  let count = 0;
  let run = 1;

  for (let i = 1; i < n + k - 1; i++) {
    if (colors[i % n] !== colors[(i - 1) % n]) run++;
    else run = 1;

    if (run >= k) count++;
  }
  return count;
}
```

</details>

## 5. 3Sum (Triplets Summing to Zero)

Return all **unique** triplets `[a, b, c]` from the array with `a + b + c === 0`.

```text
Input:  arr = [0, -1, 2, -3, 1]
Output: [[-3, 1, 2], [-1, 0, 1]]

Input:  arr = [3, 0, -2, -1, 1, 2]
Output: [[-2, -1, 3], [-2, 0, 2], [-1, 0, 1]]
```

<details>
<summary>Answer</summary>

**Pattern:** sort + fix one element + two pointers.

**Key insight:** sort first. Fix `i`, then run two pointers `j = i + 1` and `k = n - 1` on the rest. Sum too small → move `j` right. Too big → move `k` left. Equal → record it and move both. Skip duplicate values at all three positions to keep triplets unique.

**Complexity:** O(n²) time, O(1) extra space (excluding output). Brute force with three nested loops is O(n³).

```js
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const res = [];

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // skip duplicate i

    let j = i + 1;
    let k = n - 1;

    while (j < k) {
      const sum = nums[i] + nums[j] + nums[k];

      if (sum < 0) {
        j++;
      } else if (sum > 0) {
        k--;
      } else {
        res.push([nums[i], nums[j], nums[k]]);
        j++;
        k--;
        while (j < k && nums[j] === nums[j - 1]) j++; // skip duplicate j
        while (j < k && nums[k] === nums[k + 1]) k--; // skip duplicate k
      }
    }
  }
  return res;
}
```

**Intermediate approach, O(n²) time and O(n) space:** fix `i`, then for each `j` look up `-(nums[i] + nums[j])` in a set of elements seen between `i` and `j`. Simpler to derive under pressure, but needs a set of sorted triplets to dedupe.

```js
function threeSumHashing(nums) {
  const n = nums.length;
  const found = new Set();
  const res = [];

  for (let i = 0; i < n; i++) {
    const seen = new Set();
    for (let j = i + 1; j < n; j++) {
      const third = -(nums[i] + nums[j]);
      if (seen.has(third)) {
        const triplet = [nums[i], nums[j], third].sort((a, b) => a - b);
        const key = triplet.join(",");
        if (!found.has(key)) {
          found.add(key);
          res.push(triplet);
        }
      }
      seen.add(nums[j]);
    }
  }
  return res;
}
```

</details>
