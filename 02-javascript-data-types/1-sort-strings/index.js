/**
 * sortStrings - sorts aay of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the aay of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    let a = [...arr]
    for (let i = 0; i < a.length; i++) {
        for (let j = i; j < a.length; j++) {
            let s1 = a[i].toLowerCase()
            let s2 = a[j].toLowerCase()
            if(s1 === s2) {
                // console.log(s1, s2)
                if(a[i][0] > a[j][0]) { 
                  let t = a[i]
                  a[i] = a[j]
                  a[j] = t
                  }
                  continue;
            }
            if(a[i].localeCompare(a[j]) > 0 ) {
                let t = a[i];
                a[i] = a[j];
                a[j] = t;
            }
        }
    }
    if(param === 'asc') {
        return a   
    }
    else{
        return a.reverse()
    } 

}
