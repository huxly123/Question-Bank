// Given a sorted and rotated array arr[] of n duplicate elements, the task is to
// find the element is present or not

const arr = [3, 1, 2, 3, 3, 3, 3];
const k = 4;

function searchRotatedSortedArray(nums, target) {
  let l = 0;
  let r = nums.length - 1;
  let ans = -1;
  while (l <= r) {
    let mid = Math.floor((l + r) / 2);

    if (nums[mid] == target) return true;

    if (nums[l] === nums[mid] && nums[mid] === nums[r]) {
      l++;
      r--;
      continue;
    }
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
  return false;
}
console.log(searchRotatedSortedArray(arr, k));
