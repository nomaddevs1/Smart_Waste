var mergeAlternately = function (word1, word2) {
    let length = Math.min(word1.length, word2.length);
    let newWords = [];
    for (let i = 0; i < length; i++) {
        newWords.push(word1[i]);
        newWords.push(word2[i]);
    }
    if (word1.length > word2.length) {
        newWords.push(word1.slice(length, word1.length));
    }
    else {
        newWords.push(word2.slice(length, word2.length));
    }
    return newWords.join('');
};
console.log(mergeAlternately("ab", "pqrs"));
function compress(chars) {
    let indexAns = 0, index = 0;
    while (index < chars.length) {
        let char = chars[index];
        let count = 0;
        while (index < chars.length && chars[index] === char) {
            index++;
            count++;
        }
        chars[indexAns++] = char;
        if (count > 1) {
            let countStr = count.toString();
            for (let i = 0; i < countStr.length; i++) {
                chars[indexAns++] = countStr[i];
            }
        }
    }
    // Modify the length of chars to keep only the compressed string
    chars.length = indexAns;
    return indexAns;
}
console.log(compress(["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"]));
function largestAltitude(gain) {
    let maxAltitude = 0;
    let newalt = 0;
    for (let i = 0; i < gain.length; i++) {
        let temp = newalt;
        newalt += gain[i];
        gain[i] = temp;
        maxAltitude = Math.max(maxAltitude, newalt);
    }
    gain.push(newalt);
    return maxAltitude;
}
largestAltitude([-5, 1, 5, 0, -7]);
function removeStars(s) {
    let stack = [];
    for (let i = 0; i < s.length; i++) {
        if (s[i] == '*') {
            stack.pop();
        }
        else {
            stack.push(s[i]);
        }
    }
    return stack.join("");
}
console.log(removeStars("erase*****"));
var uniqueOccurrences = function (arr) {
    let count = {};
    let data = new Set();
    for (let i = 0; i < arr.length; i++) {
        count[arr[i]] = count[arr[i]] ? count[arr[i]] + 1 : 1;
    }
    for (let elem in count) {
        if (data.has(count[elem])) {
            return false;
        }
        data.add(count[elem]);
    }
    return true;
};
console.log(uniqueOccurrences([-3, 0, 1, -3, 1, 1, 1, -3, 10, 0]));
//# sourceMappingURL=text.js.map