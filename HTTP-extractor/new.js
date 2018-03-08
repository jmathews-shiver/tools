"use strict";
const Extractor = require('./Extractor.js');

module.exports.extract = {
    header: header,
    body: body,
    qs: qs,
    multi: multi
};
/**
 * @description 
 * @author Justin Mathews
 * @param {any} key 
 * @returns 
 */
function header(key) {
    let _extract = new Extractor(key);
    return (req) => {
        return _extract.header(req);
    };
}
/**
 * @description 
 * @author Justin Mathews
 * @param {any} key 
 * @returns 
 */
function body(key) {
    let _extract = new Extractor(key);
    return (req) => {
        return _extract.body(req);
    };
}
/**
 * @description 
 * @author Justin Mathews
 * @param {any} key 
 * @returns 
 */
function qs(key) {
    let _extract = new Extractor(key);
    return (req) => {
        return _extract.qs(req);
    };
}
/**
 * @description 
 * @author Justin Mathews
 * @param {any} key 
 * @param {any} list 
 * @returns 
 */
function multi(key, list) {
    if (Array.isArray(list)) throw new TypeError('Array required');
    let _extract = new Extractor(key, list);
    return (req) => {
        return _extract.multi(req);
    };
}


