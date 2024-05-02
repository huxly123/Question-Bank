// Product of Array except itself

// Given an array arr[] of n integers, construct a Product
// Array prod[] (of the same size) such that prod[i] is equal 
// to the product of all the elements of arr[] except arr[i]. 

// Note: Solve it without the division operator in O(n) time.

// Input:
// n = 5
// nums[] = {10, 3, 5, 6, 2}
// Output:
// 180 600 360 300 900
// Explanation: 
// For i=0, P[i] = 3*5*6*2 = 180.
// For i=1, P[i] = 10*5*6*2 = 600.
// For i=2, P[i] = 10*3*6*2 = 360.
// For i=3, P[i] = 10*3*5*2 = 300.
// For i=4, P[i] = 10*3*5*6 = 900.

function productExceptSelf(arr,n){
    //code here

    let totalProduct = 1
    let noOfZeros = 0

    // find the total profit by excluding 0
    for(let i=0;i<n;i++){
        if(arr[i] === 0)noOfZeros++
        else totalProduct = totalProduct*arr[i]
    }

    // if noOfZeros greater than 1 then all the array ele will be zero
    if(noOfZeros>1) return new Array(n).fill(0)

    // if noOfZeros is 1 then all the array ele will be zero except the 0 element will be totalprofit
    if(noOfZeros === 1) {
        let result = []
        for(let i=0;i<n;i++){
            if(arr[i]===0){
            result.push(totalProduct)
            }else{
                result.push(0)
            }
        }
        return result
    }
    
    // if noOfZeros is 0 then each result array ele will be the divide of totalprofit by currentele
    else{
        let result = []
        for(let i=0;i<n;i++){
            result.push(totalProduct/arr[i])
        }
        return result
    }
  }

  console.log(productExceptSelf([10, 3, 5, 6, 2], 5));