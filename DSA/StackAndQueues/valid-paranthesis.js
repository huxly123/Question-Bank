// Check if it is a valid paranthesis
// Given a string s containing just the characters '(', ')', '{', '}', '[' and ']',
// determine if the input string is valid.
const str = "()[]{}";

function validParanthesis(str) {
  const validateObj = {
    ")": "(",
    "]": "[",
    "}": "{",
  };
  const stack = [];
  let flag = false;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "{" || str[i] === "[" || str[i] === "(") {
      stack.push(str[i]);
    } else {
      if (stack[stack.length - 1] === validateObj[str[i]]) {
        stack.pop();
      } else {
        flag = true;
        break;
      }
    }
  }

  if (stack.length > 0 || flag) {
    return false;
  } else {
    return true;
  }
}

console.log(validParanthesis(str));
