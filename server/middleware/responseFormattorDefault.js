'use strict';
class router {
    constructor(config) {
        return require('express').Router().use((req, res, next) => {
            if (!req.hasOwnProperty('out')) throw new Error('Route end point not found') //prevent processing if no endpoint. endpoint will create a req.out
            let response = Object.assign({}, {
                sessionID: req.out.sessionID || req.get(config.sessionIDHeader) || config.defaultSessionID,
                status: 'Successful',
                statusCode: 200,
                message: undefined,
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
