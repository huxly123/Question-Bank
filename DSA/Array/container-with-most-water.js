// Given N non-negative integers a1,a2,....an where each represents a point at 
// coordinate (i, ai). N vertical lines are drawn such that the two endpoints of line i is 
// at (i, ai) and (i,0). Find two lines, which together with x-axis forms a container, 
// such that it contains the most water.

// Note : In Case of single verticle line it will not be able to hold water.

// Input: array = [1, 5, 4, 3]
// Output: 6
// Explanation : 
// 5 and 3 are distance 2 apart. 
// So the size of the base = 2. 
// Height of container = min(5, 3) = 3. 
// So total area = 3 * 2 = 6

// Input: array = [3, 1, 2, 4, 5]
// Output: 12
// Explanation : 
// 5 and 3 are distance 4 apart. 
// So the size of the base = 4. 
// Height of container = min(5, 3) = 3. 
// So total area = 4 * 3 = 12

// Solution:

// Brute force (O(n2))
// Two pointer (O(n))
// I need to either have long width or i need to longer height
// In two pointer one will be start other will be at last, 
// ** compare both elment and the lesser element index will be increased in next iteration, bcoz 
// the larget element can hold more water than the smaller element

function containerWithMostWater(arr, n){

    let left = 0
    let right = n-1
    let max = 0
    // we shouldn't allow the pointer to cross over
    while(left < right){
        // area is distance between indexes and the smaller pointer element
        let area = (right - left) * Math.min(arr[left], arr[right])

        // updating max element
        if (area > max) max = area

        // modifying left pointer
        if(arr[left] < arr[right]){
            left++
        }
        // modifying right pointer
        else if(arr[right] < arr[left]){
            right--
        }
        // if both pointer element are same modify both pointers
        else{
            left++
            right--
        }
    }
    return max
}

console.log(containerWithMostWater([1, 5, 4, 3], 4));