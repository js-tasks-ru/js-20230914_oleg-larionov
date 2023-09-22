/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    let pathArr = path.split('.');
    return function (obj) {
        let curStep = obj
        while(typeof curStep === 'object') {
           
            const [head, ...rest] = pathArr
            curStep = curStep[head]
            pathArr = rest;
        }
        return curStep
    }
}
