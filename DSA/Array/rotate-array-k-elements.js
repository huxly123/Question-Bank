// Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.

// Input: nums = [1,2,3,4,5,6,7], k = 3
// Output: [5,6,7,1,2,3,4]
// Explanation:
// rotate 1 steps to the right: [7,1,2,3,4,5,6]
// rotate 2 steps to the right: [6,7,1,2,3,4,5]
// rotate 3 steps to the right: [5,6,7,1,2,3,4]
// Example 2:

// Input: nums = [-1,-100,3,99], k = 2
// Output: [3,99,-1,-100]
// Explanation:
// rotate 1 steps to the right: [99,-1,-100,3]
// rotate 2 steps to the right: [3,99,-1,-100]

var rotate = function (arr, k) {
  var array = new Array(arr.length - 1).fill(0);
  for (var i = 0; i < arr.length; i++) {
    var index = (i + k) % arr.length;
    array[index] = arr[i];
  }
  console.log(array);
};
rotate([7, 1, 2, 3, 4, 5, 6], 1);

function rotateEle(nums, k) {
  const n = nums.length;
  k = k % n; // Handle cases where k > n

  // Helper function to reverse part of the array
  function reverse(start, end) {
    while (start < end) {
      [nums[start], nums[end]] = [nums[end], nums[start]];
      start++;
      end--;
    }
  }

  // Step 1: Reverse the entire array
  reverse(0, n - 1);

  // Step 2: Reverse the first k elements
  reverse(0, k - 1);

  // Step 3: Reverse the remaining n-k elements
  reverse(k, n - 1);
  return nums;
}

// [1,2,3]=> [3,1,2]

// [3,2,1] => [3,2,1] => [3,1,2]
rotateEle([7, 1, 2, 3, 4, 5, 6], 1);
