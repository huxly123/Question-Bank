// A peak element is an element that is strictly greater than its neighbors.

// Given a 0-indexed integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.

// You may imagine that nums[-1] = nums[n] = -∞. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.

// You must write an algorithm that runs in O(log n) time.

var findPeakElement = function (arr) {
  let n = arr.length;
  if (arr.length === 1) return 0;
  if (arr[0] > arr[1]) return 0;
  if (arr[n - 1] > arr[n - 2]) return n - 1;

  let l = 1;
  let r = n - 2;
  while (l <= r) {
    let mid = Math.floor((l + r) / 2);
    if (arr[mid] > arr[mid - 1] && arr[mid] > arr[mid + 1]) {
      return mid;
    } else if (arr[mid] >= arr[mid - 1]) {
      l = mid + 1;
    } else {
      r = mid - 1;
    }
  }
};

console.log(findPeakElement([1, 2, 3, 1]));
console.log(findPeakElement([1, 2, 1, 3, 5, 6, 4]));
