'use strict';
/**
 * Error response formattor processes errors and formats them to a standard format.
 * Ensure that this middleware is loaded into the server (app.use) and not as a route
 * Must be the last middleware loaded
 */
class router {
    constructor(config) {
        return require('express').Router().use((err, req, res, next) => {
            let response = Object.assign({}, {
                sessionID: req.out.sessionID || req.get(config.defaultMiddlewareConfig.sessionIDHeader) || config.defaultMiddlewareConfig.defaultSessionID,
                status: (err && err.name) ? err.name : 'System Error',
                statusCode: 400,
                message: (err && err.message) ? err.message : 'System failed due to an internal error',
                token: (req.out && req.out.token) ? req.out.token : undefined,
                expireIn: (req.out && req.out.expireIn) ? req.out.expireIn : undefined
            }, req.out);
            res.status(response.statusCode).json(response);
            return next();
            }
        );
    }
}

module.exports = router
