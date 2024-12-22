// Given a binary array nums and an integer k,
// return the maximum number of consecutive 1's in the array if you can flip at most k 0's.
// nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2
const nums = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0];
const k = 2;

function maximumNoOfConsecutive(nums, k) {
  const n = nums.length;
  let l = 0;
  let r = 0;
  let max = 0;
  let noOfZeros = 0;
  while (r < n) {
    if (nums[r] === 0) {
      noOfZeros++;
    }
    if (noOfZeros <= k) {
      if (r - l + 1 > max) {
        max = r - l + 1;
      }
    }
    while (noOfZeros > k) {
      if (nums[l] == 0) {
        noOfZeros--;
      }
      l++;
    }
    r++;
  }
  return max;
}
console.log(maximumNoOfConsecutive(nums, k));
