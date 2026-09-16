# DSA — Problem Tracker

**Progress: 34 / 146 done (23%)**

`███████░░░░░░░░░░░░░░░░░░░░░░░` 23%

Ticked items link to the write-up in the topic note. Open items are still to do.

Merged from the [Namaste DSA Sheet](https://namastedev.com/namaste-dsa-sheet) (spine, trimmed) and [Blind 75](https://takeuforward.org/dsa/blind-75-leetcode-problems-detailed-video-solutions) (gap-fillers, marked **B75**). On solved items, **N** = Namaste, **B75** = Blind 75, no tag = neither. Work the sections in order: each builds on the one before. ⭐ marks the sections that come up most in frontend interview loops.

When you solve one, write it up in the matching topic note (`array.md`, `binary-search.md`, `recursion.md`, `stack-queue.md`, `string.md`, `sliding-window.md`; format at the end of this file), tick it here, turn the name into a link to that section, append the pattern after a dash, then run `node progress.js` from the repo root to refresh the counts and bars.

## Sections

_0 / 0 · `░░░░░░░░░░` 0%_

| # | Section | Solved | Progress |
| --- | --- | --- | --- |
| 1 | [Arrays](#1-arrays) | 9 / 15 | `██████░░░░` 60% |
| 2 | [Two Pointers & Sliding Window ⭐](#2-two-pointers--sliding-window) | 5 / 10 | `█████░░░░░` 50% |
| 3 | [Strings ⭐](#3-strings) | 1 / 10 | `█░░░░░░░░░` 10% |
| 4 | [Stack & Queues ⭐](#4-stack--queues) | 3 / 8 | `████░░░░░░` 38% |
| 5 | [Binary Search](#5-binary-search) | 8 / 12 | `███████░░░` 67% |
| 6 | [Recursion](#6-recursion) | 8 / 8 | `██████████` 100% |
| 7 | [Linked List ⭐](#7-linked-list) | 0 / 12 | `░░░░░░░░░░` 0% |
| 8 | [Binary Tree ⭐](#8-binary-tree) | 0 / 16 | `░░░░░░░░░░` 0% |
| 9 | [Binary Search Tree](#9-binary-search-tree) | 0 / 4 | `░░░░░░░░░░` 0% |
| 10 | [Trie (all B75)](#10-trie) | 0 / 2 | `░░░░░░░░░░` 0% |
| 11 | [Backtracking](#11-backtracking) | 0 / 7 | `░░░░░░░░░░` 0% |
| 12 | [Heap](#12-heap) | 0 / 5 | `░░░░░░░░░░` 0% |
| 13 | [Greedy & Intervals](#13-greedy--intervals) | 0 / 10 | `░░░░░░░░░░` 0% |
| 14 | [Dynamic Programming](#14-dynamic-programming) | 0 / 12 | `░░░░░░░░░░` 0% |
| 15 | [Graphs](#15-graphs) | 0 / 9 | `░░░░░░░░░░` 0% |
| 16 | [Bit Manipulation (all B75)](#16-bit-manipulation) | 0 / 3 | `░░░░░░░░░░` 0% |
| 17 | [Matrix (all B75)](#17-matrix) | 0 / 3 | `░░░░░░░░░░` 0% |

## 1. Arrays

_9 / 15 · `██████░░░░` 60%_

- [x] [Best Time to Buy and Sell Stock](array.md#1-best-time-to-buy-and-sell-stock) — Running minimum (N, B75)
- [x] [Container With Most Water](array.md#2-container-with-most-water) — Two pointers (N, B75)
- [x] [Find Duplicates](array.md#3-find-duplicates) — Frequency map
- [x] [Two Sum (Key Pair)](array.md#4-two-sum-key-pair) — Hash set of complements (N, B75)
- [x] [Maximum Subarray](array.md#5-maximum-subarray-kadanes-algorithm) — Kadane (N, B75)
- [x] [Maximum Product Subarray](array.md#6-maximum-product-subarray) — Prefix and suffix product (N, B75)
- [x] [Product of Array Except Self](array.md#7-product-of-array-except-self) — Prefix and suffix product (B75)
- [x] [Rotate Array by K Steps](array.md#8-rotate-array-by-k-steps) — Three reversals
- [x] [Trapping Rain Water](array.md#9-trapping-rain-water) — Prefix max, two pointers (N)
- [ ] Remove Duplicates from Sorted Array
- [ ] Merge Sorted Arrays
- [ ] Move Zeroes
- [ ] Missing Number
- [ ] Single Number
- [ ] Longest Consecutive Sequence **B75**

## 2. Two Pointers & Sliding Window

_5 / 10 · `█████░░░░░` 50%_

- [x] [Maximum Sum Subarray of Size K](sliding-window.md#1-maximum-sum-subarray-of-size-k) — Fixed window
- [x] [Longest Substring Without Repeating Characters](sliding-window.md#2-longest-substring-without-repeating-characters) — Variable window + last-seen map (N, B75)
- [x] [Max Consecutive Ones III](sliding-window.md#3-max-consecutive-ones-iii) — Variable window with budget (N, listed as Arrays: Max Consecutive Ones)
- [x] [Alternating Groups](sliding-window.md#4-alternating-groups-circular) — Circular window
- [x] [3Sum](sliding-window.md#5-3sum-triplets-summing-to-zero) — Sort + two pointers (N, B75)
- [ ] Two Sum II (sorted input)
- [ ] Longest Repeating Character Replacement
- [ ] Permutation in String
- [ ] Minimum Window Substring **B75**
- [ ] Sliding Window Maximum (monotonic deque)

## 3. Strings

_1 / 10 · `█░░░░░░░░░` 10%_

- [x] [String to Integer (atoi)](string.md#1-string-to-integer-atoi) — Cursor parsing
- [ ] Valid Palindrome
- [ ] Longest Common Prefix
- [ ] Valid Anagram
- [ ] Isomorphic Strings
- [ ] Group Anagrams
- [ ] Minimum Add to Make Parentheses Valid
- [ ] Reverse Words in a String
- [ ] Decode String
- [ ] Encode and Decode Strings **B75**

## 4. Stack & Queues

_3 / 8 · `████░░░░░░` 38%_

- [x] [Valid Parentheses](stack-queue.md#1-valid-parentheses) — Stack matching (N, B75)
- [x] [Next Greater Element](stack-queue.md#2-next-greater-element) — Monotonic stack (N)
- [x] [Daily Temperatures](stack-queue.md#3-daily-temperatures) — Monotonic stack of indices (N)
- [ ] Implement Queue using Stacks
- [ ] Min Stack
- [ ] Evaluate Reverse Polish Notation
- [ ] Next Greater Element II (circular)
- [ ] Rotting Oranges (BFS on a grid)

## 5. Binary Search

_8 / 12 · `███████░░░` 67%_

- [x] [Lower Bound](binary-search.md#1-lower-bound) — Boundary binary search (N, listed as Foundation: Binary Search)
- [x] [Upper Bound](binary-search.md#2-upper-bound) — Boundary binary search (N, listed as Foundation: Binary Search)
- [x] [First and Last Occurrence](binary-search.md#3-first-and-last-occurrence) — Lower + upper bound (N)
- [x] [Search in Rotated Sorted Array](binary-search.md#4-search-in-rotated-sorted-array) — Identify sorted half (N, B75)
- [x] [Search in Rotated Sorted Array II](binary-search.md#5-search-in-rotated-sorted-array-ii-with-duplicates) — Sorted half + duplicate tie-break
- [x] [Minimum in Rotated Sorted Array](binary-search.md#6-minimum-in-rotated-sorted-array) — Min of sorted half (N, B75)
- [x] [Count Rotations](binary-search.md#7-find-how-many-times-the-array-is-rotated) — Index of minimum
- [x] [Find Peak Element](binary-search.md#8-find-peak-element) — Binary search on slope (N)
- [ ] Sqrt(x)
- [ ] First Bad Version
- [ ] Single Element in a Sorted Array
- [ ] Find K Closest Elements

## 6. Recursion

_8 / 8 · `██████████` 100%_

- [x] [Print a Name N Times](recursion.md#1-print-a-name-n-times) — Base case + decrement
- [x] [Print 1 to N, N to 1](recursion.md#2-print-1-to-n-and-n-to-1) — Parameter vs backtracking
- [x] [Power, Sum, Product](recursion.md#3-power-sum-of-array-product-of-array) — Head + recurse on rest
- [x] [Reverse a String](recursion.md#4-reverse-a-string) — Recurse on tail (N, listed as Arrays: Reverse String)
- [x] [Reverse an Array](recursion.md#5-reverse-an-array) — Recursive two pointers
- [x] [Palindrome Check](recursion.md#6-palindrome-check) — Recursive two pointers
- [x] [Fibonacci](recursion.md#7-fibonacci) — Two base cases, memoisation
- [x] [Flatten a Nested Array](recursion.md#8-flatten-a-nested-array) — Recurse into arrays

## 7. Linked List

_0 / 12 · `░░░░░░░░░░` 0%_

- [ ] Design Linked List
- [ ] Middle of the Linked List
- [ ] Reverse Linked List
- [ ] Linked List Cycle
- [ ] Palindrome Linked List
- [ ] Intersection of Two Linked Lists
- [ ] Remove Nth Node From End of List
- [ ] Add Two Numbers
- [ ] Merge Two Sorted Lists
- [ ] Swap Nodes in Pairs
- [ ] Reorder List **B75**
- [ ] Merge K Sorted Lists **B75**

## 8. Binary Tree

_0 / 16 · `░░░░░░░░░░` 0%_

- [ ] Preorder, Inorder, Postorder Traversal (recursive and iterative)
- [ ] Level Order Traversal
- [ ] Maximum Depth of Binary Tree
- [ ] Path Sum
- [ ] Symmetric Tree
- [ ] Invert Binary Tree
- [ ] Same Tree
- [ ] Balanced Binary Tree
- [ ] Diameter of Binary Tree
- [ ] Zigzag Level Order Traversal
- [ ] Subtree of Another Tree
- [ ] Lowest Common Ancestor of a Binary Tree
- [ ] Binary Tree Right Side View
- [ ] Binary Tree Maximum Path Sum
- [ ] Construct Binary Tree from Preorder and Inorder Traversal **B75**
- [ ] Serialize and Deserialize Binary Tree **B75**

## 9. Binary Search Tree

_0 / 4 · `░░░░░░░░░░` 0%_

- [ ] Validate Binary Search Tree
- [ ] Search in and Insert into a BST
- [ ] Kth Smallest Element in a BST
- [ ] Lowest Common Ancestor of a BST

## 10. Trie

_0 / 2 · `░░░░░░░░░░` 0%_

- [ ] Implement Trie (Prefix Tree)
- [ ] Design Add and Search Words Data Structure

## 11. Backtracking

_0 / 7 · `░░░░░░░░░░` 0%_

- [ ] Subsets (the power set)
- [ ] Permutations
- [ ] Combination Sum
- [ ] Combination Sum II
- [ ] Letter Combinations of a Phone Number
- [ ] Palindrome Partitioning
- [ ] Word Search

## 12. Heap

_0 / 5 · `░░░░░░░░░░` 0%_

- [ ] Kth Largest Element in an Array
- [ ] Kth Largest Element in a Stream
- [ ] Last Stone Weight
- [ ] Top K Frequent Elements
- [ ] Find Median from Data Stream **B75**

## 13. Greedy & Intervals

_0 / 10 · `░░░░░░░░░░` 0%_

- [ ] Assign Cookies
- [ ] Best Time to Buy and Sell Stock II
- [ ] Insert Interval
- [ ] Merge Intervals
- [ ] Non-overlapping Intervals
- [ ] Meeting Rooms **B75**
- [ ] Meeting Rooms II **B75**
- [ ] Partition Labels
- [ ] Task Scheduler
- [ ] Gas Station

## 14. Dynamic Programming

_0 / 12 · `░░░░░░░░░░` 0%_

- [ ] Climbing Stairs
- [ ] House Robber
- [ ] House Robber II
- [ ] Coin Change
- [ ] Longest Palindromic Substring
- [ ] Decode Ways
- [ ] Word Break
- [ ] Longest Increasing Subsequence
- [ ] Longest Common Subsequence **B75**
- [ ] Partition Equal Subset Sum
- [ ] Unique Paths
- [ ] Jump Game

## 15. Graphs

_0 / 9 · `░░░░░░░░░░` 0%_

- [ ] Find if Path Exists in Graph
- [ ] Clone Graph
- [ ] Detect Cycle in Undirected Graph
- [ ] Topological Sort (DFS)
- [ ] Course Schedule **B75**
- [ ] Number of Islands **B75**
- [ ] Pacific Atlantic Water Flow **B75**
- [ ] Graph Valid Tree **B75**
- [ ] Number of Connected Components in an Undirected Graph **B75**

## 16. Bit Manipulation

_0 / 3 · `░░░░░░░░░░` 0%_

- [ ] Number of 1 Bits
- [ ] Counting Bits
- [ ] Reverse Bits

## 17. Matrix

_0 / 3 · `░░░░░░░░░░` 0%_

- [ ] Set Matrix Zeroes
- [ ] Spiral Matrix
- [ ] Rotate Image

## Patterns cheat sheet

_0 / 0 · `░░░░░░░░░░` 0%_

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

## Format for a new problem

_0 / 0 · `░░░░░░░░░░` 0%_

Same rules as [template.md](../template.md): the heading is the prompt, the answer is collapsed.

~~~md
## N. Problem Title

_0 / 0 · `░░░░░░░░░░` 0%_

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
