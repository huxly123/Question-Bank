// Given an array prices[] of length N, representing the prices of the stocks on different days,
// the task is to find the maximum profit possible by buying and selling the stocks
// on different days when at most one transaction is allowed.

// Note: Stock must be bought before being sold.

// Input: prices[] = {7, 1, 5, 3, 6, 4}
// Output: 5
// Explanation:
// The lowest price of the stock is on the 2nd day, i.e. price = 1. Starting from the 2nd day, the highest price of the stock is witnessed on the 5th day, i.e. price = 6. 
// Therefore, maximum possible profit = 6 – 1 = 5. 

function buySellStock(arr){
// buy is the lowest element while looping
let buy = arr[0]
// max_profit is the maximum differencr from buy to current index
let max_profit = 0
 for(let i=1; i<arr.length; i++){

    let priceDifference = arr[i] - buy

    // check if currentindex is lesser the buy and update maxprofit

    if(arr[i]<buy){
        buy = arr[i]
    }
    // check if current pricediff is greater the maxprofit and update maxprofit
    if(priceDifference>max_profit){
        max_profit = priceDifference
    }
    
 }
 return max_profit
}

console.log(buySellStock([7, 1, 5, 3, 6, 4]));