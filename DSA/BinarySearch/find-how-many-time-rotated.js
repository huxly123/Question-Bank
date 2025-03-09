// Find out how many times array has been rotated

// Concept: Find the minimum element index and return the index since the index
// will tell you how much time it is rotated

// input = [4,5,6,1,2,3]
// output = 3

function findHowManyTimeRotated(arr, n) {
  // take left pointer
  let left = 0;
  // take right pointer
  let right = n - 1;

  // answer element
  let ans = Number.MAX_SAFE_INTEGER;
  let index = Number.MAX_SAFE_INTEGER;

  // if the array is sorted and the array has one element
  if (arr[left] < arr[right] || n == 1) {
    return arr[left];
  }
  // loop in log TC Ologn, = is added to check untill left become equal to right
  while (left <= right) {
    // finding mid element index
    let mid = Math.floor((left + right) / 2);

    // check if left index element is less or eq to mid index ele,
    // then left side must be sorted so we can check the minimum element
    // such as arr[left] with the ans tracking element and update it, then
    // increase the left with mid + 1
    if (arr[left] <= arr[mid]) {
      if (arr[left] < ans) {
        index = left;
        ans = arr[left];
      }
      left = mid + 1;
    }

    // now this else block will happen if the mid element is less than the high
    // element, so we can check the minimum element, such as arr[mid] with the ans
    // tracking element and update it, then decrease the right with mid - 1
    else {
      if (arr[mid] < ans) {
        index = mid;
        ans = arr[mid];
      }
      right = mid - 1;
    }
  }

  return index;
}

console.log(findHowManyTimeRotated([5, 6, 7, 8, 1, 2, 3, 4], 8));
