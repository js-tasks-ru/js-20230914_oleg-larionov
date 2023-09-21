/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
    if(!arr) {
        return []
    }
    const res = new Set();
    for (let i = 0; i < arr.length; i++) {
        res.add(arr[i]);
    }
    return [...res]

    // let res = []
    // for (let i = 0; i < arr.length; i++) {
    //     if (!res.includes(arr[i])) {
    //         res.push(arr[i])
    //     }
    // }
    // return res
}
