const calculateOccurrences = (str1, str2) => str1.split(str2).length - 1;
/**
 * Advanced levenshtein distance where we also calculate how many times the string occurs
 */
const levenshteinDistance = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1).fill(null).map(() =>
        Array(str1.length + 1).fill(null));
    let i, j;
    for (i = 0; i <= str1.length; i++) {
        track[0][i] = i;
    }
    for (j = 1; j <= str2.length; j++) {
        track[j][0] = j;
    }
    for (j = 1; j <= str2.length; j++) {
        for (i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1; // 0, 
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion 
                track[j - 1][i] + 1, // insertion 
                track[j - 1][i - 1] + indicator, // substitution
            );
        }
    }
    let requiredInsertions = track[str2.length][str1.length];
    return requiredInsertions - (calculateOccurrences(str1, str2) * 1000);
};

/**
 * Advanced cosine distance where we calculate string occurrences
 */
const cosineDistance = (str1, str2) => {
    function chunkCountMap(str) {
        const chunkSize = 2;
        const chunks = [];
        const numOfChunks = Math.ceil(str.length / chunkSize);

        for (let i = 0, o = 0; i < numOfChunks; ++i, o += chunkSize) {
            chunks[i] = str.substr(o, chunkSize);
        }

        let chunkCount = {};
        chunks.forEach((c) => {
            chunkCount[c] = (chunkCount[c] || 0) + 1;
        });
        return chunkCount;
    }
    function addChunksToDictionary(wordCountmap, dict) {
        for (let key in wordCountmap) {
            dict[key] = true;
        }
    }
    function chunkMapToVector(map, dict) {
        let wordCountVector = [];
        for (let term in dict) {
            wordCountVector.push(map[term] || 0);
        }
        return wordCountVector;
    }
    function dotProduct(vec1, vec2) {
        let product = 0;
        for (let i = 0; i < vec1.length; i++) {
            product += vec1[i] * vec2[i];
        }
        return product;
    }

    function magnitude(vec) {
        let sum = 0;
        for (let i = 0; i < vec.length; i++) {
            sum += vec[i] * vec[i];
        }
        return Math.sqrt(sum);
    }

    function cosineSimilarity(vec1, vec2) {
        return dotProduct(vec1, vec2) / (magnitude(vec1) * magnitude(vec2));
    }

    const chunkCount1 = chunkCountMap(str1);
    const chunkCount2 = chunkCountMap(str2);
    let dict = {};
    addChunksToDictionary(chunkCount1, dict);
    addChunksToDictionary(chunkCount2, dict);

    const vector1 = chunkMapToVector(chunkCount1, dict);
    const vector2 = chunkMapToVector(chunkCount2, dict);

    return Number((1 - cosineSimilarity(vector1, vector2))) - (calculateOccurrences(str1, str2) * 1000);
}

/**
 * Returns sorted array of strings based on search value
 */
const matchStringToArrValues = (arr, value, returnWithValues) => {
    let matchPercents = [];

    for (let val of arr) {
        matchPercents.push({ value: val, match: levenshteinDistance(val.toLowerCase(), value.toLowerCase()) });
    }
    matchPercents.sort((a, b) => (a.match > b.match) ? 1 : -1);

    let sortedValues = [];
    for (let val of matchPercents) {
        if (returnWithValues) {
            sortedValues.push(val);
        } else {
            sortedValues.push(val.value);
        }
    }
    return sortedValues;
};

/**
 * Recursively sorts array of any type based one occurrences of strings in any nested string values
 */
const matchStringToObjArrValues = (arr, value, returnWithValues) => {
    let matchPercents = [];
    let match = 0;

    const recursion = (obj, currMatch = 0) => {
        if (typeof (obj) === "string") {
            // lets not check values longer than this
            if (obj.length > 150) {
                return currMatch;
            }
            return currMatch + cosineDistance(obj.toLowerCase(), value.toLowerCase());
        } else if (typeof (obj) === "object") {
            for (let key in obj) {
                currMatch = recursion(obj[key], currMatch);
            }
        }
        return currMatch;
    }

    for (let val of arr) {
        for (let key in val) {
            if (typeof (val[key]) === 'string') {
                match += cosineDistance(val[key].toLowerCase(), value.toLowerCase());
            } else if (typeof (val[key]) === 'object') {
                match = recursion(val[key], match);
            }
        }
        matchPercents.push({ value: val, match });
        match = 0;
    }
    matchPercents.sort((a, b) => (a.match > b.match) ? 1 : -1);

    let sortedValues = [];
    for (let val of matchPercents) {
        if (returnWithValues) {
            sortedValues.push(val);
        } else {
            sortedValues.push(val.value);
        }
    }

    return sortedValues;
}

const strArr = ["a", "b", "c", "aaa", "d", "e", "aa"];
const objArr = ["a", "b", "c", { key: "aaa" }, "d", { key: "e", obj: { key: "aaaa" } }, "aa"];

console.log(matchStringToArrValues(strArr, "a"));
console.log(matchStringToObjArrValues(objArr, "a", true));