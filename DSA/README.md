# DSA

Solved problems in JavaScript, written as self-quizzing notes. Each problem shows the statement and examples, with the pattern, key insight, complexity, and code collapsed behind an **Answer** toggle. Code blocks are complete functions meant to be copied, not run from this repo.

See [TODO.md](../TODO.md#dsa--questions-to-practice) for the list still to practice.

## Notes by topic

| Note | Problems |
| --- | --- |
| [Array](array.md) | Buy/Sell Stock, Container With Most Water, Find Duplicates, Two Sum, Maximum Subarray, Maximum Product Subarray, Product Except Self, Rotate Array, Trapping Rain Water |
| [Binary Search](binary-search.md) | Lower Bound, Upper Bound, First/Last Occurrence, Search Rotated Array I and II, Minimum in Rotated Array, Count Rotations, Find Peak Element |
| [Recursion](recursion.md) | Print N times, 1..N and N..1, Power/Sum/Product, Reverse String, Reverse Array, Palindrome, Fibonacci, Flatten Array |
| [Stack and Queues](stack-queue.md) | Valid Parentheses, Next Greater Element, Daily Temperatures |
| [String](string.md) | String to Integer (atoi) |
| [Two Pointers and Sliding Window](sliding-window.md) | Max Sum Subarray of Size K, Longest Unique Substring, Max Consecutive Ones III, Alternating Groups, 3Sum |

## Patterns cheat sheet

Interviews test the technique, not the data structure. When a new problem appears, match it to one of these first.

| Pattern | Recognise it when | Problems |
| --- | --- | --- |
| **Running min/max in one pass** | "best pair where the first comes before the second" | [Buy/Sell Stock](array.md#1-best-time-to-buy-and-sell-stock) |
| **Kadane (running sum, reset when negative)** | "maximum sum contiguous subarray" | [Maximum Subarray](array.md#5-maximum-subarray-kadanes-algorithm) |
| **Prefix + suffix pass** | answer at `i` depends on everything left of `i` and everything right of `i` | [Product Except Self](array.md#7-product-of-array-except-self), [Trapping Rain Water](array.md#9-trapping-rain-water), [Maximum Product Subarray](array.md#6-maximum-product-subarray) |
| **Hash map / set lookup** | "does a complement exist", "has this been seen" | [Two Sum](array.md#4-two-sum-key-pair), [Find Duplicates](array.md#3-find-duplicates) |
| **Two pointers from both ends** | sorted input, or an area/width that shrinks as pointers move inward | [Container With Most Water](array.md#2-container-with-most-water), [3Sum](sliding-window.md#5-3sum-triplets-summing-to-zero), [Trapping Rain Water](array.md#9-trapping-rain-water) |
| **Reversal trick** | rotate or shift in place with O(1) space | [Rotate Array](array.md#8-rotate-array-by-k-steps) |
| **Fixed sliding window** | "subarray of exactly size k" | [Max Sum Subarray of Size K](sliding-window.md#1-maximum-sum-subarray-of-size-k), [Alternating Groups](sliding-window.md#4-alternating-groups-circular) |
| **Variable sliding window** | "longest/shortest subarray satisfying a constraint" | [Longest Unique Substring](sliding-window.md#2-longest-substring-without-repeating-characters), [Max Consecutive Ones III](sliding-window.md#3-max-consecutive-ones-iii) |
| **Boundary binary search** | first/last index satisfying a condition in sorted data | [Lower Bound](binary-search.md#1-lower-bound), [Upper Bound](binary-search.md#2-upper-bound), [First/Last Occurrence](binary-search.md#3-first-and-last-occurrence) |
| **Binary search on rotated array** | sorted but rotated; one half is always sorted | [Search Rotated I](binary-search.md#4-search-in-rotated-sorted-array), [Search Rotated II](binary-search.md#5-search-in-rotated-sorted-array-ii-with-duplicates), [Minimum](binary-search.md#6-minimum-in-rotated-sorted-array), [Count Rotations](binary-search.md#7-find-how-many-times-the-array-is-rotated) |
| **Binary search on slope / answer space** | O(log n) required but data is not sorted by value | [Find Peak Element](binary-search.md#8-find-peak-element) |
| **Monotonic stack** | "next greater/smaller element", "days until warmer" | [Next Greater Element](stack-queue.md#2-next-greater-element), [Daily Temperatures](stack-queue.md#3-daily-temperatures) |
| **Stack matching** | nested or paired structure | [Valid Parentheses](stack-queue.md#1-valid-parentheses) |
| **Cursor-based parsing** | convert a string through ordered phases with edge cases | [atoi](string.md#1-string-to-integer-atoi) |
| **Recursion: base case + smaller input** | "without loops", nested data, divide-and-conquer | [Recursion note](recursion.md) |

## Adding a problem

Follow the shape used in every note (see [template.md](../template.md) for the general rules):

~~~md
## N. Problem Title

One or two sentence statement.

```text
Input:  ...
Output: ...      // short explanation
```

<details>
<summary>Answer</summary>

**Pattern:** which row of the cheat sheet.

**Key insight:** the one sentence that unlocks it.

**Complexity:** O(?) time, O(?) space.

```js
function solution() {}
```

</details>
~~~

Then add the problem to the topic row above, and to the matching pattern row if it is a clean example of one.
