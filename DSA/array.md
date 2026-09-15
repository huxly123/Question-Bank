# Array

Read the problem, decide the pattern and sketch the approach in your head, then expand **Answer** to check. Code blocks are complete functions you can copy as-is.

## 1. Best Time to Buy and Sell Stock

Given `prices[]` where `prices[i]` is the stock price on day `i`, find the maximum profit from **at most one** buy and one later sell. Return 0 if no profit is possible.

```text
Input:  prices = [7, 1, 5, 3, 6, 4]
Output: 5        // buy at 1 (day 2), sell at 6 (day 5)
```

<details>
<summary>Answer</summary>

**Pattern:** single pass, track running minimum.

**Key insight:** the best sell on day `i` always pairs with the cheapest price seen *before* `i`. Carry the running minimum and the running best difference.

**Complexity:** O(n) time, O(1) space.

```js
function maxProfit(prices) {
  let minPrice = prices[0];
  let maxProfit = 0;

  for (let i = 1; i < prices.length; i++) {
    maxProfit = Math.max(maxProfit, prices[i] - minPrice);
    minPrice = Math.min(minPrice, prices[i]);
  }
  return maxProfit;
}
```

</details>

## 2. Container With Most Water

Given `height[]`, where each value is a vertical line at index `i`, pick two lines that together with the x-axis hold the most water. Area = `(j - i) * min(height[i], height[j])`.

```text
Input:  height = [1, 5, 4, 3]
Output: 6        // lines 5 and 3, width 2, height min(5,3) = 3

Input:  height = [3, 1, 2, 4, 5]
Output: 12       // lines 3 and 5, width 4, height 3
```

<details>
<summary>Answer</summary>

**Pattern:** two pointers from both ends.

**Key insight:** area is limited by the shorter line. Moving the taller pointer inward can only shrink width without raising the limit, so always move the **shorter** one.

**Complexity:** O(n) time, O(1) space. Brute force is O(n²).

```js
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let max = 0;

  while (left < right) {
    const area = (right - left) * Math.min(height[left], height[right]);
    max = Math.max(max, area);

    if (height[left] < height[right]) left++;
    else right--;
  }
  return max;
}
```

</details>

## 3. Find Duplicates

Given an array of `n` elements with values in `0..n-1`, return every value that appears more than once, each reported once, in sorted order.

```text
Input:  arr = [1, 2, 3, 6, 3, 6, 1]
Output: [1, 3, 6]
```

<details>
<summary>Answer</summary>

**Pattern:** hashing (frequency map).

**Key insight:** count occurrences, then keep the keys whose count is greater than 1. Push on the *second* sighting so each duplicate is reported once.

**Complexity:** O(n log n) because of the final sort, O(n) space. (An O(1)-space variant marks visited indices by negating `arr[arr[i]]`, valid because values are in `0..n-1`.)

```js
function findDuplicates(arr) {
  const seen = {};
  const result = [];

  for (const num of arr) {
    seen[num] = (seen[num] || 0) + 1;
    if (seen[num] === 2) result.push(num);
  }
  return result.sort((a, b) => a - b);
}
```

</details>

## 4. Two Sum (Key Pair)

Given `arr[]` of positive integers and a target `x`, determine whether any two elements sum to exactly `x`.

```text
Input:  arr = [1, 4, 45, 6, 10, 8], x = 16
Output: true     // 6 + 10
```

<details>
<summary>Answer</summary>

**Pattern:** hash map lookup of the complement.

**Key insight:** for each element ask "have I already seen `x - current`?" Store what you have seen as you go, so each element is checked against everything before it in O(1).

**Complexity:** O(n) time, O(n) space.

```js
function hasPairWithSum(arr, x) {
  const seen = new Set();

  for (const num of arr) {
    if (seen.has(x - num)) return true;
    seen.add(num);
  }
  return false;
}
```

</details>

## 5. Maximum Subarray (Kadane's Algorithm)

Find the contiguous subarray with the largest sum and return that sum.

```text
Input:  arr = [-2, -3, 4, -1, -2, 1, 5, -3]
Output: 7        // subarray [4, -1, -2, 1, 5]

Input:  arr = [5, 4, 1, 7, 8]
Output: 25       // whole array
```

<details>
<summary>Answer</summary>

**Pattern:** Kadane's algorithm (running sum with reset).

**Key insight:** a negative running sum can never help a later subarray, so drop it and start fresh at 0. Update the best answer *before* resetting so all-negative arrays still return the largest single element.

**Complexity:** O(n) time, O(1) space.

```js
function maxSubArray(nums) {
  let maxSum = Number.MIN_SAFE_INTEGER;
  let currentSum = 0;

  for (const num of nums) {
    currentSum += num;
    maxSum = Math.max(maxSum, currentSum);
    if (currentSum < 0) currentSum = 0;
  }
  return maxSum;
}
```

</details>

## 6. Maximum Product Subarray

Given an array with positive and negative integers (and zeros), find the largest product of any contiguous subarray.

```text
Input:  arr = [6, -3, -10, 0, 2]
Output: 180      // subarray [6, -3, -10]

Input:  arr = [-1, -3, -10, 0, 60]
Output: 60       // subarray [60]
```

<details>
<summary>Answer</summary>

**Pattern:** prefix and suffix products with reset on zero.

**Key insight:** work through the cases:
- no negatives → whole array is the answer
- even number of negatives → whole array is the answer
- odd number of negatives → the best product excludes either the first or the last negative, so a left-to-right prefix product and a right-to-left suffix product together cover both
- a zero breaks the subarray, so reset that running product to 1

**Complexity:** O(n) time, O(1) space.

```js
function maxProduct(arr) {
  const n = arr.length;
  let prefix = 1;
  let suffix = 1;
  let max = Number.MIN_SAFE_INTEGER;

  for (let i = 0; i < n; i++) {
    const fromLeft = arr[i];
    const fromRight = arr[n - 1 - i];

    prefix = fromLeft === 0 ? 1 : prefix * fromLeft;
    suffix = fromRight === 0 ? 1 : suffix * fromRight;

    // a zero is itself a subarray with product 0, so compare against 0 there
    max = Math.max(max, fromLeft === 0 ? 0 : prefix, fromRight === 0 ? 0 : suffix);
  }
  return max;
}
```

</details>

## 7. Product of Array Except Self

Build `result[]` where `result[i]` is the product of every element except `arr[i]`. Do it in O(n) **without division**.

```text
Input:  arr = [10, 3, 5, 6, 2]
Output: [180, 600, 360, 300, 900]
```

<details>
<summary>Answer</summary>

**Pattern:** prefix and suffix products.

**Key insight:** the product of everything except `i` equals (product of everything left of `i`) × (product of everything right of `i`). One pass left-to-right fills the prefix products into `result`, a second pass right-to-left multiplies in the suffix products using a single running variable.

**Complexity:** O(n) time, O(1) extra space (output array not counted).

```js
function productExceptSelf(arr) {
  const n = arr.length;
  const result = new Array(n).fill(1);

  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= arr[i];
  }

  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= arr[i];
  }
  return result;
}
```

**Alternative (division allowed):** compute the total product while counting zeros. Two or more zeros → all zeros. Exactly one zero → only that index gets the product of the rest, everything else is 0. No zeros → `total / arr[i]`.

```js
function productExceptSelfWithDivision(arr) {
  let total = 1;
  let zeros = 0;
  for (const num of arr) {
    if (num === 0) zeros++;
    else total *= num;
  }

  if (zeros > 1) return arr.map(() => 0);
  if (zeros === 1) return arr.map((num) => (num === 0 ? total : 0));
  return arr.map((num) => total / num);
}
```

</details>

## 8. Rotate Array by K Steps

Rotate `nums` to the right by `k` steps in place. `k` may be larger than the array length.

```text
Input:  nums = [1, 2, 3, 4, 5, 6, 7], k = 3
Output: [5, 6, 7, 1, 2, 3, 4]

Input:  nums = [-1, -100, 3, 99], k = 2
Output: [3, 99, -1, -100]
```

<details>
<summary>Answer</summary>

**Pattern:** three reversals.

**Key insight:** reversing the whole array puts the last `k` elements at the front but in the wrong order. Reverse the first `k` and the remaining `n-k` separately to fix the order inside each block. Take `k % n` first so oversized `k` works.

**Complexity:** O(n) time, O(1) space.

```js
function rotate(nums, k) {
  const n = nums.length;
  k = k % n;

  const reverse = (start, end) => {
    while (start < end) {
      [nums[start], nums[end]] = [nums[end], nums[start]];
      start++;
      end--;
    }
  };

  reverse(0, n - 1);   // [7,6,5,4,3,2,1]
  reverse(0, k - 1);   // [5,6,7,4,3,2,1]
  reverse(k, n - 1);   // [5,6,7,1,2,3,4]
  return nums;
}
```

**Alternative (extra array):** `result[(i + k) % n] = nums[i]`. O(n) space but the simplest to explain.

```js
function rotateWithCopy(nums, k) {
  const n = nums.length;
  const result = new Array(n);
  for (let i = 0; i < n; i++) {
    result[(i + k) % n] = nums[i];
  }
  return result;
}
```

</details>

## 9. Trapping Rain Water

Given `height[]` as an elevation map where each bar has width 1, compute how much water it traps after rain.

```text
Input:  height = [3, 0, 1, 0, 4, 0, 2]
Output: 10

Input:  height = [3, 0, 2, 0, 4]
Output: 7        // 0 + 3 + 1 + 3 + 0

Input:  height = [1, 2, 3, 4]
Output: 0        // nothing bounds the water on the right

Input:  height = [2, 1, 5, 3, 1, 0, 4]
Output: 9        // 0 + 1 + 0 + 1 + 3 + 4 + 0
```

<details>
<summary>Answer</summary>

**Pattern:** prefix max and suffix max, or two pointers.

**Key insight:** water above bar `i` is `min(tallest bar to its left, tallest bar to its right) - height[i]`, clamped at 0. Precomputing the two "tallest so far" arrays turns the O(n²) brute force into O(n).

**Complexity:** O(n) time, O(n) space for the two arrays. Brute force recomputes both maxes per bar for O(n²) time.

```js
function trap(height) {
  const n = height.length;
  if (n === 0) return 0;

  const leftMax = new Array(n);
  const rightMax = new Array(n);

  leftMax[0] = height[0];
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], height[i]);
  }

  rightMax[n - 1] = height[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], height[i]);
  }

  let water = 0;
  for (let i = 0; i < n; i++) {
    water += Math.min(leftMax[i], rightMax[i]) - height[i];
  }
  return water;
}
```

**Two-pointer variant, O(1) space:** walk in from both ends and always advance the side with the smaller max, because that side's water level is already decided.

```js
function trapTwoPointer(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }
  return water;
}
```

</details>
