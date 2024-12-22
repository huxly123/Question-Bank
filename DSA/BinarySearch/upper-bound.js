// Given a sorted array arr[] and a number target, the task is to find the upper bound
// of the target in this given array. The upper bound of a number is defined as the
// largest index in the sorted array where the element is greater than to the given number.
// For 8 -> [2, 4, 6, 8 (lower bound), 8, 8, 11, 13];
// For 8 -> [2, 4, 6, 8, 8, 8, 11(upper bound), 13];

const arr = [2, 3, 6, 7, 8, 8, 11, 11, 11, 12];

const k = 11;

let l = 0;
let r = arr.length - 1;
let ans = 3;

while (l <= r) {
  let mid = Math.floor((l + r) / 2);
  if (arr[mid] > k) {
    r = mid - 1;
    ans = mid;
  } else {
    l = mid + 1;
  }
}

console.log(ans);
