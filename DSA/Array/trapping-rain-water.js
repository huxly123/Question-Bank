// Trapping Rainwater Problem states that given an array of n non-negative
// integers arr[] representing an elevation map where the width of each bar is 1,
// compute how much water it can trap after rain.
// Input: arr[] = {3, 0, 1, 0, 4, 0, 2}
// Output: 10
// Explanation: The expected rainwater to be trapped is shown in the above image.
// https://www.geeksforgeeks.org/trapping-rain-water/

// Input: arr[]   = {3, 0, 2, 0, 4}
// Output: 7
// Explanation: We trap 0 + 3 + 1 + 3 + 0 = 7 units.

// Input: arr[] = {1, 2, 3, 4}
// Output: 0
// Explanation : We cannot trap water as there is no height bound on both sides

// Input: arr[] = {2, 1, 5, 3, 1, 0, 4}
// Output: 9
// Explanation : We trap 0 + 1 + 0 + 1 + 3 + 4 + 0 = 9 units of water.

// Brute Force TC- O(n2) SC- O(1) :
// Logic: for every section we will calculate left max and right max then we will take minimum of the both and
// substract it with the current element

const arr = [3, 0, 1, 0, 4, 0, 2];
// traverse and find the let max for every traversal
let leftMax = 0;
let ans = 0;

for (let i = 0; i < arr.length; i++) {
  let rightMax = 0;
  for (let j = i; j < arr.length; j++) {
    // find the right max for every traversal
    if (arr[j] > rightMax) rightMax = arr[j];
  }
  // change left max when current element is greater
  if (arr[i] > leftMax) {
    leftMax = arr[i];
  }
  // calculation part of finding water in a particular column section
  else if (leftMax !== 0 && rightMax !== 0) {
    const cal = Math.min(leftMax, rightMax) - arr[i];
    ans += cal;
  }
}

// Optimise soln TC- O(n) SC- O(n) :
// Here we will not run inside loop we will create two array to find the rightmax and leftmax

const leftMaxx = [];
const rightMax = [];
let anss = 0;
for (let i = 0; i < arr.length; i++) {
  if (i == 0) {
    leftMaxx[i] = arr[i];
  } else if (arr[i] > leftMaxx[i - 1]) {
    leftMaxx[i] = arr[i];
  } else {
    leftMaxx[i] = leftMaxx[i - 1];
  }
}

let j = arr.length - 1;

while (j >= 0) {
  if (j == arr.length - 1) {
    rightMax[j] = arr[j];
  } else if (arr[j] > rightMax[j + 1]) {
    rightMax[j] = arr[j];
  } else {
    rightMax[j] = rightMax[j + 1];
  }
  j--;
}

for (let i = 0; i < arr.length; i++) {
  const min = Math.min(leftMax[i], rightMax[i]);
  const cal = min - arr[i];
  if (cal > 0) {
    anss += cal;
  }
}
