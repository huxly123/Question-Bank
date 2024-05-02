// Given an array of n elements that contains elements from 0 to n-1,
// with any of these numbers appearing any number of times. Find these
// repeating numbers in O(n) and use only constant memory space.

// Note: The repeating element should be printed only once.

// Input: n=7 , array[]={1, 2, 3, 6, 3, 6, 1}
// Output: 1, 3, 6
// Explanation: The numbers 1 , 3 and 6 appears more than once in the array.

// Input : n = 5 and array[] = {1, 2, 3, 4 ,3}
// Output: 3
// Explanation: The number 3 appears more than once in the array.

function duplicates(arr, n) {
    // your code here
    // obj to store all the elements and frequency
    let obj = {}
    // store the duplicate elements and return
    let result = []
    for(let i=0; i<n; i++){
        if(obj[arr[i]]== 1){
        // if currentele frequency is 1 then push to res arr and increase the freq.
            result.push(arr[i])
            obj[arr[i]] += 1
        }else if(!obj[arr[i]]){
        // if currentele is not in obj add it with 1
            obj[arr[i]] = 1
        }else if(obj[arr[i]]>1){
        // if currentele frequency is greater 1 then increase the freq.
            obj[arr[i]] += 1
        }
    }
    return result.sort((a,b)=> a-b)
}

console.log(duplicates([3, 4, 12, 3, 12, 3, 4, 4, 12, 7, 11, 6, 5], 13));