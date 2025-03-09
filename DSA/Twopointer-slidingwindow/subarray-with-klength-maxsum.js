// Find Man sum with subarray length eqaul to k length

function subarrayWithKlengthMaxsum(arr, k) {
  let l = 0;
  let n = arr.length;
  let r = k - 1;
  let maxSum = Number.MIN_SAFE_INTEGER;
  let sum = 0;
  for (let i = l; i <= r; i++) {
    sum = sum + arr[i];
  }
  maxSum = Math.max(maxSum, sum);
  while (r < n - 1) {
    sum = sum - arr[l];
    l++;
    r++;
    sum = sum + arr[r];
    maxSum = Math.max(maxSum, sum);
  }
  return maxSum;
}

console.log(subarrayWithKlengthMaxsum([1, 2, 3, 4, -5], 2));
