// Find Longest Substring Without Repeating Characters

const str = "aabaab!bb";
const n = str.length;

function longestSubUnique(s) {
  let obj = {}; // To store the last seen index of characters
  let l = 0; // Left pointer
  let max = 0; // Maximum length of unique substring

  for (let r = 0; r < s.length; r++) {
    if (obj[s[r]] !== undefined && obj[s[r]] >= l) {
      // Update the left pointer if the current character is repeated
      l = obj[s[r]] + 1;
    }

    // Update the last seen index of the current character
    obj[s[r]] = r;

    // Calculate the current length of the unique substring
    let curr = r - l + 1;

    // Update the maximum length
    max = Math.max(max, curr);
  }

  return max;
}

console.log(longestSubUnique(str));
