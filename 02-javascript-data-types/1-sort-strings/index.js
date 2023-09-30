/**
 * sortStrings - sorts aay of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the arr of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

function sorted(arr, dir) {
  return arr.sort((a, b) => a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'}) * dir);
}
export function sortStrings(arr, param = 'asc') {
  let newArr = [...arr];
  if (param === 'asc') {
    return sorted(newArr, 1);
  }
  else {
    return sorted(newArr, -1);
  }
}


