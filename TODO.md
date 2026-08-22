# Topics To Study

Merged checklist of topics still to cover, grouped by area.

## JavaScript

- [ ] Strict mode in JavaScript
- [ ] Call stacks
- [ ] Execution context
- [ ] Jobs and priority queues
- [ ] Event loop
- [ ] Shadowing
- [ ] Memory management
- [ ] Method chaining
- [ ] Arrow functions vs normal functions
- [ ] Flattening an object
- [ ] Prototype chaining
- [ ] Callback hell
- [ ] async/await

## React

- [ ] Browser Object Model (BOM)
- [ ] Error boundaries
- [ ] Hooks
- [ ] Reference lifecycle events
- [ ] React patterns
- [ ] Redux and the Redux cycle
- [ ] Web apps
- [ ] React portal
- [ ] How the DOM is traversed
- [ ] Component lifecycle
- [ ] Class vs functional components
- [ ] CSRF and web security in React
- [ ] Interceptors
- [ ] React Fiber
- [ ] Lazy loading in React

## CSS

- [ ] Positioning in CSS
- [ ] Stacking context (priority between styles and classes)
- [ ] CSSOM

## HTML

- [ ] `<script>` async vs defer

## Build Tools

- [ ] Webpack
- [ ] Tree shaking
- [ ] Dependency graph
- [ ] What happens when you load www.google.com

## General / Browser

- [ ] Shared storage
- [ ] Service Worker API
- [ ] Web Workers
- [ ] DynamoDB
- [ ] Progressive Web Apps (PWAs)

## System Design

- [ ] Caching strategies (browser / CDN / API)
- [ ] Rate limiting
- [ ] WebSockets vs polling

### Performance (deep-dive topics)

**Network performance**
- [ ] HTTP/1 vs HTTP/2 vs HTTP/3
- [ ] DNS lookup
- [ ] TCP / TLS handshake
- [ ] Reduce network requests
- [ ] Request batching
- [ ] CDN usage
- [ ] Compression (Gzip / Brotli)
- [ ] Resource prioritization

**JavaScript performance**
- [ ] Reduce JavaScript bundle size
- [ ] Code splitting
- [ ] Dynamic imports
- [ ] Tree shaking
- [ ] Dead code elimination
- [ ] Lazy loading
- [ ] Web Workers
- [ ] Debounce
- [ ] Throttle
- [ ] Avoid large libraries

**Rendering performance**
- [ ] Reflow vs repaint
- [ ] Layout thrashing
- [ ] Reduce DOM manipulation
- [ ] Batch DOM updates
- [ ] Use DocumentFragment
- [ ] Virtualization / windowing
- [ ] Avoid forced synchronous layout

**React performance optimization**
- [ ] React.memo
- [ ] useMemo
- [ ] useCallback
- [ ] Lazy loading components
- [ ] Suspense
- [ ] State colocation
- [ ] Avoid unnecessary re-renders
- [ ] List virtualization

**Image optimization**
- [ ] Lazy-load images
- [ ] Responsive images
- [ ] Image compression
- [ ] Modern formats (WebP / AVIF)
- [ ] Proper image dimensions
- [ ] CDN image optimization

**CSS performance**
- [ ] Minify CSS
- [ ] Reduce CSS bundle size
- [ ] Avoid deep selectors
- [ ] Avoid layout thrashing
- [ ] Use GPU acceleration (transform / opacity)
- [ ] Critical CSS

**Caching strategies**
- [ ] Browser caching
- [ ] Cache-Control header
- [ ] ETag
- [ ] Last-Modified
- [ ] Service Worker caching
- [ ] Stale-while-revalidate

**Core Web Vitals**
- [x] [LCP (Largest Contentful Paint)](system-design/performance.md#2-lcp--largest-contentful-paint)
- [x] [CLS (Cumulative Layout Shift)](system-design/performance.md#3-cls--cumulative-layout-shift)
- [x] [INP (Interaction to Next Paint)](system-design/performance.md#4-inp--interaction-to-next-paint)
- [x] [FCP (First Contentful Paint)](system-design/performance.md#5-fcp--first-contentful-paint)
- [x] [TTFB (Time To First Byte)](system-design/performance.md#6-ttfb--time-to-first-byte)

**Resource loading optimization**
- [ ] Preload
- [ ] Prefetch
- [ ] Preconnect
- [ ] DNS prefetch
- [ ] Lazy-load scripts

**Build optimization**
- [ ] Bundle splitting
- [ ] Tree shaking
- [ ] Minification
- [ ] Bundle analyzer
- [ ] Remove unused code
- [ ] Optimize dependencies

**Performance monitoring**
- [ ] Chrome DevTools Performance tab
- [ ] Lighthouse audit
- [ ] WebPageTest
- [ ] Real User Monitoring (RUM)

**Large data rendering optimization**
- [ ] List virtualization
- [ ] Pagination
- [ ] Infinite scroll
- [ ] Server-side pagination

**Server / architecture-level performance**
- [ ] CDN edge caching
- [ ] Server-Side Rendering (SSR)
- [ ] Static Site Generation (SSG)
- [ ] Incremental Static Regeneration (ISR)
- [ ] Edge rendering

## DSA — Questions To Practice

### Array
- [ ] Find the factorial of a large number
- [ ] Chocolate Distribution Problem
- [ ] Insert Interval
- [ ] Merge Intervals
- [ ] Non-overlapping Intervals

### Bit Manipulation
- [ ] Number of 1 Bits
- [ ] Counting Bits
- [ ] Missing Number
- [ ] Reverse Bits
- [ ] Find XOR of all subsets of a set

### Dynamic Programming
- [ ] Count ways to reach the n'th stair
- [ ] Coin Change
- [ ] 0/1 Knapsack Problem
- [ ] Longest Increasing Subsequence
- [ ] Longest Common Subsequence
- [ ] Word Break Problem
- [ ] Dice Throw
- [ ] Egg Dropping Puzzle
- [ ] Matrix Chain Multiplication
- [ ] Combination Sum
- [ ] Subset Sum Problem
- [ ] Find maximum possible stolen value from houses
- [ ] Count possible decodings of a given digit sequence
- [ ] Unique paths in a grid with obstacles
- [ ] Jump Game
- [ ] Cutting a Rod
- [ ] Maximum Product Cutting
- [ ] Count number of ways to cover a distance

### Graph
- [ ] Clone Graph
- [ ] Course Schedule
- [ ] Pacific Atlantic Water Flow
- [ ] Number of Islands
- [ ] Longest Consecutive Sequence
- [ ] Snake and Ladder Problem
- [ ] Detect cycle in a directed graph
- [ ] Bridges in a graph
- [ ] Check whether a given graph is bipartite
- [ ] Find size of the largest region in a boolean matrix
- [ ] Flood Fill algorithm
- [ ] Strongly Connected Components
- [ ] Topological Sorting

### Heap
- [ ] Top K Frequent Elements
- [ ] Find Median from Data Stream
- [ ] Largest triplet product in a stream
- [ ] Connect n ropes with minimum cost

### Linked List
- [ ] Reverse a Linked List
- [ ] Detect Cycle in a Linked List
- [ ] Merge Two Sorted Lists
- [ ] Merge K Sorted Lists
- [ ] Remove Nth Node From End of List
- [ ] Reorder List
- [ ] Add 1 to a number represented as a linked list
- [ ] Find the middle of a given linked list
- [ ] Delete last occurrence of an item from a linked list

### Matrix
- [ ] Set Matrix Zeroes
- [ ] Spiral Matrix
- [ ] Transpose of a matrix
- [ ] Word Search

### Stack and Queues
- [ ] Convert infix expression to postfix expression
- [ ] Next Greater Element
- [ ] Delete middle element of a stack
- [ ] Check mirror in n-ary tree
- [ ] The Celebrity Problem
- [ ] Length of the longest valid substring
- [ ] Print right view of a binary tree
- [ ] Find the first circular tour that visits all petrol pumps

### String
- [ ] Longest Substring Without Repeating Characters
- [ ] Longest Repeating Character Replacement
- [ ] Smallest window in a string containing all characters of another string
- [ ] Check whether two strings are anagrams of each other
- [ ] Print all anagrams together
- [ ] Check if a given parentheses expression is balanced
- [ ] Sentence Palindrome
- [ ] Longest Palindromic Substring
- [ ] Palindromic Substrings
- [ ] Longest Common Prefix

### Tree
- [ ] Maximum Depth of Binary Tree
- [ ] Check if two trees have the same structure
- [ ] Invert/Flip Binary Tree
- [ ] Binary Tree Maximum Path Sum
- [ ] Binary Tree Level Order Traversal
- [ ] Serialize and Deserialize Binary Tree
- [ ] Subtree of Another Tree
- [ ] Construct Binary Tree from Preorder and Inorder Traversal
- [ ] Validate Binary Search Tree
- [ ] Kth Smallest Element in a BST
- [ ] Lowest Common Ancestor of a BST
- [ ] Implement Trie (Prefix Tree)
- [ ] Add and Search Word
