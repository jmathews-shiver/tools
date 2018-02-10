'use strict'

class AuthExtractor extends require('./Extractor-HTTP') {
    constructor(key, list) {
        super(key, list);
    };

    extract(key, list) {
        return new AuthExtractor(key, list);
    };

    static getClientID(req) {
        const key = 'Client_ID';
        const list = ['qs', 'body'];
        return extract(key, list).multi(req);
    };

    static getUserPWD(req) {
        const key = 'password';
        return extract(key).body(req);
    };

    static getAuthorization(req) {
        const key = 'Authorization';
        return extract(key).header(req);
    };

    static getToken(req) {
        const key = 'Token';
        const list = ['qs', 'body'];
        return extract(key, list).multi(req);
    };
};

module.exports = {
    getAuthorization: getAuthorization,
    getClientID: getClientID,
    getUserPWD: getUserPWD,
    getToken: getToken
};
