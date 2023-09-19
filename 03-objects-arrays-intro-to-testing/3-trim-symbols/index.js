/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if(size === 0) {
        const res = ''
        return res
    }
    if(!size) {
        return string
    }
    let res = '';

    let counter = 0;
    let curChar = '';
  
    for (let i = 0; i < string.length; i++) {
      const char = string[i];
      if (char === curChar) {
        counter++;
      } 
      else {
        counter = 1;
        curChar = char;
      }
  
      if (counter <= size) {
        res += char;
      }
    }
  
    return res
}
