// There is a circle of red and blue tiles. You are given an array of integers colors and an integer k. The color of tile i is represented by colors[i]:

// colors[i] == 0 means that tile i is red.
// colors[i] == 1 means that tile i is blue.
// An alternating group is every k contiguous tiles in the circle with alternating colors (each tile in the group except the first and last one has a different color from its left and right tiles).

// Return the number of alternating groups.

// Note that since colors represents a circle, the first and the last tiles are considered to be next to each other.

// Input: colors = [0,1,0,1,0], k = 3

// Output: 3

// Input: colors = [0,1,0,0,1,0,1], k = 6

// Output: 2

// Input: colors = [1,1,0,1], k = 4

// Output: 0

// Constraints:

// 3 <= colors.length <= 105
// 0 <= colors[i] <= 1
// 3 <= k <= colors.length

function alternatingGroup(arr, k) {
  let n = arr.length;
  let count = 0;
  let windowSize = 1;
  for (let i = 1; i < n - 1 + k; i++) {
    if (arr[i % n] !== arr[(i - 1) % n]) {
      windowSize++;
    } else {
      windowSize = 1;
    }
    if (windowSize >= k) count++;
  }
  return count;
}

console.log(alternatingGroup([0, 1, 0, 1, 0], 3));
