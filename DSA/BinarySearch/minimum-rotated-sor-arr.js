// Find the Minimum element in a Sorted and Rotated Array

// Given a sorted array arr[] (may be distinct or may contain duplicates) 
// of size N that is rotated at some unknown point, 
// the task is to find the minimum element in it. 

// Input: arr[] = {5, 6, 1, 2, 3, 4}
// Output: 1
// Explanation: 1 is the minimum element present in the array.

// Input: arr[] = {1, 2, 3, 4}
// Output: 1

// Input: arr[] = {2, 1}
// Output: 1

// solution:
// Identify the sorted half and find the min element from that half and store and eliminate that half
// repeat the step and return the min tracking element

function minimumRotatedSortedArray(arr, n){
    // take left pointer    
    let left = 0
    // take right pointer
    let right = n-1

    // answer element
    let ans = Number.MAX_SAFE_INTEGER
    
    // if the array is sorted and the array has one element
    if(arr[left]< arr[right] || n==1){
        return arr[left]
    }
    // loop in log TC Ologn, = is added to check untill left become equal to right
    while(left<=right){
        // finding mid element index
        let mid = Math.floor((left+right)/2)

        // check if left index element is less or eq to mid index ele, 
        // then left side must be sorted so we can check the minimum element 
        // such as arr[left] with the ans tracking element and update it, then 
        // increase the left with mid + 1
        if(arr[left]<=arr[mid]){
            ans = Math.min(arr[left], ans)
            left = mid+1
        }

        // now this else block will happen if the mid element is less than the high 
        // element, so we can check the minimum element, such as arr[mid] with the ans 
        // tracking element and update it, then decrease the right with mid - 1
        else{
            ans = Math.min(arr[mid], ans)
            right = mid-1
        }
    }

    return ans
}

console.log(minimumRotatedSortedArray([2,1], 2));