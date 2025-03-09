function printName(n) {
  if (n === 0) return; // Base case: Stop when n reaches 0
  console.log("raj");
  printName(n - 1); // Recursive call with n decremented
}
// printName(4);

function printOnetoN(curr, n) {
  if (n == 0) return;
  console.log(curr);
  printOnetoN(curr + 1, n - 1);
}

// printOnetoN(1, 4);

function printNtoOne(n) {
  if (n == 0) return;
  console.log(n);
  printNtoOne(n - 1);
}

// printNtoOne(4);

function sumArray(arr, index) {
  if (index === arr.length) return 0;
  return arr[index] + sumArray(arr, index + 1);
}

// console.log(sumArray([1, 2, 3], 0));

function productArray(arr, index) {
  if (index === arr.length) return 1;
  return arr[index] * productArray(arr, index + 1);
}
//   console.log(productArray([1, 2, 3, 4], 0));

// const arr = [1, 2, 3, 4, 5];
function reverseArray(arr, n, res) {
  if (n < 0) return res;
  else {
    res.push(arr[n]);
    return reverseArray(arr, n - 1, res);
  }
}

// console.log(reverseArray(arr, 4, []));

function reverseArray(arr, start = 0, end = arr.length - 1) {
  if (start >= end) return arr; // Base case: Stop when start index meets or exceeds the end index
  [arr[start], arr[end]] = [arr[end], arr[start]]; // Swap elements
  return reverseArray(arr, start + 1, end - 1); // Recurse with updated indices
}

function isPalindrome(str, start = 0, end = str.length - 1) {
  // Base case: If the start index crosses the end index, it's a palindrome
  if (start >= end) return true;

  // Check if characters at start and end indices are the same
  if (str[start] !== str[end]) return false;

  // Recur for the substring excluding the current start and end characters
  return isPalindrome(str, start + 1, end - 1);
}

//   console.log(isPalindrome("madam", 0, 4));

function fibannoci(n) {
  if (n == 0) return 0;
  if (n === 1) return 1;
  return fibannoci(n - 1) + fibannoci(n - 2);
}

// console.log(fibannoci(6));
