// Search an element in a sorted and rotated Array

// Given a sorted and rotated array arr[] of size N and a key, the task is to find the key in the array.

// Note: Find the element in O(logN) time and assume that all the elements are distinct.

// Input  : arr[] = {5, 6, 7, 8, 9, 10, 1, 2, 3}, key = 3
// Output : Found at index 8

// Input  : arr[] = {5, 6, 7, 8, 9, 10, 1, 2, 3}, key = 30
// Output : Not found

// Input : arr[] = {30, 40, 50, 10, 20}, key = 10   
// Output : Found at index 3

// Solution:
// Identify the sorted half and check if the target is inside it if yes eliminate the other
// half or eliminate the sorted half, repeat this untill the mid is equal to target

function findElementRotatedSortedArray(arr, n, target){
    // take left pointer  
    let left = 0;

    // take right pointer  
    let right = n-1;

    // if the array is sorted and the array has one element
    while(left<=right){

        // finding mid element index
        let mid = Math.floor((left+right)/2)

        // if the mid ele equal to target return mid ele
        if(arr[mid] === target) return mid

        // check if the left portion is sorted, if yes then check if the target is inside
        // if yes the move right to mid-1 or move left to mid + 1
        if(arr[left] <= arr[mid]){
          if(arr[left]<= target && target<=arr[mid]){
            right = mid - 1
          }else{
            left = mid + 1
          }
        }
        
        // check if the right portion is sorted, if yes then check if the target is inside
        // if yes the move left to mid + 1 or move right to mid - 1
        else{
          if(arr[mid] <= target && target <= arr[right]){
            left = mid + 1
          }else{
            right = mid - 1
          }
        }
    }
    // if element is not found return -1
    return -1
}

console.log(findElementRotatedSortedArray([5, 6, 7, 8, 9, 10, 1, 2, 3], 9, 30));