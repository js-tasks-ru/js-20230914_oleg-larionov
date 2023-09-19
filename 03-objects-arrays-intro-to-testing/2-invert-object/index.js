/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
    if(!obj) {
        return undefined
    }
    let newObj = {...obj}
    for (const [key, value] of Object.entries(newObj)) {
        const newKey = value;
        const newValue = key;
        delete newObj[key]
        newObj[newKey] = newValue

    }
    return newObj
}
