/**
 * sortStrings - sorts aay of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the arr of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

export function sortStrings(arr, param = 'asc') {
    let newArr = arr.slice().sort((a, b) => a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'}))
    if(param === 'asc') {
        return newArr
    }
    else {
        return newArr.reverse()
    }
  }
