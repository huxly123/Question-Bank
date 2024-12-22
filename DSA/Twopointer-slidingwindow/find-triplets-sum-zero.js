// Find all triplets with zero sum

// Given an array of distinct elements. The task is to find triplets in the array whose sum is zero.

// Input: arr[] = {0, -1, 2, -3, 1}
// Output: (0 -1 1), (2 -3 1)
// Explanation: The triplets with zero sum are 0 + -1 + 1 = 0 and 2 + -3 + 1 = 0  

// Input: arr[] = {1, -2, 1, 0, 5}
// Output: 1 -2  1
// Explanation: The triplets with zero sum is 1 + -2 + 1 = 0


// Brute Force
// TC -> O(n3)
// SC -> O(1) - O(n/3)


function findTripletsBruteForce(arr, n){
    // if size of array less than 3 no triplet can be there
    if(n <3) return 0

    // object to store the sorted triplet so we can eliminate the dupicate triplet to be stored
    const obj ={}
    for(let i=0; i<n-2; i++){
        for(let j=i+1; j<n-1; j++){
            for(let k=j+1; k<n; k++){
                if(arr[i]+arr[j]+arr[k] === 0){
                    // if the sum of triplet is equal to zero store the element in array and sort
                    // then store the sorted array in object
                    let temp = [arr[i],arr[j],arr[k]]
                    obj[temp.sort((a,b)=> a-b)] = 1
                }
            }
        }
    }
    return Object.keys(obj).length
}

// console.log(findTripletsBruteForce([0, -1, 2, -3, 1], 5));

// Brute Force
// TC -> O(n2)
// SC -> O(n) + O(no.of triplets)*2
function findTripletsBrute2(arr, n){
    // if size of array less than 3 no triplet can be there
    if(n <3) return 0

    // object to store the sorted triplet so we can eliminate the dupicate triplet to be stored
    const obj ={}
    for(let i=0; i<n;i++){
        // temp obj to store num from j to k through looping
        let temp = {}
        for(let j = i+1; j<n; j++){
            // formula derived from arr[i]+arr[j]+arr[k] === 0
            let findEle = -(arr[i]+arr[j])
            if(temp[findEle]){
                // if findEle is there in temp obj then it will satisfy arr[i]+arr[j]+findEle = 0
                let tripletArr = [arr[i],arr[j], findEle]
                tripletArr = tripletArr.sort((a,b)=> a-b)
                // pushing to obj to get unique triplet
                obj[tripletArr] = 1
            }
            // storing the looped arr[j] element
            temp[arr[j]] = 1
        }
    }
    return Object.keys(obj).length
}

// console.log(findTripletsBrute2([0, -1, 2, -3, 1], 5));

// TwoPointer
// TC -> O(n2) approx
// SC -> O(1)
// twopointer approach, sort the array, i will be in forst loop, j and k are two pointers.

function findTripletsTwoPointer(arr, n){
    // if size of array less than 3 no triplet can be there
    if(n <3) return 0

    // track noOfTriplets in the arr
    let noOfTriplets = 0

    // sort the array
    arr= arr.sort((a,b) => a-b)

    // iVal to tract the previous i value
    let iVal
    // jVal to tract the previous j value
    let jVal;
    // kVal to tract the previous k value
    let kVal;

    for(let i=0; i<n; i++){
        let j = i+1
        let k = n-1
        // if we encounter same i ele then we need to move the i pointer to non same element
        if(arr[i] == iVal){
            continue;
        }

        // assigning current ele to iVal
        iVal = arr[i]

        // looping untill j<k
        while(j<k){
            // if we encounter same j ele then we need to move the j pointer to non same element
            if(arr[j] === jVal) {
                j++
                continue;
            }
            // if we encounter same k ele then we need to move the k pointer to non same element
            if(arr[k] ===kVal) {
                k--
                continue;
            }

            // if the triplet equal increase the noOfTriplets and increase j by one and k by one
            if(arr[i]+arr[j]+arr[k] ===0){
                noOfTriplets++
                jVal = arr[j]
                kVal = arr[k]
                j++;
                k--;
            }
            // if sum is less than 0 increase j since it is sorted array
            else if((arr[i]+arr[j]+arr[k]) <0) {
                j++
            }
            // if sum is greater than 0 decrease k since it is sorted array
            else if((arr[i]+arr[j]+arr[k] )>0){
                k--
            }
        }
       
    }
    return noOfTriplets
}

console.log(findTripletsTwoPointer([1, -2, 1, 0, 5], 5));
// [-2,1,1,0,5]