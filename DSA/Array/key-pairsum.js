// Given an array Arr of N positive integers and another number X.
// Determine whether or not there exist two elements in
// Arr whose sum is exactly X.

// Input:
// N = 6, X = 16
// Arr[] = {1, 4, 45, 6, 10, 8}
// Output: Yes
// Explanation: Arr[3] + Arr[4] = 6 + 10 = 16

function hasArrayTwoCandidates(arr,n,x){
    //code here
    // create obj to store numbertofind
    let obj = {}

    for(let i=0 ;i<n; i++) {
        // if the element present in numToFind object return true
        if(obj[arr[i]]){
            return 'Yes'
        }else{
            // finding numToFind for checking this number present in the array
            const numToFind = x - arr[i]
            obj[numToFind] = 1
        }
    }
    return 'No'
}

console.log(hasArrayTwoCandidates([1, 4, 45, 6, 10, 8],6, 16));