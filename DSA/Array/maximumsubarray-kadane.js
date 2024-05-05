// Given an array arr[] of size N. The task is to find the sum of the contiguous 
// subarray within a arr[] with the largest sum. 

// Input: arr = {-2,-3,4,-1,-2,1,5,-3}
// Output: 7
// Explanation: The subarray {4,-1, -2, 1, 5} has the largest sum 7.

// Input: arr = {2}
// Output: 2
// Explanation: The subarray {2} has the largest sum 1.

// Input: arr = {5,4,1,7,8}
// Output: 23
// Explanation: The subarray {5,4,1,7,8} has the largest sum 25.

// Kadane’s algorithm

// 1. if the currentSum became negative there is no chance that adding next element
// in the sub array will give max sum.

function maximumSubArray(nums) {

    // to track max sum of max subarray
    let maxSum = Number.MIN_SAFE_INTEGER

    // to track current sum of current subArray
    let currentSum = 0
 
    for(let i=0; i<nums.length; i++){

    // add currentele to currentSum
     currentSum += nums[i]

     // update maxSum if currentSum is greater
     if(currentSum>maxSum){
         maxSum = currentSum
     }

     // this is the breakpoint of a subarray if the current sum is lessthan 0 
     // we will reassign current sum as 0, and then new subarray looping will happen
      if(currentSum<0){
         currentSum=0
     }
    }
    return maxSum
 };

 console.log(maximumSubArray([-2,-3,4,-1,-2,1,5,-3]));