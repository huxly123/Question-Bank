function duplicates(arr) {
    let result = [];

    // Step 1: Iterate through the array to mark frequencies
    for (let i = 0; i < arr.length; i++) {
        // Calculate the index where the frequency needs to be stored
        let index = arr[i] % arr.length;
        // Increment the value at the calculated index by n, marking the frequency
        arr[index] += arr.length;
    }

    // Step 2: Traverse the modified array to find duplicate elements
    let found = false;
    for (let i = 0; i < arr.length; i++) {
        // Calculate the frequency of the current element
        if (arr[i] / arr.length > 1) {
            // If frequency is greater than 1, add the index to the result list
            result.push(i);
            found = true;
        }
    }

    // Step 3: If no duplicates found, add -1 to the result
    if (!found) {
        result.push(-1);
    }
console.log(result);
    return result;
}

let a = [1, 6, 5, 2, 3, 3, 2];

// Call the duplicates function to find duplicate elements
duplicates(a)