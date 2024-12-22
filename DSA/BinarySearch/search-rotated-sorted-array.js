// Given a sorted and rotated array arr[] of n distinct elements, the task is to
// find the index of given key in the array. If the key is not present in the array, return -1.

const arr = [4, 5, 6, 1, 2];
const k = 1;

function searchRotatedSortedArray(nums, target) {
  let l = 0;
  let r = nums.length - 1;
  let ans = -1;
  while (l <= r) {
    let mid = Math.floor((l + r) / 2);
    if (nums[mid] == target) ans = mid;
    if (nums[l] <= nums[mid]) {
      if (nums[l] <= target && target <= nums[mid]) {
        r = mid - 1;
      } else {
        l = mid + 1;
      }
    } else {
      if (nums[mid] <= target && target <= nums[r]) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
  }
  return ans;
}
console.log(searchRotatedSortedArray(arr, k));
