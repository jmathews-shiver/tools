'use strict';
class router {
    constructor(config) {
        return require('express').Router().use((req, res, next) => {
                req.out = Object.assign({}, {
                    sessionID: (req.get(config.sessionIDHeader) !== undefined) ? req.get(config.sessionIDHeader) : config.defaultSessionID,
                    status: 'System Error',
                    statusCode: 500,
                    message: 'Route end point not found',
                    token: undefined,
                    expireIn: undefined
                }, req.out);
                next();
            }
        );
    }
}

module.exports = router
