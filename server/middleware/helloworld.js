'use strict';
class router {
    constructor(config) {
        return require('express').Router().get('/', (req, res, next) => {
            req.out = {
                sessionID: req.out.sessionID || req.get(config.sessionIDHeader) || config.defaultSessionID,
                payload: 'Hello World'
            }
            return next();
            }
        );
    }
}

module.exports = router
