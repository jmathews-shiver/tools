'use strict';
class router {
    constructor(config) {
        return require('express').Router().get('/healthcheck', (req, res, next) => {
            req.out = {
                sessionID: req.out.sessionID || req.get(config.sessionIDHeader) || config.defaultSessionID,
                payload: 'Good Health'
            }
            next();
            }
        );
    }
}

module.exports = router
