// String to Integer (atoi)

// Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.

// The algorithm for myAtoi(string s) is as follows:

// Whitespace: Ignore any leading whitespace (" ").
// Signedness: Determine the sign by checking if the next character is '-' or '+', assuming positivity if neither present.
// Conversion: Read the integer by skipping leading zeros until a non-digit character is encountered or the end of the string is reached. If no digits were read, then the result is 0.
// Rounding: If the integer is out of the 32-bit signed integer range [-231, 231 - 1], then round the integer to remain in the range. Specifically, integers less than -231 should be rounded to -231, and integers greater than 231 - 1 should be rounded to 231 - 1.
// Return the integer as the final result.

// Example 1:

// Input: s = "42"

// Output: 42

// Explanation:

// The underlined characters are what is read in and the caret is the current reader position.
// Step 1: "42" (no characters read because there is no leading whitespace)
//          ^
// Step 2: "42" (no characters read because there is neither a '-' nor '+')
//          ^
// Step 3: "42" ("42" is read in)
//            ^

var myAtoi = function (s) {
  let i = 0,
    sign = 1,
    result = 0;

  const INT_MAX = 2 ** 31 - 1;
  const INT_MIN = -(2 ** 31);

  // Step 1: Ignore leading whitespace
  while (i < s.length && s[i] === " ") {
    i++;
  }

  // Step 2: Check for a sign
  if (i < s.length && (s[i] === "+" || s[i] === "-")) {
    sign = s[i] === "-" ? -1 : 1;
    i++;
  }

  // Step 3: Convert digits to integer
  while (i < s.length && s[i] >= "0" && s[i] <= "9") {
    result = result * 10 + Number(s[i]);
    if (sign * result > INT_MAX) return INT_MAX;
    if (sign * result < INT_MIN) return INT_MIN;
    i++;
  }

  return sign * result;
};
