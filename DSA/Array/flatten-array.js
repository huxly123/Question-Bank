// Flatten the Array 
// Input -> [1, 2, 3, [4, [5,6]], 7, 8]
// output -> [1, 2, 3, 4, 5, 6, 7, 8]

let result = []
function flattenArray(arr){
    for(let i=0; i<arr.length; i++){
        if(typeof arr[i] === 'object'){
            flattenArray(arr[i])
        }else{
            result.push(arr[i])
        }
    }
    return result
}

console.log(flattenArray([1, 2, 3, [4, [5,6]], 7, 8]));