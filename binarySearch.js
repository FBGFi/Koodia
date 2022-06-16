// Find index of item in sorted array
const array = [];

for(let i = 0; i < 1000000; i++) {
    array.push(i);
}

const splitByIndex = (arr, start, end) => [arr.slice(start, Math.floor(end / 2)), arr.slice(Math.floor(end / 2), end)];

const binarySearch = (arr, value) => {
    let index = 0;
    let iterations = 0;
    let refArr = [...arr];

    while(refArr[index] !== value){
        iterations++;
        const splitArr = splitByIndex(arr, 0, arr.length);
        if(splitArr[0][splitArr[0].length - 1] >= value){
            arr = [...splitArr[0]];
        } else if (splitArr[1][0] <= value) {
            index += splitArr[0].length;
            arr = [...splitArr[1]];
        }
        if(arr.length < 2) break;
    }
    return { 
        iterations,
        index: refArr[index] === value ? index : null
    };
}

// index should be the same as the searched value
console.log(binarySearch(array, 3));
console.log(binarySearch(array, 300));
console.log(binarySearch(array, 965));
console.log(binarySearch(array, -1));