//  Find first and last occurance of an element in an array

const arr = [2, 4, 6, 8, 8, 8, 11, 13];
const k = 11;

// first occ (lower bound)
function FirstLastOcc(arr, k) {
  let l1 = 0;
  let r1 = arr.length - 1;
  let leftOcc = -1;
  while (l1 <= r1) {
    let mid = Math.floor((l1 + r1) / 2);
    if (arr[mid] >= k) {
      r1 = mid - 1;
      leftOcc = mid;
    } else {
      l1 = mid + 1;
    }
  }

  // last occ (upper bound)
  let l2 = 0;
  let r2 = arr.length - 1;
  let rightOcc = -1;
  while (l2 <= r2) {
    let mid = Math.floor((l2 + r2) / 2);
    if (arr[mid] > k) {
      rightOcc = mid;
      r2 = mid - 1;
    } else {
      l2 = mid + 1;
    }
  }

  if (arr[leftOcc] !== k || leftOcc > arr.length) {
    return [-1, -1];
  } else {
    return [leftOcc, rightOcc - 1];
  }
}
console.log(FirstLastOcc(arr, k));
