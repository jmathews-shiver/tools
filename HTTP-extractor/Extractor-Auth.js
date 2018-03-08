'use strict';
/**
 * @description 
 * @author Justin Mathews
 * @class AuthExtractor
 * @extends {require('./Extractor-HTTP')}
 */
class AuthExtractor extends require('./Extractor-HTTP') {
    constructor(key, list) {
        super(key, list);
    }

    extract(key, list) {
        return new AuthExtractor(key, list);
    };
    /**
     * @description 
     * @author Justin Mathews
     * @static
     * @param {any} req 
     * @returns 
     * @memberof AuthExtractor
     */
    static getClientID(req) {
        const key = 'Client_ID';
        const list = ['qs', 'body'];
        return extract(key, list).multi(req);
    }
    /**
     * @description 
     * @author Justin Mathews
     * @static
     * @param {any} req 
     * @returns 
     * @memberof AuthExtractor
     */
    static getUserPWD(req) {
        const key = 'password';
        return extract(key).body(req);
    }
    /**
     * @description 
     * @author Justin Mathews
     * @static
     * @param {any} req 
     * @returns 
     * @memberof AuthExtractor
     */
    static getAuthorization(req) {
        const key = 'Authorization';
        return extract(key).header(req);
    }
    /**
     * @description 
     * @author Justin Mathews
     * @static
     * @param {any} req 
     * @returns 
     * @memberof AuthExtractor
     */
    static getToken(req) {
        const key = 'Token';
        const list = ['qs', 'body'];
        return extract(key, list).multi(req);
    }
}

module.exports = {
    getAuthorization: getAuthorization,
    getClientID: getClientID,
    getUserPWD: getUserPWD,
    getToken: getToken
};