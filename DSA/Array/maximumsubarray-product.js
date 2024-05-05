// Given an array that contains both positive and negative integers, the task is to find
//  the product of the maximum product subarray. 

// Input: arr[] = {6, -3, -10, 0, 2}
// Output:  180
// Explanation: The subarray is {6, -3, -10}

// Input: arr[] = {-1, -3, -10, 0, 60}
// Output:   60
// Explanation: The subarray is {60}

// Solutioning
// 1. [1,2,3,4,5,6,7,8] -> non-negative entire array product is ans
// 2. [1,2,3,-4,5,6,-7,8] -> even-negative entire array product is ans
// 3. [4, -9 , 0 , 7, 8, 0 , -2, -4, 2] -> odd negative check from start
// to end and update the max if it is maximum and prefix
// check from end to start and update the max if it is maximum and prefix
// 4. if it is 0 from left update the prefix to 1, if it is 0 from right update the suffix to 1

function maximumSubArrayProduct(arr){
    // to track sum from left to right
    let prefix = 1
    // to track sum from right to left
    let suffix = 1
    // to track the maximum
    let max = Number.MIN_SAFE_INTEGER
    
    for(let i=0; i<arr.length; i++){
    // if the ele from first is 0 reset the prefix to 1
        if(arr[i]===0){
            prefix = 1
        }else{
            // increment prefix with ele
            prefix *= arr[i]
            // if prefix is greater update max
            if(prefix > max){
                max = prefix
            }
        }
    // if the ele from last is 0 reset the prefix to 1
        if(arr[arr.length-1-i]===0){
            suffix=1
        }else{
            // increment suffix with ele from last
            suffix *= arr[arr.length-1-i]
            // if suffix is greater update max
            if(suffix > max){
                max = suffix
            }
        }
    }
    return max
}

console.log(maximumSubArrayProduct([-2,0,-1]));