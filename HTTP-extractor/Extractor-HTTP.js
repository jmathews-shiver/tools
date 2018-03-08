'use strict';
const SourceList = [
    'header',
    'body',
    'qs'
];
/**
 * @description 
 * @author Justin Mathews
 * @class Extractor
 */
class ExtractorHTTP {
    constructor(key, list) {
        if (!key || (typeof key !== 'string')) throw new TypeError('String must be passed');
        this._key = key;
        if (Array.isArray(list) &&
            Array.from(new Set(SourceList.concat(list))).length > SourceList.length) throw new RangeError('List provided contains unaccept method names')
        this._list = list;
    }

    header(req) {
        return (req.headers && req.headers[this._key]) ? req.headers[this._key] : null;
    }

    body(req) {
        return (req.body && req.body && req.body.hasOwnProperty(this._key)) ? req.body[this._key] : null;
    }

    qs(req) {
        return (req.query && req.query && req.query.hasOwnProperty(this._key)) ? req.query[this._key] : null;
    }

    multi(req) {
        if (!Array.isArray(this._list) || this._list.length === 0) throw new TypeError('Array required');
        let value = null;
        for (let i = 0; !value && i < this._list.length; i++) {
            value = this[this._list[i]].call(this, req);
        }
        return value;
    }
}

module.exports = ExtractorHTTP;
