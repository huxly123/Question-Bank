# Binary Search

Read the problem, decide the pattern and sketch the approach in your head, then expand **Answer** to check. Code blocks are complete functions you can copy as-is.

All of these use the same skeleton: `while (l <= r)`, `mid = floor((l + r) / 2)`, decide which half is useless and throw it away. The skill is choosing the *condition* that identifies the useless half.

## 1. Lower Bound

Given a sorted array and a target `k`, return the smallest index whose element is **greater than or equal to** `k`. If none, return the array length.

```text
Input:  arr = [2, 4, 6, 8, 8, 8, 11, 13], k = 8
Output: 3        // first 8

Input:  arr = [3, 5, 8, 15, 19, 19, 19], k = 16
Output: 4        // 19 is the first element >= 16
```

<details>
<summary>Answer</summary>

**Pattern:** boundary binary search.

**Key insight:** whenever `arr[mid] >= k`, `mid` is a *candidate* answer, so record it and keep searching left for an earlier one. Otherwise move right.

**Complexity:** O(log n) time, O(1) space.

```js
function lowerBound(arr, k) {
  let l = 0;
  let r = arr.length - 1;
  let ans = arr.length;

  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (arr[mid] >= k) {
      ans = mid;
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }
  return ans;
}
```

</details>

## 2. Upper Bound

Given a sorted array and a target `k`, return the smallest index whose element is **strictly greater than** `k`. If none, return the array length.

```text
Input:  arr = [2, 4, 6, 8, 8, 8, 11, 13], k = 8
Output: 6        // 11 is the first element > 8

Input:  arr = [2, 3, 6, 7, 8, 8, 11, 11, 11, 12], k = 11
Output: 9
```

<details>
<summary>Answer</summary>

**Pattern:** boundary binary search.

**Key insight:** identical to lower bound with `>` instead of `>=`. Lower bound and upper bound together bracket every occurrence of `k`: count = `upper - lower`.

**Complexity:** O(log n) time, O(1) space.

```js
function upperBound(arr, k) {
  let l = 0;
  let r = arr.length - 1;
  let ans = arr.length;

  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (arr[mid] > k) {
      ans = mid;
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }
  return ans;
}
```

</details>

## 3. First and Last Occurrence

Given a sorted array and a target `k`, return `[firstIndex, lastIndex]` of `k`, or `[-1, -1]` if it is absent.

```text
Input:  arr = [2, 4, 6, 8, 8, 8, 11, 13], k = 8
Output: [3, 5]

Input:  arr = [2, 4, 6, 8, 8, 8, 11, 13], k = 11
Output: [6, 6]
```

<details>
<summary>Answer</summary>

**Pattern:** lower bound + upper bound.

**Key insight:** first occurrence is the lower bound. Last occurrence is `upperBound - 1`. If the lower bound is out of range or does not hold `k`, the value is absent.

**Complexity:** O(log n) time, O(1) space.

```js
function firstAndLastOccurrence(arr, k) {
  const first = lowerBound(arr, k);
  if (first === arr.length || arr[first] !== k) return [-1, -1];
  return [first, upperBound(arr, k) - 1];
}

function lowerBound(arr, k) {
  let l = 0, r = arr.length - 1, ans = arr.length;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (arr[mid] >= k) { ans = mid; r = mid - 1; }
    else l = mid + 1;
  }
  return ans;
}

function upperBound(arr, k) {
  let l = 0, r = arr.length - 1, ans = arr.length;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (arr[mid] > k) { ans = mid; r = mid - 1; }
    else l = mid + 1;
  }
  return ans;
}
```

</details>

## 4. Search in Rotated Sorted Array

A sorted array of **distinct** elements has been rotated at an unknown pivot. Return the index of `target`, or -1.

```text
Input:  nums = [4, 5, 6, 1, 2], target = 1
Output: 3

Input:  nums = [4, 5, 6, 7, 0, 1, 2], target = 3
Output: -1
```

<details>
<summary>Answer</summary>

**Pattern:** identify the sorted half.

**Key insight:** after any rotation, at least one half around `mid` is still sorted. Check `nums[l] <= nums[mid]` to know which. If the target lies inside the sorted half's range, search there. Otherwise search the other half.

**Complexity:** O(log n) time, O(1) space.

```js
function search(nums, target) {
  let l = 0;
  let r = nums.length - 1;

  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) return mid;

    if (nums[l] <= nums[mid]) {
      // left half is sorted
      if (nums[l] <= target && target < nums[mid]) r = mid - 1;
      else l = mid + 1;
    } else {
      // right half is sorted
      if (nums[mid] < target && target <= nums[r]) l = mid + 1;
      else r = mid - 1;
    }
  }
  return -1;
}
```

</details>

## 5. Search in Rotated Sorted Array II (with duplicates)

Same as above, but the array **may contain duplicates**. Return `true` if `target` is present.

```text
Input:  nums = [3, 1, 2, 3, 3, 3, 3], target = 2
Output: true

Input:  nums = [3, 1, 2, 3, 3, 3, 3], target = 4
Output: false
```

<details>
<summary>Answer</summary>

**Pattern:** identify the sorted half, with a tie-break for duplicates.

**Key insight:** when `nums[l] === nums[mid] === nums[r]` you cannot tell which half is sorted, so shrink both ends by one and retry. Everything else is the distinct-element algorithm.

**Complexity:** O(log n) average, O(n) worst case when the array is mostly one repeated value. O(1) space.

```js
function searchWithDuplicates(nums, target) {
  let l = 0;
  let r = nums.length - 1;

  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) return true;

    if (nums[l] === nums[mid] && nums[mid] === nums[r]) {
      l++;
      r--;
      continue;
    }

    if (nums[l] <= nums[mid]) {
      if (nums[l] <= target && target < nums[mid]) r = mid - 1;
      else l = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[r]) l = mid + 1;
      else r = mid - 1;
    }
  }
  return false;
}
```

</details>

## 6. Minimum in Rotated Sorted Array

A sorted array rotated at an unknown pivot. Return the minimum element.

```text
Input:  arr = [5, 6, 1, 2, 3, 4]
Output: 1

Input:  arr = [1, 2, 3, 4]
Output: 1

Input:  arr = [2, 1]
Output: 1
```

<details>
<summary>Answer</summary>

**Pattern:** identify the sorted half, take its minimum, discard it.

**Key insight:** the minimum of a sorted half is its leftmost element. If the left half is sorted, `arr[l]` is a candidate and the answer (if smaller) must be on the right. Otherwise `arr[mid]` is a candidate and the answer is on the left.

**Complexity:** O(log n) time, O(1) space.

```js
function findMin(arr) {
  let l = 0;
  let r = arr.length - 1;
  let ans = Number.MAX_SAFE_INTEGER;

  while (l <= r) {
    const mid = Math.floor((l + r) / 2);

    if (arr[l] <= arr[mid]) {
      // left half sorted, its min is arr[l]
      ans = Math.min(ans, arr[l]);
      l = mid + 1;
    } else {
      // right half sorted, its min is arr[mid]
      ans = Math.min(ans, arr[mid]);
      r = mid - 1;
    }
  }
  return ans;
}
```

</details>

## 7. Find How Many Times the Array Is Rotated

A sorted array of distinct elements rotated `k` times to the right. Return `k`.

```text
Input:  arr = [4, 5, 6, 1, 2, 3]
Output: 3

Input:  arr = [5, 6, 7, 8, 1, 2, 3, 4]
Output: 4
```

<details>
<summary>Answer</summary>

**Pattern:** same as "minimum in rotated sorted array", but track the index.

**Key insight:** the number of rotations equals the **index of the minimum element**. Run the minimum search and remember where the minimum lives.

**Complexity:** O(log n) time, O(1) space.

```js
function countRotations(arr) {
  let l = 0;
  let r = arr.length - 1;
  let minValue = Number.MAX_SAFE_INTEGER;
  let minIndex = 0;

  while (l <= r) {
    const mid = Math.floor((l + r) / 2);

    if (arr[l] <= arr[mid]) {
      if (arr[l] < minValue) {
        minValue = arr[l];
        minIndex = l;
      }
      l = mid + 1;
    } else {
      if (arr[mid] < minValue) {
        minValue = arr[mid];
        minIndex = mid;
      }
      r = mid - 1;
    }
  }
  return minIndex;
}
```

</details>

## 8. Find Peak Element

A peak is strictly greater than both neighbours. Treat out-of-bounds as `-∞`. Return the index of **any** peak in O(log n).

```text
Input:  nums = [1, 2, 3, 1]
Output: 2

Input:  nums = [1, 2, 1, 3, 5, 6, 4]
Output: 5        // index 1 is also a valid answer
```

<details>
<summary>Answer</summary>

**Pattern:** binary search on slope.

**Key insight:** if `nums[mid] < nums[mid + 1]` you are on an upward slope, so a peak must exist to the right. Otherwise one must exist to the left (or at `mid`). Handle length 1 and the two edges up front so `mid - 1` and `mid + 1` are always in range.

**Complexity:** O(log n) time, O(1) space.

```js
function findPeakElement(nums) {
  const n = nums.length;
  if (n === 1) return 0;
  if (nums[0] > nums[1]) return 0;
  if (nums[n - 1] > nums[n - 2]) return n - 1;

  let l = 1;
  let r = n - 2;

  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] > nums[mid - 1] && nums[mid] > nums[mid + 1]) return mid;
    if (nums[mid] > nums[mid - 1]) l = mid + 1;  // climbing, peak is right
    else r = mid - 1;                             // descending, peak is left
  }
  return -1;
}
```

</details>
